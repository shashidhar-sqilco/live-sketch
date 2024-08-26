import React, { useEffect, useRef, useState } from "react";
import io from "socket.io-client";

export default function Canvas({ color, brushSize, tool }) {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState(null);
  const socketRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    const context = canvas.getContext("2d");
    setCtx(context);

    // Connect to Socket.io server
    socketRef.current = io.connect("http://localhost:5000");

    // Handle drawing data from other users
    socketRef.current.on("draw", handleDrawData);

    socketRef.current.on("clear", () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
    });

    // Handling drawing history for new users
    socketRef.current.on("drawingHistory", (history) => {
      history.forEach(handleDrawData);
    });

    return () => {
      socketRef.current.off("draw", handleDrawData);
      socketRef.current.off("clear");
      socketRef.current.off("drawingHistory");
      socketRef.current.disconnect();
    };
  }, []);

  const handleDrawData = ({ x, y, color, brushSize, tool }) => {
    if (!ctx) return;

    if (tool === "eraser") {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    if (isDrawing) {
      setIsDrawing(false);
      ctx.beginPath();
      socketRef.current.emit("draw", { type: "end" });
    }
  };

  const draw = (e) => {
    if (!isDrawing) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const drawData = { x, y, color, brushSize, tool };

    if (tool === "eraser") {
      ctx.clearRect(x - brushSize / 2, y - brushSize / 2, brushSize, brushSize);
    } else {
      ctx.lineWidth = brushSize;
      ctx.lineCap = "round";
      ctx.strokeStyle = color;
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }

    socketRef.current.emit("draw", drawData);
  };

  const clearCanvas = () => {
    if (ctx) {
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      socketRef.current.emit("clear");
    }
  };

  return (
    <div>
      <canvas
        id="canvas"
        width="800"
        height="600"
        style={{
          border: "1px solid black",
        }}
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseUp={stopDrawing}
        onMouseOut={stopDrawing}
        onMouseMove={draw}
      ></canvas>
      <button onClick={clearCanvas}>Clear Canvas</button>
    </div>
  );
}
