import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import { AdditiveBlending, EdgesGeometry, IcosahedronGeometry, MathUtils, type Group, type Mesh } from "three";

type Props = { active: boolean; pointer: RefObject<{ x: number; y: number }>; onReady: () => void; onLost: () => void };

function Orbit({ radius, tilt, color, speed, active }: { radius: number; tilt: [number, number, number]; color: string; speed: number; active: boolean }) {
  const orbit = useRef<Group>(null);
  useFrame((_, delta) => { if (active && orbit.current) orbit.current.rotation.z += Math.min(delta, .05) * speed; });
  return <group rotation={tilt}><group ref={orbit}>
    <mesh><torusGeometry args={[radius, .012, 8, 160]} /><meshBasicMaterial color={color} /></mesh>
    <mesh><torusGeometry args={[radius, .05, 8, 128]} /><meshBasicMaterial color={color} transparent opacity={.07} blending={AdditiveBlending} depthWrite={false} /></mesh>
    <mesh rotation={[0, 0, .2]}><torusGeometry args={[radius + .055, .004, 6, 80, Math.PI * .65]} /><meshBasicMaterial color={color} transparent opacity={.5} /></mesh>
    {[0, Math.PI].map((angle, index) => <group key={angle} position={[Math.cos(angle) * radius, Math.sin(angle) * radius, 0]}>
      <mesh><sphereGeometry args={[index ? .033 : .055, 12, 12]} /><meshBasicMaterial color={index ? color : "#b5fff2"} /></mesh>
      <mesh><sphereGeometry args={[.105, 12, 12]} /><meshBasicMaterial color={color} transparent opacity={.09} blending={AdditiveBlending} depthWrite={false} /></mesh>
    </group>)}
  </group></group>;
}

function Sculpture({ active, pointer, onReady, onLost }: Props) {
  const root = useRef<Group>(null);
  const cage = useRef<Group>(null);
  const core = useRef<Mesh>(null);
  const elapsed = useRef(0);
  const gl = useThree(state => state.gl);
  const edges = useMemo(() => {
    const geometry = new IcosahedronGeometry(1.14, 0);
    const result = new EdgesGeometry(geometry);
    geometry.dispose();
    return result;
  }, []);
  useEffect(() => () => edges.dispose(), [edges]);
  useEffect(() => {
    onReady();
    const lost = (event: Event) => { event.preventDefault(); onLost(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onReady, onLost]);
  const particles = useMemo(() => Float32Array.from(Array.from({ length: 90 }, (_, i) => {
    const a = i * 2.399963;
    const r = 2 + (Math.sin(i * 17.31) + 1) * .35;
    return [Math.cos(a) * r, Math.sin(a) * r, Math.sin(i * 3.7) * .75 - .5];
  }).flat()), []);
  useFrame((_, delta) => {
    if (!active) return;
    const dt = Math.min(delta, .05);
    elapsed.current += dt;
    const t = elapsed.current;
    if (root.current) {
      root.current.rotation.y = MathUtils.damp(root.current.rotation.y, pointer.current.x * .22, 3, dt);
      root.current.rotation.x = MathUtils.damp(root.current.rotation.x, pointer.current.y * .15, 3, dt);
      root.current.position.y = Math.sin(t * .6) * .07;
    }
    if (cage.current) { cage.current.rotation.y = t * .12; cage.current.rotation.z = Math.sin(t * .2) * .12; }
    if (core.current) { core.current.rotation.y = -t * .22; core.current.rotation.z = .18 + Math.sin(t * .45) * .1; }
  });
  return <group ref={root}>
    <ambientLight intensity={.7} />
    <directionalLight position={[3, 4, 4]} intensity={4} color="#83fff0" />
    <directionalLight position={[-4, -1, 2]} intensity={3} color="#357bff" />
    <pointLight position={[0, -2, 1]} intensity={8} color="#1eacaf" />
    <mesh ref={core} rotation={[.25, .4, .18]}>
      <octahedronGeometry args={[.78, 0]} />
      <meshStandardMaterial color="#1f93b9" metalness={.62} roughness={.24} emissive="#07314b" emissiveIntensity={.5} flatShading />
    </mesh>
    <group ref={cage}>
      <lineSegments geometry={edges}><lineBasicMaterial color="#4aefd6" transparent opacity={.64} /></lineSegments>
      <mesh rotation={[.4, .2, 0]}><icosahedronGeometry args={[1.32, 0]} /><meshBasicMaterial color="#256ebd" wireframe transparent opacity={.12} /></mesh>
    </group>
    <Orbit radius={1.72} tilt={[1.13, .35, -.35]} color="#38d9df" speed={.28} active={active} />
    <Orbit radius={2.03} tilt={[.43, 1.1, .5]} color="#428dff" speed={-.19} active={active} />
    <Orbit radius={2.25} tilt={[1.32, -.48, .2]} color="#3fdfb0" speed={.14} active={active} />
    <points><bufferGeometry><bufferAttribute attach="attributes-position" args={[particles, 3]} /></bufferGeometry><pointsMaterial size={.014} color="#77b6dc" transparent opacity={.6} sizeAttenuation depthWrite={false} /></points>
  </group>;
}

export default function HeroScene(props: Props) {
  return <div className="sculpture-canvas"><Canvas camera={{ position: [0, 0, 7.8], fov: 43 }} dpr={[1, 1.5]} frameloop={props.active ? "always" : "demand"} gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} fallback={null}>
    <Sculpture {...props} />
  </Canvas></div>;
}
