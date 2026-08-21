import { useEffect, useRef } from 'react';

export type WaveState = 'idle' | 'listening' | 'submitting' | 'analyzing' | 'transitioning' | 'results';

interface CanvasSiriWaveProps {
  state: WaveState;
  activity: number;
}

export function CanvasSiriWave({ state, activity }: CanvasSiriWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef(state);
  const activityRef = useRef(activity);

  useEffect(() => {
    stateRef.current = state;
    activityRef.current = activity;
  }, [state, activity]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let reqId: number;
    let phase = 0;

    let currentAmp = 48;
    let currentSpeed = 1.0;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };
    window.addEventListener('resize', resize);
    resize();

    const waves = [
      { color: 'rgba(192, 132, 252, 0.58)', speed: 0.035, shift: 0, freq: 3.1, ampMult: 1.05 },    // Lavender
      { color: 'rgba(59, 130, 246, 0.52)', speed: 0.048, shift: 2.1, freq: 2.7, ampMult: 0.95 },   // Royal Blue
      { color: 'rgba(56, 189, 248, 0.52)', speed: 0.062, shift: 4.2, freq: 3.5, ampMult: 0.88 },   // Cyan
      { color: 'rgba(168, 85, 247, 0.45)', speed: 0.028, shift: 1.2, freq: 2.3, ampMult: 1.12 },   // Purple
    ];

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);

      const currentState = stateRef.current;
      const currentActivity = activityRef.current;

      const isGenerating = currentState === 'analyzing' || currentState === 'submitting';
      const isTyping = currentState === 'listening';

      let targetAmp = 48;
      if (isTyping) targetAmp = 62 + (currentActivity * 22);
      if (isGenerating) targetAmp = 115;
      currentAmp += (targetAmp - currentAmp) * 0.06;

      let targetSpeed = 1.0;
      if (isTyping) targetSpeed = 1.4;
      if (isGenerating) targetSpeed = 4.0; // 4x speed when analyzing
      currentSpeed += (targetSpeed - currentSpeed) * 0.05;

      waves.forEach((wave) => {
        ctx.beginPath();

        for (let i = 0; i <= w; i += 3) {
          const x = (i / w) * 4 - 2;
          const attenuation = Math.exp(-Math.pow(x, 2));
          const y = Math.sin(x * wave.freq + phase * wave.speed + wave.shift) * currentAmp * wave.ampMult * attenuation;
          ctx.lineTo(i, h / 2 + y);
        }

        for (let i = w; i >= 0; i -= 3) {
          const x = (i / w) * 4 - 2;
          const attenuation = Math.exp(-Math.pow(x, 2));
          const y = Math.sin(x * wave.freq + phase * wave.speed + wave.shift) * currentAmp * wave.ampMult * attenuation;
          ctx.lineTo(i, h / 2 - y);
        }

        ctx.closePath();
        ctx.fillStyle = wave.color;
        ctx.fill();
      });

      phase += currentSpeed;
      reqId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(reqId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div
      style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '84%',
        height: '432px',
        zIndex: 0,
        pointerEvents: 'none',
        mixBlendMode: 'multiply',
        opacity: state === 'results' ? 0.2 : 0.88,
        transition: 'opacity 0.5s ease',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
}
