import { CanvasKitElement } from "./elements/baseElement";
import { BoxSelectElement } from "./kit/BoxSelect";
import { asyncIter } from "./kit/asyncIter";
import { KitEvent } from "./kit/event";
import { ElementSelect } from "./kit/select";

interface CanvasKitOptions {
  width: number;
  height: number;
}

export class CanvasKit {
  kitOptions: CanvasKitOptions;
  elements: CanvasKitElement[] = [
    new ElementSelect(0, 0, 0, 0),
    new BoxSelectElement(0, 0, 0, 0),
  ];
  elementMap: Map<number, CanvasKitElement> = new Map();
  canvasCtx: CanvasRenderingContext2D;// OffscreenCanvasRenderingContext2D;
  canvasElement: HTMLCanvasElement;
  // offscreenCanvas: OffscreenCanvas;

  declare kitEvent: KitEvent;
  constructor(id: string, kitOptions: CanvasKitOptions) {
    this.canvasElement = document.getElementById(id) as HTMLCanvasElement;
    this.canvasCtx = this.canvasElement.getContext('2d')!;
    // this.canvasCtx =  new OffscreenCanvas() // this.canvasElement.getContext('2d')!;
    this.kitOptions = kitOptions;
    this.canvasElement.width = kitOptions.width;
    this.canvasElement.height = kitOptions.height;
    // this.offscreenCanvas = this.canvasElement.transferControlToOffscreen(); //new OffscreenCanvas(kitOptions.width, kitOptions.height);
    this.kitEvent = new KitEvent(this);
  }


  render() {
    this.canvasCtx.clearRect(0, 0, this.canvasElement.width, this.canvasElement.height);

    this.elements.forEach((element) => {
      element.draw(this);
    })
    // asyncIter(this.elements, (element) => {
    //   element.draw(this);
    // })
  }


  addElement(element: CanvasKitElement) {
    this.elements.push(element);
    return this
  }
}