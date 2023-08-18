import React, { useState, useRef } from "react";

interface TimerProps {
  x: number;
  y: number;
  label: string;
  minutes: number;
}

const Timer: React.FC<TimerProps> = ({ x, y, label, minutes }) => {
  const [position, setPosition] = useState({ x, y });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const radius = 100;
  const degree = minutes * 6;
  const radian = degree * (Math.PI / 180);
  const sectorPath = getSectorPath(radius, minutes);

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
        if (newX < 0) newX = 0;
        if (newY < 0) newY = 0;
        //TODO: 以下はオブジェクト1つ分はみ出ているので、オブジェクトのサイズ分マイナスする必要がある。
        if (newX > svgRect.width) newX = svgRect.width;
        if (newY > svgRect.height) newY = svgRect.height;
        setPosition({ x: newX, y: newY });
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <svg
      ref={svgRef}
      width="200"
      height="200"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <text>{minutes}</text>
      <text x={position.x} y={position.y + 35} textAnchor="middle" fill="black">
        {label}
      </text>
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill="white"
        stroke="black"
        strokeWidth={3}
      />
      {/* <path d="M200,200 L200,0 A200,200 0 0,1 400,200z" fill="red" /> */}
      <path d={sectorPath} fill="blue" />
      <rect
        x={position.x}
        y={position.y}
        width={20}
        height={20}
        rx={10}
        ry={10}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      />
      <text x={position.x} y={position.y + 50} textAnchor="middle" fill="black">
        {position.x}/{position.y}
      </text>
    </svg>
  );
};

export default Timer;

function getSectorPath(radius: number, minutes: number) {
  const degree = minutes * 6;
  const radian = degree * (Math.PI / 180);
  // 始点（真ん中）
  var path = "M" + radius + "," + radius;
  // 0分を扇の開始にする
  path += " L" + radius + ",0";
  if (minutes < 60) {
    // 60分未満の扇
    path +=
      " A" +
      radius +
      "," +
      radius +
      " 0 " +
      (minutes < 30 ? 0 : 1) +
      ",1 " +
      (radius + getCircleX(radian, radius)) +
      "," +
      (radius - getCircleY(radian, radius));
  } else if (minutes == 60) {
    // 60分の場合は0と同じになってしまうので別処理
    path +=
      " A" + radius + "," + radius + " 0 0,1 " + radius + "," + radius * 2;
    path += " A" + radius + "," + radius + " 0 1,1 " + radius + ",0";
  }
  return path + "z";
}

function getCircleY(radians: number, radius: number) {
  return Math.cos(radians) * radius;
}

function getCircleX(radians: number, radius: number) {
  return Math.sin(radians) * radius;
}
