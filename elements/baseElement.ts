import { CanvasKit } from "../canvas";

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

  getOffset() {
    const { y, x, width, height } = this;
    return {
      x,
      y,
      topLeft: x,
      topRight: x + width,
      bottomLeft: x + height,
      bottomRight: y + height,
      width, height
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
    const { x, y } = this.getOffset();
    const { x: diffX, y: diffY, width: diffWidth, height: diffHeight } = diffEle.getOffset();
    return x < diffX + diffWidth && x + this.width > diffX && y < diffY + diffHeight && y + this.height > diffY;
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

  reset() {
    this.width = 0;
    this.height = 0;
    this.x = 0;
    this.y = 0;
    this.originalPoint = { x: 0, y: 0 };
    this.children = []
  }
}