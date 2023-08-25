import React, { useState, useRef } from "react";

interface TimerProps {
  radius: number;
  minutes: number;
}

const Timer: React.FC<TimerProps> = ({ radius, minutes }) => {
  const draggSize = 20;
  const [position, setPosition] = useState({
    x: getCircleX(minutesToRadian(minutes), radius) - draggSize / 2,
    y: getCircleY(minutesToRadian(minutes), radius) - draggSize / 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  const calcRadian =
    Math.atan2(
      radius - (position.x + draggSize / 2),
      position.y + draggSize / 2 - radius
    ) + Math.PI;
  const calcDegree = calcRadian / (Math.PI / 180);
  minutes = Math.round(calcDegree / 6);

  const getSectorPath = (radius: number, minutes: number) => {
    const radian = minutesToRadian(minutes);
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
        getCircleX(radian, radius) +
        "," +
        getCircleY(radian, radius);
    } else if (minutes == 60) {
      // 60分の場合は0と同じになってしまうので別処理
      path +=
        " A" + radius + "," + radius + " 0 0,1 " + radius + "," + radius * 2;
      path += " A" + radius + "," + radius + " 0 1,1 " + radius + ",0";
    }
    return path + "z";
  };

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
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill="white"
        stroke="black"
        strokeWidth={3}
      />
      <path d={getSectorPath(radius, minutes)} fill="red" />
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill="#00000000"
        stroke="black"
        strokeWidth={3}
      />
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
    </svg>
  );
};

export default Timer;

function minutesToRadian(minutes: number) {
  const degree = minutes * 6;
  const radian = degree * (Math.PI / 180);
  return radian;
}

function getCircleY(radians: number, radius: number) {
  return radius - Math.cos(radians) * radius;
}

function getCircleX(radians: number, radius: number) {
  return radius + Math.sin(radians) * radius;
}
