import React, { useState, useRef, useEffect } from "react";
import FanShaped from "./FanShaped";
import { minutesToRadian, getCircleX, getCircleY } from "../utils/circle";

interface TimerProps {
  radius: number;
  initialtime: number;
  timeunit: number; // second=1, minutes=60, hour=360
}

const Timer: React.FC<TimerProps> = ({ radius, initialtime, timeunit }) => {
  const intervalId = useRef<NodeJS.Timer | null>(null);
  const draggSize = 16;
  if (initialtime < 0) {
    initialtime = 0;
  }
  if (timeunit == 1 || timeunit == 60) {
    if (initialtime > 60) {
      initialtime = 60;
    }
  } else {
    if (initialtime > 24) {
      initialtime = 24;
    }
  }
  const [time, setTime] = useState(initialtime * timeunit);

  // タイマーのカウントを-1する関数
  const countDecrement = () => {
    setTime((t) => (t <= 0 ? 0 : t - 1));
  };

  const setupFunc = () => {
    if (intervalId.current !== null) {
      return;
    }
    intervalId.current = setInterval(countDecrement, 1000);

    return () => {
      console.log("clean up");
    };
  };

  useEffect(setupFunc, []);

  // タイマーを止める関数countStopを定義
  const countStop = () => {
    // タイマーを停止する
    if (intervalId.current) {
      clearInterval(intervalId.current);
    }
    intervalId.current = null;

    // タイマーを止めた時のカウントを保持する
    setTime(time);
  };

  // タイマーを再開
  const countStart = () => {
    if (intervalId.current !== null) {
      return;
    }
    intervalId.current = setInterval(countDecrement, 1000);

    console.log(intervalId);
  };

  const [position, setPosition] = useState({
    x: getCircleX(minutesToRadian(initialtime), radius) - draggSize / 2,
    y: getCircleY(minutesToRadian(initialtime), radius) - draggSize / 2,
  });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const t = time / timeunit;
    if (!isDragging) {
      setPosition({
        x: getCircleX(minutesToRadian(t), radius) - draggSize / 2,
        y: getCircleY(minutesToRadian(t), radius) - draggSize / 2,
      });
    }
    if (time <= 0) {
      countStop();
    }
  }, [time]);

  const handleMouseDown = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    setIsDragging(true);
    // ドラッグ開始時のマウス位置からノード位置へのオフセットを計算
    const rect = e.currentTarget.getBoundingClientRect();
    setDragOffset({
      x: e.pageX - rect.left,
      y: e.pageY - rect.top,
    });
    countStop();
  };

  const handleMouseMove = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    if (isDragging) {
      // ドラッグ中のマウス位置を取得し、オフセットを考慮して新しい位置を計算
      if (svgRef && svgRef.current) {
        const svgRect = svgRef.current.getBoundingClientRect();
        var newX = e.pageX - dragOffset.x - svgRect.left;
        var newY = e.pageY - dragOffset.y - svgRect.top;
        setPosition({ x: newX, y: newY });
        const calcRadian =
          Math.atan2(
            radius - (position.x + draggSize / 2),
            position.y + draggSize / 2 - radius
          ) + Math.PI;
        const calcDegree = calcRadian / (Math.PI / 180);
        setTime(Math.round(calcDegree / 6) * timeunit);
      }
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    countStart();
    // ここで丸の位置を戻す
    setPosition({
      x: getCircleX(minutesToRadian(time / timeunit), radius) - draggSize / 2,
      y: getCircleY(minutesToRadian(time / timeunit), radius) - draggSize / 2,
    });
  };

  return (
    <svg
      ref={svgRef}
      width={radius * 2}
      height={radius * 2}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseUp}
    >
      <text>{time}</text>
      <FanShaped
        cx={radius}
        cy={radius}
        radius={radius}
        radian={minutesToRadian(time / timeunit)}
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
