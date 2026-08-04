/**
 * useCanvasRenderer.ts – Canvas render loop manager
 *
 * Handles requestAnimationFrame lifecycle with automatic cleanup.
 * Supports offscreen canvas for performance.
 */

import { useEffect, useRef, useCallback } from 'react';

type DrawFn = (ctx: CanvasRenderingContext2D, width: number, height: number, frame: number) => void;

interface CanvasRendererOptions {
  /** Reference to the canvas element */
  canvasRef: React.RefObject<HTMLCanvasElement | null>;
  /** Draw function called each animation frame */
  draw: DrawFn;
  /** Whether to use device pixel ratio for sharp rendering */
  hiDpi?: boolean;
}

export const useCanvasRenderer = ({ canvasRef, draw, hiDpi = true }: CanvasRendererOptions) => {
  const animRef = useRef(0);
  const frameRef = useRef(0);

  const resize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const dpr = hiDpi ? window.devicePixelRatio : 1;
    const w = parent.clientWidth;
    const h = parent.clientHeight;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
  }, [canvasRef, hiDpi]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    resize();
    window.addEventListener('resize', resize);

    const loop = () => {
      const parent = canvas.parentElement;
      if (!parent) return;

      const w = parent.clientWidth;
      const h = parent.clientHeight;

      ctx.clearRect(0, 0, w, h);
      draw(ctx, w, h, frameRef.current);
      frameRef.current++;
      animRef.current = requestAnimationFrame(loop);
    };

    loop();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animRef.current);
    };
  }, [canvasRef, draw, resize]);
};
