import { useEffect, useRef } from 'react';

export default function Fireworks() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    
    // Support high DPI displays
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
    };
    window.addEventListener('resize', handleResize);

    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      life: number;
      maxLife: number;
      color: string;
      size: number;
      friction: number;
      gravity: number;
      alpha: number;

      constructor(x: number, y: number, color: string, isSpark: boolean = false) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * (isSpark ? 8 : 4) + 1;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;
        
        this.life = 0;
        this.maxLife = Math.random() * 50 + (isSpark ? 80 : 50);
        this.color = color;
        this.size = Math.random() * (isSpark ? 1 : 2) + 0.5;
        this.friction = 0.96;
        this.gravity = 0.05;
        this.alpha = 1;
      }

      update() {
        this.vx *= this.friction;
        this.vy *= this.friction;
        this.vy += this.gravity;
        this.x += this.vx;
        this.y += this.vy;
        this.life++;
        this.alpha = Math.max(0, 1 - this.life / this.maxLife);
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        
        // Add a nice glow effect to particles
        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;
        
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    class Rocket {
      x: number;
      y: number;
      vy: number;
      color: string;
      exploded: boolean;
      targetY: number;

      constructor() {
        this.x = width * 0.1 + Math.random() * (width * 0.8);
        this.y = height + 10;
        
        // Make sure it explodes in the top portion of the screen (top 5% to 35%)
        // This ensures the login form doesn't block the fireworks, especially on tall mobile screens
        this.targetY = height * 0.05 + Math.random() * (height * 0.3);
        
        // Calculate initial velocity required to reach the target height against gravity (0.05)
        const distance = this.y - this.targetY;
        this.vy = -Math.sqrt(2 * 0.05 * distance) - (Math.random() * 1.5); 
        
        this.color = ['#2563EB', '#60A5FA', '#FFFFFF', '#3B82F6', '#93C5FD'][Math.floor(Math.random() * 5)];
        this.exploded = false;
      }

      update() {
        this.y += this.vy;
        // Gravity effect naturally slows down the rocket
        this.vy += 0.05;
        
        if (this.y <= this.targetY || this.vy >= -1) {
          this.exploded = true;
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.exploded) return;
        ctx.save();
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tail
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255, 255, 255, 0.4)`;
        ctx.lineWidth = 1;
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(this.x, this.y - this.vy * 3);
        ctx.stroke();
        
        ctx.restore();
      }
    }

    class AmbientParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      targetAlpha: number;
      
      constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5 - 0.2; // slight upward drift
        this.size = Math.random() * 2 + 0.5;
        this.color = ['#2563EB', '#60A5FA', '#FFFFFF', '#3B82F6'][Math.floor(Math.random() * 4)];
        this.alpha = 0;
        this.targetAlpha = Math.random() * 0.5 + 0.1;
      }
      
      update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Appear/disappear slowly
        if (this.alpha < this.targetAlpha) {
          this.alpha += 0.005;
        }
        
        // Wrap around
        if (this.y < -10) this.y = height + 10;
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
      }
      
      draw(ctx: CanvasRenderingContext2D) {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.fillStyle = this.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }
    }

    let rockets: Rocket[] = [];
    let particles: Particle[] = [];
    let ambientParticles: AmbientParticle[] = Array.from({ length: 40 }, () => new AmbientParticle());
    let animationFrameId: number;

    const animate = () => {
      // Create trailing effect by filling with semi-transparent background
      ctx.fillStyle = 'rgba(3, 7, 18, 0.15)'; 
      ctx.fillRect(0, 0, width, height);
      
      // Update ambient particles
      ambientParticles.forEach(ap => {
        ap.update();
        ap.draw(ctx);
      });

      // Randomly launch rockets
      if (Math.random() < (width < 768 ? 0.02 : 0.04)) {
        rockets.push(new Rocket());
      }

      // Update rockets backward to safely remove them
      for (let i = rockets.length - 1; i >= 0; i--) {
        let rocket = rockets[i];
        rocket.update();
        rocket.draw(ctx);

        if (rocket.exploded) {
          const isMobile = width < 768;
          const particleCount = isMobile ? 30 : 60;
          const sparkCount = isMobile ? 10 : 20;

          // Explode
          for (let j = 0; j < particleCount; j++) {
            particles.push(new Particle(rocket.x, rocket.y, rocket.color, false));
          }
          // Extra bright sparks
          for (let j = 0; j < sparkCount; j++) {
             particles.push(new Particle(rocket.x, rocket.y, '#FFFFFF', true));
          }
          rockets.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particles.length - 1; i >= 0; i--) {
        let particle = particles[i];
        particle.update();
        particle.draw(ctx);

        if (particle.life >= particle.maxLife) {
          particles.splice(i, 1);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
    />
  );
}
