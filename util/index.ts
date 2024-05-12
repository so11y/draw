import { CanvasKitElement } from "../elements/baseElement";


export interface Point {
  x: number;
  y: number;
}
export interface PointRect extends Point {
  width: number;
  height: number;
  topRight: number;
  bottomRight: number;
}

export interface PointRectOffset extends PointRect {
  center: Point;
  topLeft: number;
  bottomLeft: number;
}

export function getRectOfPoints(points: Point[]): PointRect {
  let x = Infinity;
  let y = Infinity;
  let topRight = -Infinity;
  let bottomRight = -Infinity;

  points?.forEach((item) => {
    if (!isFinite(item.x) || !isFinite(item.y)) {
      return;
    }
    x = Math.min(x, item.x);
    y = Math.min(y, item.y);
    topRight = Math.max(topRight, item.x);
    bottomRight = Math.max(bottomRight, item.y);
  });
  return { x, y, topRight, bottomRight, width: topRight - x, height: bottomRight - y };
}

export function rotatePoint(pt: Point, angle: number, center: Point) {
  if (!angle || angle % 360 === 0) {
    return;
  }
  const a = (angle * Math.PI) / 180;
  const x =
    (pt.x - center.x) * Math.cos(a) -
    (pt.y - center.y) * Math.sin(a) +
    center.x;
  const y =
    (pt.x - center.x) * Math.sin(a) +
    (pt.y - center.y) * Math.cos(a) +
    center.y;
  pt.x = x;
  pt.y = y;
}

export function rectToPoints(rect: CanvasKitElement) {
  const { x, y, topRight, bottomRight, center } = rect.getOffset();
  const pts = [
    { x, y },
    { x: topRight, y },
    { x: topRight, y: bottomRight },
    { x, y: bottomRight },
  ];

  if (rect.angle) {
    pts.forEach((pt) => {
      rotatePoint(pt, rect.angle, center);
    });
  }
  return pts;
}

export function getMovePoint(element: CanvasKitElement, e: MouseEvent) {
  const { kitEvent } = element.kit;
  const downPoint = kitEvent.downPoint!
  const { offsetX, offsetY } = e;
  const { x: originalX, y: originalY } = element.originalPoint;
  return {
    x: offsetX - downPoint.x + originalX,
    y: offsetY - downPoint.y + originalY,
  }
}

export function getSurroundBox(element: CanvasKitElement, options?: Point & { pad: number }): PointRectOffset {

  let { pad, x: moveX, y: moveY } = Object.assign({ pad: 0, x: 0, y: 0 }, options)

  const children = element.children;

  const point: any = {
    x: Infinity,
    y: Infinity,
    topRight: -Infinity,
    bottomRight: -Infinity,
    center: { x: 0, y: 0 }
  };

  const walk = (element: CanvasKitElement) => {
    const { x, y, topRight, bottomRight } = element.getOffset();
    point.x = Math.min(point.x, x);
    point.y = Math.min(point.y, y);
    point.topRight = Math.max(point.topRight, topRight);
    point.bottomRight = Math.max(point.bottomRight, bottomRight);
    if (element.children.length > 0) {
      element.children.forEach(walk)
    }
  }
  children.forEach(walk)
  point.x = point.x + moveX - pad / 2;
  point.y = point.y + moveY - pad / 2;
  point.topRight += moveX + pad / 2;
  point.bottomRight += moveY + pad / 2;
  point.center = {
    x: point.x + (point.topRight - point.x) / 2,
    y: point.y + (point.bottomRight - point.y) / 2
  }
  point.topLeft = point.x;
  point.bottomLeft = point.y + point.height;

  point.width = point.topRight - point.x;
  point.height = point.bottomRight - point.y;


  return point as any;
}