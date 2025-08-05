import React, { useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { Command } from "../types";

interface DrawingCanvasProps {
  commands: Command[];
  style?: React.CSSProperties;
}

const DrawingCanvas = forwardRef<HTMLCanvasElement, DrawingCanvasProps>(({ commands, style }, ref) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // מאפשרים ל-DrawingBot לגשת ל-ref של הקנבס
  useImperativeHandle(ref, () => canvasRef.current as HTMLCanvasElement);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // ניקוי הקנבס לפני ציור חדש
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    commands.forEach((cmd) => {
      ctx.strokeStyle = cmd.color;
      ctx.fillStyle = cmd.color;
      ctx.lineWidth = cmd.strokeWidth ?? 2;

      switch (cmd.type) {
        case "circle":
          ctx.beginPath();
          ctx.arc(cmd.x, cmd.y, cmd.radius ?? 20, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
          break;

        case "rectangle":
          ctx.beginPath();
          ctx.rect(cmd.x, cmd.y, cmd.width ?? 50, cmd.height ?? 50);
          ctx.fill();
          ctx.stroke();
          break;

        case "line":
          ctx.beginPath();
          ctx.moveTo(cmd.x, cmd.y);
          ctx.lineTo(cmd.x2 ?? cmd.x, cmd.y2 ?? cmd.y);
          ctx.stroke();
          break;

        case "triangle":
          ctx.beginPath();
          ctx.moveTo(cmd.x, cmd.y);
          ctx.lineTo(cmd.x + (cmd.width ?? 40) / 2, cmd.y + (cmd.height ?? 40));
          ctx.lineTo(cmd.x - (cmd.width ?? 40) / 2, cmd.y + (cmd.height ?? 40));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
          break;

        default:
          console.warn("Unknown command type:", cmd.type);
      }
    });
  }, [commands]);

  return (
    <canvas
      ref={canvasRef}
      width={800}
      height={600}
      style={{ border: "1px solid #ccc", backgroundColor: "#fff", ...style }}
    />
  );
});

export default DrawingCanvas;
