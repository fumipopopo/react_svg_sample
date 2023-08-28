import React from "react";
import { getCircleX, getCircleY } from "../utils/circle";

interface FanShapedProps {
  cx: number;
  cy: number;
  radius: number;
  radian: number;
}

const FanShaped: React.FC<FanShapedProps> = ({ cx, cy, radius, radian }) => {
  const getSectorPath = (radius: number, radian: number) => {
    // 始点（真ん中）
    var path = "M" + cx + "," + cy;
    // 0分を扇の開始にする
    path += " L" + radius + ",0";
    if (radian < Math.PI * 2) {
      // 60分未満の扇
      path +=
        " A" +
        radius +
        "," +
        radius +
        " 0 " +
        (radian < Math.PI ? 0 : 1) +
        ",1 " +
        getCircleX(radian, radius) +
        "," +
        getCircleY(radian, radius);
    } else if (radian == Math.PI * 2) {
      // 60分の場合は0と同じになってしまうので別処理
      path +=
        " A" + radius + "," + radius + " 0 0,1 " + radius + "," + radius * 2;
      path += " A" + radius + "," + radius + " 0 1,1 " + radius + ",0";
    }
    return path + "z";
  };

  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="white"
        stroke="black"
        strokeWidth={3}
      />
      <path d={getSectorPath(radius, radian)} fill="red" />
      <circle
        cx={radius}
        cy={radius}
        r={radius}
        fill="#00000000"
        stroke="black"
        strokeWidth={3}
      />
    </g>
  );
};

export default FanShaped;
