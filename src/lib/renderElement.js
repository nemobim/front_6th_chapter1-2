import { createElement } from "./createElement";
import { setupEventListeners } from "./eventManager";
import { normalizeVNode } from "./normalizeVNode";
// import { updateElement } from "./updateElement";

/**
 * 렌더링 함수
 * @param {object} vNode - 렌더링할 노드
 * @param {HTMLElement} container - 렌더링할 컨테이너
 */
export function renderElement(vNode, container) {
  // vNode 정규화
  const normalizedVNode = normalizeVNode(vNode);

  // DOM 생성
  const dom = createElement(normalizedVNode);

  // 컨테이너 비우고 새 DOM 추가 (기존 방식)
  container.innerHTML = "";
  container.appendChild(dom);

  setupEventListeners(container);
}
