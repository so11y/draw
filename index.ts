import { CanvasKit } from "./canvas";
import { Rect } from "./elements/rect";
import { ControlPoint } from "./kit/ControlPoint";


const kit = new CanvasKit("app", {
  width: window.innerWidth,
  height: window.innerHeight
});

const rect = new Rect(50, 50, 100, 100);

const controlPoint = new ControlPoint(50, 50, 10, 10);

rect.addEventListener("click", (e) => {
  console.log(e);
})

kit.addElement(rect).addElement(controlPoint);

kit.render();

