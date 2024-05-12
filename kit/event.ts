import { CanvasKit } from "../canvas";
import { CanvasKitElement } from "../elements/baseElement";
import { BoxSelectElementId } from "./BoxSelect";
import { ElementSelect, ElementSelectId } from "./select";

export class KitEvent {
  currentElement: CanvasKitElement | null;
  currentInTap = false;
  currentControl: CanvasKitElement | null;
  downPoint: { x: number, y: number } | null = null;

  get getCurrentElement() {
    return this.currentControl || this.currentElement;
  }

  constructor(kit: CanvasKit) {
    const { canvasElement, internalElement, elements } = kit;

    const getCurrentElement = (element: CanvasKitElement, e: MouseEvent) => {
      if (element.inspectPointRect(e)) {
        if (element.isControl()) {
          this.currentControl = element;
        } else {
          this.currentElement = element;
        }
        canvasElement.style.cursor = "pointer";
        return true;
      } else {
        this.currentElement = null;
        this.currentControl = null;
        canvasElement.style.cursor = "default";
      }
    }
    canvasElement.addEventListener("mousemove", (e) => {

      if (this.currentInTap && this.downPoint && this.getCurrentElement) {
        this.getCurrentElement!.dispatchEvent(new MouseEvent("move", e));
        this.getCurrentElement!.move(e);
        kit.render();
        return
      }

      for (const element of internalElement) {
        if (getCurrentElement(element, e)) {
          break
        }
      }

      if (!this.getCurrentElement) {
        for (const element of elements) {
          if (getCurrentElement(element, e)) {
            break
          }
        }
      }


      //如果当前点击了,但是没有找到元素那么激活ElementSelect
      if (!this.currentControl && !this.currentElement && this.currentInTap) {
        this.currentElement = kit.elementMap.get(ElementSelectId)!;
        (this.currentElement as ElementSelect).isSelect = true
        canvasElement.style.cursor = "default";
      }

    })

    canvasElement.addEventListener("mousedown", (e) => {
      this.currentInTap = true;
      this.downPoint = { x: e.offsetX, y: e.offsetY };
      this.currentControl = null;
      this.currentElement = null;
    })

    canvasElement.addEventListener("mouseup", (e) => {
      if (this.currentElement && this.currentInTap) {
        this.currentElement.dispatchEvent(new MouseEvent("click", e));

        this.currentElement.originalPoint.x = this.currentElement.x;
        this.currentElement.originalPoint.y = this.currentElement.y;
        this.currentElement.children.forEach((child) => {
          child.originalPoint.x = child.x;
          child.originalPoint.y = child.y;
        })

        if (this.currentElement.id === ElementSelectId) {
          (this.currentElement as ElementSelect).isSelect = false;
          (this.currentElement as ElementSelect).reset();
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