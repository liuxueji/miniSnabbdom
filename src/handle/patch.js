import vnode from './vnode'
import createElement from './createElement'
export default function (oldVnode, newVnode) {
  // 判断旧节点是否为真实节点。通过判断旧节点是否有el属性
  if (oldVnode.el === undefined) {
    // 将旧真实节点转为旧虚拟节点，通过vnode()
    oldVnode = vnode(
      oldVnode.tagName.toLowerCase(), // 获取标签名 el
      {}, // data
      [], // children
      undefined, // text
      oldVnode // 真实节点 elm
    )
  }
  // 判断是否为同一节点，根据新旧节点的el属性panduan 
  if (oldVnode === newVnode) {
    // 暂不分析
  } else { // 不是同一节点，暴力删除
    // 创建 createElement() ，将新虚拟节点转为 真实DOM
    let newVnodeElm = createElement(newVnode)
    // 获取旧虚拟节点，通过 elm 得到旧真实节点
    let oldVnodeElm = oldVnode.elm
    // 创建新节点
    if (newVnode) {
      // 根据旧节点的父级节点（body）来插入
      oldVnodeElm.parentNode.insertBefore(newVnodeElm, oldVnodeElm)
    }
    // 删除旧节点
    oldVnodeElm.parentNode.removeChild(oldVnodeElm)
  }
}