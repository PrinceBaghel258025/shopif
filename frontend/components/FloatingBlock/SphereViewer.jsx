import React, { useEffect, useRef } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { OrbitControls } from "@react-three/drei";
import { Image, Stack } from "@chakra-ui/react";
import QrLoaderGif from "../assets/qr-scan.gif";

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
  const videoRef = useRef();
  const meshRef = useRef();
  const videoTextureRef = useRef();

  useEffect(() => {
    // Create a video element and set the source to the provided video URL
    const video = document.createElement("video");
    video.src = videoUrl;
    video.crossOrigin = "anonymous"; // Ensure smooth handling of CORS if the video is hosted elsewhere
    video.loop = true;
    video.muted = true;
    video.play();
    videoRef.current = video;

    // Create a video texture from the video element
    const texture = new THREE.VideoTexture(video);
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.format = THREE.RGBFormat;
    videoTextureRef.current = texture;

    return () => {
      // Clean up the video texture and stop playback when the component is unmounted
      video.pause();
      video.src = "";
      videoTextureRef.current.dispose();
    };
  }, [videoUrl]);

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
      {/* Use the video texture as the material map */}
      {videoTextureRef.current && (
        <meshStandardMaterial
          map={videoTextureRef.current}
          side={THREE.DoubleSide}
        />
      )}
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

const SphereViewer = ({ type, sourceUrl }) => {
  return (
    <>
      {sourceUrl ? (
        <>
          {type === "carousel_2d_image" ? (
            <ImageScreen imageUrl={sourceUrl} />
          ) : type === "carousel_2d_video" ? (
            <VideoScreen videoUrl={sourceUrl} />
          ) : (
            <Canvas camera={{ position: [0, 0, 0.001] }}>
              <ambientLight intensity={3} />
              <React.Suspense fallback={null}>
                {type === "carousel_360_image" ? (
                  <AnimatedImageSphere imageUrl={sourceUrl} />
                ) : type === "carousel_360_video" ? (
                  <AnimatedVideoSphere videoUrl={sourceUrl} />
                ) : null}
              </React.Suspense>
              <OrbitControls />
            </Canvas>
          )}
        </>
      ) : (
        <Image src={QrLoaderGif} alt="loading" mt={"50%"} />
      )}
    </>
  );
};

export default SphereViewer;
