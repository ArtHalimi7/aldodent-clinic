import { useRef, useMemo, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, ContactShadows } from '@react-three/drei'
import { Suspense } from 'react'

/* ─── The actual GLB mesh ─── */
function Tooth({ mouse }) {
    const group = useRef()
    const { scene } = useGLTF('/models/tooth.glb')

    // Clone the scene so each Canvas instance gets its own independent copy
    const clonedScene = useMemo(() => scene.clone(true), [scene])

    // Auto-rotate + mouse parallax tilt
    useFrame((state) => {
        if (!group.current) return
        const t = state.clock.getElapsedTime()

        // Continuous slow rotation
        group.current.rotation.y = t * 0.35

        // Gentle floating bob
        group.current.position.y = Math.sin(t * 0.6) * 0.08

        // Mouse parallax tilt (subtle)
        group.current.rotation.x += (mouse.current.y * 0.25 - group.current.rotation.x) * 0.05
    })

    return (
        <group ref={group} dispose={null}>
            <primitive
                object={clonedScene}
                scale={0.8}
                position={[0, 0.2, 0]}
            />
        </group>
    )
}

/* ─── Loading fallback ring ─── */
function LoadingRing() {
    const ref = useRef()
    useFrame((state) => {
        if (ref.current) ref.current.rotation.z = state.clock.getElapsedTime() * 1.5
    })
    return (
        <mesh ref={ref}>
            <torusGeometry args={[0.6, 0.05, 16, 60]} />
            <meshStandardMaterial color="#2dd4bf" transparent opacity={0.6} />
        </mesh>
    )
}

/* ─── Canvas wrapper — exported for use in Hero ─── */
export default function ToothCanvas() {
    const mouse = useRef({ x: 0, y: 0 })

    useEffect(() => {
        const handleMouseMove = (e) => {
            mouse.current.x = (e.clientX / window.innerWidth - 0.5) * 2
            mouse.current.y = -(e.clientY / window.innerHeight - 0.5) * 2
        }
        window.addEventListener('mousemove', handleMouseMove)
        return () => window.removeEventListener('mousemove', handleMouseMove)
    }, [])

    return (
        <Canvas
            camera={{ position: [0, 0.2, 5.5], fov: 65 }}
            dpr={[1, 2]}
            style={{ background: 'transparent' }}
        >
            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
            <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#a3e4f5" />
            <pointLight position={[0, 4, 2]} intensity={1.2} color="#fff" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            {/* Contact shadow beneath tooth */}
            <ContactShadows
                position={[0, -1.3, 0]}
                opacity={0.35}
                scale={7}
                blur={2}
                far={3}
                color="#000"
            />

            <Suspense fallback={<LoadingRing />}>
                <Tooth mouse={mouse} />
            </Suspense>
        </Canvas>
    )
}

// Preload for zero-delay experience
useGLTF.preload('/models/tooth.glb')
