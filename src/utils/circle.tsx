
export function minutesToRadian(minutes: number) {
  const degree = minutes * 6;
  const radian = degree * (Math.PI / 180);
  return radian;
}

export function getCircleY(radians: number, radius: number) {
  return radius - Math.cos(radians) * radius;
}

export function getCircleX(radians: number, radius: number) {
  return radius + Math.sin(radians) * radius;
}
