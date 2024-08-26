/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Canvas from "./components/Canvas";

export default function App() {
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [tool, setTool] = useState("brush");

  return (
    <div>
      {/* ToolBar */}

      <div className="bg-black">
        <button
          className="text-white text-2xl"
          onClick={() => setTool("brush")}
          style={{
            backgroundColor: tool === "brush" ? "blue" : "",
            color: tool === "brush" ? "white" : "black",
          }}
        >
          Brush
        </button>
        <button
          style={{
            backgroundColor: tool === "eraser" ? "blue" : "",
            color: tool === "eraser" ? "white" : "black",
          }}
          onClick={() => setTool("eraser")}
        >
          Eraser
        </button>
        <input
          type="color"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
          }}
          title="Pick a color"
        />
        <div>
          <label>
            <input
              type="range"
              min="1"
              max="50"
              value={brushSize}
              onChange={(e) => {
                setBrushSize(e.target.value);
              }}
            />
          </label>
        </div>
      </div>

      {/* Canvas Area */}
      <div>
        <Canvas color={color} tool={tool} brushSize={brushSize} />
      </div>
    </div>
  );
}
