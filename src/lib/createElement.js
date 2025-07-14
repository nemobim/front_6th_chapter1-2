import { addEvent } from "./eventManager";

export function createElement(vNode) {
  console.log(vNode, "vNode");
  console.log(addEvent, "addEvent");
  console.log(updateAttributes, "updateAttributes");
}

function updateAttributes($el, props) {
  console.log($el, props, "updateAttributes $el, props");
}
