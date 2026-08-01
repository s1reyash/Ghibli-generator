import React, { useEffect, useRef } from 'react';

interface Petal {
  x: number;
  y: number;
  size: number;
  rotation: number;
  rotationSpeed: number;
  speedX: number;
  speedY: number;
  opacity: number;
}

interface Firefly {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  pulseSpeed: number;
  vx: number;
  vy: number;
}

interface CursorTrail {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
}

export const DualAtmosphereBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // 1. Sakura Petals
    const petals: Petal[] = [];
    const petalCount = 28;
    for (let i = 0; i < petalCount; i++) {
      petals.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 6 + 4,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.03,
        speedX: Math.random() * 0.6 + 0.2,
        speedY: Math.random() * 0.8 + 0.4,
        opacity: Math.random() * 0.6 + 0.3,
      });
    }

    // 2. Spirit Fireflies
    const fireflies: Firefly[] = [];
    const fireflyCount = 20;
    const colors = ['#F59E0B', '#10B981', '#38BDF8', '#F472B6'];
    for (let i = 0; i < fireflyCount; i++) {
      fireflies.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.7 + 0.2,
        pulseSpeed: Math.random() * 0.03 + 0.01,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4 - 0.1,
      });
    }

    // 3. Cursor Trail
    const cursorTrails: CursorTrail[] = [];
    const handleMouseMove = (e: MouseEvent) => {
      for (let i = 0; i < 2; i++) {
        cursorTrails.push({
          x: e.clientX + (Math.random() - 0.5) * 10,
          y: e.clientY + (Math.random() - 0.5) * 10,
          radius: Math.random() * 3 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.4,
          maxLife: 35,
          life: 0,
        });
      }
    };
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Render Cursor Trails
      for (let i = cursorTrails.length - 1; i >= 0; i--) {
        const ct = cursorTrails[i];
        ct.life++;
        const ratio = ct.life / ct.maxLife;
        const alpha = Math.max(0, ct.alpha * (1 - ratio));

        if (ct.life >= ct.maxLife) {
          cursorTrails.splice(i, 1);
          continue;
        }

        ctx.beginPath();
        const grad = ctx.createRadialGradient(ct.x, ct.y, 0, ct.x, ct.y, ct.radius * 3);
        grad.addColorStop(0, ct.color + Math.floor(alpha * 255).toString(16).padStart(2, '0'));
        grad.addColorStop(1, ct.color + '00');
        ctx.fillStyle = grad;
        ctx.arc(ct.x, ct.y, ct.radius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      // Render Fireflies
      fireflies.forEach(f => {
        f.x += f.vx;
        f.y += f.vy;

        if (f.x < 0) f.x = width;
        if (f.x > width) f.x = 0;
        if (f.y < 0) f.y = height;
        if (f.y > height) f.y = 0;

        f.alpha += Math.sin(Date.now() * f.pulseSpeed) * 0.015;
        f.alpha = Math.max(0.15, Math.min(0.85, f.alpha));

        ctx.beginPath();
        const grad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, f.radius * 4);
        grad.addColorStop(0, `${f.color}${Math.floor(f.alpha * 255).toString(16).padStart(2, '0')}`);
        grad.addColorStop(1, `${f.color}00`);
        ctx.fillStyle = grad;
        ctx.arc(f.x, f.y, f.radius * 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // Render Sakura Petals
      petals.forEach(p => {
        p.x += p.speedX;
        p.y += p.speedY;
        p.rotation += p.rotationSpeed;

        if (p.x > width + 20) p.x = -20;
        if (p.y > height + 20) p.y = -20;

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        ctx.fillStyle = `rgba(244, 114, 182, ${p.opacity})`;

        // Draw soft petal shape
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(p.size, -p.size, p.size * 2, p.size / 2, 0, p.size * 2);
        ctx.bezierCurveTo(-p.size * 2, p.size / 2, -p.size, -p.size, 0, 0);
        ctx.fill();
        ctx.restore();
      });

      animFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-60"
    />
  );
};
