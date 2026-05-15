"use client";

import { useEffect, useRef, useState } from "react";
import * as THREE from "three";

const CARD_BACK_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="750" viewBox="0 0 500 750"><defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#4F46E5"/><stop offset="100%" stop-color="#7C3AED"/></linearGradient><radialGradient id="glow" cx="50%" cy="50%" r="50%"><stop offset="0%" stop-color="#A78BFA" stop-opacity="0.4"/><stop offset="100%" stop-color="#4F46E5" stop-opacity="0"/></radialGradient></defs><rect width="500" height="750" rx="24" fill="url(#bg)"/><circle cx="250" cy="375" r="200" fill="url(#glow)"/><circle cx="250" cy="375" r="120" fill="none" stroke="#A78BFA" stroke-width="1.5" opacity="0.4"/><circle cx="250" cy="375" r="80" fill="none" stroke="#C4B5FD" stroke-width="1" opacity="0.3"/><polygon points="250,295 264,355 330,355 276,391 292,451 250,415 208,451 224,391 170,355 236,355" fill="none" stroke="#E9D5FF" stroke-width="1.5" opacity="0.5"/></svg>`,
  );

export default function Card3DViewer({ cardName, cardImage, onClose }) {
  const mountRef = useRef(null);
  const rendererRef = useRef(null);
  const animationFrameRef = useRef(null);
  const isDragging = useRef(false);
  const prevMouse = useRef({ x: 0, y: 0 });
  const velocityRef = useRef({ x: 0, y: 0 });
  const [autoRotate, setAutoRotate] = useState(true);
  const autoRotateRef = useRef(true);
  const [loadingTexture, setLoadingTexture] = useState(true);

  useEffect(() => {
    autoRotateRef.current = autoRotate;
  }, [autoRotate]);

  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a0f);

    const camera = new THREE.PerspectiveCamera(
      50,
      container.clientWidth / container.clientHeight,
      0.1,
      1000,
    );
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Card as thin box so both sides are visible
    const cardGeometry = new THREE.BoxGeometry(2.5, 4, 0.04);

    const sideMat = new THREE.MeshPhongMaterial({
      color: 0x2a1055,
      emissive: 0x150833,
      shininess: 60,
    });
    const frontMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      shininess: 80,
    });
    const backMat = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      emissive: 0x111111,
      shininess: 80,
    });

    // Load front card image via same-origin proxy to avoid CORS
    const textureLoader = new THREE.TextureLoader();
    if (cardImage) {
      const proxyUrl = `/api/proxy-image?url=${encodeURIComponent(cardImage)}`;
      fetch(proxyUrl)
        .then((res) => {
          if (!res.ok) throw new Error("Proxy fetch failed");
          return res.blob();
        })
        .then((blob) => {
          const objectUrl = URL.createObjectURL(blob);
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth || 500;
            canvas.height = img.naturalHeight || 750;
            const ctx = canvas.getContext("2d");
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            URL.revokeObjectURL(objectUrl);
            const tex = new THREE.CanvasTexture(canvas);
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
            frontMat.map = tex;
            frontMat.needsUpdate = true;
            setLoadingTexture(false);
          };
          img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            console.error("Failed to decode card image blob");
            setLoadingTexture(false);
          };
          img.src = objectUrl;
        })
        .catch((err) => {
          console.error("Failed to load card image via proxy:", err);
          setLoadingTexture(false);
        });
    } else {
      setLoadingTexture(false);
    }

    // Load back texture from SVG data URI (no CORS issue)
    textureLoader.load(CARD_BACK_SVG, (tex) => {
      tex.colorSpace = THREE.SRGBColorSpace;
      backMat.map = tex;
      backMat.needsUpdate = true;
    });

    const materials = [sideMat, sideMat, sideMat, sideMat, frontMat, backMat];
    const cardMesh = new THREE.Mesh(cardGeometry, materials);
    scene.add(cardMesh);

    // Glow ring
    const glowGeo = new THREE.RingGeometry(2.6, 3.2, 64);
    const glowMat = new THREE.MeshBasicMaterial({
      color: 0x7c3aed,
      transparent: true,
      opacity: 0.08,
      side: THREE.DoubleSide,
    });
    const glowRing = new THREE.Mesh(glowGeo, glowMat);
    glowRing.position.z = -0.5;
    scene.add(glowRing);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(3, 4, 5);
    scene.add(keyLight);
    const fillLight = new THREE.DirectionalLight(0xa78bfa, 0.4);
    fillLight.position.set(-3, -2, 4);
    scene.add(fillLight);
    const rimLight = new THREE.PointLight(0x7c3aed, 1.5, 20);
    rimLight.position.set(0, 0, -3);
    scene.add(rimLight);
    const accent1 = new THREE.PointLight(0xa78bfa, 0.8, 15);
    accent1.position.set(5, 3, 2);
    scene.add(accent1);
    const accent2 = new THREE.PointLight(0x6d28d9, 0.6, 15);
    accent2.position.set(-5, -3, 2);
    scene.add(accent2);

    // Particles
    const pCount = 150;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(pCount * 3);
    for (let i = 0; i < pCount * 3; i++) pPos[i] = (Math.random() - 0.5) * 12;
    pGeo.setAttribute("position", new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xc4b5fd,
      size: 0.05,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const pts = new THREE.Points(pGeo, pMat);
    scene.add(pts);

    // Drag state
    let targetRotY = 0,
      targetRotX = 0;

    const onMD = (e) => {
      isDragging.current = true;
      prevMouse.current = { x: e.clientX, y: e.clientY };
      velocityRef.current = { x: 0, y: 0 };
      setAutoRotate(false);
    };
    const onMM = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - prevMouse.current.x;
      const dy = e.clientY - prevMouse.current.y;
      velocityRef.current = { x: dx * 0.008, y: dy * 0.006 };
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX + dy * 0.006));
      prevMouse.current = { x: e.clientX, y: e.clientY };
    };
    const onMU = () => {
      isDragging.current = false;
    };
    const onTS = (e) => {
      if (e.touches.length === 1) {
        isDragging.current = true;
        prevMouse.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
        };
        velocityRef.current = { x: 0, y: 0 };
        setAutoRotate(false);
      }
    };
    const onTM = (e) => {
      if (!isDragging.current || e.touches.length !== 1) return;
      e.preventDefault();
      const dx = e.touches[0].clientX - prevMouse.current.x;
      const dy = e.touches[0].clientY - prevMouse.current.y;
      velocityRef.current = { x: dx * 0.008, y: dy * 0.006 };
      targetRotY += dx * 0.008;
      targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX + dy * 0.006));
      prevMouse.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };
    const onTE = () => {
      isDragging.current = false;
    };

    container.addEventListener("mousedown", onMD);
    container.addEventListener("mousemove", onMM);
    container.addEventListener("mouseup", onMU);
    container.addEventListener("mouseleave", onMU);
    container.addEventListener("touchstart", onTS, { passive: true });
    container.addEventListener("touchmove", onTM, { passive: false });
    container.addEventListener("touchend", onTE);

    let autoAngle = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      if (autoRotateRef.current) {
        autoAngle += 0.008;
        cardMesh.rotation.y += (autoAngle - cardMesh.rotation.y) * 0.05;
        cardMesh.rotation.x +=
          (Math.sin(t * 0.5) * 0.1 - cardMesh.rotation.x) * 0.05;
      } else {
        if (!isDragging.current) {
          velocityRef.current.x *= 0.95;
          velocityRef.current.y *= 0.95;
          targetRotY += velocityRef.current.x;
          targetRotX += velocityRef.current.y;
          targetRotX = Math.max(-1.2, Math.min(1.2, targetRotX));
        }
        cardMesh.rotation.y += (targetRotY - cardMesh.rotation.y) * 0.1;
        cardMesh.rotation.x += (targetRotX - cardMesh.rotation.x) * 0.1;
      }
      cardMesh.position.y = Math.sin(t * 0.8) * 0.08;

      const pp = pGeo.attributes.position.array;
      for (let i = 0; i < pCount; i++) {
        pp[i * 3 + 1] += Math.sin(t + i * 0.3) * 0.001;
        pp[i * 3] += Math.cos(t * 0.5 + i * 0.2) * 0.0005;
      }
      pGeo.attributes.position.needsUpdate = true;
      pts.rotation.y = t * 0.02;
      glowRing.rotation.z = t * 0.1;
      glowMat.opacity = 0.06 + Math.sin(t) * 0.03;
      accent1.position.x = Math.sin(t * 0.5) * 5;
      accent1.position.y = Math.cos(t * 0.3) * 3;
      accent2.position.x = Math.cos(t * 0.4) * 5;
      accent2.position.y = Math.sin(t * 0.6) * 3;

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      container.removeEventListener("mousedown", onMD);
      container.removeEventListener("mousemove", onMM);
      container.removeEventListener("mouseup", onMU);
      container.removeEventListener("mouseleave", onMU);
      container.removeEventListener("touchstart", onTS);
      container.removeEventListener("touchmove", onTM);
      container.removeEventListener("touchend", onTE);
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
      if (rendererRef.current && container)
        container.removeChild(rendererRef.current.domElement);
      cardGeometry.dispose();
      materials.forEach((m) => {
        if (m.map) m.map.dispose();
        m.dispose();
      });
      glowGeo.dispose();
      glowMat.dispose();
      pGeo.dispose();
      pMat.dispose();
      renderer.dispose();
    };
  }, [cardImage]);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.92)",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 16,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          maxWidth: 900,
          height: "min(700px, 85vh)",
          backgroundColor: "#0a0a0f",
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(124,58,237,0.4)",
          boxShadow: "0 0 60px 12px rgba(124,58,237,0.15)",
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            zIndex: 10,
            background: "rgba(124,58,237,0.5)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            border: "1px solid rgba(139,92,246,0.3)",
            color: "#fff",
            padding: "8px 18px",
            borderRadius: 10,
            fontWeight: 600,
            fontSize: 13,
            cursor: "pointer",
          }}
        >
          Close
        </button>
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            zIndex: 10,
            background: "rgba(0,0,0,0.6)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            padding: "12px 18px",
            borderRadius: 12,
            border: "1px solid rgba(139,92,246,0.2)",
          }}
        >
          <h3
            style={{
              color: "#E9D5FF",
              fontSize: 18,
              fontWeight: 700,
              margin: 0,
            }}
          >
            {cardName}
          </h3>
          <p style={{ color: "#9B7FD4", fontSize: 11, margin: "4px 0 0" }}>
            Drag to rotate
          </p>
        </div>
        <div
          style={{
            position: "absolute",
            bottom: 16,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
        >
          <button
            onClick={() => setAutoRotate(!autoRotate)}
            style={{
              background: autoRotate
                ? "rgba(124,58,237,0.5)"
                : "rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              border: "1px solid rgba(139,92,246,0.3)",
              color: "#C4B5FD",
              padding: "8px 16px",
              borderRadius: 10,
              fontSize: 12,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {autoRotate ? "⏸ Auto-Rotate" : "▶ Auto-Rotate"}
          </button>
        </div>
        {loadingTexture && (
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%,-50%)",
              zIndex: 10,
              color: "#A78BFA",
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            Loading card artwork…
          </div>
        )}
        <div
          ref={mountRef}
          style={{ width: "100%", height: "100%", cursor: "grab" }}
        />
      </div>
    </div>
  );
}
