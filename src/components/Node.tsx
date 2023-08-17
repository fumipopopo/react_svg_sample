import React, { useState, useRef } from "react";

interface NodeProps {
  x: number;
  y: number;
  label: string;
}

const Node: React.FC<NodeProps> = ({ x, y, label }) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const handleMouseDown = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    setIsDragging(true);
    // ドラッグ開始時のマウス位置からノード位置へのオフセットを計算
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (isDragging) {
      // ドラッグ中のマウス位置を取得し、オフセットを考慮して新しい位置を計算
      if (svgRef && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        const newX = e.pageX - dragOffset.x - svgRect.left;
        const newY = e.pageY - dragOffset.y - svgRect.top;
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <svg ref={svgRef} width="1240" height="1754">
      <rect
        x={position.x}
        y={position.y}
        width={20}
        height={20}
        rx={10}
        ry={10}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseUp}
        onMouseUp={handleMouseUp}
      />
      <text x={position.x} y={position.y + 35} textAnchor="middle" fill="black">
        {label}
      </text>
      <text x={position.x} y={position.y + 50} textAnchor="middle" fill="black">
        {position.x}/{position.y}
      </text>
    </svg>
  );
};

export default Node;
