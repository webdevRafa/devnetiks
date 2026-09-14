import { Canvas, useFrame, useLoader, useThree, type ThreeEvent } from "@react-three/fiber";
import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { SRGBColorSpace, TextureLoader, Vector3, type Mesh } from "three";

type Props = { active: boolean; reduced: boolean; focus: number | null; selected: number; onSelect: (index: number) => void; onReady: () => void; onFailure: () => void };
function Box({ position = [0, 0, 0], size, color = "#18212a", metal = .45 }: { position?: [number, number, number]; size: [number, number, number]; color?: string; metal?: number }) {
  const [width, height, depth] = size;
  const geometry = useMemo(() => new RoundedBoxGeometry(width, height, depth, 2, Math.min(width, height, depth) * .22), [width, height, depth]);
  useEffect(() => () => geometry.dispose(), [geometry]);
  return <mesh position={position} geometry={geometry}><meshStandardMaterial color={color} roughness={.4} metalness={metal} /></mesh>;
}
function Device({ index, position, rotation = 0, width, height, image, selected, onSelect, active, reduced }: { index: number; position: [number, number, number]; rotation?: number; width: number; height: number; image: string; selected: number; onSelect: Props["onSelect"]; active: boolean; reduced: boolean }) {
  const ring = useRef<Mesh>(null);
  const phase = useRef(index * -1.4);
  useFrame((_, delta) => {
    if (!ring.current) return;
    if (reduced) { ring.current.scale.setScalar(1); return; }
    if (!active) return;
    phase.current += Math.min(delta, .05);
    const pulse = Math.pow((Math.sin(phase.current * Math.PI / 2.5) + 1) / 2, 4);
    ring.current.scale.setScalar(1 + pulse * .2);
  });
  const texture = useLoader(TextureLoader, image);
  useMemo(() => { texture.colorSpace = SRGBColorSpace; }, [texture]);
  const color = index === 1 ? "#d9b768" : index === 2 ? "#45d8c1" : "#4eacdf";
  const click = (event: ThreeEvent<MouseEvent>) => { event.stopPropagation(); onSelect(index); };
  return <group position={position} rotation={[0, rotation, 0]} onClick={click} onPointerOver={event => { event.stopPropagation(); document.body.style.cursor = "pointer"; }} onPointerOut={() => { document.body.style.cursor = ""; }}>
    <Box size={[width + .15, height + .15, .12]} color="#263644" />
    <Box size={[width + .09, height + .09, .13]} color="#070a10" />
    <mesh position={[0, 0, .073]}><planeGeometry args={[width, height]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
    <mesh position={[0, height / 2 + .21, 0]}><sphereGeometry args={[.05, 16, 12]} /><meshBasicMaterial color={selected === index ? "#aaffef" : color} /></mesh>
    <mesh ref={ring} position={[0, height / 2 + .21, -.005]}><torusGeometry args={[.092, .009, 8, 32]} /><meshBasicMaterial color={color} /></mesh>
  </group>;
}

function World(props: Props) {
  const { onReady, onFailure } = props;
  const { camera, gl, invalidate, size } = useThree();
  const initialized = useRef(false);
  const look = useRef(new Vector3(0, 1.1, 0));
  const target = useMemo(() => {
    const values = props.focus === 0 ? [[0, 2.9, 6.6], [0, 1.9, -.55]] : props.focus === 1 ? [[-3, 2.6, 5.5], [-2.9, 1.15, .65]] : props.focus === 2 ? [[3.2, 2.5, 5.1], [3.15, 1.2, .8]] : [[0, 3.8, 8.9], [0, 1.1, 0]];
    const lookAt = new Vector3(...values[1]);
    const position = new Vector3(...values[0]);
    const aspect = size.width / size.height;
    if (props.focus === 0) {
      // Fit the monitor and its cue to the canvas, including narrow phone layouts.
      const distance = Math.max(2.18 / (Math.tan(Math.PI / 9) * aspect * .86), 1.2 / (Math.tan(Math.PI / 9) * .82));
      const monitorCenter = new Vector3(0, 2.04, -.7);
      return { position: monitorCenter.clone().add(new Vector3(0, .3, distance)), look: monitorCenter };
    }
    if (props.focus !== null) {
      const laptop = props.focus === 1;
      const center = laptop ? new Vector3(-2.966, 1.15, .6) : new Vector3(3.05, 1.23, .75);
      const halfWidth = laptop ? 1.4 : .57;
      const halfHeight = laptop ? .88 : 1.14;
      const distance = Math.max(halfWidth / (Math.tan(Math.PI / 9) * aspect * .86), halfHeight / (Math.tan(Math.PI / 9) * .82));
      const angle = laptop ? .16 : -.17;
      return { position: center.clone().add(new Vector3(Math.sin(angle) * distance, .24, Math.cos(angle) * distance)), look: center };
    }
    position.sub(lookAt).multiplyScalar(Math.max(1, 1.7 / aspect)).add(lookAt);
    return { position, look: lookAt };
  }, [props.focus, size.width, size.height]);
  useLayoutEffect(() => {
    if (!initialized.current || props.reduced) { camera.position.copy(target.position); look.current.copy(target.look); camera.lookAt(look.current); }
    initialized.current = true;
    invalidate();
  }, [target, props.reduced, camera, invalidate]);
  useFrame((_, delta) => {
    if (!props.active || props.reduced) return;
    const amount = 1 - Math.exp(-Math.min(delta, .05) * 4);
    camera.position.lerp(target.position, amount); look.current.lerp(target.look, amount); camera.lookAt(look.current);
    invalidate();
  });
  useEffect(() => {
    onReady();
    const lost = (event: Event) => { event.preventDefault(); onFailure(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => { gl.domElement.removeEventListener("webglcontextlost", lost); document.body.style.cursor = ""; };
  }, [gl, onReady, onFailure]);
  useEffect(() => { if (props.active) invalidate(); }, [props.active, invalidate]);
  return <>
    <ambientLight intensity={1.5} />
    <directionalLight position={[1, 5, 7]} intensity={3} color="#dce9ff" />
    <directionalLight position={[-3, 6, 4]} intensity={3} color="#71bdfc" />
    <directionalLight position={[5, 3, 1]} intensity={3} color="#60eac8" />
    <directionalLight position={[0, 7, -3]} intensity={1.5} color="#d9e9ff" />
    <Box position={[0, -.18, .2]} size={[9, .18, 4.2]} color="#10222d" />
    <Box position={[0, -.075, .2]} size={[8.9, .035, 4.1]} color="#151e25" />
    <Box position={[0, -.3, -.1]} size={[8.4, .12, 3.6]} color="#08131d" />
    <Device index={0} position={[0, 1.95, -.7]} width={4.2} height={4.2 * 742 / 1600} image="/workspace/satx.webp" selected={props.selected} onSelect={props.onSelect} active={props.active} reduced={props.reduced} />
    <Box position={[0, .51, -.73]} size={[.2, .96, .18]} />
    <Box position={[0, .04, -.55]} size={[1.25, .09, .75]} />
    <group position={[-2.95, 0, .7]} rotation={[0, .16, 0]}>
      <Device index={1} position={[0, 1.05, -.1]} width={2.5} height={2.5 * 839 / 1600} image="/workspace/rancho.webp" selected={props.selected} onSelect={props.onSelect} active={props.active} reduced={props.reduced} />
      <Box position={[0, .07, .55]} size={[2.7, .1, 1.5]} color="#293741" />
      {Array.from({ length: 4 }, (_, row) => Array.from({ length: 12 }, (_, col) => <Box key={`${row}-${col}`} position={[-1.12 + col * .202, .132, .16 + row * .16]} size={[.17, .025, .12]} color="#090f17" />))}
      <Box position={[0, .132, 1.08]} size={[.82, .012, .33]} color="#192631" />
    </group>
    <Device index={2} position={[3.05, 1.12, .75]} rotation={-.17} width={.95} height={.95 * 864 / 477} image="/workspace/roofzeus.webp" selected={props.selected} onSelect={props.onSelect} active={props.active} reduced={props.reduced} />
    <Box position={[3.05, .025, .82]} size={[1.15, .08, .75]} />
    <Box position={[3.05, .35, .55]} size={[.24, .65, .15]} />
    <group position={[0, .07, 1.15]} rotation={[0, -.035, 0]}>
      <Box size={[2.6, .08, .93]} color="#26323c" />
      {Array.from({ length: 5 }, (_, row) => Array.from({ length: 14 }, (_, col) => <Box key={`${row}-${col}`} position={[-1.17 + col * .18, .06, -.35 + row * .16]} size={[.14, .035, .12]} color="#0b111a" />))}
    </group>
    <mesh position={[1.84, .13, 1.3]} scale={[.2, .11, .32]}><sphereGeometry args={[1, 24, 16]} /><meshStandardMaterial color="#253640" metalness={.5} roughness={.4} /></mesh>
    <group position={[4, .15, -.55]}>
      <mesh position={[0, .16, 0]}><cylinderGeometry args={[.25, .19, .4, 7]} /><meshStandardMaterial color="#183940" roughness={.5} /></mesh>
      {Array.from({ length: 7 }, (_, i) => <mesh key={i} position={[Math.cos(i) * .16, .55 + i % 2 * .12, Math.sin(i) * .16]} rotation={[Math.sin(i) * .5, i, .4]} scale={[.1, .42, .09]}><octahedronGeometry /><meshStandardMaterial color={i % 2 ? "#337f65" : "#205444"} roughness={.7} /></mesh>)}
    </group>
  </>;
}

export default function WorkspaceScene(props: Props) {
  return <div className="workspace-canvas" aria-hidden="true"><Canvas camera={{ position: [0, 3.8, 8.9], fov: 40 }} dpr={[1, 1.5]} frameloop="demand" gl={{ alpha: true, antialias: true, powerPreference: "low-power" }} fallback={null}>
    <World {...props} />
  </Canvas></div>;
}
