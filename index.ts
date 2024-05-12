import { CanvasKit } from "./canvas";
import { Rect } from "./elements/rect";
import { ControlPoint } from "./kit/ControlPoint";


const kit = new CanvasKit("app", {
  width: window.innerWidth,
  height: window.innerHeight
});

const rect = new Rect(50, 50, 100, 100);

const rect1 = new Rect(150, 150, 100, 100);

const controlPoint = new ControlPoint(50, 50, 10, 10);

rect.addEventListener("click", (e) => {
  console.log(e);
})

kit.addElement(rect).addElement(controlPoint).addElement(rect1);

kit.render();


window.kit = kit;
