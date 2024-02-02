import React, { useCallback, useState } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Box } from '@react-three/drei';

const Voxel = ({ position, onClick }) => (
  <Box position={position} onClick={onClick}>
    <meshStandardMaterial attach="material" color="green" />
  </Box>
);

const GroundPlane = () => {
  const { viewport } = useThree();
  return (
    <mesh rotation={-Math.PI / 2} position={[0, -0.5, 0]} receiveShadow>
      <planeGeometry attach="geometry" args={[viewport.width, viewport.height]} />
      <meshStandardMaterial attach="material" color="#aaa" />
    </mesh>
  );
};

const SimpleCube = () => (
    <mesh position={[0, 1, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );

const VoxelScene = () => {
  const [voxels, setVoxels] = useState([]);

  const addVoxel = useCallback((e) => {
    // Calculate where to add the voxel
    const [x, y, z] = Object.values(e.point).map(coord => Math.ceil(coord));
    setVoxels([...voxels, { position: [x, y, z], id: `${x}-${y}-${z}` }]);
  }, [voxels]);

  const removeVoxel = useCallback((id) => {
    setVoxels(voxels.filter(voxel => voxel.id !== id));
  }, [voxels]);

  return (
    <Canvas style={{ height: "400px", width: "100%" }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} />
      <OrbitControls />
      <GroundPlane />
      <SimpleCube />
      {voxels.map(voxel => (
        <Voxel key={voxel.id} position={voxel.position} onClick={() => removeVoxel(voxel.id)} />
      ))}
      <mesh onClick={addVoxel}>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial opacity={0} transparent />
      </mesh>
    </Canvas>
  );
};

export default VoxelScene;