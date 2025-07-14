export function setupEventListeners(root) {
  console.log(root, "root");
}

export function addEvent(element, eventType, handler) {
  console.log(element, eventType, handler, "addEvent element, eventType, handler");
}

export function removeEvent(element, eventType, handler) {
  console.log(element, eventType, handler, "removeEvent element, eventType, handler");
}
