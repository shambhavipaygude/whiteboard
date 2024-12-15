"use client";
import { useEffect, useRef, useState } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:4000'); 

// Function to create a room


// Function to join an existing room
const joinRoom = () => {
  const roomId = prompt("Enter the room ID to join");
  if (roomId) {
    socket.emit('join-room', roomId);
    return roomId;
  }
};

interface WhiteboardProps {
  roomId: string;
}

const Whiteboard = ({ roomId }: WhiteboardProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawing, setDrawing] = useState<boolean>(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');

    if (!ctx) return;

    const draw = (e: MouseEvent) => {
      if (!drawing) return;
      if (!canvas) return;

      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.strokeStyle = 'black';

      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);

      // Emit the drawing data along with room ID
      socket.emit('canvas-data', { x, y, color: 'black' }, roomId);
    };

    const startDrawing = () => {
      setDrawing(true);
    };

    const stopDrawing = () => {
      setDrawing(false);
      ctx.beginPath();
    };

    canvas?.addEventListener('mousedown', startDrawing);
    canvas?.addEventListener('mouseup', stopDrawing);
    canvas?.addEventListener('mousemove', draw);

    // Listen for incoming drawing data in the specified room
    socket.on('canvas-data', (data: { x: number; y: number }) => {
      const { x, y } = data;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    });

    return () => {
      canvas?.removeEventListener('mousedown', startDrawing);
      canvas?.removeEventListener('mouseup', stopDrawing);
      canvas?.removeEventListener('mousemove', draw);
      socket.off('canvas-data');
    };
  }, [drawing, roomId]);

  return (
    <div>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        style={{ border: '1px solid black', display: 'block', margin: '0 auto' }}
      />
    </div>
  );
};

export default Whiteboard;
