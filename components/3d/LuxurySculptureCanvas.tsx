"use client";

import { useEffect, useRef, useState } from "react";

export default function LuxurySculptureCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;
    let mouseX = 0;
    let mouseY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };

    window.addEventListener("mousemove", handleMouseMove);

    const resize = () => {
      if (!canvas) return;
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = canvas.parentElement?.clientHeight || 600;
    };

    resize();
    window.addEventListener("resize", resize);

    // Sculptural Ribbon Torus Lattice Render Loop
    const render = () => {
      time += 0.008;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2 + mouseX * 20;
      const centerY = height / 2 + mouseY * 20;

      ctx.clearRect(0, 0, width, height);

      // Deep radial glow backdrop
      const bgGlow = ctx.createRadialGradient(
        centerX,
        centerY,
        10,
        centerX,
        centerY,
        width * 0.45
      );
      bgGlow.addColorStop(0, "rgba(201, 169, 110, 0.12)");
      bgGlow.addColorStop(0.5, "rgba(72, 22, 29, 0.08)");
      bgGlow.addColorStop(1, "rgba(8, 8, 9, 0)");

      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, width, height);

      // Render satin metallic sculptural ribbon loops
      const strands = 48;
      const radius = Math.min(width, height) * 0.28;

      ctx.save();
      ctx.translate(centerX, centerY);

      for (let i = 0; i < strands; i++) {
        const angle = (i / strands) * Math.PI * 2 + time * 0.3;
        const wave = Math.sin(angle * 3 + time) * 35;
        const x = Math.cos(angle) * (radius + wave);
        const y = Math.sin(angle) * (radius + wave * 0.5) * 0.7;

        const size = Math.sin(angle * 2 + time) * 12 + 18;

        // Luxury Champagne & Onyx Satin Gradient
        const strokeGrad = ctx.createLinearGradient(
          x - size,
          y - size,
          x + size,
          y + size
        );

        if (i % 3 === 0) {
          strokeGrad.addColorStop(0, "rgba(244, 240, 232, 0.85)");
          strokeGrad.addColorStop(0.5, "rgba(201, 169, 110, 0.6)");
          strokeGrad.addColorStop(1, "rgba(72, 22, 29, 0.2)");
        } else if (i % 3 === 1) {
          strokeGrad.addColorStop(0, "rgba(201, 169, 110, 0.9)");
          strokeGrad.addColorStop(0.7, "rgba(169, 102, 82, 0.5)");
          strokeGrad.addColorStop(1, "rgba(17, 17, 19, 0.3)");
        } else {
          strokeGrad.addColorStop(0, "rgba(244, 240, 232, 0.4)");
          strokeGrad.addColorStop(1, "rgba(8, 8, 9, 0.8)");
        }

        ctx.beginPath();
        ctx.ellipse(
          x,
          y,
          size * 1.6,
          size * 0.7,
          angle + Math.sin(time + i) * 0.5,
          0,
          Math.PI * 2
        );
        ctx.strokeStyle = strokeGrad;
        ctx.lineWidth = 1.2;
        ctx.stroke();

        ctx.fillStyle = strokeGrad;
        ctx.fill();
      }

      ctx.restore();

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <div className="relative w-full h-full flex items-center justify-center pointer-events-none">
      <canvas
        ref={canvasRef}
        className="w-full h-full max-w-[650px] max-h-[650px] object-contain opacity-90 transition-opacity duration-1000"
      />
    </div>
  );
}
