import { addEvent, removeEvent } from "./eventManager";
import { createElement } from "./createElement.js";
import { normalizeVNode } from "./normalizeVNode.js";

function updateAttributes(target, newProps = {}, oldProps = {}) {
  // 새로운 속성 추가 또는 갱신
  for (const [key, newValue] of Object.entries(newProps)) {
    const oldValue = oldProps[key];

    if (key === "children") continue; // children은 별도 처리

    if (key === "className") {
      if (newValue !== oldValue) {
        if (newValue) {
          target.className = newValue;
        } else {
          target.removeAttribute("class");
        }
      }
    } else if (key === "style") {
      if (newValue !== oldValue) target.style.cssText = newValue;
    } else if (key.startsWith("on") && typeof newValue === "function") {
      const eventType = key.toLowerCase().slice(2);
      if (newValue !== oldValue) {
        if (typeof oldValue === "function") removeEvent(target, eventType, oldValue);
        addEvent(target, eventType, newValue);
      }
    } else if (typeof newValue === "boolean") {
      target[key] = newValue;

      // boolean 속성별로 다른 처리
      if (key === "checked" || key === "selected") {
        // checked, selected는 property로만 설정, DOM attribute는 제거
        target.removeAttribute(key);
      } else {
        // disabled, readOnly 등은 property와 DOM attribute 모두 설정
        if (newValue) {
          target.setAttribute(key, "");
        } else {
          target.removeAttribute(key);
        }
      }
    } else {
      if (newValue !== oldValue) {
        target.setAttribute(key, newValue);
      }
    }
  }

  // 제거된 속성 제거
  for (const key in oldProps) {
    if (key === "children") continue;
    if (!(key in newProps)) {
      if (key === "className") {
        target.removeAttribute("class");
      } else if (key.startsWith("on") && typeof oldProps[key] === "function") {
        const eventType = key.toLowerCase().slice(2);
        removeEvent(target, eventType, oldProps[key]);
      } else if (typeof oldProps[key] === "boolean") {
        target[key] = false;
        target.removeAttribute(key);
      } else {
        target.removeAttribute(key);
      }
    }
  }
}

export function updateElement(parent, newVNode, oldVNode, index = 0) {
  // 노드 정규화
  const normalizedNewNode = normalizeVNode(newVNode);
  const normalizedOldNode = normalizeVNode(oldVNode);

  // 둘 다 null/undefined인 경우
  if (!normalizedNewNode && !normalizedOldNode) {
    return;
  }

  // 새로운 노드가 없는 경우 (제거)
  if (!normalizedNewNode) {
    if (parent.childNodes[index]) {
      parent.removeChild(parent.childNodes[index]);
    }
    return;
  }

  // 기존 노드가 없는 경우 (추가)
  if (!normalizedOldNode) {
    const newElement = createElement(normalizedNewNode);
    parent.insertBefore(newElement, parent.childNodes[index]);
    return;
  }

  // 둘 다 텍스트 노드인 경우
  if (typeof normalizedNewNode === "string" && typeof normalizedOldNode === "string") {
    if (normalizedNewNode !== normalizedOldNode) {
      parent.childNodes[index].textContent = normalizedNewNode;
    }
    return;
  }

  // 하나는 텍스트, 하나는 요소인 경우
  if (typeof normalizedNewNode === "string" || typeof normalizedOldNode === "string") {
    const newElement = createElement(normalizedNewNode);
    parent.replaceChild(newElement, parent.childNodes[index]);
    return;
  }

  // 둘 다 요소인 경우
  const oldElement = parent.childNodes[index];

  // 타입이 다른 경우 완전히 교체
  if (normalizedNewNode.type !== normalizedOldNode.type) {
    const newElement = createElement(normalizedNewNode);
    parent.replaceChild(newElement, oldElement);
    return;
  }

  // 같은 타입이므로 속성만 업데이트
  updateAttributes(oldElement, normalizedNewNode.props || {}, normalizedOldNode.props || {});

  // 자식 요소들 업데이트
  const newChildren = normalizedNewNode.children || [];
  const oldChildren = normalizedOldNode.children || [];

  // 새로운 자식들로 업데이트
  for (let i = 0; i < newChildren.length; i++) {
    updateElement(oldElement, newChildren[i], oldChildren[i], i);
  }

  // 초과하는 기존 자식들 제거 (역순으로 제거)
  for (let i = oldElement.childNodes.length - 1; i >= newChildren.length; i--) {
    oldElement.removeChild(oldElement.childNodes[i]);
  }
}
