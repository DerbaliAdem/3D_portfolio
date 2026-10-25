
/* eslint react/no-unknown-property: "off" */
import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMotionValue, useSpring } from "motion/react";

export function Astronaut({
  position = [2, -1, 0],
  rotation = [-Math.PI / 6, 5.5, 0],
  scale = 0.8,
  ...props
}) {
  const group = useRef(null);
  const model = useRef(null);

  const { nodes, materials } = useGLTF(
    "/models/3december_2021_day_18_astronaut.glb"
  );

  const yPosition = useMotionValue(position[1] + 6);

  const ySpring = useSpring(yPosition, {
    stiffness: 35,
    damping: 18,
    mass: 1.2,
  });

  useEffect(() => {
    yPosition.set(position[1] + 6);
    ySpring.set(position[1]);
  }, [position, yPosition, ySpring]);

  useFrame((state) => {
    if (!group.current || !model.current) return;

    const time = state.clock.elapsedTime;

    group.current.position.set(
      position[0],
      ySpring.get() + Math.sin(time * 0.7) * 0.06,
      position[2]
    );

    model.current.rotation.set(
      rotation[0] + Math.sin(time * 0.3) * 0.015,
      rotation[1] + Math.sin(time * 0.4) * 0.02,
      rotation[2] + Math.sin(time * 0.45) * 0.025
    );
  });

  return (
    <group
      ref={group}
      {...props}
      position={position}
      dispose={null}
    >
      <group ref={model} rotation={rotation} scale={scale}>
        <group scale={0.01}>
          <group position={[0, 0, -41.251]} scale={40}>
            <primitive object={nodes._rootJoint} />

            <skinnedMesh
              geometry={nodes.Object_7.geometry}
              material={materials.Suit_Base}
              skeleton={nodes.Object_7.skeleton}
              castShadow
              receiveShadow
            />

            <skinnedMesh
              geometry={nodes.Object_8.geometry}
              material={materials.Suit_Details}
              skeleton={nodes.Object_8.skeleton}
              castShadow
              receiveShadow
            />

            <skinnedMesh
              geometry={nodes.Object_9.geometry}
              material={materials.Suit_Visor}
              skeleton={nodes.Object_9.skeleton}
              castShadow
              receiveShadow
            />
          </group>
        </group>
      </group>
    </group>
  );
}

Astronaut.propTypes = {
  position: PropTypes.arrayOf(PropTypes.number),
  rotation: PropTypes.arrayOf(PropTypes.number),
  scale: PropTypes.number,
};

useGLTF.preload(
  "/models/3december_2021_day_18_astronaut.glb"
);
