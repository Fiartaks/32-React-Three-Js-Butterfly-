import React, { useRef, useEffect, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { AnimationMixer } from "three";

const Scene = () => {
  const mountRef = useRef(null);
  const mixerRef = useRef(null);

  useEffect(() => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      115,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff);
    mountRef.current.appendChild(renderer.domElement);

    camera.position.z = 20;

    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(20, 80, 70).normalize();
    scene.add(light);

    const loader = new GLTFLoader();
    loader.load(
      "/models/butterfly.glb",
      (gltf) => {
        const model = gltf.scene;
        scene.add(model);

        model.position.set(0, 0, 0);
        model.scale.set(8, 8, 8);
        model.rotation.x = Math.PI / 3;

        const mixer = new AnimationMixer(model);
        gltf.animations.forEach((clip) => {
          const action = mixer.clipAction(clip);
          action.paused = true; // Başlangıçta duraklat
          action.play();
          action.timeScale = 38; // Hızı artırmak için zaman ölçeğini ayarlayın (daha yüksek değerler hızlanır)
        });

        mixerRef.current = mixer;

        const clock = new THREE.Clock();

        const animate = () => {
          requestAnimationFrame(animate);
          const delta = clock.getDelta();
          mixer.update(delta);
          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("Bir hata oluştu:", error);
      }
    );

    return () => {
      mountRef.current.removeChild(renderer.domElement);
    };
  }, []);

  const handleInputKeyDown = () => {
    if (mixerRef.current) {
      mixerRef.current._actions.forEach((action) => {
        action.paused = false; // Animasyonu başlat
      });
    }
  };

  const handleInputKeyUp = () => {
    if (mixerRef.current) {
      mixerRef.current._actions.forEach((action) => {
        action.paused = true; // Animasyonu duraklat
      });
    }
  };

  return (
    <div>
      <input
        onKeyDown={handleInputKeyDown}
        onKeyUp={handleInputKeyUp}
        placeholder="Type here..."
      />
      <div ref={mountRef} />
    </div>
  );
};

export default Scene;
