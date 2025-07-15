export function normalizeVNode(vNode) {
  console.log("시작~~~~~~~~~~~~~~~~~~~");
  if (vNode === null || vNode === undefined || typeof vNode === "boolean") {
    return "";
  }

  if (typeof vNode === "string" || typeof vNode === "number") {
    return vNode.toString();
  }

  if (typeof vNode.type === "function") {
    const componentProps = {
      ...(vNode.props || {}),
      children: vNode.children,
    };

    const renderedComponent = vNode.type(componentProps);
    return normalizeVNode(renderedComponent);
  }

  if (typeof vNode === "object" && vNode?.type) {
    console.log("vNode object", vNode);
    const normalizedChildren = (vNode.children || []).map(normalizeVNode).filter((child) => child !== "");

    console.log("vNode object 반환값", {
      ...vNode,
      children: normalizedChildren,
    });
    return {
      ...vNode,
      children: normalizedChildren,
    };
  }

  console.log("vNode", vNode);

  return vNode;
}
