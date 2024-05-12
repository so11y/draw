import { CanvasKit } from "../canvas";

interface Point {
  x: number;
  y: number;
}
interface PointRect extends Point {
  width: number;
  height: number;
  topRight: number;
  bottomRight: number;
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
    y: offsetY - downPoint.y + originalY
  }
}


export abstract class CanvasKitElement extends EventTarget {
  static id = 0;
  id = CanvasKitElement.id++;
  x: number;
  y: number;
  width: number;
  height: number;
  angle: number = 0;
  children: CanvasKitElement[] = [];
  isMounted = false;
  kit: CanvasKit;
  parentId?: number;
  originalPoint: { x: number, y: number };
  constructor(x: number, y: number, width: number, height: number) {
    super();
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.originalPoint = { x, y };
  }

  beforeMount(kit: CanvasKit) {
    kit.elementMap.set(this.id, this);
    this.isMounted = true;
    this.kit = kit;
  }

  getOffset(point: { x: number, y: number, width: number, height: number } = this) {
    const { y, x, width, height } = point;
    return {
      x,
      y,
      topLeft: x,
      topRight: x + width,
      bottomLeft: x + height,
      bottomRight: y + height,
      width, height,
      center: {
        x: x + width / 2,
        y: y + height / 2
      }
    };
  }

  abstract render(kit: CanvasKit): void | false;

  renderTemplate(kit: CanvasKit) {
    const { canvasCtx, } = this.kit;
    canvasCtx.save();
    this.rotateCenter(this.angle,);
    const result = this.render(kit);
    canvasCtx.restore();
    return result
  }

  draw(kit: CanvasKit) {
    this.beforeMount(kit);
    const isBreak = this.renderTemplate(kit);
    if (isBreak === false) {
      return
    }
    this.children.forEach((child) => {
      child.parentId = this.id;
      child.draw(kit)
    });
  }


  inspectPointRect(e: { offsetX: number, offsetY: number }) {
    const { x, y } = this.getOffset();
    const { offsetX, offsetY } = e;
    return offsetX > x && offsetX < x + this.width && offsetY > y && offsetY < y + this.height;
  }


  inspectRect(diffEle: CanvasKitElement) {
    let source = getRectOfPoints(rectToPoints(this));
    let target = getRectOfPoints(rectToPoints(diffEle));
    return !(
      source.x > target.topRight ||
      source.topRight < target.x ||
      source.bottomRight < target.y ||
      source.y > target.bottomRight
    );
  }

  move(e: MouseEvent) {
    const { x, y } = getMovePoint(this, e);
    this.x = x;
    this.y = y;
  }

  addEventListener(type: string, callback: EventListener, options?: boolean | AddEventListenerOptions | undefined): void {
    super.addEventListener(type, (e) => {
      let isStop = false
      e.stopPropagation = () => {
        isStop = true
      }
      callback(e);
      if (isStop) {
        return;
      }
      if (this.parentId) {
        this.kit.elementMap.get(this.parentId)?.dispatchEvent(e)
      }
    }, options);
  }

  rotateCenter(angle: number,) {
    if (angle) {
      const { canvasCtx } = this.kit;
      const { width, height, x, y } = this;
      canvasCtx.translate(x + 0.5 * width, y + 0.5 * height)
      canvasCtx.rotate(angle * Math.PI / 180,)
      canvasCtx.translate(-(x + 0.5 * width), -(y + 0.5 * height))
    }
  }

  isControl() {
    return false
  }

  reset() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.originalPoint = { x: 0, y: 0 };
    this.children = []
  }
}