import React, { useEffect, useRef } from 'react';
import { TelemetryEngine } from '@/app/services/telemetry/telemetry-engine';

export interface OscilloscopeProps {
  type?: 'ECG' | 'PPG';
  height?: number;
  label?: string;
  lead?: string;
  sweepSpeed?: number;
  color?: string;
  className?: string;
}

export const Oscilloscope: React.FC<OscilloscopeProps> = ({
  type = 'ECG',
  height = 90,
  label = 'LEAD II · ECG',
  lead = '0.05 - 150 Hz',
  sweepSpeed = 1,
  color = '#00f0ff',
  className = ''
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let sweepX = 0;
    const telemetry = TelemetryEngine.getInstance();
    let lastTime = performance.now();

    const resize = () => {
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * (window.devicePixelRatio || 1);
      canvas.height = height * (window.devicePixelRatio || 1);
      ctx.scale(window.devicePixelRatio || 1, window.devicePixelRatio || 1);
    };
    resize();
    window.addEventListener('resize', resize);

    const historyPoints: number[] = [];
    const maxPoints = 500;

    const render = (time: number) => {
      const dt = (time - lastTime) / 1000;
      lastTime = time;

      const rect = canvas.getBoundingClientRect();
      const w = rect.width;
      const h = height;

      // Generate next waveform slice
      const points = type === 'ECG' 
        ? telemetry.generateECGPoints(4, time / 1000)
        : telemetry.generatePPGPoints(4, time / 1000);

      points.forEach(p => {
        historyPoints.push(p.voltage);
        if (historyPoints.length > maxPoints) {
          historyPoints.shift();
        }
      });

      // Clear with slight dark persistence
      ctx.fillStyle = '#050a15';
      ctx.fillRect(0, 0, w, h);

      // Draw subtle technical grid
      ctx.strokeStyle = '#0e2238';
      ctx.lineWidth = 1;
      const gridSize = 16;
      ctx.beginPath();
      for (let x = 0; x < w; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
      }
      for (let y = 0; y < h; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
      }
      ctx.stroke();

      // Center baseline
      const midY = h * 0.58;
      ctx.strokeStyle = '#183858';
      ctx.beginPath();
      ctx.moveTo(0, midY);
      ctx.lineTo(w, midY);
      ctx.stroke();

      // Render waveform curve
      if (historyPoints.length > 2) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.6;
        ctx.shadowColor = color;
        ctx.shadowBlur = 6;
        ctx.beginPath();

        const step = w / maxPoints;
        for (let i = 0; i < historyPoints.length; i++) {
          const x = i * step;
          const v = historyPoints[i];
          const y = type === 'ECG' ? midY - v * 28 : midY - v * 32 + 16;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.stroke();
        ctx.shadowBlur = 0;

        // Current leading edge head dot
        const currentIdx = historyPoints.length - 1;
        const headX = currentIdx * step;
        const headY = type === 'ECG'
          ? midY - historyPoints[currentIdx] * 28
          : midY - historyPoints[currentIdx] * 32 + 16;

        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.arc(headX, headY, 2.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationId = requestAnimationFrame(render);
    };

    animationId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [type, height, sweepSpeed, color]);

  return (
    <div className={`relative bg-[#050a15] border border-slate-800 rounded-none overflow-hidden ${className}`}>
      <div className="absolute top-1.5 left-2 flex items-center gap-2 z-10 pointer-events-none">
        <span className="font-mono text-[10px] font-bold tracking-wider text-cyan-400 uppercase">
          {label}
        </span>
        <span className="font-mono text-[9px] text-slate-400">
          [{lead}]
        </span>
      </div>
      <div className="absolute top-1.5 right-2 flex items-center gap-1.5 z-10 pointer-events-none">
        <span className="w-1.5 h-1.5 bg-emerald-400 rounded-none animate-ping" />
        <span className="font-mono text-[9px] text-emerald-400 uppercase tracking-widest font-semibold">
          ACTIVE
        </span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: `${height}px`, display: 'block' }}
      />
    </div>
  );
};
