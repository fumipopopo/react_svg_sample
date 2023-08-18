import "./styles.css";
import Node from "./components/Node";
import Timer from "./components/Timer";
import { useState } from "react";

export default function App() {
  const [positionSVG, setPositionSVG] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const newX = e.clientX;
    const newY = e.clientY;
    setPositionSVG({ x: newX, y: newY });
  };

  return (
    <div className="App">
      <h1>Hello CodeSandbox</h1>
      <h2>test svg</h2>
      <div>
        <Timer x={50} y={50} label="A" minutes={0} />
        <Timer x={50} y={50} label="A" minutes={15} />
        <Timer x={50} y={50} label="A" minutes={30} />
        <Timer x={50} y={50} label="A" minutes={45} />
        <Timer x={50} y={50} label="A" minutes={60} />
        <Timer x={50} y={50} label="A" minutes={61} />
        <Node x={100} y={100} label="B" />
      </div>
    </div>
  );
}
