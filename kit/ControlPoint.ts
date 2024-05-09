import { CanvasKitElement, getMovePoint } from "../elements/baseElement";



export class ControlPoint extends CanvasKitElement {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.addEventListener("click", (e) => {
      e.preventDefault();
    })
  }

  move(e: MouseEvent) {
    const { x, y } = getMovePoint(this, e);
    const x2 = this.originalPoint.x;
    const y2 = this.originalPoint.y
    const v = this.kit.elements.find(e => e.id > 0)!;
    const angle = Math.atan2(y2 - y, x2 - x) * 180 / Math.PI;
    v.angle = angle;
  }

  render() {
    const { canvasCtx, } = this.kit;
    const { x, y } = this.getOffset();
    canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "black";
    canvasCtx.rect(x, y, 10, 10);
    canvasCtx.stroke();
    canvasCtx.restore();
  }

}