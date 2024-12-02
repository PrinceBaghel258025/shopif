import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { OrbitControls, useVideoTexture } from "@react-three/drei";
import { Image, Stack } from "@chakra-ui/react";

// Sphere component that renders an image texture with rotation
const AnimatedImageSphere = ({ imageUrl }) => {
  // Load the texture
  const texture = useLoader(TextureLoader, imageUrl);
  const meshRef = useRef();

  // Animation hook to rotate the sphere
  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Y-axis
      meshRef.current.rotation.y += 0.3 * delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
};

// Sphere component that renders a video texture with rotation
const AnimatedVideoSphere = ({ videoUrl }) => {
  const meshRef = useRef();
  const videoTexture = useVideoTexture(videoUrl);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // Rotate around Y-axis
      meshRef.current.rotation.y += 0.3 * delta;
    }
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 100, 100]} />
      <meshStandardMaterial map={videoTexture} side={THREE.DoubleSide} />
    </mesh>
  );
};

const ImageScreen = ({ imageUrl }) => {
  return (
    <Stack w={65} h={120}>
      <Image
        w={65}
        h={120}
        src={imageUrl}
        alt="story"
        style={{ pointerEvents: "none" }}
      />
    </Stack>
  );
};

const VideoScreen = ({ videoUrl }) => {
  return (
    <Stack w={65} h={120}>
      <video
        src={videoUrl}
        style={{
          height: "120px",
          objectFit: "fill",
          pointerEvents: "none",
        }}
        autoPlay
        loop
        muted
        playsInline
      />
    </Stack>
  );
};

const SphereViewer = ({ type, sourceUrl, videoRes = "" }) => {
  const [videoResolution, setVideoResolution] = useState("");

  useEffect(() => {
    if (videoRes === "320p") {
      setVideoResolution("_320p.mp4");
    }
  }, [videoRes]);

  function loading() {
    return (
      <Html>
        <Image
          src={"https://360-images-v1.s3.ap-south-1.amazonaws.com/qr-scan.gif"}
          alt="loading"
          mt={"50%"}
        />
      </Html>
    );
  }

  return (
    <>
      {sourceUrl ? (
        <>
          {type === "carousel_2d_image" ? (
            <ImageScreen imageUrl={sourceUrl} />
          ) : type === "carousel_2d_video" ? (
            <VideoScreen videoUrl={sourceUrl + videoResolution} />
          ) : (
            <Canvas camera={{ position: [0, 0, 0.001] }}>
              <ambientLight intensity={3} />
              <Suspense fallback={loading}>
                {type === "carousel_360_image" ? (
                  <AnimatedImageSphere imageUrl={sourceUrl} />
                ) : type === "carousel_360_video" ? (
                  <AnimatedVideoSphere videoUrl={sourceUrl + videoResolution} />
                ) : null}
              </Suspense>
              <OrbitControls />
            </Canvas>
          )}
        </>
      ) : (
        <Image
          src={"https://360-images-v1.s3.ap-south-1.amazonaws.com/qr-scan.gif"}
          alt="loading"
          mt={"50%"}
        />
      )}
    </>
  );
};

export default SphereViewer;
