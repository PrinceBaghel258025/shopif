import React, { Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader, useFrame } from "@react-three/fiber";
import { TextureLoader } from "three";
import * as THREE from "three";
import { Html, OrbitControls, useVideoTexture } from "@react-three/drei";
import { Image, Stack } from "@chakra-ui/react";

// Separate the sphere mesh into its own component
const VideoSphereMesh = ({ videoUrl }) => {
  const meshRef = useRef();
  const videoTexture = useVideoTexture(videoUrl);

  useFrame((state, delta) => {
    if (meshRef.current) {
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

// Separate the image sphere mesh into its own component
const ImageSphereMesh = ({ imageUrl }) => {
  const texture = useLoader(TextureLoader, imageUrl);
  const meshRef = useRef();

  useFrame((state, delta) => {
    if (meshRef.current) {
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

const AnimatedImageSphere = ({ imageUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 0.001] }}>
      <ambientLight intensity={3} />
      <Suspense
        fallback={
          <Html center>
            <Stack w={65} h={120} position={"relative"}>
              <Image
                src={
                  "https://360-images-v1.s3.ap-south-1.amazonaws.com/qr-scan.gif"
                }
                alt="loading"
                position={"absolute"}
                top={30}
              />
            </Stack>
          </Html>
        }
      >
        <ImageSphereMesh imageUrl={imageUrl} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

const AnimatedVideoSphere = ({ videoUrl }) => {
  return (
    <Canvas camera={{ position: [0, 0, 0.001] }}>
      <ambientLight intensity={3} />
      <Suspense
        fallback={
          <Html center>
            <Stack w={65} h={120} position={"relative"}>
              <Image
                src={
                  "https://360-images-v1.s3.ap-south-1.amazonaws.com/qr-scan.gif"
                }
                alt="loading"
                position={"absolute"}
                top={30}
              />
            </Stack>
          </Html>
        }
      >
        <VideoSphereMesh videoUrl={videoUrl} />
      </Suspense>
      <OrbitControls />
    </Canvas>
  );
};

const ImageScreen = ({ imageUrl }) => {
  return (
    <>
      {imageUrl ? (
        <Stack w={65} h={120}>
          <Image
            w={65}
            h={120}
            src={imageUrl}
            alt="story"
            style={{ pointerEvents: "none" }}
          />
        </Stack>
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

const VideoScreen = ({ videoUrl }) => {
  return (
    <>
      {videoUrl ? (
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

const SphereViewer = ({ type, sourceUrl, videoRes = "" }) => {
  const [videoResolution, setVideoResolution] = useState("");

  useEffect(() => {
    if (videoRes === "144p") {
      setVideoResolution("_144p.mp4");
    } else if (videoRes === "280p") {
      setVideoResolution("_280p.mp4");
    } else if (videoRes === "320p") {
      setVideoResolution("_320p.mp4");
    }
  }, [videoRes]);

  return (
    <>
      {sourceUrl ? (
        <>
          {type === "carousel_2d_image" ? (
            <ImageScreen imageUrl={sourceUrl} />
          ) : type === "carousel_2d_video" ? (
            <VideoScreen videoUrl={sourceUrl + videoResolution} />
          ) : type === "carousel_360_image" ? (
            <AnimatedImageSphere imageUrl={sourceUrl} />
          ) : type === "carousel_360_video" ? (
            <AnimatedVideoSphere videoUrl={sourceUrl + videoResolution} />
          ) : null}
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
