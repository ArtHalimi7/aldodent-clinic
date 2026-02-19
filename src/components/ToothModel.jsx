import { useRef, useMemo, useState, useCallback } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, Environment, OrbitControls } from '@react-three/drei'
import { Suspense } from 'react'

/* ─── The actual GLB mesh ─── */
function Tooth() {
    const { scene } = useGLTF('/models/tooth.glb')
    const clonedScene = useMemo(() => scene.clone(true), [scene])

    return (
        <group dispose={null}>
            <primitive
                object={clonedScene}
                scale={1.6}
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
    const [canvasKey, setCanvasKey] = useState(0)

    // Auto-recover if WebGL context is lost: remount after 500ms
    const handleCreated = useCallback(({ gl }) => {
        const canvas = gl.domElement
        const onLost = (e) => {
            e.preventDefault()
            setTimeout(() => setCanvasKey((k) => k + 1), 500)
        }
        canvas.addEventListener('webglcontextlost', onLost)
    }, [])

    return (
        <Canvas
            key={canvasKey}
            camera={{ position: [0, 0.2, 5.5], fov: 65 }}
            dpr={[1, 1.5]}
            style={{ background: 'transparent' }}
            frameloop="demand"
            gl={{ powerPreference: 'default', failIfMajorPerformanceCaveat: false }}
            onCreated={handleCreated}
        >
            {/* Controls - autoRotate removed to save performance */}
            <OrbitControls
                makeDefault
                enableZoom={false}
                enablePan={false}
                minPolarAngle={Math.PI / 4}
                maxPolarAngle={Math.PI / 1.5}
            />

            {/* Lighting */}
            <ambientLight intensity={0.4} />
            <directionalLight position={[5, 8, 5]} intensity={2.5} color="#ffffff" />
            <directionalLight position={[-5, -2, -5]} intensity={0.8} color="#a3e4f5" />
            <pointLight position={[0, 4, 2]} intensity={1.2} color="#3a92eaff" />

            {/* Environment for reflections */}
            <Environment preset="city" />

            <Suspense fallback={<LoadingRing />}>
                <Tooth />
            </Suspense>
        </Canvas>
    )
}

// Preload removed to allow lazy loading
// useGLTF.preload('/models/tooth.glb')
