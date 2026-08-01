import React, { useEffect, useRef } from 'react';

interface TrailParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  alpha: number;
  maxLife: number;
  life: number;
  vx: number;
  vy: number;
}

export const MouseZenBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles: TrailParticle[] = [];
    const colors = ['#4A6B5D', '#D97706', '#38BDF8', '#818CF8', '#34D399'];

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Spawn 2 soft trailing zen particles on mouse move
      for (let i = 0; i < 2; i++) {
        particles.push({
          x: e.clientX + (Math.random() - 0.5) * 8,
          y: e.clientY + (Math.random() - 0.5) * 8,
          radius: Math.random() * 4 + 2,
          color: colors[Math.floor(Math.random() * colors.length)],
          alpha: 0.45,
          maxLife: 40 + Math.random() * 20,
          life: 0,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6 - 0.2,
        });
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('mousemove', handleMouseMove);

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        p.life++;
        p.x += p.vx;
        p.y += p.vy;

        const lifeRatio = p.life / p.maxLife;
        const currentAlpha = Math.max(0, p.alpha * (1 - lifeRatio));
        const currentRadius = p.radius * (1 + lifeRatio * 1.5);

        if (p.life >= p.maxLife) {
          particles.splice(i, 1);
          continue;
        }

        // Draw soft glowing zen aura
        ctx.beginPath();
        const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, currentRadius * 3);
        gradient.addColorStop(0, p.color + Math.floor(currentAlpha * 255).toString(16).padStart(2, '0'));
        gradient.addColorStop(1, p.color + '00');
        ctx.fillStyle = gradient;
        ctx.arc(p.x, p.y, currentRadius * 3, 0, Math.PI * 2);
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-70"
    />
  );
};
