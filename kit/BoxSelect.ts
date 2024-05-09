import { CanvasKitElement } from "../elements/baseElement";

export const BoxSelectElementId = -2;


export class BoxSelectElement extends CanvasKitElement {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.id = BoxSelectElementId;
  }

  render() {
    const { canvasCtx, kitEvent } = this.kit;
    if (kitEvent.currentElement !== this || this.children.length === 0) {
      this.reset();
      return;
    }
    const { width, height } = this;
    const { x, y } = this.getOffset();
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "black";
    canvasCtx.rect(x, y, width, height);
    canvasCtx.stroke();
  }
}