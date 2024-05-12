import { CanvasKitElement } from "../elements/baseElement";
import { BoxSelectElement, BoxSelectElementId } from "./BoxSelect";

export const ElementSelectId = -1;

export class ElementSelect extends CanvasKitElement {

  isSelect = false;

  constructor(x: number, y: number, width: number, height: number) {
    super(x, y, width, height);
    this.id = ElementSelectId;
  }

  render() {
    const { canvasCtx, elements } = this.kit;
    if (!this.isSelect) {
      return;
    }
    const crossElement = elements.filter((element) => element.id > 0)
      .filter(element => this.inspectRect(element));
    const { width, height } = this;
    const { x, y } = this.getOffset();
    canvasCtx.save();
    canvasCtx.beginPath();
    canvasCtx.strokeStyle = "black";
    canvasCtx.rect(x - 2, y - 2, width + 2, height + 2);
    canvasCtx.stroke();
    canvasCtx.restore();
    this.children = crossElement;
    return false
  }

  inspectPointRect(e: MouseEvent): boolean {
    const { kitEvent } = this.kit
    if (!kitEvent.currentInTap) {
      return false;
    }
    if (kitEvent.currentElement === this) {
      return true;
    }
    return super.inspectPointRect(e);
  }

  move(e: MouseEvent) {
    const { kitEvent } = this.kit;
    const downPoint = kitEvent.downPoint!
    const { offsetX, offsetY } = e;
    this.width = offsetX - downPoint.x;
    this.height = offsetY - downPoint.y;
  }

  getOffset() {
    const { kitEvent } = this.kit
    const { x, y } = kitEvent.downPoint!
    const { width, height } = this;
    return super.getOffset({
      x,
      y,
      width,
      height
    })
  }


  reset() {

    const { kitEvent, elementMap } = this.kit
    const { x, y } = this.getOffset();
    kitEvent.currentElement = elementMap.get(BoxSelectElementId)!;
    kitEvent.currentElement.width = this.width;
    kitEvent.currentElement.height = this.height;
    kitEvent.currentElement.x = x;
    kitEvent.currentElement.y = y;
    kitEvent.currentElement.originalPoint = { x, y };
    kitEvent.currentElement.children = this.children;

    super.reset();
    this.isSelect = false;
  }
}