// 方法接收一个虚拟节点，返回真实DOM
export default function createElement(vnode) {
  // 根据sel，创建DOM节点
  let domNode = document.createElement(vnode.sel)
  // 判断有无子节点，即第三个参数是否为数组
  if (vnode.children === undefined) {
    // 无子节点，就是字符串，直接插入
    domNode.innerText = vnode.text
  } else if (Array.prototype === vnode.children.__proto__) { // 有children，且为数组
    // 有子节点，是数组，需要递归
    for (let child of vnode.children) {
      // 递归子节点
      let childDom = createElement(child)
      domNode.appendChild(childDom)
    }
  }
  // 传入elm属性
  vnode.elm = domNode
  // 返回处理好的真实节点
  return domNode
}