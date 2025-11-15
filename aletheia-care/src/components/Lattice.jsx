import React, { useEffect, useRef } from "react";

export default function Lattice() {
  const canvasRef = useRef(null);
  const animationFrameRef = useRef(null);
  const nodesRef = useRef([]);
  const connectionsRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const width = canvas.width = canvas.offsetWidth;
    const height = canvas.height = 400;

    // Create nodes (lattice points)
    const nodeCount = 20;
    const nodes = [];
    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: 3 + Math.random() * 2,
      });
    }
    nodesRef.current = nodes;

    // Create connections based on proximity
    const updateConnections = () => {
      const connections = [];
      const maxDistance = 150;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDistance) {
            connections.push({
              from: i,
              to: j,
              distance: dist,
              strength: 1 - dist / maxDistance,
            });
          }
        }
      }
      connectionsRef.current = connections;
    };

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Update node positions (with boundary bounce)
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > width) node.vx *= -1;
        if (node.y < 0 || node.y > height) node.vy *= -1;
        node.x = Math.max(0, Math.min(width, node.x));
        node.y = Math.max(0, Math.min(height, node.y));
      });

      // Update connections
      updateConnections();

      // Draw connections (lattice edges)
      connectionsRef.current.forEach((conn) => {
        const from = nodes[conn.from];
        const to = nodes[conn.to];
        const alpha = conn.strength * 0.3;
        
        // Gradient from red/orange to yellow (flame colors)
        const gradient = ctx.createLinearGradient(from.x, from.y, to.x, to.y);
        gradient.addColorStop(0, `rgba(239, 68, 68, ${alpha})`);
        gradient.addColorStop(0.5, `rgba(249, 115, 22, ${alpha})`);
        gradient.addColorStop(1, `rgba(234, 179, 8, ${alpha})`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(from.x, from.y);
        ctx.lineTo(to.x, to.y);
        ctx.stroke();
      });

      // Draw nodes (lattice points)
      nodes.forEach((node) => {
        const gradient = ctx.createRadialGradient(
          node.x, node.y, 0,
          node.x, node.y, node.radius
        );
        gradient.addColorStop(0, "rgba(234, 179, 8, 0.9)");
        gradient.addColorStop(0.5, "rgba(249, 115, 22, 0.6)");
        gradient.addColorStop(1, "rgba(239, 68, 68, 0.3)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        className="w-full rounded border border-slate-700 bg-slate-900/50"
        style={{ height: "400px" }}
      />
      <div className="absolute bottom-2 left-2 text-xs text-gray-500">
        Lattice: Breaking recursion • Reducing entropy
      </div>
    </div>
  );
}
