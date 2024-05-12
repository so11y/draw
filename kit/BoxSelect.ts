import { CanvasKitElement } from "../elements/baseElement";
import { Point, getMovePoint, getSurroundBox } from "../util";

export const BoxSelectElementId = -2;


export class BoxSelectElement extends CanvasKitElement {

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.id = BoxSelectElementId;
  }

  getOffset() {
    const offset = getSurroundBox(this, {
      x: 0,
      y: 0,
      pad: 8
    });
    return offset;
  }

  // move(e: MouseEvent) {
  //   super.move(e);
  // }


  render() {
    const { canvasCtx, kitEvent } = this.kit;
    if (kitEvent.currentElement !== this || this.children.length === 0) {
      this.reset();
      return;
    }
    const { x, y, width, height } = this;
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "black";
    canvasCtx.rect(x, y, width, height);
    canvasCtx.stroke();
  }
}