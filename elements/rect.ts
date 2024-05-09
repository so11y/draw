import { CanvasKitElement } from "./baseElement";

export class Rect extends CanvasKitElement {


  render() {
    const { width, height } = this;
    const { canvasCtx, } = this.kit;
    const { x, y } = this.getOffset();
    // canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "red";
    canvasCtx.rect(x, y, width, height);
    canvasCtx.stroke();
    // canvasCtx.restore();
  }
}