import { CanvasKit } from "../canvas";
import { CanvasKitElement } from "../elements/baseElement";
import { BoxSelectElementId } from "./BoxSelect";
import { ElementSelect, ElementSelectId } from "./select";

export class KitEvent {
  currentElement: CanvasKitElement | null;
  currentInTap = false;
  downPoint: { x: number, y: number } | null = null;
  constructor(kit: CanvasKit) {
    const { canvasElement, elementMap } = kit;

    canvasElement.addEventListener("mousemove", (e) => {
      if (this.currentInTap && this.downPoint && this.currentElement) {
        this.currentElement.dispatchEvent(new MouseEvent("move", e));
        this.currentElement.move(e);
        kit.render();
        return
      }
      for (const element of elementMap.values()) {
        if (element.inspectPointRect(e)) {
          this.currentElement = element;
          canvasElement.style.cursor = "pointer";
          break;
        } else {
          this.currentElement = null;
          canvasElement.style.cursor = "default";
        }
      }

      //如果当前点击了,但是没有找到元素那么激活ElementSelect
      if (!this.currentElement && this.currentInTap) {
        this.currentElement = kit.elementMap.get(ElementSelectId)!;
        (this.currentElement as ElementSelect).isSelect = true
        canvasElement.style.cursor = "default";
      }

    })

    canvasElement.addEventListener("mousedown", (e) => {
      this.currentInTap = true;
      this.downPoint = { x: e.offsetX, y: e.offsetY };
    })

    canvasElement.addEventListener("mouseup", (e) => {
      if (this.currentElement && this.currentInTap) {
        const notStop = this.currentElement.dispatchEvent(new MouseEvent("click", e));

        if (notStop) {
          this.currentElement.originalPoint.x = this.currentElement.x;
          this.currentElement.originalPoint.y = this.currentElement.y;

          if (this.currentElement.id === ElementSelectId) {
            (this.currentElement as ElementSelect).isSelect = false;
            (this.currentElement as ElementSelect).reset();
          }
        }
      }
      this.currentInTap = false
      this.downPoint = null;

      //如果当前元素不是BoxSelectElement,那么清空currentElement
      // if (this.currentElement?.id !== BoxSelectElementId) {
      //   this.currentElement = null;
      // }
      kit.render();
    })
  }
}