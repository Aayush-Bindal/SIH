import React, { useEffect, useRef, useState, useId } from 'react';
import * as THREE from 'three';
import { CadastralBuilding, UnitCadastre, UndergroundUtility } from '../types';
import { Layers, Eye, ShieldAlert, Sparkles, Box, Compass, RefreshCw, ZoomIn, ZoomOut, Zap, AlertTriangle, CheckCircle2, Info } from 'lucide-react';
import { Tooltip } from './Tooltip';

interface ThreeDViewerProps {
  building: CadastralBuilding;
  selectedUnit: UnitCadastre | null;
  selectedUtility: UndergroundUtility | null;
  onSelectUnit: (unit: UnitCadastre | null) => void;
  onSelectUtility: (utility: UndergroundUtility | null) => void;
  colorMode: 'usage' | 'confidence' | 'registration' | 'change_detection';
  subsurfaceVisible: boolean;
  airRightsVisible: boolean;
  explosionFactor: number;
  onExplosionChange: (val: number) => void;
  filterLevel: number | 'all';
}

interface MeshEntry {
  mesh: THREE.Mesh | THREE.Group;
  unit?: UnitCadastre;
  utility?: UndergroundUtility;
  baseZ: number;
  level: number;
}

export const ThreeDViewer: React.FC<ThreeDViewerProps> = ({
  building,
  selectedUnit,
  selectedUtility,
  onSelectUnit,
  onSelectUtility,
  colorMode,
  subsurfaceVisible,
  airRightsVisible,
  explosionFactor,
  onExplosionChange,
  filterLevel,
}) => {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const isDraggingRef = useRef(false);
  const prevMousePosRef = useRef({ x: 0, y: 0 });
  const cameraAnglesRef = useRef({ theta: Math.PI / 4, phi: Math.PI / 3, radius: 65 });
  const meshesMapRef = useRef<Map<string, MeshEntry>>(new Map());
  const highlightBoxRef = useRef<THREE.BoxHelper | null>(null);

  const [hoveredLabel, setHoveredLabel] = useState<{ text: string; subtext: string; x: number; y: number } | null>(null);
  const [fps, setFps] = useState<number>(60);
  const viewerId = useId();

  // Helper color logic
  const getUnitColor = (unit: UnitCadastre): number => {
    if (colorMode === 'confidence') {
      if (unit.aiConfidence >= 95) return 0x22c55e; // Green
      if (unit.aiConfidence >= 85) return 0xeab308; // Yellow
      return 0xef4444; // Red
    }

    if (colorMode === 'registration') {
      if (unit.status === 'unauthorized_extension') return 0xdc2626;
      if (unit.ownership.encumbranceStatus === 'court_stay') return 0xb91c1c;
      if (unit.ownership.encumbranceStatus.startsWith('mortgaged')) return 0xf59e0b;
      return 0x059669; // Clean registered
    }

    if (colorMode === 'change_detection') {
      if (unit.changeDetectionFlag === 'unauthorized_floor') return 0xef4444; // Flashing red
      if (unit.level > 14) return 0xf97316;
      return 0x3b82f6; // Compliant
    }

    // Default: by usage
    switch (unit.usageType) {
      case 'residential':
        return unit.level % 2 === 0 ? 0x2563eb : 0x1d4ed8;
      case 'commercial':
        return 0x0d9488; // Teal
      case 'parking':
        return 0x475569; // Slate
      case 'common_area':
        return 0x64748b;
      case 'utility_corridor':
        return 0xca8a04;
      case 'air_corridor':
        return 0x9333ea;
      default:
        return 0x3b82f6;
    }
  };

  // Initialize Three.js scene
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth;
    const height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
    scene.fog = new THREE.Fog(0xffffff, 110, 300);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    rendererRef.current = renderer;

    container.appendChild(renderer.domElement);

    // Lights - crisp, technical illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.95);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.1);
    dirLight.position.set(40, 70, 30);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 10;
    dirLight.shadow.camera.far = 200;
    const d = 50;
    dirLight.shadow.camera.left = -d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = -d;
    scene.add(dirLight);

    const softFillLight = new THREE.DirectionalLight(0xf5f5f5, 0.6);
    softFillLight.position.set(-30, 30, -30);
    scene.add(softFillLight);

    // Cadastral Ground Plane (2D Parcel Footprint & Grid)
    const groundGroup = new THREE.Group();
    groundGroup.name = 'groundGroup';

    // Outer terrain grid - subtle hairline gray grid
    const gridHelper = new THREE.GridHelper(120, 60, 0x171717, 0xe5e7eb);
    gridHelper.position.y = -0.05;
    groundGroup.add(gridHelper);

    // Parcel Boundary Outline (Survey 2D Polygon)
    const parcelShape = new THREE.Shape();
    const pw = 28;
    const pl = 28;
    parcelShape.moveTo(-pw / 2, -pl / 2);
    parcelShape.lineTo(pw / 2, -pl / 2);
    parcelShape.lineTo(pw / 2, pl / 2);
    parcelShape.lineTo(-pw / 2, pl / 2);
    parcelShape.closePath();

    const parcelPoints = parcelShape.getPoints();
    const parcelGeo = new THREE.BufferGeometry().setFromPoints(parcelPoints.map(p => new THREE.Vector3(p.x, 0.05, p.y)));
    const parcelLine = new THREE.LineLoop(parcelGeo, new THREE.LineBasicMaterial({ color: 0x171717, linewidth: 2 }));
    groundGroup.add(parcelLine);

    // Roadway & Corridor Context
    const roadGeo = new THREE.PlaneGeometry(120, 14);
    const roadMat = new THREE.MeshStandardMaterial({ color: 0xf3f4f6, roughness: 0.95 });
    const roadMesh = new THREE.Mesh(roadGeo, roadMat);
    roadMesh.rotation.x = -Math.PI / 2;
    roadMesh.position.set(0, -0.04, 22);
    groundGroup.add(roadMesh);

    // Road markings
    const markingGeo = new THREE.PlaneGeometry(4, 0.4);
    const markingMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
    for (let rx = -50; rx <= 50; rx += 10) {
      const mark = new THREE.Mesh(markingGeo, markingMat);
      mark.rotation.x = -Math.PI / 2;
      mark.position.set(rx, -0.02, 22);
      groundGroup.add(mark);
    }

    scene.add(groundGroup);

    // Highlight Box for selected element - Antimetal Accent (#e2e67d)
    const highlightBox = new THREE.BoxHelper(new THREE.Mesh(new THREE.BoxGeometry(1, 1, 1)), 0x171717);
    highlightBox.visible = false;
    scene.add(highlightBox);
    highlightBoxRef.current = highlightBox;

    // Animation Loop
    let lastTime = performance.now();
    let frameCount = 0;
    const animate = () => {
      animFrameRef.current = requestAnimationFrame(animate);

      // Camera position from spherical angles
      const { theta, phi, radius } = cameraAnglesRef.current;
      camera.position.x = radius * Math.sin(phi) * Math.cos(theta);
      camera.position.y = radius * Math.cos(phi);
      camera.position.z = radius * Math.sin(phi) * Math.sin(theta);
      camera.lookAt(0, 14, 0);

      // Pulse unauthorized floors if any
      const now = performance.now();
      meshesMapRef.current.forEach((item) => {
        if (item.unit?.status === 'unauthorized_extension' && item.mesh instanceof THREE.Mesh) {
          const mat = item.mesh.material as THREE.MeshStandardMaterial;
          if (mat) {
            mat.emissive = new THREE.Color(0xdc2626);
            mat.emissiveIntensity = 0.3 + 0.3 * Math.sin(now * 0.005);
          }
        }
      });

      // Utility glowing animation
      scene.children.forEach((obj) => {
        if (obj.name.startsWith('utility-glow-') && obj instanceof THREE.Mesh) {
          const mat = obj.material as THREE.MeshBasicMaterial;
          mat.opacity = 0.6 + 0.25 * Math.sin(now * 0.004);
        }
      });

      renderer.render(scene, camera);

      // Simple FPS counter
      frameCount++;
      if (now - lastTime >= 1000) {
        setFps(frameCount);
        frameCount = 0;
        lastTime = now;
      }
    };
    animate();

    // Resize handler with ResizeObserver
    const resizeObserver = new ResizeObserver(() => {
      if (!container || !rendererRef.current || !cameraRef.current) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    });
    resizeObserver.observe(container);

    // Mouse / Touch Orbit Controls
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) {
        isDraggingRef.current = true;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingRef.current) {
        const deltaX = e.clientX - prevMousePosRef.current.x;
        const deltaY = e.clientY - prevMousePosRef.current.y;
        prevMousePosRef.current = { x: e.clientX, y: e.clientY };

        cameraAnglesRef.current.theta -= deltaX * 0.007;
        cameraAnglesRef.current.phi = Math.max(0.1, Math.min(Math.PI / 2 - 0.02, cameraAnglesRef.current.phi + deltaY * 0.007));
      } else {
        // Raycast for hover label
        handleHoverRaycast(e.clientX, e.clientY);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraAnglesRef.current.radius = Math.max(15, Math.min(150, cameraAnglesRef.current.radius + e.deltaY * 0.06));
    };

    const handleHoverRaycast = (clientX: number, clientY: number) => {
      if (!container || !cameraRef.current || !sceneRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const clickableMeshes: THREE.Mesh[] = [];
      meshesMapRef.current.forEach((item) => {
        if (item.mesh instanceof THREE.Mesh && item.mesh.visible) {
          clickableMeshes.push(item.mesh);
        }
      });

      const intersects = raycaster.intersectObjects(clickableMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        let entry: MeshEntry | undefined;
        meshesMapRef.current.forEach((v) => {
          if (v.mesh === hit) entry = v;
        });
        if (entry?.unit) {
          setHoveredLabel({
            text: `${entry.unit.unitNumber} (${entry.unit.ulpin3D})`,
            subtext: `Owner: ${entry.unit.ownership.ownerName} | Vol: ${entry.unit.dimensions.volumeM3} m³ | Conf: ${entry.unit.aiConfidence}%`,
            x: clientX - rect.left,
            y: clientY - rect.top,
          });
          return;
        } else if (entry?.utility) {
          setHoveredLabel({
            text: `Subsurface Utility: ${entry.utility.operatorName}`,
            subtext: `ULPIN: ${entry.utility.ulpin3D} | Depth: ${entry.utility.depthMeters}m | Buffer: ${entry.utility.bufferZoneMeters}m`,
            x: clientX - rect.left,
            y: clientY - rect.top,
          });
          return;
        }
      }
      setHoveredLabel(null);
    };

    const handleClick = (e: MouseEvent) => {
      if (!container || !cameraRef.current || !sceneRef.current) return;
      const rect = container.getBoundingClientRect();
      const mouse = new THREE.Vector2(
        ((e.clientX - rect.left) / rect.width) * 2 - 1,
        -((e.clientY - rect.top) / rect.height) * 2 + 1
      );

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(mouse, cameraRef.current);

      const clickableMeshes: THREE.Mesh[] = [];
      meshesMapRef.current.forEach((item) => {
        if (item.mesh instanceof THREE.Mesh && item.mesh.visible) {
          clickableMeshes.push(item.mesh);
        }
      });

      const intersects = raycaster.intersectObjects(clickableMeshes);
      if (intersects.length > 0) {
        const hit = intersects[0].object;
        let entry: MeshEntry | undefined;
        meshesMapRef.current.forEach((v) => {
          if (v.mesh === hit) entry = v;
        });
        if (entry?.unit) {
          onSelectUnit(entry.unit);
          onSelectUtility(null);
        } else if (entry?.utility) {
          onSelectUtility(entry.utility);
          onSelectUnit(null);
        }
      } else {
        // Clicked background
        onSelectUnit(null);
        onSelectUtility(null);
      }
    };

    container.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('wheel', handleWheel, { passive: false });
    container.addEventListener('click', handleClick);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('wheel', handleWheel);
      container.removeEventListener('click', handleClick);
      resizeObserver.disconnect();
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      if (rendererRef.current?.domElement && container.contains(rendererRef.current.domElement)) {
        container.removeChild(rendererRef.current.domElement);
      }
      rendererRef.current?.dispose();
    };
  }, []);

  // Re-populate 3D meshes when building or filter changes
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Clear old unit/utility meshes
    meshesMapRef.current.forEach(({ mesh }) => {
      scene.remove(mesh);
      if (mesh instanceof THREE.Mesh) {
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      }
    });
    meshesMapRef.current.clear();

    // Remove any previous utilities or air-rights groups
    const oldUtilityGroup = scene.getObjectByName('utilitiesGroup');
    if (oldUtilityGroup) scene.remove(oldUtilityGroup);
    const oldAirRightsGroup = scene.getObjectByName('airRightsGroup');
    if (oldAirRightsGroup) scene.remove(oldAirRightsGroup);

    // Update Ground transparency based on subsurface mode
    const ground = scene.getObjectByName('groundGroup');
    if (ground) {
      ground.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
          child.material.transparent = subsurfaceVisible;
          child.material.opacity = subsurfaceVisible ? 0.35 : 1.0;
        }
      });
    }

    // BUILD BUILDING UNITS
    building.units.forEach((unit) => {
      if (filterLevel !== 'all' && unit.level !== filterLevel) {
        return; // Filtered out
      }

      // Hide basements if subsurface is not visible and no filter active
      if (unit.level < 0 && !subsurfaceVisible && filterLevel === 'all') {
        return;
      }

      const dims = unit.dimensions;
      const geometry = new THREE.BoxGeometry(dims.width, dims.height, dims.length);

      const unitColor = getUnitColor(unit);
      const isSelected = selectedUnit?.id === unit.id;

      const material = new THREE.MeshStandardMaterial({
        color: isSelected ? 0x2563eb : unitColor,
        roughness: 0.35,
        metalness: 0.15,
        transparent: true,
        opacity: unit.level < 0 ? 0.85 : unit.status === 'unauthorized_extension' ? 0.95 : 0.88,
        wireframe: false,
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Base Y elevation calculation
      const zBase = dims.zBase;
      const centerY = zBase + dims.height / 2;

      // Apply initial explosion offset
      const explosionOffset = unit.level > 0 ? unit.level * (explosionFactor * 2.8) : unit.level < 0 ? unit.level * (explosionFactor * 1.5) : 0;
      mesh.position.set(dims.x, centerY + explosionOffset, dims.y);

      // Add wireframe edge border for crisp cadastral volumetric delineation
      const edges = new THREE.EdgesGeometry(geometry);
      const edgeColor = unit.status === 'unauthorized_extension' ? 0xdc2626 : 0x334155;
      const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: edgeColor, linewidth: 1.5 }));
      mesh.add(line);

      scene.add(mesh);
      meshesMapRef.current.set(unit.id, { mesh, unit, baseZ: centerY, level: unit.level });
    });

    // BUILD UNDERGROUND UTILITIES
    if (subsurfaceVisible && building.utilities) {
      const utilitiesGroup = new THREE.Group();
      utilitiesGroup.name = 'utilitiesGroup';

      building.utilities.forEach((utility) => {
        const points = utility.coordinates.map(c => new THREE.Vector3(c[0], c[2], c[1]));
        const curve = new THREE.CatmullRomCurve3(points);
        const radius = (utility.diameterMm / 1000) * 0.7;
        const tubeGeo = new THREE.TubeGeometry(curve, 32, Math.max(0.12, radius), 8, false);

        let pipeColor = 0xf59e0b; // Amber gas
        if (utility.utilityType === 'water_potable') pipeColor = 0x06b6d4; // Cyan water
        if (utility.utilityType === 'power_highvoltage') pipeColor = 0xef4444; // Red power
        if (utility.utilityType === 'telecom_ofc') pipeColor = 0x10b981; // Green fiber
        if (utility.utilityType === 'stormwater') pipeColor = 0x8b5cf6; // Purple storm

        const isUtilSelected = selectedUtility?.id === utility.id;

        const pipeMat = new THREE.MeshStandardMaterial({
          color: isUtilSelected ? 0x38bdf8 : pipeColor,
          emissive: pipeColor,
          emissiveIntensity: 0.4,
          roughness: 0.2,
          metalness: 0.8,
        });

        const pipeMesh = new THREE.Mesh(tubeGeo, pipeMat);
        pipeMesh.castShadow = true;
        utilitiesGroup.add(pipeMesh);

        // Safety Buffer Corridor Tube (Translucent outer cylinder)
        const bufferGeo = new THREE.TubeGeometry(curve, 16, utility.bufferZoneMeters * 0.6, 8, false);
        const bufferMat = new THREE.MeshBasicMaterial({
          color: pipeColor,
          transparent: true,
          opacity: 0.15,
          wireframe: true,
        });
        const bufferMesh = new THREE.Mesh(bufferGeo, bufferMat);
        bufferMesh.name = `utility-glow-${utility.id}`;
        utilitiesGroup.add(bufferMesh);

        meshesMapRef.current.set(utility.id, { mesh: pipeMesh, utility, baseZ: utility.depthMeters, level: -3 });
      });

      scene.add(utilitiesGroup);
    }

    // BUILD AIR-RIGHTS METRO CORRIDOR
    if (airRightsVisible && building.airRights) {
      const airGroup = new THREE.Group();
      airGroup.name = 'airRightsGroup';

      // Elevated metro track box
      const trackGeo = new THREE.BoxGeometry(6, 2.5, 70);
      const trackMat = new THREE.MeshStandardMaterial({
        color: 0x9333ea,
        roughness: 0.4,
        metalness: 0.3,
        transparent: true,
        opacity: 0.7,
      });
      const trackMesh = new THREE.Mesh(trackGeo, trackMat);
      trackMesh.position.set(-20, building.airRights.clearanceHeightMeters, 0);
      airGroup.add(trackMesh);

      // Support pillars
      const pillarGeo = new THREE.CylinderGeometry(1.2, 1.2, building.airRights.clearanceHeightMeters, 12);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.7 });
      for (let pz = -25; pz <= 25; pz += 25) {
        const pillar = new THREE.Mesh(pillarGeo, pillarMat);
        pillar.position.set(-20, building.airRights.clearanceHeightMeters / 2, pz);
        airGroup.add(pillar);
      }

      // Air-rights Volumetric Envelope Wireframe
      const airBoxGeo = new THREE.BoxGeometry(14, 8, 70);
      const airBoxEdges = new THREE.EdgesGeometry(airBoxGeo);
      const airLine = new THREE.LineSegments(airBoxEdges, new THREE.LineBasicMaterial({ color: 0xc084fc, linewidth: 2 }));
      airLine.position.set(-20, building.airRights.clearanceHeightMeters + 2, 0);
      airGroup.add(airLine);

      scene.add(airGroup);
    }

  }, [building, colorMode, subsurfaceVisible, airRightsVisible, filterLevel, selectedUnit, selectedUtility]);

  // Handle Explosion Factor changes smoothly
  useEffect(() => {
    meshesMapRef.current.forEach(({ mesh, level, baseZ }) => {
      if (mesh instanceof THREE.Mesh) {
        const explosionOffset = level > 0 ? level * (explosionFactor * 2.8) : level < 0 ? level * (explosionFactor * 1.5) : 0;
        mesh.position.y = baseZ + explosionOffset;
      }
    });

    // Update highlight box if visible
    if (highlightBoxRef.current && selectedUnit) {
      const entry = meshesMapRef.current.get(selectedUnit.id);
      if (entry?.mesh) {
        highlightBoxRef.current.setFromObject(entry.mesh);
        highlightBoxRef.current.visible = true;
      }
    }
  }, [explosionFactor, selectedUnit]);

  // Update Highlight Box on selection
  useEffect(() => {
    if (!highlightBoxRef.current) return;
    if (selectedUnit) {
      const entry = meshesMapRef.current.get(selectedUnit.id);
      if (entry?.mesh) {
        highlightBoxRef.current.setFromObject(entry.mesh);
        highlightBoxRef.current.visible = true;
        return;
      }
    }
    if (selectedUtility) {
      const entry = meshesMapRef.current.get(selectedUtility.id);
      if (entry?.mesh) {
        highlightBoxRef.current.setFromObject(entry.mesh);
        highlightBoxRef.current.visible = true;
        return;
      }
    }
    highlightBoxRef.current.visible = false;
  }, [selectedUnit, selectedUtility]);

  // Preset camera positions
  const setCameraPreset = (preset: 'street' | 'exploded' | 'subsurface' | 'metro') => {
    if (!cameraRef.current) return;
    if (preset === 'street') {
      cameraAnglesRef.current = { theta: 0.8, phi: 1.3, radius: 50 };
      onExplosionChange(0);
    } else if (preset === 'exploded') {
      cameraAnglesRef.current = { theta: 0.9, phi: 1.1, radius: 85 };
      onExplosionChange(0.65);
    } else if (preset === 'subsurface') {
      cameraAnglesRef.current = { theta: 1.2, phi: 1.45, radius: 45 };
      onExplosionChange(0.2);
    } else if (preset === 'metro') {
      cameraAnglesRef.current = { theta: -0.8, phi: 1.2, radius: 60 };
    }
  };

  const resetCamera = () => {
    cameraAnglesRef.current = { theta: Math.PI / 4, phi: Math.PI / 3, radius: 65 };
  };

  const zoom = (delta: number) => {
    cameraAnglesRef.current.radius = Math.max(15, Math.min(150, cameraAnglesRef.current.radius + delta));
  };

  return (
    <div id={`3d-viewer-container-${viewerId}`} className="relative w-full h-full min-h-[480px] bg-white rounded-[8px] overflow-hidden border border-[#e5e7eb] select-none flex flex-col">
      {/* 3D WebGL Canvas Container */}
      <div ref={mountRef} className="w-full flex-1 cursor-grab active:cursor-grabbing relative" />

      {/* Floating HUD Top Bar */}
      <div className="absolute top-3 left-3 right-3 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Building Title & Live Cadastre Pin */}
        <div className="pointer-events-auto bg-white px-3 py-2 rounded-[8px] border border-[#e5e7eb] flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-[#171717]" />
          <div>
            <div className="text-[12px] font-medium font-['Geist'] text-[#171717]/60 flex items-center gap-1.5">
              <span>National Cadastre Base</span>
              <span className="font-mono text-[#171717] bg-[#e2e67d] px-1.5 py-0.2 rounded-full border border-[#cfd45e] text-[11px] font-medium">
                {building.baseParcelUlpin}
              </span>
            </div>
            <div className="text-[14px] font-medium font-['Geist'] text-[#171717] flex items-center gap-1.5 mt-0.5">
              <span>{building.name}</span>
              <span className="text-[12px] text-[#171717]/50 font-normal">({building.state})</span>
            </div>
          </div>
        </div>

        {/* Camera Preset Quick Buttons with Helpful Tooltips */}
        <div className="pointer-events-auto flex items-center gap-1 bg-white p-1 rounded-[8px] border border-[#e5e7eb]">
          <Tooltip
            title="Street Angle Preset"
            content="Frames the building at human pedestrian height to inspect ground floor retail, entry setbacks, and sidewalk alignment."
            side="bottom"
          >
            <button
              id="btn-preset-street"
              onClick={() => setCameraPreset('street')}
              className="px-2.5 py-1 text-[13px] font-medium font-['Geist'] text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#171717]" />
              <span>Street</span>
            </button>
          </Tooltip>

          <Tooltip
            title="Exploded Vertical Slabs"
            content="Separates all stacked floors along the Z-axis so individual apartments, parking slots, and floor plans are directly visible."
            side="bottom"
          >
            <button
              id="btn-preset-exploded"
              onClick={() => setCameraPreset('exploded')}
              className="px-2.5 py-1 text-[13px] font-medium font-['Geist'] text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Layers className="w-3.5 h-3.5 text-[#171717]" />
              <span>Exploded</span>
            </button>
          </Tooltip>

          <Tooltip
            title="Subsurface View"
            content="Angles the camera below ground datum to reveal underground parking, utility conduits (PNG gas, power), and foundations."
            side="bottom"
          >
            <button
              id="btn-preset-subsurface"
              onClick={() => setCameraPreset('subsurface')}
              className="px-2.5 py-1 text-[13px] font-medium font-['Geist'] text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5 text-[#171717]" />
              <span>Subsurface</span>
            </button>
          </Tooltip>

          <Tooltip
            title="Air Rights Envelope"
            content="Switches to high perspective showing municipal sanctioned building height envelopes and air space boundary restrictions."
            side="bottom"
          >
            <button
              id="btn-preset-metro"
              onClick={() => setCameraPreset('metro')}
              className="px-2.5 py-1 text-[13px] font-medium font-['Geist'] text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Box className="w-3.5 h-3.5 text-[#171717]" />
              <span>Air Rights</span>
            </button>
          </Tooltip>
        </div>
      </div>

      {/* Floating Explosion Slider Controls (Left Bottom) */}
      <div className="absolute bottom-3 left-3 pointer-events-auto bg-white p-4 rounded-[8px] border border-[#e5e7eb] max-w-xs w-full flex flex-col gap-2.5">
        <div className="flex items-center justify-between text-[13px] font-medium font-['Geist'] text-[#171717]">
          <div className="flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-[#171717]" />
            <span>Vertical Floor Separation</span>
          </div>
          <span className="font-mono bg-[#e2e67d] text-[#171717] px-2 py-0.5 rounded-full text-[11px] font-medium border border-[#cfd45e]">
            {Math.round(explosionFactor * 100)}%
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[11px] font-medium text-[#171717]/50 font-['Geist']">Compact</span>
          <input
            id="slider-vertical-explosion"
            type="range"
            min="0"
            max="1"
            step="0.02"
            value={explosionFactor}
            onChange={(e) => onExplosionChange(parseFloat(e.target.value))}
            className="w-full accent-[#171717] h-1.5 bg-[#e5e7eb] rounded-[4px] cursor-pointer"
          />
          <span className="text-[11px] font-medium text-[#171717] font-['Geist']">Separated</span>
        </div>
        <div className="text-[11px] text-[#171717]/60 leading-relaxed font-sans">
          Separates vertical levels along the Z-axis so individual unit volumes can be clicked and inspected.
        </div>
      </div>

      {/* Zoom / Navigation Widget (Right Bottom) */}
      <div className="absolute bottom-3 right-3 pointer-events-auto flex flex-col gap-1 bg-white p-1 rounded-[8px] border border-[#e5e7eb]">
        <Tooltip title="Zoom In" content="Closer look at unit boundaries and cadastre hashes." side="left">
          <button
            id="btn-zoom-in"
            onClick={() => zoom(-10)}
            aria-label="Zoom In"
            className="p-2 text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors cursor-pointer"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip title="Zoom Out" content="Wider perspective showing the full parcel footprint and site boundary." side="left">
          <button
            id="btn-zoom-out"
            onClick={() => zoom(10)}
            aria-label="Zoom Out"
            className="p-2 text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors cursor-pointer"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
        </Tooltip>

        <Tooltip title="Reset Camera" content="Re-centers camera orientation back to the base cadastral parcel." side="left">
          <button
            id="btn-reset-view"
            onClick={resetCamera}
            aria-label="Reset Camera"
            className="p-2 text-[#171717] hover:bg-black/[0.04] rounded-[6px] transition-colors cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </Tooltip>
      </div>

      {/* Hover Information Tooltip */}
      {hoveredLabel && (
        <div
          className="absolute pointer-events-none z-30 bg-[#171717] text-white rounded-[6px] px-3 py-2 border border-[#171717] transform -translate-x-1/2 -translate-y-full mb-3"
          style={{ left: hoveredLabel.x, top: hoveredLabel.y }}
        >
          <div className="text-[12px] font-medium font-['Geist'] text-white flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#e2e67d]" />
            <span>{hoveredLabel.text}</span>
          </div>
          <div className="text-[11px] text-white/70 font-sans mt-0.5">{hoveredLabel.subtext}</div>
        </div>
      )}

      {/* Live System Diagnostics Pill */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 pointer-events-none hidden sm:flex items-center gap-3 bg-white px-3 py-1 rounded-full border border-[#e5e7eb] text-[12px] font-['Geist'] text-[#171717]">
        <span className="flex items-center gap-1.5 font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[#171717]" />
          <span>OGC 3D Cadastre Engine</span>
        </span>
        <span className="text-[#171717]/30">•</span>
        <span>{fps} FPS</span>
        <span className="text-[#171717]/30">•</span>
        <span>{building.totalUnits} Envelopes</span>
      </div>
    </div>
  );
};
