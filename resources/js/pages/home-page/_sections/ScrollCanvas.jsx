/**
 * ScrollCanvas — Cinematic Three.js engine for asuraHOTEL homepage.
 */

import { useRef, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Stars, Text } from '@react-three/drei';
import * as THREE from 'three';

// ─────────────────────────────────────────────────────────────
// CONSTANTS
// ─────────────────────────────────────────────────────────────

const CAMERA_PATH = [
    // Waypoint 0: Hero Title View — Kept identical to frame image_815340.png
    { pos: [-30, 8, 50], look: [-22, 40, 5], fov: 60 },
    
    // Waypoint 1: Axis Alignment — Glides onto center line (X=0) early while safely back in the courtyard
    { pos: [0, 5.5, 22], look: [0, 5, -10], fov: 62 },
    
    // Waypoint 2: Straight Entry — Travels strictly along X=0 straight through the open entrance doors
    { pos: [0, 5, -12], look: [0, 4, -36], fov: 74 },
    
    // Waypoint 3: Grand Lobby View — Centered approach toward the reception desk
    { pos: [0, 2, -28], look: [0, 2.2, -48], fov: 70 },
    
    // Waypoint 4: Locked Luxury Suite View
    { pos: [0, 5.5, -44], look: [0, 0.5, -65], fov: 68 },
];

const ROOM_PALETTES = [
    { fog: new THREE.Color('#1a1008'), win: new THREE.Color('#ffd89b'), intensity: 1.5 }, // Deluxe King
    { fog: new THREE.Color('#0c1020'), win: new THREE.Color('#89c4f4'), intensity: 1.7 }, // Executive Suite
    { fog: new THREE.Color('#0a1814'), win: new THREE.Color('#5ae8c8'), intensity: 1.6 }, // Premier Ocean
    { fog: new THREE.Color('#201408'), win: new THREE.Color('#ffc34d'), intensity: 1.9 }, // Presidential
];

// ─────────────────────────────────────────────────────────────
// CAMERA RIG
// ─────────────────────────────────────────────────────────────

function CameraRig({ scrollProgressRef }) {
    const { camera } = useThree();
    const currentLook = useRef(new THREE.Vector3(0, 8, 0));
    const targetPos   = useRef(new THREE.Vector3(0, 10, 42));
    const targetLook  = useRef(new THREE.Vector3(0, 8, 0));
    const initialised = useRef(false);

    useFrame(() => {
        const p = scrollProgressRef.current;
        // Smoothly blend from lobby path → locked room view over p = 0.58 → 0.82
        const BLEND_START = 0.58;
        const BLEND_END   = 0.82;
        let effectiveP;
        if (p <= BLEND_START) {
            effectiveP = p;
        } else if (p < BLEND_END) {
            const blend  = (p - BLEND_START) / (BLEND_END - BLEND_START);
            const smooth = blend * blend * (3 - 2 * blend); // smoothstep
            effectiveP   = p + (1.0 - p) * smooth;
        } else {
            effectiveP = 1.0;
        }
        const raw        = effectiveP * (CAMERA_PATH.length - 1);
        const i   = Math.min(Math.floor(raw), CAMERA_PATH.length - 2);
        const t   = raw - i;

        const e = t * t * (3 - 2 * t);

        const s0 = CAMERA_PATH[i];
        const s1 = CAMERA_PATH[i + 1];

        targetPos.current.set(
            s0.pos[0] + (s1.pos[0] - s0.pos[0]) * e,
            s0.pos[1] + (s1.pos[1] - s0.pos[1]) * e,
            s0.pos[2] + (s1.pos[2] - s0.pos[2]) * e,
        );
        targetLook.current.set(
            s0.look[0] + (s1.look[0] - s0.look[0]) * e,
            s0.look[1] + (s1.look[1] - s0.look[1]) * e,
            s0.look[2] + (s1.look[2] - s0.look[2]) * e,
        );

        // Uniform lerp — smooth throughout lobby and room
        const lerpAlpha = initialised.current ? 0.055 : 1;
        if (!initialised.current) initialised.current = true;

        camera.position.lerp(targetPos.current, lerpAlpha);
        currentLook.current.lerp(targetLook.current, lerpAlpha);
        camera.lookAt(currentLook.current);

        const targetFov = s0.fov + (s1.fov - s0.fov) * e;
        camera.fov += (targetFov - camera.fov) * lerpAlpha;
        camera.updateProjectionMatrix();
    });

    return null;
}

// ─────────────────────────────────────────────────────────────
// SCENE ATMOSPHERE
// ─────────────────────────────────────────────────────────────

function SceneAtmosphere({ scrollProgressRef, selectedRoomRef }) {
    const { scene } = useThree();
    const bgColor  = useRef(new THREE.Color('#080c1a'));
    const fogColor = useRef(new THREE.Color('#080c1a'));
    const ambRef   = useRef();

    useEffect(() => {
        scene.background = bgColor.current.clone();
        scene.fog = new THREE.FogExp2(fogColor.current.clone(), 0.006);
    }, [scene]);

    useFrame(() => {
        const p = scrollProgressRef.current;

        let wantBg, wantFog;
        if (p < 0.25) {
            wantBg  = new THREE.Color('#080c1a');
            wantFog = new THREE.Color('#060914');
        } else if (p < 0.58) {
            const t = Math.min(1, (p - 0.25) / 0.30);
            wantBg  = new THREE.Color().lerpColors(new THREE.Color('#0c1020'), new THREE.Color('#2a1808'), t);
            wantFog = new THREE.Color().lerpColors(new THREE.Color('#08101c'), new THREE.Color('#1e1006'), t);
        } else {
            const palette = ROOM_PALETTES[selectedRoomRef.current] ?? ROOM_PALETTES[0];
            wantBg  = palette.fog.clone();
            wantFog = palette.fog.clone();
        }

        bgColor.current.lerp(wantBg, 0.025);
        fogColor.current.lerp(wantFog, 0.025);

        if (scene.background) scene.background.copy(bgColor.current);
        if (scene.fog) scene.fog.color.copy(fogColor.current);

        // Fog-density bell curve during the lobby → room transition (cinematic dissolve)
        if (scene.fog) {
            const inTransition = p > 0.54 && p < 0.80;
            const targetDensity = inTransition
                ? 0.006 + 0.032 * Math.sin(((p - 0.54) / 0.26) * Math.PI)
                : 0.006;
            scene.fog.density += (targetDensity - scene.fog.density) * 0.04;
        }

        if (ambRef.current) {
            let wantColor, wantIntensity;
            if (p < 0.25) {
                wantColor     = new THREE.Color('#0a1428');
                wantIntensity = 1.2;
            } else if (p < 0.58) {
                wantColor     = new THREE.Color('#2a1e0a');
                wantIntensity = 3.5;
            } else {
                wantColor     = new THREE.Color('#ffffff');
                wantIntensity = 3.5;
            }
            ambRef.current.color.lerp(wantColor, 0.035);
            ambRef.current.intensity += (wantIntensity - ambRef.current.intensity) * 0.035;
        }
    });

    return <ambientLight ref={ambRef} color="#1a1428" intensity={1.5} />;
}

// ─────────────────────────────────────────────────────────────
// HOTEL EXTERIOR
// ─────────────────────────────────────────────────────────────

function TowerWindows({ cols, rows, colSpacing, rowSpacing, startX, startY, startZ, winW, winH, litRatio = 0.76 }) {
    const meshRef = useRef();
    const count   = cols * rows;

    useEffect(() => {
        if (!meshRef.current) return;
        const temp  = new THREE.Object3D();
        const color = new THREE.Color();
        let idx = 0;
        for (let c = 0; c < cols; c++) {
            for (let r = 0; r < rows; r++) {
                temp.position.set(startX + c * colSpacing, startY + r * rowSpacing, startZ);
                temp.scale.set(winW, winH, 1);
                temp.rotation.set(0, 0, 0);
                temp.updateMatrix();
                meshRef.current.setMatrixAt(idx, temp.matrix);
                color.set(Math.random() < litRatio ? '#ffd89b' : '#08121e');
                meshRef.current.setColorAt(idx, color);
                idx++;
            }
        }
        meshRef.current.instanceMatrix.needsUpdate = true;
        if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
    }, [cols, rows, colSpacing, rowSpacing, startX, startY, startZ, winW, winH, litRatio]);

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]}>
            <planeGeometry args={[1, 1]} />
            <meshStandardMaterial emissive="#ffd89b" emissiveIntensity={0.65} vertexColors />
        </instancedMesh>
    );
}

function HotelExterior({ scrollProgressRef }) {
    const groupRef = useRef();
    
    useFrame(() => {
        if (groupRef.current) {
            const p = scrollProgressRef.current;
            if (p > 0.45) {
                const targetY = (p - 0.45) * -120;
                groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
            } else {
                groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.05;
            }
        }
    });

    return (
        <group ref={groupRef}>
            <mesh position={[0, 4, -2]}><boxGeometry args={[54, 8, 14]} /><meshStandardMaterial color="#0c1018" roughness={0.22} metalness={0.72} /></mesh>
            <mesh position={[0, 8.45, 2]}><boxGeometry args={[54, 0.45, 0.3]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.94} emissive="#c9a96e" emissiveIntensity={0.28} /></mesh>
            <mesh position={[0, 7, 8]}><boxGeometry args={[22, 0.35, 9]} /><meshStandardMaterial color="#c9a96e" roughness={0.15} metalness={0.92} emissive="#c9a96e" emissiveIntensity={0.2} /></mesh>
            {[-8.5, 0, 8.5].map((x) => (<mesh key={x} position={[x, 3.5, 11.5]}><boxGeometry args={[0.26, 7, 0.26]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.95} /></mesh>))}
            {[0, 1, 2].map((i) => (<mesh key={i} position={[0, (i + 1) * 0.25, 5.2 + i * 1.4]}><boxGeometry args={[20, 0.22, 2.5]} /><meshStandardMaterial color="#1a1e28" roughness={0.7} metalness={0.15} /></mesh>))}
            {[-15, 15].map((x) => (
                <group key={x} position={[x, 0, 8]}>
                    <mesh position={[0, 0.75, 0]}><boxGeometry args={[2.8, 1.5, 1.6]} /><meshStandardMaterial color="#c9a96e" roughness={0.28} metalness={0.72} /></mesh>
                    <mesh position={[0, 2.5, 0]}><sphereGeometry args={[1.3, 12, 12]} /><meshStandardMaterial color="#1a3010" roughness={0.9} /></mesh>
                </group>
            ))}
            <mesh position={[0, 29, -5]}><boxGeometry args={[24, 42, 10]} /><meshStandardMaterial color="#080c14" roughness={0.1} metalness={0.8} /></mesh>
            <TowerWindows cols={8} rows={12} colSpacing={2.62} rowSpacing={3.28} startX={-9.17} startY={10.5} startZ={0.06} winW={1.55} winH={2.1} litRatio={0.78} />
            {[-12.12, 12.12].map((x, i) => (<mesh key={i} position={[x, 29, 0]}><boxGeometry args={[0.2, 42, 0.2]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.95} emissive="#c9a96e" emissiveIntensity={0.14} /></mesh>))}
            <mesh position={[0, 50.5, -4]}><boxGeometry args={[26, 0.6, 12]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.95} emissive="#c9a96e" emissiveIntensity={0.38} /></mesh>
            <mesh position={[0, 61.5, -4]}><boxGeometry args={[18, 21, 8]} /><meshStandardMaterial color="#060a12" roughness={0.07} metalness={0.84} /></mesh>
            <TowerWindows cols={6} rows={6} colSpacing={2.6} rowSpacing={3.1} startX={-6.5} startY={53} startZ={0.06} winW={1.5} winH={1.95} litRatio={0.65} />
            {[-9.1, 9.1].map((x, i) => (<mesh key={i} position={[x, 61.5, 0]}><boxGeometry args={[0.18, 21, 0.18]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.95} emissive="#c9a96e" emissiveIntensity={0.14} /></mesh>))}
            <mesh position={[0, 72.5, -3]}><boxGeometry args={[20, 0.55, 10]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.95} emissive="#c9a96e" emissiveIntensity={0.38} /></mesh>
            <mesh position={[0, 81, -3]}><boxGeometry args={[12, 16, 6]} /><meshStandardMaterial color="#050810" roughness={0.05} metalness={0.88} /></mesh>
            <TowerWindows cols={4} rows={5} colSpacing={2.4} rowSpacing={2.95} startX={-3.6} startY={74} startZ={0.06} winW={1.4} winH={1.82} litRatio={0.58} />
            {[-6.1, 6.1].map((x, i) => (<mesh key={i} position={[x, 81, 0]}><boxGeometry args={[0.16, 16, 0.16]} /><meshStandardMaterial color="#c9a96e" roughness={0.1} metalness={0.96} emissive="#c9a96e" emissiveIntensity={0.2} /></mesh>))}
            <mesh position={[0, 89.45, -3]}><boxGeometry args={[14, 0.48, 8]} /><meshStandardMaterial color="#c9a96e" roughness={0.1} metalness={0.96} emissive="#c9a96e" emissiveIntensity={0.4} /></mesh>
            <mesh position={[0, 94.5, -3]}><boxGeometry args={[6, 9, 4]} /><meshStandardMaterial color="#040608" roughness={0.04} metalness={0.92} /></mesh>
            <mesh position={[0, 101, -3]}><boxGeometry args={[1.4, 13, 1.4]} /><meshStandardMaterial color="#c9a96e" roughness={0.04} metalness={0.98} emissive="#c9a96e" emissiveIntensity={0.55} /></mesh>
            <mesh position={[0, 57.5, 0.18]}><boxGeometry args={[5, 1.1, 0.08]} /><meshStandardMaterial color="#c9a96e" emissive="#c9a96e" emissiveIntensity={2.5} /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}><planeGeometry args={[400, 400]} /><meshStandardMaterial color="#060a12" roughness={0.9} /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 16]}><planeGeometry args={[70, 28]} /><meshStandardMaterial color="#0e1220" roughness={0.55} metalness={0.24} /></mesh>
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, 28]}><ringGeometry args={[4.5, 9.5, 36]} /><meshStandardMaterial color="#151c28" roughness={0.5} metalness={0.28} /></mesh>
            {[-24, -12, 12, 24].map((x, i) => (
                <group key={i} position={[x, 0, 28]}>
                    <mesh position={[0, 3.2, 0]}><cylinderGeometry args={[0.06, 0.1, 6.4, 6]} /><meshStandardMaterial color="#3a3c48" /></mesh>
                    <pointLight position={[0, 6.6, 0]} color="#ffe8cc" intensity={1.5} distance={26} />
                </group>
            ))}
            {[
                [-80, 14, -120], [-62, 22, -110], [-44, 30, -96], [-28, 18, -102],
                [28, 20, -102], [44, 34, -96], [62, 18, -108], [80, 12, -118],
                [-14, 10, -88], [14, 15, -88], [-100, 8, -130], [100, 10, -130],
            ].map(([x, h, z], i) => (
                <mesh key={i} position={[x, h / 2, z]}>
                    <boxGeometry args={[12, h, 10]} />
                    <meshStandardMaterial color="#090d16" emissive="#1a2535" emissiveIntensity={0.12} />
                </mesh>
            ))}
            <hemisphereLight args={['#0d1830', '#302010', 0.35]} />

            {/* ── Front entrance door ── */}
            {/* Gold frame surround */}
            <mesh position={[0, 3.8, 5.06]}>
                <boxGeometry args={[8.2, 7.6, 0.08]} />
                <meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.92} emissive="#c9a96e" emissiveIntensity={0.4} />
            </mesh>
            {/* Dark glass door panels */}
            <mesh position={[0, 3.8, 5.02]}>
                <boxGeometry args={[7.4, 6.8, 0.06]} />
                <meshStandardMaterial color="#08101e" roughness={0.04} metalness={0.6} transparent opacity={0.88} />
            </mesh>
            {/* Warm lobby glow bleeding through the glass */}
            <pointLight position={[0, 3.5, 3.5]} color="#ffe8cc" intensity={35} distance={16} />

            {/* ── Canopy & facade lighting ── */}
            {/* Canopy underside emissive strip */}
            <mesh position={[0, 6.5, 8]}>
                <boxGeometry args={[21, 0.1, 8.6]} />
                <meshStandardMaterial color="#ffe8cc" emissive="#ffe8cc" emissiveIntensity={1.4} />
            </mesh>
            {/* Canopy overhead point lights */}
            {[-8, 0, 8].map((x, i) => (
                <pointLight key={`cu${i}`} position={[x, 6.5, 8]} color="#ffe8cc" intensity={18} distance={16} />
            ))}
            {/* Ground-level facade uplights */}
            {[-16, -8, 0, 8, 16].map((x, i) => (
                <pointLight key={`up${i}`} position={[x, 0.8, 6]} color="#ffe8d0" intensity={12} distance={22} />
            ))}
            {/* Flanking facade floodlights */}
            <pointLight position={[-22, 10, 14]} color="#fff5e0" intensity={24} distance={38} />
            <pointLight position={[22, 10, 14]} color="#fff5e0" intensity={24} distance={38} />
        </group>
    );
}

// ─────────────────────────────────────────────────────────────
// GRAND LOBBY
// ─────────────────────────────────────────────────────────────

function GrandLobby({ scrollProgressRef }) {
    const groupRef = useRef();
    const Z = -25;
    const W = 40;
    const D = 30;
    const H = 14;

    useFrame(() => {
        if (groupRef.current) {
            const p = scrollProgressRef.current;
            if (p > 0.55) {
                const targetY = (p - 0.55) * -100;
                groupRef.current.position.y += (targetY - groupRef.current.position.y) * 0.05;
            } else {
                groupRef.current.position.y += (0 - groupRef.current.position.y) * 0.05;
            }
        }
    });

    return (
        <group ref={groupRef}>
            {/* Floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, Z]}>
                <planeGeometry args={[W, D + 8]} />
                <meshStandardMaterial color="#e8dcc8" roughness={0.08} metalness={0.45} />
            </mesh>
            {/* Ceiling */}
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, H, Z]}>
                <planeGeometry args={[W, D + 8]} />
                <meshStandardMaterial color="#f0eae0" roughness={0.85} />
            </mesh>
            {/* Left wall */}
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2, H / 2, Z]}>
                <planeGeometry args={[D + 8, H]} />
                <meshStandardMaterial color="#f8f8f6" roughness={0.9} />
            </mesh>
            {/* Right wall */}
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2, H / 2, Z]}>
                <planeGeometry args={[D + 8, H]} />
                <meshStandardMaterial color="#f8f8f6" roughness={0.9} />
            </mesh>

            {/*
             * BACK WALL — solid single plane, no doorway cutout.
             *
             * Previously this was 3 pieces leaving a gap in the centre
             * which revealed the LuxurySuite's dark entrance wall panels
             * sitting at the exact same Z (-41). That created the dark
             * picture-frame shape visible behind the reception desk.
             *
             * The transition to the suite is handled by the lobby sliding
             * downward (useFrame above), so there is no need for a
             * physical hole for the camera to fly through.
             */}
            <mesh position={[0, H / 2, Z - D / 2 - 1]}>
                <planeGeometry args={[W, H]} />
                <meshStandardMaterial color="#f5f5f3" roughness={0.88} />
            </mesh>

            {/* Columns */}
            {[0, 1, 2, 3].map((k) => {
                const z = Z - 4 + k * -6.5;
                return (
                    <group key={k}>
                        <mesh position={[-13, H / 2, z]}><cylinderGeometry args={[0.58, 0.68, H, 20]} /><meshStandardMaterial color="#d4c4a8" roughness={0.28} metalness={0.12} /></mesh>
                        <mesh position={[13, H / 2, z]}><cylinderGeometry args={[0.58, 0.68, H, 20]} /><meshStandardMaterial color="#d4c4a8" roughness={0.28} metalness={0.12} /></mesh>
                    </group>
                );
            })}

            {/* Reception desk */}
            <mesh position={[0, 1.3, Z - 9]}><boxGeometry args={[10, 2.6, 3]} /><meshStandardMaterial color="#3a2510" roughness={0.28} metalness={0.2} /></mesh>
            <mesh position={[0, 2.65, Z - 9]}><boxGeometry args={[10.2, 0.12, 3.2]} /><meshStandardMaterial color="#e8dcc8" roughness={0.08} metalness={0.4} /></mesh>

            {/* Chandelier lights — front row */}
            {[-14, 0, 14].map((x, i) => (
                <group key={i} position={[x, H - 0.8, Z - 3]}>
                    <mesh><sphereGeometry args={[0.35, 16, 16]} /><meshStandardMaterial color="#ffd89b" emissive="#ffd89b" emissiveIntensity={2.5} /></mesh>
                    <pointLight color="#ffd89b" intensity={16} distance={30} />
                </group>
            ))}
            {/* Chandelier lights — back row */}
            {[-14, 0, 14].map((x, i) => (
                <group key={`b${i}`} position={[x, H - 0.8, Z - 14]}>
                    <mesh><sphereGeometry args={[0.3, 12, 12]} /><meshStandardMaterial color="#ffd89b" emissive="#ffd89b" emissiveIntensity={2} /></mesh>
                    <pointLight color="#ffd89b" intensity={11} distance={26} />
                </group>
            ))}

            {/* Fill lights */}
            <pointLight position={[-12, 3, Z - 4]} color="#ffe8cc" intensity={14} distance={26} />
            <pointLight position={[12, 3, Z - 4]} color="#ffe8cc" intensity={14} distance={26} />
            <pointLight position={[0, 3, Z - 14]} color="#ffe8cc" intensity={12} distance={24} />

            {/* Red carpet runner */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, Z]}>
                <planeGeometry args={[5.5, D + 5]} />
                <meshStandardMaterial color="#6a1a1a" roughness={0.95} />
            </mesh>

            {/* Entry planters */}
            {[-17, 17].map((x, i) => (
                <group key={i} position={[x, 0, Z + 5]}>
                    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[0.6, 0.5, 1, 12]} /><meshStandardMaterial color="#c9a96e" roughness={0.3} metalness={0.6} /></mesh>
                    <mesh position={[0, 2, 0]}><sphereGeometry args={[1, 10, 10]} /><meshStandardMaterial color="#1a3010" roughness={0.9} /></mesh>
                </group>
            ))}

            {/* ── Lobby chairs — left side ── */}
            {[Z - 6, Z - 14].map((z, i) => (
                <group key={`cl${i}`} position={[-W / 2 + 2.4, 0, z]}>
                    <mesh position={[0, 0.9, 0]}><boxGeometry args={[2.2, 0.4, 2.2]} /><meshStandardMaterial color="#bfab90" roughness={0.7} /></mesh>
                    <mesh position={[-0.88, 1.8, 0]}><boxGeometry args={[0.22, 1.9, 2.2]} /><meshStandardMaterial color="#bfab90" roughness={0.7} /></mesh>
                    <mesh position={[0, 1.22, -0.9]}><boxGeometry args={[1.8, 0.14, 0.14]} /><meshStandardMaterial color="#c9a96e" metalness={0.8} roughness={0.14} /></mesh>
                    <mesh position={[0, 1.22, 0.9]}><boxGeometry args={[1.8, 0.14, 0.14]} /><meshStandardMaterial color="#c9a96e" metalness={0.8} roughness={0.14} /></mesh>
                    {[[0.8, 0.8], [0.8, -0.8], [-0.8, 0.8], [-0.8, -0.8]].map(([lx, lz], li) => (
                        <mesh key={li} position={[lx, 0.44, lz]}><boxGeometry args={[0.1, 0.88, 0.1]} /><meshStandardMaterial color="#c9a96e" metalness={0.85} roughness={0.12} /></mesh>
                    ))}
                </group>
            ))}
            {/* Side table — left */}
            <mesh position={[-W / 2 + 2.4, 0.84, Z - 10]}><boxGeometry args={[1.4, 1.68, 1.4]} /><meshStandardMaterial color="#2c1e10" roughness={0.4} /></mesh>
            <mesh position={[-W / 2 + 2.4, 1.69, Z - 10]}><boxGeometry args={[1.55, 0.08, 1.55]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} /></mesh>

            {/* ── Lobby chairs — right side ── */}
            {[Z - 6, Z - 14].map((z, i) => (
                <group key={`cr${i}`} position={[W / 2 - 2.4, 0, z]}>
                    <mesh position={[0, 0.9, 0]}><boxGeometry args={[2.2, 0.4, 2.2]} /><meshStandardMaterial color="#bfab90" roughness={0.7} /></mesh>
                    <mesh position={[0.88, 1.8, 0]}><boxGeometry args={[0.22, 1.9, 2.2]} /><meshStandardMaterial color="#bfab90" roughness={0.7} /></mesh>
                    <mesh position={[0, 1.22, -0.9]}><boxGeometry args={[1.8, 0.14, 0.14]} /><meshStandardMaterial color="#c9a96e" metalness={0.8} roughness={0.14} /></mesh>
                    <mesh position={[0, 1.22, 0.9]}><boxGeometry args={[1.8, 0.14, 0.14]} /><meshStandardMaterial color="#c9a96e" metalness={0.8} roughness={0.14} /></mesh>
                    {[[0.8, 0.8], [0.8, -0.8], [-0.8, 0.8], [-0.8, -0.8]].map(([lx, lz], li) => (
                        <mesh key={li} position={[lx, 0.44, lz]}><boxGeometry args={[0.1, 0.88, 0.1]} /><meshStandardMaterial color="#c9a96e" metalness={0.85} roughness={0.12} /></mesh>
                    ))}
                </group>
            ))}
            {/* Side table — right */}
            <mesh position={[W / 2 - 2.4, 0.84, Z - 10]}><boxGeometry args={[1.4, 1.68, 1.4]} /><meshStandardMaterial color="#2c1e10" roughness={0.4} /></mesh>
            <mesh position={[W / 2 - 2.4, 1.69, Z - 10]}><boxGeometry args={[1.55, 0.08, 1.55]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} /></mesh>

            {/* ── Wall paintings — left ── */}
            {[Z - 7, Z - 12].map((z, i) => (
                <group key={`pl${i}`}>
                    <mesh position={[-W / 2 + 0.09, 6.5, z]}>
                        <boxGeometry args={[0.16, 4.2, 6.2]} />
                        <meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.1} />
                    </mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-W / 2 + 0.17, 6.5, z]}>
                        <planeGeometry args={[5.4, 3.6]} />
                        <meshStandardMaterial color={i === 0 ? "#0e1828" : "#1e0e08"} roughness={0.92} emissive={i === 0 ? "#1a3060" : "#601a10"} emissiveIntensity={0.28} />
                    </mesh>
                    <pointLight position={[-W / 2 + 1.4, 9.2, z]} color="#ffe8cc" intensity={5} distance={7} />
                </group>
            ))}

            {/* ── Wall paintings — right ── */}
            {[Z - 7, Z - 12].map((z, i) => (
                <group key={`pr${i}`}>
                    <mesh position={[W / 2 - 0.09, 6.5, z]}>
                        <boxGeometry args={[0.16, 4.2, 6.2]} />
                        <meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.1} />
                    </mesh>
                    <mesh rotation={[0, -Math.PI / 2, 0]} position={[W / 2 - 0.17, 6.5, z]}>
                        <planeGeometry args={[5.4, 3.6]} />
                        <meshStandardMaterial color={i === 0 ? "#0e1828" : "#1e0e08"} roughness={0.92} emissive={i === 0 ? "#1a3060" : "#601a10"} emissiveIntensity={0.28} />
                    </mesh>
                    <pointLight position={[W / 2 - 1.4, 9.2, z]} color="#ffe8cc" intensity={5} distance={7} />
                </group>
            ))}

            {/* ── asuraTECH Solutions — hotel logo on back wall ── */}
            {/* Depth/shadow layer for 3-D effect */}
            <Text position={[0, 10.6, Z - D / 2 - 0.88]} fontSize={0.9} color="#7a5a28" anchorX="center" anchorY="middle" letterSpacing={0.12}>
                ASURATECH
            </Text>
            <Text position={[0, 9.35, Z - D / 2 - 0.88]} fontSize={0.44} color="#7a5a28" anchorX="center" anchorY="middle" letterSpacing={0.18}>
                SOLUTIONS
            </Text>
            {/* Gold front layer */}
            <Text position={[0, 10.6, Z - D / 2 - 0.7]} fontSize={0.9} color="#c9a96e" anchorX="center" anchorY="middle" letterSpacing={0.12}>
                ASURATECH
            </Text>
            <Text position={[0, 9.35, Z - D / 2 - 0.7]} fontSize={0.44} color="#c9a96e" anchorX="center" anchorY="middle" letterSpacing={0.18}>
                SOLUTIONS
            </Text>
            {/* Thin gold separator line between the two words */}
            <mesh position={[0, 9.85, Z - D / 2 - 0.69]}>
                <boxGeometry args={[6, 0.055, 0.04]} />
                <meshStandardMaterial color="#c9a96e" metalness={0.9} roughness={0.12} emissive="#c9a96e" emissiveIntensity={0.5} />
            </mesh>
            {/* Soft gold glow over the logo */}
            <pointLight position={[0, 10.4, Z - D / 2 + 0.5]} color="#c9a96e" intensity={5} distance={10} />
        </group>
    );
}

// ─────────────────────────────────────────────────────────────
// LUXURY SUITE — CAROUSEL SLIDING APPROACH
// ─────────────────────────────────────────────────────────────

function LuxurySuite({ selectedRoomRef }) {
    /*
     * Z moved from -56 → -62.
     *
     * At Z=-56 the suite's front face sat at Z+15 = -41, which is
     * exactly the same plane as the lobby's back wall (-41). This
     * caused z-fighting AND the suite's dark entrance wall panels to
     * bleed through at the lobby stage.
     *
     * At Z=-62 the front face is at Z+15 = -47, giving 6 clear units
     * of separation behind the lobby wall. The camera final waypoint
     * (z=-48) lands 1 unit past the front face — correctly inside the
     * suite — and the look target (z=-68) sits 9 units from the back
     * window (z=-77), giving a proper interior view.
     *
     * The 3 "Front Entrance Wall" meshes that used to sit at Z+15
     * have been removed. They were the source of the dark door-frame
     * shape visible through the lobby. The transition is a downward
     * slide, not a physical doorway, so they were never needed.
     */
    const Z = -62;

    const windowMatRef = useRef();
    const winLightRef  = useRef();
    const roomGroupRef = useRef();

    useFrame((state, delta) => {
        const active = selectedRoomRef.current;
        const palette = ROOM_PALETTES[active] ?? ROOM_PALETTES[0];

        if (windowMatRef.current) {
            windowMatRef.current.emissive.lerp(palette.win, 0.06);
            windowMatRef.current.emissiveIntensity += (palette.intensity - windowMatRef.current.emissiveIntensity) * 0.06;
        }
        if (winLightRef.current) {
            winLightRef.current.color.lerp(palette.win, 0.06);
        }

        // Smooth theatrical carousel slide between rooms
        const targetX = -active * 40;
        if (roomGroupRef.current) {
            roomGroupRef.current.position.x = THREE.MathUtils.lerp(
                roomGroupRef.current.position.x,
                targetX,
                6 * delta
            );
        }
    });

    return (
        <group>
            {/* ── Static structural shell ── */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, Z]}>
                <planeGeometry args={[24, 30]} />
                <meshStandardMaterial color="#1e1610" roughness={0.65} metalness={0.04} />
            </mesh>
            <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 12, Z]}>
                <planeGeometry args={[24, 30]} />
                <meshStandardMaterial color="#151218" roughness={0.92} />
            </mesh>
            <mesh rotation={[0, Math.PI / 2, 0]} position={[-12, 6, Z]}>
                <planeGeometry args={[30, 12]} />
                <meshStandardMaterial color="#2a2228" roughness={0.78} />
            </mesh>
            <mesh rotation={[0, -Math.PI / 2, 0]} position={[12, 6, Z]}>
                <planeGeometry args={[30, 12]} />
                <meshStandardMaterial color="#2a2228" roughness={0.78} />
            </mesh>

            {/* Back window wall */}
            <mesh position={[0, 6, Z - 15]}>
                <planeGeometry args={[24, 12]} />
                <meshStandardMaterial
                    ref={windowMatRef}
                    color="#0a1020"
                    emissive="#ffd89b"
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.96}
                />
            </mesh>
            <mesh position={[0, 6, Z - 14.8]}>
                <boxGeometry args={[24.5, 12.4, 0.18]} />
                <meshStandardMaterial color="#c9a96e" roughness={0.25} metalness={0.82} />
            </mesh>

            {/* Ambient room lighting */}
            <pointLight ref={winLightRef} color="#ffd89b" intensity={12} distance={44} position={[0, 6, Z - 11]} />
            <pointLight position={[0, 10, Z + 7]} color="#ffe8d0" intensity={8} distance={30} />
            <pointLight position={[0, 10, Z - 3]} color="#ffe8d0" intensity={8} distance={30} />

            {/* ── Dynamic furniture carousel ── */}
            <group ref={roomGroupRef}>

                {/* Room 0: Deluxe King ── Luxury Uniformed Warm Amber & Deep Cognac */}
                <group position={[0, 0, 0]}>

                {/* ── UNIFORM ROOM ARCHITECTURE ── */}
                {/* Floor — Deep polished walnut hardwood floor */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, Z]}>
                    <planeGeometry args={[24, 30]} />
                    <meshStandardMaterial color="#2d1d13" roughness={0.65} metalness={0.1} />
                </mesh>

                {/* Left wall — Clean architectural soft gallery white */}
                <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.9, 6, Z]}>
                    <planeGeometry args={[30, 12]} />
                    <meshStandardMaterial color="#f4f3ef" roughness={0.9} />
                </mesh>

                {/* Right wall (Added for enclosure) — Matching architectural gallery white */}
                <mesh rotation={[0, -Math.PI / 2, 0]} position={[11.9, 6, Z]}>
                    <planeGeometry args={[30, 12]} />
                    <meshStandardMaterial color="#f4f3ef" roughness={0.9} />
                </mesh>

                {/* Ceiling — Clean architectural matte white ceiling */}
                <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 11.98, Z]}>
                    <planeGeometry args={[24, 30]} />
                    <meshStandardMaterial color="#2d1d13" roughness={0.95} />
                </mesh>

                {/* Main Accent Feature Wall — Deep rich cognac leather/wood paneling */}
                <mesh position={[0, 6, Z - 6.3]}>
                    <boxGeometry args={[24, 12, 0.08]} />
                    <meshStandardMaterial color="#2d1d13" roughness={0.65} metalness={0.1} />
                </mesh>

                {/* Headboard inset accent panel — Tailored textured warm taupe */}
                <mesh position={[0, 4.5, Z - 6.24]}>
                    <boxGeometry args={[8.6, 8.8, 0.06]} />
                    <meshStandardMaterial color="#51443b" roughness={0.85} />
                </mesh>


                {/* ── ARCHITECTURAL CEILING COVE LIGHTING ── */}
                {/* Premium hidden LED slots giving a soft ambient glow off the white ceiling */}
                <mesh position={[0, 11.82, Z + 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial color="#c9a96e" emissive="#ffd89b" emissiveIntensity={1.2} /></mesh>
                <mesh position={[0, 11.82, Z - 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial color="#c9a96e" emissive="#ffd89b" emissiveIntensity={1.2} /></mesh>
                <mesh position={[-11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#c9a96e" emissive="#ffd89b" emissiveIntensity={1.2} /></mesh>
                <mesh position={[11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#c9a96e" emissive="#ffd89b" emissiveIntensity={1.2} /></mesh>
                
                <pointLight position={[-6, 11.2, Z - 4]} color="#ffd1a9" intensity={6} distance={25} />
                <pointLight position={[6, 11.2, Z - 4]} color="#ffd1a9" intensity={6} distance={25} />


                {/* ── PLUSH TEXTILES & AREA RUG ── */}
                {/* Area rug — Luxury custom burnt cognac textile under the bed */}
                <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, Z - 2]}>
                    <planeGeometry args={[15, 12]} />
                    <meshStandardMaterial color="#666159" roughness={0.95} />
                </mesh>


                {/* ── MASTER BED COMPLEX ── */}
                {/* Bed Base Frame — Matte dark chocolate timber */}
                <mesh position={[0, 0.4, Z - 3]}><boxGeometry args={[7.1, 0.8, 5.6]} /><meshStandardMaterial color="#1a110a" roughness={0.7} /></mesh>
                {/* Main Mattress — Tailored crisp white sheets */}
                <mesh position={[0, 1.0, Z - 3]}><boxGeometry args={[6.7, 0.4, 5.2]} /><meshStandardMaterial color="#ffffff" roughness={0.95} /></mesh>
                {/* Duvet folded cover — Rich textured golden honey amber */}
                <mesh position={[0, 1.22, Z - 2.0]}><boxGeometry args={[6.72, 0.18, 3.1]} /><meshStandardMaterial color="#b57c32" roughness={0.8} /></mesh>
                {/* Bed runner accent fabric — Dark roasted espresso accent */}
                <mesh position={[0, 1.23, Z - 0.4]}><boxGeometry args={[6.74, 0.18, 1.2]} /><meshStandardMaterial color="#26170d" roughness={0.85} /></mesh>
                {/* Pillows — Clean stacked cream luxury linens */}
                {[-1.3, 1.3].map(x => (
                    <mesh key={x} position={[x, 1.35, Z - 5.1]}><boxGeometry args={[2.2, 0.35, 1.4]} /><meshStandardMaterial color="#fcfaf2" roughness={0.9} /></mesh>
                ))}


                {/* ── HEADBOARD & GOLD FRAME ACCENTS ── */}
                {/* Main Headboard Backing */}
                <mesh position={[0, 3.2, Z - 5.95]}><boxGeometry args={[7.4, 5.8, 0.3]} /><meshStandardMaterial color="#21150e" roughness={0.5} /></mesh>
                {/* Luxury Polished Gold Metal Bezel Border Frame */}
                <mesh position={[0, 3.2, Z - 5.87]}><boxGeometry args={[7.9, 6.3, 0.06]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} emissive="#b5891a" emissiveIntensity={0.05} /></mesh>


                {/* ── NIGHTSTAND SUITE ELEMENT ── */}
                {/* Side Tables */}
                <mesh position={[-4.5, 0.8, Z - 3]}><boxGeometry args={[1.5, 1.6, 1.5]} /><meshStandardMaterial color="#1f140e" roughness={0.6} /></mesh>
                <mesh position={[4.5, 0.8, Z - 3]}><boxGeometry args={[1.5, 1.6, 1.5]} /><meshStandardMaterial color="#1f140e" roughness={0.6} /></mesh>
                {/* Polished Inlaid Gold Metal Tabletops */}
                <mesh position={[-4.5, 1.61, Z - 3]}><boxGeometry args={[1.54, 0.04, 1.54]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} /></mesh>
                <mesh position={[4.5, 1.61, Z - 3]}><boxGeometry args={[1.54, 0.04, 1.54]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} /></mesh>
                {/* Frosted Crystal Lamp Globes */}
                <mesh position={[-4.5, 2.1, Z - 3]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial emissive="#ffeaad" emissiveIntensity={3.5} color="#ffffff" roughness={0.1} /></mesh>
                <pointLight position={[-4.5, 2.4, Z - 3]} color="#ffd89b" intensity={8} distance={15} />
                <mesh position={[4.5, 2.1, Z - 3]}><sphereGeometry args={[0.2, 16, 16]} /><meshStandardMaterial emissive="#ffeaad" emissiveIntensity={3.5} color="#ffffff" roughness={0.1} /></mesh>
                <pointLight position={[4.5, 2.4, Z - 3]} color="#ffd89b" intensity={8} distance={15} />


                {/* ── MEDIA & CREDENZA SYSTEM (Right Wall) ── */}
                {/* Walnut Veneer Media Credenza */}
                <mesh position={[10.4, 0.9, Z - 1]}><boxGeometry args={[1.8, 1.8, 9]} /><meshStandardMaterial color="#1f140e" roughness={0.5} /></mesh>
                {/* Gold Inlay Trim Line */}
                <mesh position={[10.4, 1.81, Z - 1]}><boxGeometry args={[1.84, 0.04, 9.04]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.85} /></mesh>
                {/* Premium Anodized Black Screen Frame */}
                <mesh position={[11.88, 4.8, Z - 1]}><boxGeometry args={[0.12, 5.3, 9.2]} /><meshStandardMaterial color="#111111" roughness={0.4} metalness={0.8} /></mesh>
                {/* OLED Deep Black Screen Texture */}
                <mesh position={[11.83, 4.8, Z - 1]}><boxGeometry args={[0.08, 4.9, 8.8]} /><meshStandardMaterial color="#05070a" roughness={0.1} metalness={0.6} emissive="#0d1f3d" emissiveIntensity={1.2} /></mesh>
                {/* Screen Ambient Backlight Throw */}
                <pointLight position={[10.5, 4.8, Z - 1]} color="#9bc0ff" intensity={4} distance={15} />


                {/* ── LUXURY WALL ART ATELIER (Left Wall) ── */}
                {/* Polished Floating Gold frame */}
                <mesh position={[-11.88, 5.8, Z - 2]}><boxGeometry args={[0.12, 4.6, 7.0]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} /></mesh>
                {/* Abstract Painting Canvas — Warm Amber Textures */}
                <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.83, 5.8, Z - 2]}>
                    <planeGeometry args={[6.6, 4.2]} />
                    <meshStandardMaterial color="#3d1e10" roughness={0.95} emissive="#542307" emissiveIntensity={0.4} />
                </mesh>
                {/* Dedicated Art Display directional spotlight */}
                <pointLight position={[-9.5, 9.0, Z - 2]} color="#ffeed0" intensity={6} distance={12} />


                {/* ── READING LOUNGE & LAMPS (Left Front Foreground) ── */}
                {/* Premium Soft Saddle Leather Lounge Armchair */}
                <mesh position={[-7, 0.6, Z + 5]}><boxGeometry args={[2.8, 1.2, 2.8]} /><meshStandardMaterial color="#4a2c16" roughness={0.7} /></mesh>
                <mesh position={[-7, 2.2, Z + 4.3]}><boxGeometry args={[2.8, 2.2, 0.4]} /><meshStandardMaterial color="#4a2c16" roughness={0.7} /></mesh>
                {/* Leather Ottoman */}
                <mesh position={[-5, 0.55, Z + 5]}><boxGeometry args={[1.6, 1.1, 1.6]} /><meshStandardMaterial color="#3d2412" roughness={0.75} /></mesh>
                {/* Floor lamp Slim Metal Column stem */}
                <mesh position={[-9.2, 4.0, Z + 4]}><boxGeometry args={[0.08, 8.0, 0.08]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} /></mesh>
                {/* Floor lamp shade — Tailored pleated Ivory Silk shade */}
                <mesh position={[-9.2, 8.2, Z + 4]}><cylinderGeometry args={[0.7, 0.45, 0.9, 12]} /><meshStandardMaterial color="#fffaf0" roughness={0.8} emissive="#ffd19b" emissiveIntensity={0.6} /></mesh>
                <pointLight position={[-9.2, 7.6, Z + 4]} color="#ffd19b" intensity={9} distance={15} />
                {/* Side accent table */}
                <mesh position={[-5.5, 0.55, Z + 6.5]}><cylinderGeometry args={[0.5, 0.4, 1.1, 12]} /><meshStandardMaterial color="#1a110a" roughness={0.6} /></mesh>
                <mesh position={[-5.5, 1.11, Z + 6.5]}><cylinderGeometry args={[0.54, 0.54, 0.04, 12]} /><meshStandardMaterial color="#d4af37" roughness={0.1} metalness={0.9} /></mesh>

                </group>

                {/* Room 1: Executive Suite ── Luxury Uniformed Midnight Burgundy & Steel */}
                <group position={[40, 0, 0]}>

                    {/* ── UNIFORM ROOM ARCHITECTURE ── */}
                    {/* Floor — Deep graphite tint hardwood */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, Z]}>
                        <planeGeometry args={[24, 30]} />
                        <meshStandardMaterial color="#1f222b" roughness={0.3} metalness={0.1} />
                    </mesh>

                    {/* Left wall — Clean architectural soft matte finish */}
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#4a0e17" roughness={0.95} metalness={0.0} />
                    </mesh>

                    {/* Right wall — Clean matching architectural white exactly */}
                    <mesh rotation={[0, -Math.PI / 2, 0]} position={[11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#4a0e17" roughness={0.95} metalness={0.0} />
                    </mesh>

                    {/* Ceiling — Flat architectural white ceiling layout plane */}
                    <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 11.98, Z]}>
                        <planeGeometry args={[24, 30]} />
                        <meshStandardMaterial color="#f7f6f2" roughness={0.95} metalness={0.0} />
                    </mesh>

                    {/* Main Accent Feature Wall Background — Rich Royal Velvet Burgundy */}
                    <mesh position={[0, 6, Z - 8.5]}>
                        <boxGeometry args={[24, 12, 0.08]} />
                        <meshStandardMaterial color="#4a0e17" roughness={0.7} metalness={0.05} />
                    </mesh>

                    {/* Headboard Inset Accent Panel — Deep Midnight Burgundy Leather look */}
                    <mesh position={[0, 4.5, Z - 8.44]}>
                        <boxGeometry args={[9.5, 9.0, 0.06]} />
                        <meshStandardMaterial color="#2b050a" roughness={0.6} />
                    </mesh>

                    {/* ── ARCHITECTURAL CORNICE COVE LIGHTING ── */}
                    <mesh position={[0, 11.82, Z + 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial encodeStaticParams color="#7090c0" emissive="#89c4f4" emissiveIntensity={0.5} /></mesh>
                    <mesh position={[0, 11.82, Z - 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial color="#7090c0" emissive="#89c4f4" emissiveIntensity={0.5} /></mesh>
                    <mesh position={[-11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#7090c0" emissive="#89c4f4" emissiveIntensity={0.5} /></mesh>
                    <mesh position={[11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#7090c0" emissive="#89c4f4" emissiveIntensity={0.5} /></mesh>
                    
                    <pointLight position={[-6, 11.0, Z - 5]} color="#d0e8ff" intensity={3} distance={22} />
                    <pointLight position={[6, 11.0, Z - 5]} color="#d0e8ff" intensity={3} distance={22} />

                    {/* ── HIGH-END LUXURY CHANDELIER (Ceiling Mounted Central Unit) ── */}
                    <group position={[0, 10, Z]}>
                        {/* Chandelier Mount Stem */}
                        <mesh position={[0, 1.0, 0]}><cylinderGeometry args={[0.08, 0.08, 2, 8]} /><meshStandardMaterial color="#8090b0" metalness={0.9} roughness={0.1} /></mesh>
                        {/* Tiered Steel Rings */}
                        <mesh position={[0, 0, 0]}><cylinderGeometry args={[1.6, 1.6, 0.15, 24, 1, true]} /><meshStandardMaterial color="#8090b0" metalness={0.95} roughness={0.1} /></mesh>
                        <mesh position={[0, -0.4, 0]}><cylinderGeometry args={[1.0, 1.0, 0.15, 24, 1, true]} /><meshStandardMaterial color="#8090b0" metalness={0.95} roughness={0.1} /></mesh>
                        {/* Inner Glowing Crystal Core */}
                        <mesh position={[0, -0.2, 0]}><sphereGeometry args={[0.4, 16, 16]} /><meshStandardMaterial emissive="#89c4f4" emissiveIntensity={4} color="#ffffff" /></mesh>
                        <pointLight position={[0, -0.3, 0]} color="#d0e8ff" intensity={12} distance={25} />
                    </group>

                    {/* ── COHESIVE BED AREA ACCESSORIES ── */}
                    {/* Sleeping area rug — Charcoal plush variant */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, Z - 4]}>
                        <planeGeometry args={[14, 13]} />
                        <meshStandardMaterial color="#1a1c24" roughness={0.95} />
                    </mesh>

                    {/* Bed Complex */}
                    <mesh position={[0, 0.4, Z - 5]}><boxGeometry args={[7.5, 0.8, 6]} /><meshStandardMaterial color="#12151f" roughness={0.6} /></mesh>
                    <mesh position={[0, 1.0, Z - 5]}><boxGeometry args={[7.2, 0.4, 5.6]} /><meshStandardMaterial color="#ffffff" roughness={0.9} /></mesh>
                    {/* Quilt Fold — Rich Deep Wine Burgundy Accent */}
                    <mesh position={[0, 1.22, Z - 3.8]}><boxGeometry args={[7.22, 0.18, 3.2]} /><meshStandardMaterial color="#5c0914" roughness={0.85} /></mesh>
                    {/* Decorative Runner — Steel Slate Strip */}
                    <mesh position={[0, 1.23, Z - 1.6]}><boxGeometry args={[7.24, 0.18, 1.2]} /><meshStandardMaterial color="#475266" roughness={0.7} /></mesh>
                    {/* Linens */}
                    {[-1.3, 1.3].map(x => (
                        <mesh key={x} position={[x, 1.35, Z - 7.8]}><boxGeometry args={[2.2, 0.32, 1.3]} /><meshStandardMaterial color="#f5f7ff" roughness={0.9} /></mesh>
                    ))}

                    {/* Headboard Component with Steel framing */}
                    <mesh position={[0, 3.2, Z - 8.35]}><boxGeometry args={[8, 5.8, 0.3]} /><meshStandardMaterial color="#1c0509" roughness={0.65} /></mesh>
                    <mesh position={[0, 3.2, Z - 8.27]}><boxGeometry args={[8.5, 6.3, 0.06]} /><meshStandardMaterial color="#8090b0" roughness={0.15} metalness={0.9} /></mesh>

                    {/* Nightstands Suite */}
                    <mesh position={[-5, 0.7, Z - 5]}><boxGeometry args={[1.5, 1.4, 1.5]} /><meshStandardMaterial color="#141824" roughness={0.6} /></mesh>
                    <mesh position={[5, 0.7, Z - 5]}><boxGeometry args={[1.5, 1.4, 1.5]} /><meshStandardMaterial color="#141824" roughness={0.6} /></mesh>
                    <mesh position={[-5, 1.41, Z - 5]}><boxGeometry args={[1.54, 0.04, 1.54]} /><meshStandardMaterial color="#8090b0" roughness={0.1} metalness={0.9} /></mesh>
                    <mesh position={[5, 1.41, Z - 5]}><boxGeometry args={[1.54, 0.04, 1.54]} /><meshStandardMaterial color="#8090b0" roughness={0.1} metalness={0.9} /></mesh>
                    {/* Frosted lamps */}
                    <mesh position={[-5, 1.9, Z - 5]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial emissive="#a3d3ff" emissiveIntensity={3.5} color="#ffffff" /></mesh>
                    <pointLight position={[-5, 2.2, Z - 5]} color="#89c4f4" intensity={6} distance={12} />
                    <mesh position={[5, 1.9, Z - 5]}><sphereGeometry args={[0.18, 16, 16]} /><meshStandardMaterial emissive="#a3d3ff" emissiveIntensity={3.5} color="#ffffff" /></mesh>
                    <pointLight position={[5, 2.2, Z - 5]} color="#89c4f4" intensity={6} distance={12} />

                    {/* ── FIXED TELEVISION MODULE (Moved completely out of the feature wall depth zone) ── */}
                    {/* Console Unit */}
                    <mesh position={[10.4, 0.9, Z - 2]}><boxGeometry args={[1.8, 1.8, 9]} /><meshStandardMaterial color="#666159" roughness={0.5} /></mesh>
                    <mesh position={[10.4, 1.81, Z - 2]}><boxGeometry args={[1.84, 0.04, 9.04]} /><meshStandardMaterial color="#8090b0" roughness={0.1} metalness={0.9} /></mesh>
                    {/* TV Outer frame adjusted to clear wall paneling flawlessly */}
                    <mesh position={[11.88, 4.8, Z - 2]}><boxGeometry args={[0.12, 5.3, 9.2]} /><meshStandardMaterial color="#111111" roughness={0.4} metalness={0.8} /></mesh>
                    <mesh position={[11.83, 4.8, Z - 2]}><boxGeometry args={[0.08, 4.9, 8.8]} /><meshStandardMaterial color="#03050a" roughness={0.08} metalness={0.5} emissive="#0a1f40" emissiveIntensity={1.4} /></mesh>
                    <pointLight position={[10.5, 4.8, Z - 2]} color="#89c4f4" intensity={4} distance={15} />

                    {/* ── WALL ART (Left Wall Variant) ── */}
                    <mesh position={[-11.88, 5.8, Z - 3]}><boxGeometry args={[0.12, 4.6, 7.0]} /><meshStandardMaterial color="#8090b0" roughness={0.1} metalness={0.9} /></mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.83, 5.8, Z - 3]}>
                        <planeGeometry args={[6.6, 4.2]} />
                        <meshStandardMaterial color="#110306" roughness={0.95} emissive="#3d050c" emissiveIntensity={0.4} />
                    </mesh>
                    <pointLight position={[-9.5, 9.0, Z - 3]} color="#89c4f4" intensity={5} distance={12} />

                    {/* ── LIVING ATELIER AREA ── */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, Z + 5]}>
                        <planeGeometry args={[12, 8]} />
                        <meshStandardMaterial color="#0c1017" roughness={0.95} />
                    </mesh>
                    {/* Sectional furniture elements */}
                    <mesh position={[0, 0.7, Z + 7]}><boxGeometry args={[7, 1.4, 2.8]} /><meshStandardMaterial color="#666159" roughness={0.8} /></mesh>
                    <mesh position={[0, 1.8, Z + 8.4]}><boxGeometry args={[7, 2.2, 0.4]} /><meshStandardMaterial color="#666159" roughness={0.8} /></mesh>
                    {[-2, 0, 2].map((x, i) => (
                        <mesh key={i} position={[x, 1.05, Z + 7]}><boxGeometry args={[1.9, 0.35, 2.6]} /><meshStandardMaterial color="#2d374d" roughness={0.85} /></mesh>
                    ))}
                    <mesh position={[-3.7, 1.4, Z + 7]}><boxGeometry args={[0.4, 0.8, 2.8]} /><meshStandardMaterial color="#1e2433" roughness={0.8} /></mesh>
                    <mesh position={[3.7, 1.4, Z + 7]}><boxGeometry args={[0.4, 0.8, 2.8]} /><meshStandardMaterial color="#1e2433" roughness={0.8} /></mesh>
                    {/* Coffee Table */}
                    <mesh position={[0, 0.45, Z + 4]}><boxGeometry args={[3.5, 0.9, 1.8]} /><meshStandardMaterial color="#080a0f" roughness={0.3} metalness={0.6} /></mesh>
                    <mesh position={[0, 0.91, Z + 4]}><boxGeometry args={[3.54, 0.04, 1.84]} /><meshStandardMaterial color="#8090b0" roughness={0.1} metalness={0.9} /></mesh>

                </group>

                {/* Room 2: Premier Ocean View ── coastal teal, beautified */}
                <group position={[80, 0, 0]}>

                    {/* ── Room surfaces ── */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, Z]}>
                        <planeGeometry args={[24, 30]} />
                        <meshStandardMaterial color="#c4a870" roughness={0.6} metalness={0.04} />
                    </mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#8ab4a8" roughness={0.82} />
                    </mesh>
                    <mesh rotation={[0, -Math.PI / 2, 0]} position={[11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#8ab4a8" roughness={0.82} />
                    </mesh>
                    <mesh position={[0, 6, Z - 6.5]}>
                        <boxGeometry args={[24, 12, 0.08]} />
                        <meshStandardMaterial color="#1e5048" roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 4.5, Z - 6.44]}>
                        <boxGeometry args={[12.5, 8.5, 0.06]} />
                        <meshStandardMaterial color="#0e2a26" roughness={0.7} />
                    </mesh>

                    {/* ── Crown moulding — teal LED ── */}
                    <mesh position={[0, 11.82, Z + 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial color="#60c0b0" emissive="#5ae8c8" emissiveIntensity={0.7} /></mesh>
                    <mesh position={[0, 11.82, Z - 14.6]}><boxGeometry args={[24, 0.2, 0.28]} /><meshStandardMaterial color="#60c0b0" emissive="#5ae8c8" emissiveIntensity={0.7} /></mesh>
                    <mesh position={[-11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#60c0b0" emissive="#5ae8c8" emissiveIntensity={0.7} /></mesh>
                    <mesh position={[11.82, 11.82, Z]}><boxGeometry args={[0.28, 0.2, 30]} /><meshStandardMaterial color="#60c0b0" emissive="#5ae8c8" emissiveIntensity={0.7} /></mesh>
                    <pointLight position={[-6, 11.5, Z - 3]} color="#5ae8c8" intensity={3} distance={20} />
                    <pointLight position={[6, 11.5, Z - 3]} color="#5ae8c8" intensity={3} distance={20} />

                    {/* ── Area rug ── */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, Z - 3]}>
                        <planeGeometry args={[16, 11]} />
                        <meshStandardMaterial color="#2a4840" roughness={0.95} />
                    </mesh>

                    {/* ── Twin Bed A (left) ── */}
                    <mesh position={[-4, 0.4, Z - 3]}><boxGeometry args={[5, 0.8, 5.5]} /><meshStandardMaterial color="#1e2a28" roughness={0.6} /></mesh>
                    <mesh position={[-4, 1.0, Z - 3]}><boxGeometry args={[4.7, 0.4, 5.2]} /><meshStandardMaterial color="#e8f0ee" roughness={0.9} /></mesh>
                    <mesh position={[-4, 1.22, Z - 2.0]}><boxGeometry args={[4.7, 0.18, 3.2]} /><meshStandardMaterial color="#2a8a7a" roughness={0.88} /></mesh>
                    <mesh position={[-4, 1.32, Z - 5.8]}><boxGeometry args={[3.5, 0.3, 1.2]} /><meshStandardMaterial color="#f0f5f3" roughness={0.95} /></mesh>
                    <mesh position={[-4, 2.6, Z - 6.2]}><boxGeometry args={[5.2, 4.5, 0.28]} /><meshStandardMaterial color="#1a2e2a" roughness={0.7} /></mesh>
                    <mesh position={[-4, 2.6, Z - 6.12]}><boxGeometry args={[5.6, 4.9, 0.06]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.1} /></mesh>

                    {/* ── Twin Bed B (right) ── */}
                    <mesh position={[4, 0.4, Z - 3]}><boxGeometry args={[5, 0.8, 5.5]} /><meshStandardMaterial color="#1e2a28" roughness={0.6} /></mesh>
                    <mesh position={[4, 1.0, Z - 3]}><boxGeometry args={[4.7, 0.4, 5.2]} /><meshStandardMaterial color="#e8f0ee" roughness={0.9} /></mesh>
                    <mesh position={[4, 1.22, Z - 2.0]}><boxGeometry args={[4.7, 0.18, 3.2]} /><meshStandardMaterial color="#2a8a7a" roughness={0.88} /></mesh>
                    <mesh position={[4, 1.32, Z - 5.8]}><boxGeometry args={[3.5, 0.3, 1.2]} /><meshStandardMaterial color="#f0f5f3" roughness={0.95} /></mesh>
                    <mesh position={[4, 2.6, Z - 6.2]}><boxGeometry args={[5.2, 4.5, 0.28]} /><meshStandardMaterial color="#1a2e2a" roughness={0.7} /></mesh>
                    <mesh position={[4, 2.6, Z - 6.12]}><boxGeometry args={[5.6, 4.9, 0.06]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.1} /></mesh>

                    {/* ── Nightstands with teal tops ── */}
                    <mesh position={[0, 0.8, Z - 3]}><boxGeometry args={[1.5, 1.6, 1.5]} /><meshStandardMaterial color="#182820" roughness={0.5} /></mesh>
                    <mesh position={[0, 1.62, Z - 3]}><boxGeometry args={[1.55, 0.07, 1.55]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.85} /></mesh>
                    <mesh position={[0, 2.2, Z - 3]}><sphereGeometry args={[0.22, 10, 10]} /><meshStandardMaterial emissive="#5ae8c8" emissiveIntensity={2.2} color="#c0fff0" /></mesh>
                    <pointLight position={[0, 2.6, Z - 3]} color="#5ae8c8" intensity={10} distance={16} />
                    <mesh position={[-8, 0.8, Z - 3]}><boxGeometry args={[1.4, 1.6, 1.4]} /><meshStandardMaterial color="#182820" roughness={0.5} /></mesh>
                    <mesh position={[8, 0.8, Z - 3]}><boxGeometry args={[1.4, 1.6, 1.4]} /><meshStandardMaterial color="#182820" roughness={0.5} /></mesh>
                    <mesh position={[-8, 1.62, Z - 3]}><boxGeometry args={[1.45, 0.07, 1.45]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.85} /></mesh>
                    <mesh position={[8, 1.62, Z - 3]}><boxGeometry args={[1.45, 0.07, 1.45]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.85} /></mesh>

                    {/* ── TV wall — right ── */}
                    <mesh position={[10.4, 0.9, Z - 2]}><boxGeometry args={[2, 1.8, 8]} /><meshStandardMaterial color="#1e2a28" roughness={0.45} /></mesh>
                    <mesh position={[10.4, 1.82, Z - 2]}><boxGeometry args={[2.1, 0.08, 8.1]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.85} /></mesh>
                    <mesh position={[11.88, 4.5, Z - 2]}><boxGeometry args={[0.13, 4.8, 8.4]} /><meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.7} /></mesh>
                    <mesh position={[11.82, 4.5, Z - 2]}><boxGeometry args={[0.1, 4.4, 8.0]} /><meshStandardMaterial color="#020408" roughness={0.04} metalness={0.4} emissive="#082820" emissiveIntensity={1.4} /></mesh>
                    <pointLight position={[10.5, 4.5, Z - 2]} color="#5ae8c8" intensity={4} distance={12} />

                    {/* ── Wall art — left ── */}
                    <mesh position={[-11.88, 5.8, Z - 3]}><boxGeometry args={[0.13, 4.6, 7.0]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.1} /></mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.82, 5.8, Z - 3]}>
                        <planeGeometry args={[6.6, 4.2]} />
                        <meshStandardMaterial color="#062820" roughness={0.9} emissive="#0a6050" emissiveIntensity={0.35} />
                    </mesh>
                    <pointLight position={[-9.8, 9.5, Z - 3]} color="#5ae8c8" intensity={5} distance={9} />

                    {/* ── Window desk with lamp ── */}
                    <mesh position={[8, 0.9, Z - 11]}><boxGeometry args={[5, 0.14, 2.2]} /><meshStandardMaterial color="#1e3028" metalness={0.3} roughness={0.4} /></mesh>
                    <mesh position={[8, 0.44, Z - 12]}><boxGeometry args={[0.18, 0.9, 0.18]} /><meshStandardMaterial color="#1e3028" /></mesh>
                    <mesh position={[8, 0.44, Z - 10]}><boxGeometry args={[0.18, 0.9, 0.18]} /><meshStandardMaterial color="#1e3028" /></mesh>
                    <mesh position={[6.5, 0.92, Z - 11]}><boxGeometry args={[0.08, 1.8, 0.08]} /><meshStandardMaterial color="#60c0b0" metalness={0.85} roughness={0.12} /></mesh>
                    <mesh position={[6.5, 2.0, Z - 11]}><sphereGeometry args={[0.3, 8, 8]} /><meshStandardMaterial color="#d0fff0" emissive="#5ae8c8" emissiveIntensity={2.0} /></mesh>
                    <pointLight position={[6.5, 1.8, Z - 11]} color="#5ae8c8" intensity={5} distance={7} />

                    {/* ── Lounge chair + floor lamp ── */}
                    <mesh position={[-8, 0.5, Z + 5]}><boxGeometry args={[2.5, 1, 2.5]} /><meshStandardMaterial color="#2a5a50" roughness={0.8} /></mesh>
                    <mesh position={[-8, 1.8, Z + 4.2]}><boxGeometry args={[2.5, 2, 0.35]} /><meshStandardMaterial color="#2a5a50" roughness={0.8} /></mesh>
                    <mesh position={[-10.2, 4.0, Z + 4]}><boxGeometry args={[0.1, 8.0, 0.1]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.9} /></mesh>
                    <mesh position={[-10.2, 8.2, Z + 4]}><cylinderGeometry args={[0.65, 0.45, 0.9, 8]} /><meshStandardMaterial color="#c0f0e8" roughness={0.5} emissive="#5ae8c8" emissiveIntensity={0.45} /></mesh>
                    <pointLight position={[-10.2, 7.6, Z + 4]} color="#5ae8c8" intensity={6} distance={12} />
                    <mesh position={[-5.5, 0.5, Z + 6.2]}><cylinderGeometry args={[0.55, 0.45, 1.0, 10]} /><meshStandardMaterial color="#182820" roughness={0.5} /></mesh>
                    <mesh position={[-5.5, 1.02, Z + 6.2]}><cylinderGeometry args={[0.6, 0.6, 0.06, 10]} /><meshStandardMaterial color="#60c0b0" roughness={0.12} metalness={0.85} /></mesh>
                </group>

                {/* Room 3: Presidential Suite ── gold palatial, beautified */}
                <group position={[120, 0, 0]}>

                    {/* ── Room surfaces ── */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, Z]}>
                        <planeGeometry args={[24, 30]} />
                        <meshStandardMaterial color="#140e08" roughness={0.25} metalness={0.25} />
                    </mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#c4a060" roughness={0.78} />
                    </mesh>
                    <mesh rotation={[0, -Math.PI / 2, 0]} position={[11.9, 6, Z]}>
                        <planeGeometry args={[30, 12]} />
                        <meshStandardMaterial color="#c4a060" roughness={0.78} />
                    </mesh>
                    <mesh position={[0, 6, Z - 7.8]}>
                        <boxGeometry args={[24, 12, 0.08]} />
                        <meshStandardMaterial color="#0c0808" roughness={0.85} />
                    </mesh>
                    <mesh position={[0, 5.0, Z - 7.74]}>
                        <boxGeometry args={[11.5, 10.5, 0.06]} />
                        <meshStandardMaterial color="#060402" roughness={0.7} />
                    </mesh>

                    {/* ── Crown moulding — heavy gold LED ── */}
                    <mesh position={[0, 11.82, Z + 14.6]}><boxGeometry args={[24, 0.26, 0.32]} /><meshStandardMaterial color="#c9a96e" emissive="#ffc34d" emissiveIntensity={1.1} /></mesh>
                    <mesh position={[0, 11.82, Z - 14.6]}><boxGeometry args={[24, 0.26, 0.32]} /><meshStandardMaterial color="#c9a96e" emissive="#ffc34d" emissiveIntensity={1.1} /></mesh>
                    <mesh position={[-11.82, 11.82, Z]}><boxGeometry args={[0.32, 0.26, 30]} /><meshStandardMaterial color="#c9a96e" emissive="#ffc34d" emissiveIntensity={1.1} /></mesh>
                    <mesh position={[11.82, 11.82, Z]}><boxGeometry args={[0.32, 0.26, 30]} /><meshStandardMaterial color="#c9a96e" emissive="#ffc34d" emissiveIntensity={1.1} /></mesh>
                    <pointLight position={[-6, 11.5, Z - 4]} color="#ffc34d" intensity={6} distance={22} />
                    <pointLight position={[6, 11.5, Z - 4]} color="#ffc34d" intensity={6} distance={22} />

                    {/* ── Grand rug ── */}
                    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.025, Z - 2]}>
                        <planeGeometry args={[18, 15]} />
                        <meshStandardMaterial color="#2a1a0a" roughness={0.95} />
                    </mesh>

                    {/* ── Super King bed ── */}
                    <mesh position={[0, 0.5, Z - 4]}><boxGeometry args={[9, 1, 6.5]} /><meshStandardMaterial color="#1a1006" roughness={0.5} metalness={0.1} /></mesh>
                    <mesh position={[0, 1.12, Z - 4]}><boxGeometry args={[8.6, 0.45, 6.1]} /><meshStandardMaterial color="#f9f5ec" roughness={0.9} /></mesh>
                    <mesh position={[0, 1.35, Z - 2.8]}><boxGeometry args={[8.6, 0.22, 4.0]} /><meshStandardMaterial color="#c9924a" roughness={0.85} /></mesh>
                    <mesh position={[0, 1.35, Z - 0.5]}><boxGeometry args={[8.6, 0.22, 1.5]} /><meshStandardMaterial color="#c9a96e" roughness={0.65} metalness={0.2} /></mesh>
                    {[-2.2, -0.7, 0.7, 2.2].map(x => (
                        <mesh key={x} position={[x, 1.7, Z - 7.1]}><boxGeometry args={[1.6, 0.4, 1.3]} /><meshStandardMaterial color="#fffbf0" roughness={0.9} /></mesh>
                    ))}

                    {/* ── Grand headboard with bold gold trim ── */}
                    <mesh position={[0, 4.0, Z - 7.65]}><boxGeometry args={[9.5, 7.5, 0.35]} /><meshStandardMaterial color="#1a1006" roughness={0.5} /></mesh>
                    <mesh position={[0, 4.0, Z - 7.47]}><boxGeometry args={[9.9, 7.9, 0.12]} /><meshStandardMaterial color="#c9a96e" roughness={0.15} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.22} /></mesh>

                    {/* ── Gold bedside tables + lamps ── */}
                    {[-5.5, 5.5].map(x => (
                        <group key={x}>
                            <mesh position={[x, 0.9, Z - 4]}><boxGeometry args={[1.8, 1.8, 1.8]} /><meshStandardMaterial color="#1a1006" roughness={0.4} metalness={0.3} /></mesh>
                            <mesh position={[x, 1.82, Z - 4]}><boxGeometry args={[1.85, 0.07, 1.85]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.9} /></mesh>
                            <mesh position={[x, 2.35, Z - 4]}><sphereGeometry args={[0.3, 12, 12]} /><meshStandardMaterial emissive="#ffc34d" emissiveIntensity={3.5} color="#fff5d0" /></mesh>
                            <pointLight position={[x, 2.8, Z - 4]} color="#ffc34d" intensity={14} distance={18} />
                        </group>
                    ))}

                    {/* ── TV wall — right ── */}
                    <mesh position={[10.4, 0.9, Z - 2]}><boxGeometry args={[2, 1.8, 10]} /><meshStandardMaterial color="#1a1006" roughness={0.4} metalness={0.1} /></mesh>
                    <mesh position={[10.4, 1.82, Z - 2]}><boxGeometry args={[2.1, 0.08, 10.1]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.9} /></mesh>
                    <mesh position={[11.88, 5.2, Z - 2]}><boxGeometry args={[0.14, 5.8, 10.2]} /><meshStandardMaterial color="#1a1a1a" roughness={0.2} metalness={0.7} /></mesh>
                    <mesh position={[11.82, 5.2, Z - 2]}><boxGeometry args={[0.1, 5.4, 9.8]} /><meshStandardMaterial color="#020408" roughness={0.04} metalness={0.4} emissive="#100808" emissiveIntensity={1.5} /></mesh>
                    <pointLight position={[10.5, 5.2, Z - 2]} color="#ffc34d" intensity={4} distance={14} />

                    {/* ── Two paintings — left wall ── */}
                    <mesh position={[-11.88, 8.0, Z - 3]}><boxGeometry args={[0.13, 3.8, 5.6]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.12} /></mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.82, 8.0, Z - 3]}>
                        <planeGeometry args={[5.2, 3.4]} />
                        <meshStandardMaterial color="#100c04" roughness={0.9} emissive="#604010" emissiveIntensity={0.4} />
                    </mesh>
                    <pointLight position={[-9.8, 10.2, Z - 3]} color="#ffc34d" intensity={5} distance={8} />
                    <mesh position={[-11.88, 3.8, Z + 1]}><boxGeometry args={[0.13, 4.0, 5.8]} /><meshStandardMaterial color="#c9a96e" roughness={0.12} metalness={0.88} emissive="#c9a96e" emissiveIntensity={0.12} /></mesh>
                    <mesh rotation={[0, Math.PI / 2, 0]} position={[-11.82, 3.8, Z + 1]}>
                        <planeGeometry args={[5.4, 3.6]} />
                        <meshStandardMaterial color="#1a0c06" roughness={0.9} emissive="#804020" emissiveIntensity={0.35} />
                    </mesh>
                    <pointLight position={[-9.8, 6.0, Z + 1]} color="#ffc34d" intensity={4} distance={8} />

                    
                    
                    {/* Floor lamp */}
                    <mesh position={[9.5, 4.0, Z + 7]}><boxGeometry args={[0.12, 8.0, 0.12]} /><meshStandardMaterial color="#c9a96e" roughness={0.1} metalness={0.92} /></mesh>
                    <mesh position={[9.5, 8.2, Z + 7]}><cylinderGeometry args={[0.8, 0.55, 1.0, 10]} /><meshStandardMaterial color="#f8e8c0" roughness={0.55} emissive="#ffc34d" emissiveIntensity={0.55} /></mesh>
                    <pointLight position={[9.5, 7.6, Z + 7]} color="#ffc34d" intensity={9} distance={14} />
                </group>

            </group>

            {/* Background cityscape */}
            {[
                [-14, 8, Z - 24], [-8, 13, Z - 21], [0, 7, Z - 18],
                [8, 11, Z - 22], [14, 7, Z - 25], [-20, 6, Z - 33], [20, 5, Z - 33],
            ].map(([x, h, z], i) => (
                <mesh key={i} position={[x, h / 2, z]}>
                    <boxGeometry args={[7, h, 5]} />
                    <meshStandardMaterial color="#04080f" emissive="#1a2535" emissiveIntensity={0.45} />
                </mesh>
            ))}
        </group>
    );
}

// ─────────────────────────────────────────────────────────────
// ROOT EXPORT
// ─────────────────────────────────────────────────────────────

export default function ScrollCanvas({ scrollProgressRef, selectedRoomRef }) {
    return (
        <Canvas
            camera={{ position: [-14, 8, 55], fov: 60, near: 0.1, far: 600 }}
            style={{ width: '100%', height: '100%' }}
            gl={{ antialias: true, alpha: false }}
            dpr={[1, 2]}
        >
            <SceneAtmosphere scrollProgressRef={scrollProgressRef} selectedRoomRef={selectedRoomRef} />
            <CameraRig scrollProgressRef={scrollProgressRef} />
            <Stars radius={160} depth={80} count={3500} factor={3} saturation={0} fade />
            <directionalLight position={[20, 40, 20]} intensity={3.5} />
            {/* Front-facing fill light so the hotel facade is visibly lit */}
            <directionalLight position={[-5, 12, 45]} intensity={2.5} color="#fff5e0" />

            <HotelExterior scrollProgressRef={scrollProgressRef} />
            <GrandLobby scrollProgressRef={scrollProgressRef} />
            <LuxurySuite selectedRoomRef={selectedRoomRef} />
        </Canvas>
    );
}