import React, { useEffect, useRef, useState, useMemo } from 'react';

const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(Math.max(window.scrollY / h, 0), 1);
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const sceneData = useMemo(() => {
    const pr = (s: number) => {
      const x = Math.sin(s) * 10000;
      return x - Math.floor(x);
    };

    const buildings = Array.from({ length: 32 }, (_, i) => {
      const xs = (i / 32);
      const w = 50 + pr(i * 13) * 100;
      const h = 200 + pr(i * 26) * 450;
      const style = pr(i * 39) > 0.85 ? 'landmark' : (pr(i * 52) > 0.82 ? 'bitexco' : 'flat');
      
      const windows: { x: number, y: number }[] = [];
      const stepX = 12, stepY = 20;
      for (let ix = 10; ix < w - 10; ix += stepX) {
        for (let iy = 25; iy < h - 40; iy += stepY) {
          if (pr(ix + iy * 2000 + i) > 0.5) windows.push({ x: ix, y: iy });
        }
      }
      return { xs, w, h, style, windows };
    });

    const clouds = Array.from({ length: 12 }, (_, i) => ({
      x: pr(i * 9) * 2500,
      y: 60 + pr(i * 18) * 350,
      s: 0.12 + pr(i * 27) * 0.2,
      w: 150 + pr(i * 36) * 180,
      h: 60 + pr(i * 45) * 40
    }));

    const stars = Array.from({ length: 300 }, (_, i) => ({
      x: pr(i * 7) * 4000,
      y: pr(i * 14) * 1200,
      r: 0.5 + pr(i * 21) * 1.5
    }));

    const birds = Array.from({ length: 10 }, (_, i) => ({
      x: pr(i * 8) * 3000,
      y: 100 + pr(i * 16) * 250,
      s: 0.8 + pr(i * 24) * 0.7,
      size: 8 + pr(i * 32) * 8,
      offset: pr(i * 40) * 10
    }));

    return { buildings, clouds, stars, birds };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let id: number, time = 0;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    const vArr = Array.from({ length: 45 }, () => ({ x: Math.random() * 2000, s: 2.8 + Math.random() * 5, w: 28 + Math.random() * 32, h: 14 + Math.random() * 6, color: [`#ff4444`, `#44ff44`, `#ffffff`, `#ffff44`, `#4444ff`][Math.floor(Math.random() * 5)] }));

    const draw = () => {
      time += 0.005;
      const { width: w, height: h } = canvas, p = scrollProgress, isN = p > 0.8;

      // 1. SKY GRADIENT (Smooth & Descriptive)
      let skyC1 = '#4db8ff', skyC2 = '#ffffff', sunC = '#fff444', cloudC = '#ffffff';
      if (p < 0.25) { // Dawn
        const t = p / 0.25;
        skyC1 = '#2b3a67'; skyC2 = '#ffac81'; sunC = '#ffac81'; cloudC = '#ffbeac'; 
      } else if (p < 0.6) { // Noon
        skyC1 = '#2196F3'; skyC2 = '#90CAF9'; sunC = '#FFF176'; cloudC = '#ffffff'; 
      } else if (p < 0.85) { // Sunset
        skyC1 = '#ff4b2b'; skyC2 = '#1e1450'; sunC = '#ff6a00'; cloudC = '#5a1b1b'; 
      } else { // Night
        skyC1 = '#050a1b'; skyC2 = '#000000'; sunC = '#ffffff'; cloudC = '#1a1a4a'; 
      }
      
      const skyGrad = ctx.createLinearGradient(0, 0, 0, h);
      skyGrad.addColorStop(0, skyC1); skyGrad.addColorStop(1, skyC2);
      ctx.fillStyle = skyGrad; ctx.fillRect(0, 0, w, h);

      // STARS
      if (p > 0.75) {
        ctx.fillStyle = '#ffffff';
        sceneData.stars.forEach(s => { ctx.beginPath(); ctx.arc(s.x % w, s.y, s.r, 0, Math.PI * 2); ctx.fill(); });
      }

      // SUN/MOON (Blazing Shadow Glow, No Border)
      const ang = Math.PI + p * Math.PI, rad = Math.min(w, h) * 0.92;
      const sX = (w/2) + Math.cos(ang) * rad, sY = (h*0.95) + Math.sin(ang) * rad;
      if (p <= 0.85) {
        ctx.save();
        ctx.shadowBlur = 60; ctx.shadowColor = sunC;
        ctx.fillStyle = sunC; ctx.beginPath(); ctx.arc(sX, sY, 65, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      } else {
        ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(w * 0.85, h * 0.15, 40, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = skyC1; ctx.beginPath(); ctx.arc(w * 0.85 + 20, h * 0.15 - 5, 40, 0, Math.PI * 2); ctx.fill();
      }

      // CLOUDS
      ctx.fillStyle = cloudC;
      sceneData.clouds.forEach(c => {
        const cx = (c.x + time * 65) % (w + 500) - 250;
        ctx.beginPath();
        ctx.arc(cx, c.y, c.w * 0.4, 0, Math.PI * 2);
        ctx.arc(cx - c.w * 0.3, c.y + 10, c.w * 0.3, 0, Math.PI * 2);
        ctx.arc(cx + c.w * 0.3, c.y + 10, c.w * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // BIRDS
      if (p < 0.8) {
        ctx.strokeStyle = (p > 0.6) ? '#fff' : '#111'; ctx.lineWidth = 1.8;
        sceneData.birds.forEach(b => {
          const bx = (b.x + time * 30 * b.s) % (w + 250) - 125, by = b.y + Math.sin(time * 2 + b.offset) * 20;
          const flap = Math.sin(time * 8 + b.offset) * 15;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - b.size, by - b.size - flap, bx - b.size * 2, by - flap/2);
          ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + b.size, by - b.size - flap, bx + b.size * 2, by - flap/2);
          ctx.stroke();
        });
      }

      // BUILDINGS (No Borders, Glow & Mobile Scaling)
      let bkgC = '#1c3d6e'; 
      if (p < 0.25) { 
        const t = p / 0.25; bkgC = `rgb(${Math.floor(40+t*50)}, ${Math.floor(50+t*50)}, ${Math.floor(100+t*30)})`;
      } else if (p < 0.6) { 
        const t = (p - 0.25) / 0.35; bkgC = `rgb(${Math.floor(90+t*40)}, ${Math.floor(100+t*40)}, ${Math.floor(130+t*40)})`;
      } else if (p < 0.85) { 
        const t = (p - 0.6) / 0.25; bkgC = `rgb(${Math.floor(130+t*50)}, ${Math.floor(140-t*110)}, ${Math.floor(170-t*140)})`;
      } else { 
        bkgC = '#050510';
      }

      const winC = isN ? '#fff1a0' : '#87ceeb';
      const reflectC = isN ? 'transparent' : sunC;
      const isMob = w < 768; 
      const mobOff = isMob ? h * 0.1 : 0; // Small Y offset
      
      sceneData.buildings.forEach(b => {
        const x = w * b.xs;
        const bH = isMob ? b.h * 0.5 : b.h; // 50% shorter on mobile
        
        // SHADOW
        if (!isN) {
          ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.1)';
          const shadLen = (sX - (x + b.w/2)) * 0.3;
          ctx.beginPath(); ctx.moveTo(x, h - 80 + mobOff); ctx.lineTo(x + b.w, h - 80 + mobOff);
          ctx.lineTo(x + b.w - shadLen, h - 20 + mobOff); ctx.lineTo(x - shadLen, h - 20 + mobOff);
          ctx.fill(); ctx.restore();
        }

        // MAIN STRUCTURE
        ctx.save();
        ctx.fillStyle = bkgC;
        ctx.shadowBlur = isN ? 25 : 15; 
        ctx.shadowColor = isN ? 'rgba(77,184,255,0.5)' : 'rgba(0,0,0,0.2)';

        const drawY = h - bH + mobOff;

        if (b.style === 'flat' || b.style === 'landmark') {
          if (b.style === 'flat') {
            ctx.fillRect(x, drawY, b.w, bH);
            if (!isN) {
              const hWidth = b.w * 0.12; ctx.fillStyle = reflectC; ctx.globalAlpha = 0.2;
              if (sX < x + b.w / 2) ctx.fillRect(x, drawY, hWidth, bH); else ctx.fillRect(x + b.w - hWidth, drawY, hWidth, bH);
              ctx.globalAlpha = 1.0;
              ctx.fillStyle = '#111'; ctx.fillRect(x + b.w * 0.4, h - 120 + mobOff, b.w * 0.2, 20); 
            }
          } else {
            let ch=bH, cw=b.w, cx=x;
            for(let i=0; i<6; i++){ 
              ctx.fillStyle = bkgC; ctx.fillRect(cx, h - ch + mobOff, cw, ch); 
              if (!isN) {
                ctx.fillStyle = reflectC; ctx.globalAlpha = 0.1;
                if (sX < cx + cw / 2) ctx.fillRect(cx, h - ch + mobOff, cw * 0.15, ch); else ctx.fillRect(cx + cw * 0.85, h - ch + mobOff, cw * 0.15, ch);
                ctx.globalAlpha = 1.0;
                if (i === 0) { ctx.fillStyle = '#111'; ctx.fillRect(cx + cw * 0.4, h - 120 + mobOff, cw * 0.2, 20); }
              }
              ch+=bH*0.08; cw*=0.78; cx+=(b.w-cw)/2; 
            }
          }
          ctx.restore();
          // Windows
          ctx.fillStyle = winC;
          if (isN) { ctx.shadowBlur = 8; ctx.shadowColor = winC; }
          b.windows.forEach(win => {
             const wy = drawY + (win.y / b.h) * bH; // Scaled window Y
             ctx.fillRect(x + win.x, wy, 2.5, 4.5);
          });
          ctx.shadowBlur = 0;
        } else if (b.style === 'bitexco') {
          ctx.beginPath(); ctx.moveTo(x, h + mobOff); ctx.lineTo(x+b.w*0.4, h-bH+mobOff); ctx.lineTo(x+b.w*0.6, h-bH+mobOff); ctx.lineTo(x+b.w, h+mobOff); ctx.fill();
          if (!isN) {
            ctx.save(); ctx.beginPath();
            if (sX < x + b.w / 2) { ctx.moveTo(x, h + mobOff); ctx.lineTo(x+b.w*0.4, h-bH+mobOff); ctx.lineTo(x+b.w*0.5, h-bH+mobOff); ctx.lineTo(x+b.w*0.5, h+mobOff); }
            else { ctx.moveTo(x+b.w, h+mobOff); ctx.lineTo(x+b.w*0.6, h-bH+mobOff); ctx.lineTo(x+b.w*0.5, h-bH+mobOff); ctx.lineTo(x+b.w*0.5, h+mobOff); }
            ctx.fillStyle = reflectC; ctx.globalAlpha = 0.1; ctx.fill(); ctx.restore();
          }
          ctx.restore();
        }
      });

      // ROAD & TRAFFIC
      ctx.fillStyle = '#1e5a2d'; ctx.fillRect(0, h - 120, w, 40);
      ctx.fillStyle = '#222'; ctx.fillRect(0, h - 80, w, 80);
      // Road Divider
      ctx.setLineDash([20, 30]); ctx.strokeStyle = 'rgba(255,255,255,0.3)'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, h-40); ctx.lineTo(w, h-40); ctx.stroke(); ctx.setLineDash([]);

      vArr.forEach((v, i) => {
        v.x = (v.x + v.s) % (w + 200);
        const vy = h - 70 + (i % 2) * 35;
        const isTruck = i % 3 === 0;

        // Vehicle Body
        ctx.fillStyle = v.color;
        if (isTruck) {
           ctx.fillRect(v.x - 100, vy, 60, 15); // Container
           ctx.fillRect(v.x - 40, vy + 5, 20, 10); // Cabin
           ctx.fillStyle = '#111'; // Windows
           ctx.fillRect(v.x - 28, vy + 7, 5, 4);
           ctx.fillRect(v.x - 90, vy + 15, 8, 8); // Wheels
           ctx.fillRect(v.x - 55, vy + 15, 8, 8);
           ctx.fillRect(v.x - 35, vy + 15, 8, 8);
        } else {
           ctx.fillRect(v.x - 50, vy + 5, 30, 8); // Car body
           ctx.fillRect(v.x - 42, vy, 15, 6); // Top
           ctx.fillStyle = '#111'; // Windows
           ctx.fillRect(v.x - 40, vy + 1, 4, 3);
           ctx.fillRect(v.x - 33, vy + 1, 4, 3);
           ctx.fillRect(v.x - 45, vy + 12, 6, 6); // Wheels
           ctx.fillRect(v.x - 28, vy + 12, 6, 6);
        }

        if (isN) {
          ctx.fillStyle = '#fff'; ctx.fillRect(v.x - 5, vy + 8, 8, 3); // Headlights
        }
      });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
  }, [scrollProgress, sceneData]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }} />;
};

export default BackgroundCanvas;
