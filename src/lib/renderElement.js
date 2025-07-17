//import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
import { updateElement } from "./updateElement";
// import { updateElement } from "./updateElement";

/**
 * 렌더링 함수
 * @param {object} vNode - 렌더링할 노드
 * @param {HTMLElement} container - 렌더링할 컨테이너
 */
export function renderElement(vNode, container) {
  // vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // 이전 상태와 비교하여 DOM 업데이트
  updateElement(container, normalizedVNode, container._vnode);
  container._vnode = normalizedVNode;

  setupEventListeners(container);
}
