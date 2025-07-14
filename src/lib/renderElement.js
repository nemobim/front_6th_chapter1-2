import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";

export function renderElement(vNode, container) {
  console.log(vNode, container, "renderElement vNode, container");
  console.log(setupEventListeners, "setupEventListeners");
  console.log(createElement, "createElement");
  console.log(normalizeVNode, "normalizeVNode");
  console.log(updateElement, "updateElement");
  // 최초 렌더링시에는 createElement로 DOM을 생성하고
  // 이후에는 updateElement로 기존 DOM을 업데이트한다.
  // 렌더링이 완료되면 container에 이벤트를 등록한다.
}
