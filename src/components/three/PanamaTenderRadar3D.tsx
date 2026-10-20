"use client";

import React, { useRef, useState, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";
import { MOCK_TENDERS, type MockTender } from "@/lib/data/mock-tenders";
import { formatCurrency } from "@/lib/utils";
import { Shield, Sparkles, Clock } from "lucide-react";

// Geographic simplified coordinates for Panama's Isthmus in 3D Space (X: West to East, Z: North to South)
interface ProvinceNode {
  id: string;
  name: string;
  position: [number, number, number];
  tenders: MockTender[];
  color: string;
}

const PROVINCE_MAP: { name: string; position: [number, number, number]; color: string }[] = [
  { name: "Chiriquí", position: [-5.2, 0, 1.2], color: "#10B981" },
  { name: "Bocas del Toro", position: [-4.6, 0, -1.0], color: "#06B6D4" },
  { name: "Veraguas", position: [-2.8, 0, 1.4], color: "#10B981" },
  { name: "Coclé", position: [-1.2, 0, 0.4], color: "#F59E0B" },
  { name: "Colón", position: [-0.6, 0, -1.2], color: "#10B981" },
  { name: "Panamá Oeste", position: [0.3, 0, 0.5], color: "#10B981" },
  { name: "Panamá", position: [1.6, 0, -0.2], color: "#10B981" },
  { name: "Herrera", position: [-1.5, 0, 2.0], color: "#06B6D4" },
  { name: "Los Santos", position: [-0.8, 0, 2.8], color: "#F59E0B" },
  { name: "Darién", position: [4.2, 0, 1.0], color: "#06B6D4" },
];

function RadarScanSweep() {
  const sweepRef = useRef<THREE.Mesh>(null);

  useFrame((_, delta) => {
    if (sweepRef.current) {
      sweepRef.current.rotation.y += delta * 0.8;
    }
  });

  return (
    <mesh ref={sweepRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]}>
      <ringGeometry args={[0.2, 7.5, 64, 1, 0, Math.PI / 3]} />
      <meshBasicMaterial
        color="#10B981"
        transparent
        opacity={0.12}
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}

function GridRings() {
  const crosshairLines = useMemo(() => {
    const mat = new THREE.LineBasicMaterial({ color: "#1E293B", transparent: true, opacity: 0.3 });
    const geom1 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(-8, 0, 0),
      new THREE.Vector3(8, 0, 0),
    ]);
    const geom2 = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0, -8, 0),
      new THREE.Vector3(0, 8, 0),
    ]);
    const group = new THREE.Group();
    group.add(new THREE.Line(geom1, mat));
    group.add(new THREE.Line(geom2, mat));
    return group;
  }, []);

  return (
    <group position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
      {/* Concentric telemetry rings */}
      {[2, 4, 6, 7.5].map((radius, idx) => (
        <mesh key={idx}>
          <ringGeometry args={[radius - 0.02, radius, 80]} />
          <meshBasicMaterial
            color="#1E293B"
            transparent
            opacity={0.4}
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}

      {/* Crosshair grid lines */}
      <primitive object={crosshairLines} />
    </group>
  );
}

function IsthmusSpine() {
  // Connects provinces with a holographic bezier curve representing Panama
  const curvePoints = useMemo(() => {
    return PROVINCE_MAP.map((p) => new THREE.Vector3(p.position[0], 0.05, p.position[2]));
  }, []);

  const spineObject = useMemo(() => {
    const curve = new THREE.CatmullRomCurve3(curvePoints);
    const points = curve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const material = new THREE.LineBasicMaterial({ color: "#10B981", transparent: true, opacity: 0.35 });
    return new THREE.Line(geometry, material);
  }, [curvePoints]);

  return <primitive object={spineObject} />;
}

function ProvinceBeacon({
  node,
  isSelected,
  onSelect,
}: {
  node: ProvinceNode;
  isSelected: boolean;
  onSelect: (node: ProvinceNode) => void;
}) {
  const pulseRef = useRef<THREE.Mesh>(null);
  const ringRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (pulseRef.current) {
      const scale = 1 + 0.25 * Math.sin(t * 3 + node.position[0]);
      pulseRef.current.scale.set(scale, scale, scale);
    }
    if (ringRef.current) {
      const ringScale = 1 + (t * 1.5) % 2.5;
      ringRef.current.scale.set(ringScale, ringScale, 1);
      const mat = ringRef.current.material as THREE.MeshBasicMaterial;
      if (mat) {
        mat.opacity = Math.max(0, 0.6 * (1 - (ringScale - 1) / 2.5));
      }
    }
  });

  const hasTenders = node.tenders.length > 0;
  const beaconColor = hasTenders ? node.color : "#64748B";

  return (
    <group position={node.position}>
      {/* Expanding Ripple Ring */}
      {hasTenders && (
        <mesh ref={ringRef} rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
          <ringGeometry args={[0.25, 0.3, 32]} />
          <meshBasicMaterial color={beaconColor} transparent opacity={0.6} side={THREE.DoubleSide} />
        </mesh>
      )}

      {/* Core Glowing Sphere */}
      <mesh
        ref={pulseRef}
        position={[0, 0.2, 0]}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = "pointer";
        }}
        onPointerOut={() => {
          setHovered(false);
          document.body.style.cursor = "auto";
        }}
      >
        <sphereGeometry args={[isSelected || hovered ? 0.22 : 0.16, 24, 24]} />
        <meshStandardMaterial
          color={beaconColor}
          emissive={beaconColor}
          emissiveIntensity={isSelected || hovered ? 1.2 : 0.6}
          roughness={0.2}
        />
      </mesh>

      {/* Label above node */}
      <Text
        position={[0, 0.55, 0]}
        fontSize={0.22}
        color={isSelected || hovered ? "#FFFFFF" : "#94A3B8"}
        anchorX="center"
        anchorY="bottom"
      >
        {node.name}
      </Text>

      {/* Active tender count badge */}
      {hasTenders && (
        <Text
          position={[0, 0.8, 0]}
          fontSize={0.16}
          color="#10B981"
          anchorX="center"
          anchorY="bottom"
        >
          {`${node.tenders.length} ${node.tenders.length === 1 ? "acto" : "actos"}`}
        </Text>
      )}
    </group>
  );
}

export function PanamaTenderRadar3D({
  onSelectTender,
}: {
  onSelectTender?: (tender: MockTender) => void;
}) {
  const [selectedNode, setSelectedNode] = useState<ProvinceNode | null>(null);

  // Group tenders by province
  const nodes: ProvinceNode[] = useMemo(() => {
    return PROVINCE_MAP.map((prov) => ({
      id: prov.name.toLowerCase().replace(/\s+/g, "-"),
      name: prov.name,
      position: prov.position,
      color: prov.color,
      tenders: MOCK_TENDERS.filter((t) => t.province === prov.name),
    }));
  }, []);

  // Default select Panama on load
  React.useEffect(() => {
    const panamaNode = nodes.find((n) => n.name === "Panamá");
    if (panamaNode) setSelectedNode(panamaNode);
  }, [nodes]);

  return (
    <div className="relative w-full h-[520px] rounded-3xl border border-slate-800 bg-[#070B14] overflow-hidden shadow-2xl">
      {/* 3D WebGL Canvas */}
      <Canvas
        camera={{ position: [0, 9, 6.5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
      >
        <color attach="background" args={["#070B14"]} />
        <ambientLight intensity={0.6} />
        <directionalLight position={[10, 15, 10]} intensity={1.2} />
        <pointLight position={[-10, -5, -10]} color="#10B981" intensity={0.5} />

        <Float speed={1.2} rotationIntensity={0.1} floatIntensity={0.2}>
          <GridRings />
          <RadarScanSweep />
          <IsthmusSpine />

          {nodes.map((node) => (
            <ProvinceBeacon
              key={node.id}
              node={node}
              isSelected={selectedNode?.id === node.id}
              onSelect={(n) => setSelectedNode(n)}
            />
          ))}
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          maxPolarAngle={Math.PI / 2.3}
          minPolarAngle={Math.PI / 4}
          dampingFactor={0.05}
        />
      </Canvas>

      {/* Top Telemetry Header */}
      <div className="absolute top-5 left-5 right-5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center space-x-2 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60 shadow-lg pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-semibold text-white tracking-wide font-[family-name:var(--font-mono)]">
            RADAR 3D WEBGL: PANAMÁCOMPRA EN VIVO
          </span>
        </div>

        <div className="hidden sm:flex items-center space-x-3 text-xs text-slate-400 font-mono bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-slate-700/60">
          <span>Lat: 8.98° N</span>
          <span>Lng: -79.52° W</span>
          <span className="text-emerald-400 font-bold">60 FPS</span>
        </div>
      </div>

      {/* Floating Selected Node Detail HUD */}
      {selectedNode && (
        <div className="absolute bottom-5 left-5 right-5 sm:right-auto sm:max-w-md bg-[#0F172A]/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl p-4 shadow-2xl text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5 mb-3">
            <div>
              <span className="text-[10px] text-emerald-400 font-mono uppercase tracking-wider font-semibold">
                Telemetría Provincial
              </span>
              <h4 className="text-base font-bold text-white font-[family-name:var(--font-heading)]">
                {selectedNode.name}
              </h4>
            </div>
            <span className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold font-mono">
              {selectedNode.tenders.length} {selectedNode.tenders.length === 1 ? "licitación" : "licitaciones"}
            </span>
          </div>

          {selectedNode.tenders.length > 0 ? (
            <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
              {selectedNode.tenders.map((tender) => (
                <div
                  key={tender.id}
                  onClick={() => onSelectTender?.(tender)}
                  className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-emerald-500/50 cursor-pointer transition-all group"
                >
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-400 font-medium truncate max-w-[200px]">
                      {tender.entity_name}
                    </span>
                    <span className="text-emerald-400 font-bold font-mono">
                      {formatCurrency(tender.reference_amount)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-200 line-clamp-1 font-semibold group-hover:text-emerald-400 transition-colors">
                    {tender.title}
                  </p>
                  <div className="flex items-center justify-between mt-2 pt-1 border-t border-slate-800/60 text-[10px] text-slate-400 font-mono">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      Cierra: {new Date(tender.close_date).toLocaleDateString("es-PA")}
                    </span>
                    <span className="text-emerald-400 font-semibold group-hover:underline">
                      Ver pliego →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-400 italic py-2">
              No hay actos públicos activos en esta provincia en este momento.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
