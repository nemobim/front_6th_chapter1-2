import { addEvent } from "./eventManager";

/**
 * 노드를 생성하는 함수
 * @param {object} vNode - 생성할 노드
 * @returns {HTMLElement} - 생성된 노드
 */
export function createElement(vNode) {
  // 배열인 경우 → DocumentFragment 생성 후 재귀 렌더링
  if (Array.isArray(vNode)) {
    const fragment = document.createDocumentFragment();
    for (const child of vNode) {
      const el = createElement(child);
      if (el) fragment.appendChild(el);
    }
    return fragment;
  }

  // null / undefined / boolean → 빈 텍스트 노드로 변환
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return document.createTextNode("");
  }

  // 문자열 또는 숫자 → 텍스트 노드로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    console.log("vNode", vNode);
    return document.createTextNode(vNode.toString());
  }

  // 일반 엘리먼트 (VNode 형태) → 태그 생성
  if (typeof vNode.type === "string") {
    const el = document.createElement(vNode.type);

    // 속성 설정
    const props = vNode.props || {};
    for (const [key, value] of Object.entries(props)) {
      if (key === "className") {
        // className 속성 처리
        el.className = value;
      } else if (key === "style") {
        // style 속성 처리
        el.style.cssText = value;
      } else if (key.startsWith("on") && typeof value === "function") {
        // onClick 속성 처리
        const eventType = key.toLowerCase().slice(2); // onClick -> click
        addEvent(el, eventType, value);
      } else if (typeof value === "boolean") {
        // 불리언 속성 (예: disabled)
        el[key] = value;
      } else {
        // 일반 속성
        el.setAttribute(key, value);
      }
    }

    // 자식 요소 처리
    for (const child of vNode.children || []) {
      const childEl = createElement(child); // 재귀
      el.appendChild(childEl); // childEl도 Node
    }

    return el;
  }
  // 지원하지 않는 입력은 에러 발생
  throw new Error("지원하지 않는 입력입니다.");
}

function updateAttributes($el, props) {
  console.log("addEvent", addEvent, $el, props);
}

console.log(updateAttributes);
