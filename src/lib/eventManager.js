//이벤트 저장소
const eventStore = new WeakMap();
//이벤트 리스너 컨테이너
const eventListeners = new Map();

export function setupEventListeners(container, type = "click") {
  if (eventListeners.has(type)) return;
  eventListeners.set(type, true);

  container.addEventListener(type, (e) => {
    let target = e.target;
    while (target && target !== container) {
      const events = eventStore.get(target);
      if (events?.[type]) {
        for (const handler of events[type]) {
          handler.call(target, e);
        }
      }
      if (e.cancelBubble) break; // stopPropagation 처리
      target = target.parentNode;
    }
  });
}

export function addEvent(element, eventType, handler) {
  // 해당 요소에 대한 이벤트 맵이 없으면 초기화(처음 등록)
  if (!eventStore.has(element)) {
    // 이벤트 타입별로 저장할 객체
    eventStore.set(element, {});
  }

  const events = eventStore.get(element);

  // 해당 이벤트 타입에 대한 핸들러 Set이 없으면 생성
  if (!events[eventType]) {
    events[eventType] = new Set();
  }

  // 핸들러 추가
  events[eventType].add(handler);
}

export function removeEvent(element, eventType, handler) {
  // 해당 요소에 대한 이벤트 가져와서 없으면 종료
  const events = eventStore.get(element);
  if (!events || !events[eventType]) return;

  events[eventType].delete(handler); // 핸들러 제거

  //해당 타입에 핸들러가 더 이상 없으면 타입도 삭제 ex click 이벤트 제거
  if (events[eventType].size === 0) {
    delete events[eventType];
  }

  // 해당 요소에 이벤트가 아무것도 없으면 통째로 삭제 ex button 요소에 이벤트 제거
  if (Object.keys(events).length === 0) {
    eventStore.delete(element);
  }
}
