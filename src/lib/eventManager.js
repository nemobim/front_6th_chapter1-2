// 이벤트 저장소 - 요소별 이벤트 관리 (element -> Map(eventType -> Set(handlers)))
const eventMap = new WeakMap();
// 전체 시스템에서 사용 중인 이벤트 타입들 추적
const delegatedEvents = new Set();

/**
 * 컨테이너에 이벤트 리스너를 등록합니다.
 * @param {HTMLElement} container - 이벤트 리스너를 등록할 컨테이너 엘리먼트
 */
export function setupEventListeners(container) {
  // 이벤트 핸들러를 컨테이너의 속성으로 저장 (중복 등록 방지)
  if (!container._eventHandler) {
    container._eventHandler = function handleEvent(event) {
      let target = event.target;
      while (target && target !== container) {
        const elementEvents = eventMap.get(target);
        if (elementEvents) {
          const handlers = elementEvents.get(event.type);
          if (handlers) {
            handlers.forEach((handler) => handler(event));
            return;
          }
        }
        target = target.parentElement;
      }
    };
  }

  // 현재까지 등록된 모든 이벤트 타입에 대해 리스너 등록
  delegatedEvents.forEach((eventType) => {
    container.removeEventListener(eventType, container._eventHandler);
    container.addEventListener(eventType, container._eventHandler);
  });
}

/**
 * 특정 엘리먼트에 이벤트 핸들러를 등록합니다.
 * @param {HTMLElement} element - 이벤트를 등록할 엘리먼트
 * @param {string} eventType - 이벤트 타입 (예: 'click')
 * @param {Function} handler - 이벤트 핸들러 함수
 */
export function addEvent(element, eventType, handler) {
  // 요소별 이벤트 맵 초기화
  if (!eventMap.has(element)) {
    eventMap.set(element, new Map());
  }

  const elementEvents = eventMap.get(element);

  // 이벤트 타입별 핸들러 Set 초기화
  if (!elementEvents.has(eventType)) {
    elementEvents.set(eventType, new Set());
  }

  // 핸들러 추가
  elementEvents.get(eventType).add(handler);

  // 새로운 이벤트 타입이면 전체 시스템에 추가
  if (!delegatedEvents.has(eventType)) {
    delegatedEvents.add(eventType);

    // 자동화: DOM 트리를 올라가며 설정된 컨테이너들에 새 이벤트 타입 리스너 추가
    let current = element;
    while (current) {
      // 이 요소가 setupEventListeners가 호출된 컨테이너인지 확인
      if (current._eventHandler) {
        current.removeEventListener(eventType, current._eventHandler);
        current.addEventListener(eventType, current._eventHandler);
      }
      current = current.parentElement;
    }
  }
}

/**
 * 특정 엘리먼트에서 이벤트 핸들러를 제거합니다.
 * @param {HTMLElement} element - 이벤트를 제거할 엘리먼트
 * @param {string} eventType - 이벤트 타입 (예: 'click')
 * @param {Function} handler - 제거할 이벤트 핸들러 함수
 */
export function removeEvent(element, eventType, handler) {
  const elementEvents = eventMap.get(element);
  if (!elementEvents) return;

  const handlers = elementEvents.get(eventType);
  if (!handlers) return;

  // 핸들러 제거
  handlers.delete(handler);

  // 해당 타입에 핸들러가 없으면 타입 삭제
  if (handlers.size === 0) {
    elementEvents.delete(eventType);
  }

  // 해당 요소에 이벤트가 없으면 요소 삭제
  if (elementEvents.size === 0) {
    eventMap.delete(element);
  }
}
