import React, { useState, useRef } from "react";
import FanShaped from "./FanShaped";
import { minutesToRadian, getCircleX, getCircleY } from "../utils/circle";

interface TimerProps {
  radius: number;
  minutes: number;
}

const Timer: React.FC<TimerProps> = ({ radius, minutes }) => {
  const draggSize = 20;
  if (minutes < 0) {
    minutes = 0;
  }
  if (minutes > 60) {
    minutes = 60;
  }
  const [position, setPosition] = useState({
    x: getCircleX(minutesToRadian(minutes), radius) - draggSize / 2,
    y: getCircleY(minutesToRadian(minutes), radius) - draggSize / 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  // TODO: minutesの初期値が0の場合、ここが微妙
  const calcRadian =
    Math.atan2(
      radius - (position.x + draggSize / 2),
      position.y + draggSize / 2 - radius
    ) + Math.PI;
  const calcDegree = calcRadian / (Math.PI / 180);
  minutes = Math.round(calcDegree / 6);

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
        var newX = e.pageX - dragOffset.x - svgRect.left;
        var newY = e.pageY - dragOffset.y - svgRect.top;
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // TODO: ここで丸の位置を戻す
  };

  return (
    <svg
      ref={svgRef}
      width={radius * 2}
      height={radius * 2}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <text>{minutes}</text>
      <FanShaped
        cx={radius}
        cy={radius}
        radius={radius}
        radian={minutesToRadian(minutes)}
      />
      <rect
        x={position.x}
        y={position.y}
        width={draggSize}
        height={draggSize}
        rx={draggSize / 2}
        ry={draggSize / 2}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
    </svg>
  );
};

export default Timer;
