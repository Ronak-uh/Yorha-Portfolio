import React, { useRef, useEffect, useState } from 'react';

export default function HackingMinigame({ onHackSuccess, onHackFail }) {
  const canvasRef = useRef(null);
  const [timeLeft, setTimeLeft] = useState(15);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let isPlaying = true;

    // Game State
    const player = { x: 150, y: 300, angle: 0, radius: 10 };
    const enemy = { x: 150, y: 100, radius: 25, hp: 10, angle: 0 };
    let bullets = [];
    const keys = { w: false, a: false, s: false, d: false };
    let mouse = { x: 150, y: 150 };

    // Controls
    const handleKeyDown = (e) => { keys[e.key.toLowerCase()] = true; };
    const handleKeyUp = (e) => { keys[e.key.toLowerCase()] = false; };
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };
    const handleClick = () => {
      if (!isPlaying) return;
      bullets.push({
        x: player.x,
        y: player.y,
        vx: Math.cos(player.angle) * 8,
        vy: Math.sin(player.angle) * 8,
      });
      // Play your click sound here if desired
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);

    // Timer
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          isPlaying = false;
          onHackFail();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Game Loop
    const render = () => {
      if (!isPlaying) return;

      // Clear Canvas (Nier Beige)
      ctx.fillStyle = '#dad4bb';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Player Movement
      if (keys.w && player.y > 20) player.y -= 3;
      if (keys.s && player.y < canvas.height - 20) player.y += 3;
      if (keys.a && player.x > 20) player.x -= 3;
      if (keys.d && player.x < canvas.width - 20) player.x += 3;

      // Player Aiming
      player.angle = Math.atan2(mouse.y - player.y, mouse.x - player.x);

      // Draw Player (Arrow)
      ctx.save();
      ctx.translate(player.x, player.y);
      ctx.rotate(player.angle);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, 10);
      ctx.lineTo(-10, -10);
      ctx.fill();
      ctx.restore();

      // Enemy logic
      enemy.angle += 0.05;
      
      // Draw Enemy Core
      ctx.save();
      ctx.translate(enemy.x, enemy.y);
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw Enemy Shield (Rotating)
      ctx.rotate(enemy.angle);
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(0, 0, enemy.radius + 15, 0, Math.PI);
      ctx.stroke();
      ctx.restore();

      // Update & Draw Bullets
      for (let i = bullets.length - 1; i >= 0; i--) {
        const b = bullets[i];
        b.x += b.vx;
        b.y += b.vy;

        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.arc(b.x, b.y, 4, 0, Math.PI * 2);
        ctx.fill();

        // Collision with Enemy
        const dist = Math.hypot(b.x - enemy.x, b.y - enemy.y);
        if (dist < enemy.radius + 15) {
          bullets.splice(i, 1);
          enemy.hp -= 1;
          if (enemy.hp <= 0) {
            isPlaying = false;
            onHackSuccess();
          }
        } else if (b.x < 0 || b.x > canvas.width || b.y < 0 || b.y > canvas.height) {
          bullets.splice(i, 1); // Remove off-screen bullets
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
      cancelAnimationFrame(animationFrameId);
      clearInterval(timer);
    };
  }, [onHackSuccess, onHackFail]);

  return (
    <div className="flex flex-col items-center justify-center p-4 border-2 border-black bg-[#dad4bb]">
      <div className="flex justify-between w-full max-w-[300px] mb-2 font-bold uppercase tracking-widest">
        <span>Target: System Core</span>
        <span>Time: 00:{timeLeft.toString().padStart(2, '0')}</span>
      </div>
      <canvas 
        ref={canvasRef} 
        width={300} 
        height={400} 
        className="border-2 border-black cursor-crosshair shadow-lg"
      />
      <p className="mt-4 text-xs font-bold opacity-70 uppercase tracking-widest">
        Use W,A,S,D to move. Click to fire.
      </p>
    </div>
  );
}