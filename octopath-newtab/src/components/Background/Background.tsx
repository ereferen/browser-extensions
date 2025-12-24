import { useEffect, useRef } from 'react';
import styles from './Background.module.css';

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  fadeSpeed: number;
}

export function Background() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animationRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const createParticle = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.3,
      speedY: -Math.random() * 0.5 - 0.1,
      opacity: Math.random() * 0.5 + 0.2,
      fadeSpeed: Math.random() * 0.005 + 0.002,
    });

    const initParticles = () => {
      particlesRef.current = Array.from({ length: 50 }, createParticle);
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesRef.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.speedX;
        particle.y += particle.speedY;

        // Fade effect
        particle.opacity -= particle.fadeSpeed;

        // Reset particle if it's too faded or out of bounds
        if (particle.opacity <= 0 || particle.y < 0) {
          particlesRef.current[index] = createParticle();
          particlesRef.current[index].y = canvas.height + 10;
          particlesRef.current[index].opacity = 0;
        }

        // Fade in new particles
        if (particlesRef.current[index].opacity < 0.5 && particle.y < canvas.height) {
          particlesRef.current[index].opacity += 0.01;
        }

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${particle.opacity})`;
        ctx.fill();

        // Add glow effect
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size * 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(201, 162, 39, ${particle.opacity * 0.3})`;
        ctx.fill();
      });

      animationRef.current = requestAnimationFrame(animate);
    };

    resizeCanvas();
    initParticles();
    animate();

    window.addEventListener('resize', resizeCanvas);

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return (
    <div className={styles.background}>
      {/* Base gradient layer */}
      <div className={styles.gradientLayer} />

      {/* Pixel art pattern overlay */}
      <div className={styles.patternLayer} />

      {/* Light particles canvas */}
      <canvas ref={canvasRef} className={styles.particlesCanvas} />

      {/* Vignette overlay */}
      <div className={styles.vignetteLayer} />
    </div>
  );
}
