import React, { useEffect, useRef } from 'react';

interface SceneAnimationDeckProps {
  sceneNumber: 1 | 2 | 3;
  weather: string;
  timeOfDay: string;
}

export const SceneAnimationDeck: React.FC<SceneAnimationDeckProps> = ({
  sceneNumber,
  weather,
  timeOfDay,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 360);
    let height = (canvas.height = 150);

    const isSunset = timeOfDay.toLowerCase().includes('sunset') || timeOfDay.toLowerCase().includes('golden');
    const isRain = weather.toLowerCase().includes('rain');

    // Clouds
    const clouds = [
      { x: 10, y: 25, r: 25, speed: 0.15 },
      { x: 140, y: 20, r: 35, speed: 0.12 },
      { x: 260, y: 30, r: 20, speed: 0.18 },
    ];

    // Fireflies / Spores
    const spores: { x: number; y: number; r: number; alpha: number; speedY: number }[] = [];
    for (let i = 0; i < 18; i++) {
      spores.push({
        x: Math.random() * width,
        y: Math.random() * height,
        r: Math.random() * 2 + 1,
        alpha: Math.random() * 0.7 + 0.3,
        speedY: Math.random() * 0.4 + 0.1,
      });
    }

    // Raindrops if rain weather
    const raindrops: { x: number; y: number; speed: number }[] = [];
    if (isRain) {
      for (let i = 0; i < 35; i++) {
        raindrops.push({
          x: Math.random() * width,
          y: Math.random() * height,
          speed: Math.random() * 5 + 4,
        });
      }
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Sky Gradient (Ghibli Watercolor Sky)
      const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
      if (isSunset) {
        skyGrad.addColorStop(0, '#7C2D12'); // Amber terracotta
        skyGrad.addColorStop(0.5, '#EA580C');
        skyGrad.addColorStop(1, '#FEF08A');
      } else {
        skyGrad.addColorStop(0, '#0F172A'); // Deep twilight slate
        skyGrad.addColorStop(0.6, '#1E3A8A');
        skyGrad.addColorStop(1, '#38BDF8');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, width, height);

      // 2. Rolling Green Ghibli Hills
      ctx.fillStyle = '#15803D'; // Deep moss green
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.25, height - 40, width * 0.5, height - 20);
      ctx.quadraticCurveTo(width * 0.75, height, width, height - 30);
      ctx.lineTo(width, height);
      ctx.fill();

      ctx.fillStyle = '#22C55E'; // Foreground bright grass green
      ctx.beginPath();
      ctx.moveTo(0, height);
      ctx.quadraticCurveTo(width * 0.3, height - 15, width * 0.6, height - 35);
      ctx.quadraticCurveTo(width * 0.85, height - 10, width, height - 15);
      ctx.lineTo(width, height);
      ctx.fill();

      // 3. Moving Clouds
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      clouds.forEach(c => {
        c.x += c.speed;
        if (c.x - c.r > width) c.x = -c.r;

        ctx.beginPath();
        ctx.arc(c.x, c.y, c.r, 0, Math.PI * 2);
        ctx.arc(c.x + 15, c.y - 10, c.r * 0.8, 0, Math.PI * 2);
        ctx.arc(c.x + 30, c.y, c.r * 0.7, 0, Math.PI * 2);
        ctx.fill();
      });

      // 4. Center Flickering Golden Lantern Light
      const lanternX = width * 0.5;
      const lanternY = height * 0.65;
      const glowR = 35 + Math.sin(Date.now() * 0.006) * 5;
      const glowGrad = ctx.createRadialGradient(lanternX, lanternY, 0, lanternX, lanternY, glowR * 2.5);
      glowGrad.addColorStop(0, 'rgba(253, 224, 71, 0.6)');
      glowGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.3)');
      glowGrad.addColorStop(1, 'rgba(245, 158, 11, 0)');
      ctx.fillStyle = glowGrad;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, glowR * 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Lantern Core Light Dot
      ctx.fillStyle = '#FEF08A';
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, 4, 0, Math.PI * 2);
      ctx.fill();

      // 5. Raindrops if raining
      if (isRain) {
        ctx.strokeStyle = 'rgba(224, 242, 254, 0.6)';
        ctx.lineWidth = 1.2;
        raindrops.forEach(r => {
          r.y += r.speed;
          if (r.y > height) r.y = 0;
          ctx.beginPath();
          ctx.moveTo(r.x, r.y);
          ctx.lineTo(r.x - 2, r.y + 10);
          ctx.stroke();
        });
      }

      // 6. Floating Spirit Spores / Fireflies
      spores.forEach(s => {
        s.y -= s.speedY;
        if (s.y < 0) s.y = height;

        ctx.beginPath();
        ctx.fillStyle = `rgba(254, 240, 138, ${s.alpha})`;
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // 7. Header Badge Overlay
      ctx.fillStyle = '#FFFFFF';
      ctx.font = '700 11px sans-serif';
      ctx.fillText(`LIVE SCENE 0${sceneNumber} STORYBOARD PREVIEW`, 14, 22);

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [sceneNumber, weather, timeOfDay]);

  return (
    <div className="w-full h-[150px] rounded-2xl overflow-hidden shadow-md relative border border-[#E2E0D8] my-3">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute bottom-2.5 right-3 text-[10px] text-amber-100 font-mono font-bold tracking-wider bg-slate-900/70 px-2.5 py-1 rounded-lg backdrop-blur-xs border border-white/10">
        {weather || 'Clear'} • {timeOfDay || 'Golden Hour'}
      </div>
    </div>
  );
};
