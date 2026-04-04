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
      // Taper height towards edges (lower at far left and far right)
      const taper = 1 - Math.pow(Math.abs(xs - 0.5) * 2, 2) * 0.8;
      const h = (200 + pr(i * 26) * 450) * Math.max(0.2, taper);
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
      x: pr(i * 4) * 3000,
      y: 100 + pr(i * 8) * 250,
      s: 0.8 + pr(i * 12) * 0.7,
      size: 4 + pr(i * 16) * 4,
      offset: pr(i * 20) * 10
    }));

    return { buildings, clouds, stars, birds };
  }, []);

  const timeRef = useRef(0);
  const vArrRef = useRef<any[]>([]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    let id: number;
    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    resize();

    if (vArrRef.current.length === 0) {
      vArrRef.current = Array.from({ length: 45 }, () => ({ x: Math.random() * 2000, s: 2.8 + Math.random() * 5, w: 28 + Math.random() * 32, h: 14 + Math.random() * 6, color: [`#ff4444`, `#44ff44`, `#ffffff`, `#ffff44`, `#4444ff`][Math.floor(Math.random() * 5)] }));
    }

    const draw = () => {
      timeRef.current += 0.005;
      const t = timeRef.current;
      const { width: w, height: h } = canvas, p = scrollProgress, isN = p > 0.8;
      const isMob = w < 768;
      const mobOff = isMob ? h * 0.1 : 0;

      // 1. SKY GRADIENT (Smooth & Descriptive)
      let skyC1 = '#4db8ff', skyC2 = '#ffffff', sunC = '#fff444', cloudC = '#ffffff';
      if (p < 0.25) { // Dawn
        const tt = p / 0.25;
        skyC1 = '#2b3a67'; skyC2 = '#ffac81'; sunC = '#ffac81'; cloudC = '#ffbeac';
      } else if (p < 0.6) { // Noon
        skyC1 = '#2196F3'; skyC2 = '#90CAF9'; sunC = '#FFF176'; cloudC = '#ffffff';
      } else if (p < 0.85) { // Sunset
        skyC1 = '#ffaa2bff'; skyC2 = '#1e1450'; sunC = '#ff6a00'; cloudC = '#5a1b1b';
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

      // SUN & MOON (Responsive Elliptical Orbit with Dawn Compression)
      const radX = isMob ? w * 0.45 : Math.min(w, h) * 0.92;
      const radY = isMob ? h * 0.55 : Math.min(w, h) * 0.92;
      const anchorY = isMob ? h * 0.85 : h * 1.1;

      // Use a non-linear ease (power function) to shorten both Dawn and Sunset phases
      const pShifted = (p - 0.5) * 2; // Range -1 to 1
      const pCurve = 0.5 + 0.5 * Math.sign(pShifted) * Math.pow(Math.abs(pShifted), 1.25);
      
      const ang = Math.PI + pCurve * Math.PI;
      const sX = (w / 2) + Math.cos(ang) * radX;
      const sY = anchorY + Math.sin(ang) * radY;
      
      // Moon angle offset: high at night (p=1)
      const mAngCurve = ((pCurve + 0.5) % 1);
      const mAng = Math.PI + mAngCurve * Math.PI;
      const mX = (w / 2) + Math.cos(mAng) * radX;
      const mY = anchorY + Math.sin(mAng) * radY;

      // Draw Sun (Only during Day/Sunset)
      if (p <= 0.85) {
        ctx.save();
        ctx.shadowBlur = 60; ctx.shadowColor = sunC;
        ctx.fillStyle = sunC; ctx.beginPath(); ctx.arc(sX, sY, 65, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
      }

      // Draw Moon (Dynamic: Faded at Dawn, Glowing at Night)
      const moonVis = (p < 0.15 || p > 0.75);
      if (moonVis) {
        // Dynamic moon radius: smaller at Dawn (p=0), larger at Night (p=1)
        const mRad = 18 + p * 22; 
        const mOff = document.createElement('canvas'); mOff.width = mRad * 3; mOff.height = mRad * 3;
        const mCtx = mOff.getContext('2d');
        if (mCtx) {
          // Calculate opacity and glow
          let mAlpha = 1, mGlow = 40;
          if (p < 0.15) { // Dawn: Faded
            mAlpha = 0.25; mGlow = 5;
          } else if (p > 0.85) { // Night: Brilliant
            mAlpha = 1.0; mGlow = 70;
          } else { // Intermediate
            mAlpha = 0.6; mGlow = 20;
          }

          ctx.save();
          ctx.globalAlpha = mAlpha;
          ctx.shadowBlur = mGlow; ctx.shadowColor = '#ffffff';
          
          mCtx.fillStyle = '#ffffff';
          mCtx.beginPath(); mCtx.arc(mRad * 1.5, mRad * 1.5, mRad, 0, Math.PI * 2); mCtx.fill();
          mCtx.globalCompositeOperation = 'destination-out';
          mCtx.beginPath(); mCtx.arc(mRad * 1.5 + mRad * 0.4, mRad * 1.5 - mRad * 0.2, mRad, 0, Math.PI * 2); mCtx.fill();
          
          ctx.drawImage(mOff, mX - mRad * 1.5, mY - mRad * 1.5);
          ctx.restore();
        }
      }

      // CLOUDS (Sharp Vector Silhouette, Mobile Scaling)
      ctx.fillStyle = cloudC;
      const cSizeMult = isMob ? 0.2 : 0.5;
      sceneData.clouds.forEach(c => {
        const cx = (c.x + t * 65) % (w + 500) - 250;
        const cw = c.w * cSizeMult;
        // Draw segment cloud
        ctx.beginPath();
        ctx.arc(cx, c.y, cw * 0.4, 0, Math.PI * 2);
        ctx.arc(cx - cw * 0.3, c.y + 10 * cSizeMult, cw * 0.3, 0, Math.PI * 2);
        ctx.arc(cx + cw * 0.3, c.y + 10 * cSizeMult, cw * 0.3, 0, Math.PI * 2);
        ctx.fill();
      });

      // BIRDS
      if (p < 0.85) {
        let birdC = (p < 0.25 || p > 0.6) ? '#ffffff' : '#111111';
        ctx.strokeStyle = birdC; ctx.lineWidth = 1.8;
        sceneData.birds.forEach(b => {
          const bx = (b.x + t * 30 * b.s) % (w + 250) - 125, by = b.y + Math.sin(t * 2 + b.offset) * 20;
          const flap = Math.sin(t * 8 + b.offset) * 15;
          ctx.beginPath(); ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx - b.size, by - b.size - flap, bx - b.size * 2, by - flap / 2);
          ctx.moveTo(bx, by); ctx.quadraticCurveTo(bx + b.size, by - b.size - flap, bx + b.size * 2, by - flap / 2);
          ctx.stroke();
        });
      }

      // BUILDINGS (No Borders, Glow & Mobile Scaling)
      let bkgC = '#1c3d6e';
      if (p < 0.25) {
        const tt = p / 0.25; bkgC = `rgb(${Math.floor(40 + tt * 50)}, ${Math.floor(50 + tt * 50)}, ${Math.floor(100 + tt * 30)})`;
      } else if (p < 0.6) {
        const tt = (p - 0.25) / 0.35; bkgC = `rgb(${Math.floor(90 + tt * 40)}, ${Math.floor(100 + tt * 40)}, ${Math.floor(130 + tt * 40)})`;
      } else if (p < 0.85) {
        const tt = (p - 0.6) / 0.25; bkgC = `rgb(${Math.floor(130 + tt * 50)}, ${Math.floor(140 - tt * 110)}, ${Math.floor(170 - tt * 140)})`;
      } else {
        bkgC = '#050510';
      }

      const winC = isN ? '#fff1a0' : '#87ceeb';
      const reflectC = isN ? 'transparent' : sunC;

      sceneData.buildings.forEach(b => {
        const x = w * b.xs;
        const bH = isMob ? b.h * 0.7 : b.h; // 50% shorter on mobile

        // SHADOW
        if (!isN) {
          ctx.save(); ctx.fillStyle = 'rgba(0,0,0,0.1)';
          const shadLen = (sX - (x + b.w / 2)) * 0.3;
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
            let ch = bH, cw = b.w, cx = x;
            for (let i = 0; i < 6; i++) {
              ctx.fillStyle = bkgC; ctx.fillRect(cx, h - ch + mobOff, cw, ch);
              if (!isN) {
                ctx.fillStyle = reflectC; ctx.globalAlpha = 0.1;
                if (sX < cx + cw / 2) ctx.fillRect(cx, h - ch + mobOff, cw * 0.15, ch); else ctx.fillRect(cx + cw * 0.85, h - ch + mobOff, cw * 0.15, ch);
                ctx.globalAlpha = 1.0;
                if (i === 0) { ctx.fillStyle = '#111'; ctx.fillRect(cx + cw * 0.4, h - 120 + mobOff, cw * 0.2, 20); }
              }
              ch += bH * 0.08; cw *= 0.78; cx += (b.w - cw) / 2;
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
          ctx.beginPath(); ctx.moveTo(x, h + mobOff); ctx.lineTo(x + b.w * 0.4, h - bH + mobOff); ctx.lineTo(x + b.w * 0.6, h - bH + mobOff); ctx.lineTo(x + b.w, h + mobOff); ctx.fill();
          if (!isN) {
            ctx.save(); ctx.beginPath();
            if (sX < x + b.w / 2) { ctx.moveTo(x, h + mobOff); ctx.lineTo(x + b.w * 0.4, h - bH + mobOff); ctx.lineTo(x + b.w * 0.5, h - bH + mobOff); ctx.lineTo(x + b.w * 0.5, h + mobOff); }
            else { ctx.moveTo(x + b.w, h + mobOff); ctx.lineTo(x + b.w * 0.6, h - bH + mobOff); ctx.lineTo(x + b.w * 0.5, h - bH + mobOff); ctx.lineTo(x + b.w * 0.5, h + mobOff); }
            ctx.fillStyle = reflectC; ctx.globalAlpha = 0.1; ctx.fill(); ctx.restore();
          }
          ctx.restore();
        }
      });

      // vArr.forEach((v, i) => {
      //   v.x = (v.x + v.s) % (w + 200);
      //   const vy = h - 70 + (i % 2) * 35;
      //   const isTruck = i % 3 === 0;

      //   // Vehicle Body
      //   ctx.fillStyle = v.color;
      //   if (isTruck) {
      //     ctx.fillRect(v.x - 100, vy, 60, 15); // Container
      //     ctx.fillRect(v.x - 40, vy + 5, 20, 10); // Cabin
      //     ctx.fillStyle = '#111'; // Windows
      //     ctx.fillRect(v.x - 28, vy + 7, 5, 4);
      //     ctx.fillRect(v.x - 90, vy + 15, 8, 8); // Wheels
      //     ctx.fillRect(v.x - 55, vy + 15, 8, 8);
      //     ctx.fillRect(v.x - 35, vy + 15, 8, 8);
      //   } else {
      //     ctx.fillRect(v.x - 50, vy + 5, 30, 8); // Car body
      //     ctx.fillRect(v.x - 42, vy, 15, 6); // Top
      //     ctx.fillStyle = '#111'; // Windows
      //     ctx.fillRect(v.x - 40, vy + 1, 4, 3);
      //     ctx.fillRect(v.x - 33, vy + 1, 4, 3);
      //     ctx.fillRect(v.x - 45, vy + 12, 6, 6); // Wheels
      //     ctx.fillRect(v.x - 28, vy + 12, 6, 6);
      //   }

      //   if (isN) {
      //     ctx.fillStyle = '#fff'; ctx.fillRect(v.x - 5, vy + 8, 8, 3); // Headlights
      //   }
      // });

      id = requestAnimationFrame(draw);
    };
    draw();
    return () => { window.removeEventListener('resize', resize); cancelAnimationFrame(id); };
  }, [scrollProgress, sceneData]);

  return <canvas ref={canvasRef} style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: -1, pointerEvents: 'none' }} />;
};

export default BackgroundCanvas;
