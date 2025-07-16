export function normalizeVNode(vNode) {
  // 조건 1. 노드가 null, undefined, boolean 인 경우 빈 값 처리
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  // 조건 2. 문자열 또는 숫자인 경우 문자열로 변환
  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  // 조건 3. 함수 컴포넌트인 경우 재귀적 실행 (컴포넌트 함수를 호출하여 렌더링된 결과를 다시 normalizeVNode로 처리)
  if (typeof vNode.type === "function") {
    const props = {
      ...(vNode.props || {}),
      children: vNode.children,
    };

    const renderedVNode = vNode.type(props);
    return normalizeVNode(renderedVNode); // 재귀 실행
  }

  // 조건 4. 일반 VNode 객체인 경우 → children도 재귀적으로 normalize
  if (typeof vNode === "object" && vNode?.type) {
    return {
      ...vNode,
      children: (vNode.children || []).map(normalizeVNode),
    };
  }

  return vNode;
}
