import { useEffect, useRef, useCallback } from 'react';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';

const KONAMI = [
  'ArrowUp', 'ArrowUp',
  'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight',
  'ArrowLeft', 'ArrowRight',
  'b', 'a',
];

function triggerConfetti() {
  const count = 80;
  const colors = ['#00D4FF', '#9D4EDD', '#FF006E', '#E8913A', '#00F5D4', '#F72585'];

  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    const size = Math.random() * 8 + 4;
    const color = colors[Math.floor(Math.random() * colors.length)];
    const startX = window.innerWidth / 2;
    const startY = window.innerHeight / 2;

    el.style.cssText = `
      position: fixed;
      left: ${startX}px;
      top: ${startY}px;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
      pointer-events: none;
      z-index: 99999;
      box-shadow: 0 0 6px ${color};
    `;
    document.body.appendChild(el);

    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * 300 + 100;
    const vx = Math.cos(angle) * velocity;
    const vy = Math.sin(angle) * velocity;
    const gravity = 400;
    const drag = 0.96;

    let x = 0;
    let y = 0;
    let velX = vx;
    let velY = vy;
    let opacity = 1;
    let startTime: number | null = null;
    const duration = Math.random() * 1200 + 800;

    const animate = (ts: number) => {
      if (!startTime) startTime = ts;
      const elapsed = ts - startTime;
      if (elapsed > duration) {
        el.remove();
        return;
      }

      velX *= drag;
      velY *= drag;
      velY += (gravity * elapsed) / 1000 * 0.016;
      x += velX * 0.016;
      y += velY * 0.016;
      opacity = 1 - elapsed / duration;

      el.style.transform = `translate(${x}px, ${y}px) rotate(${elapsed * 0.5}deg)`;
      el.style.opacity = String(opacity);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }
}

export function useEasterEggs() {
  const { setUnlockMatrix, setUnlockRainbow, unlockMatrix, unlockRainbow } = useTheme();
  const { success: toastSuccess } = useToast();
  const bufferRef = useRef<string[]>([]);

  const triggerKonami = useCallback(() => {
    triggerConfetti();

    const newMatrix = !unlockMatrix;
    const newRainbow = !unlockRainbow;

    setUnlockMatrix(true);
    setUnlockRainbow(true);

    if (newMatrix || newRainbow) {
      toastSuccess('Secret themes unlocked! Check the theme toggle.');
    } else {
      toastSuccess('Konami code activated!');
    }
  }, [setUnlockMatrix, setUnlockRainbow, unlockMatrix, unlockRainbow, toastSuccess]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      bufferRef.current.push(e.key);
      if (bufferRef.current.length > KONAMI.length) {
        bufferRef.current = bufferRef.current.slice(-KONAMI.length);
      }

      if (bufferRef.current.join(',') === KONAMI.join(',')) {
        bufferRef.current = [];
        triggerKonami();
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [triggerKonami]);
}
