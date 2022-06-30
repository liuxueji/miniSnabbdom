import deepPatch from "./deepPatch";
import patch from "./patch";
import createElement from "./createElement";

// 判断两个虚拟节点是否为同一个节点
function sameVnode(vNode1, vNode2) {
  return vNode1.key == vNode2.key

}
// parentElm 真实DOM , oldCh 旧的虚拟节点, newCh 新的虚拟节点
export default (parentElm, oldCh, newCh) => {
  let oldStartIdx = 0 // 旧前指针
  let oldEndIdx = oldCh.length - 1 // 旧后指针
  let newStartIdx = 0 // 新前指针
  let newEndIdx = newCh.length - 1 // 新后指针

  let oldStartVnode = oldCh[0] // 旧前虚拟节点
  let oldEndVnode = oldCh[oldEndIdx] // 旧后虚拟节点
  let newStartVnode = newCh[0] // 新前虚拟节点
  let newEndVnode = newCh[newEndIdx] // 新后虚拟节点

  while (oldStartIdx <= oldEndIdx && newStartIdx <= newEndIdx) {
    if (oldStartVnode == undefined) {
      oldStartVnode = oldCh[++oldStartIdx]
    }
    if (oldEndVnode == undefined) {
      oldEndVnode = oldCh[--oldEndVnode]
    } else if (sameVnode(oldStartVnode, newStartVnode)) {
      // 第一种情况：旧前和新前
      console.log('情况1')
      deepPatch(oldStartVnode, newStartVnode)
      if (newStartVnode) newStartVnode.elm = oldStartVnode.elm
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = oldCh[++newStartIdx]
    } else if (sameVnode(oldEndVnode, newEndVnode)) {
      // 第二种情况：旧后和新后
      console.log('情况2')
      deepPatch(oldEndVnode, newEndVnode)
      if (newEndVnode) newEndVnode.elm = oldEndVnode.elm
      oldStartVnode = oldCh[++oldStartIdx]
      newStartVnode = newCh[++newStartIdx]
    } else if (sameVnode(oldStartVnode, newEndVnode)) {
      // 第三种情况：旧前和新后
      console.log('情况3')
      deepPatch(oldStartVnode, newEndVnode)
      if (newEndVnode) newEndVnode.elm = oldEndVnode.elm
      // 把旧前指定的节点移动到旧后指定的节点的后面
      parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm)
      oldStartVnode = oldCh[++oldStartIdx]
      newEndVnode = newCh[--newEndIdx]
    } else if (sameVnode(oldEndVnode, newStartVnode)) {
      // 第四种情况：旧后和新前
      console.log('情况4')
      deepPatch(oldEndVnode, newStartVnode)
      if (newStartVnode) newStartVnode.elm = oldEndVnode.elm
      // 将旧后指定节点移动到旧前指定的节点前面
      parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
      oldEndVnode = oldCh[--oldEndIdx]
      newStartVnode = newCh[++newStartIdx]
    } else {
      // 第五种情况：查找
      console.log('情况5')
      // 创建一个对象，存虚拟节点的（判断新旧有无相同节点）
      const keyMap = {}

      for (let i = oldStartIdx; i <= oldEndIdx; i++) {
        const key = oldCh[i].key
        if (key) keyMap[key] = i
      }

      // 在旧节点种寻找新前指向的节点
      let idxInOld = keyMap[newStartVnode.key]

      // 如果有，说明数据在新旧虚拟节点中都存在
      if (idxInOld) {
        const elmMove = oldCh[idxInOld]
        deepPatch(elmMove, newStartVnode)
        // 处理过的节点，在旧虚拟节点的数组种，设置为undefine
        oldCh[idxInOld] = undefined
        parentElm.insertBefore(elmMove.elm, oldStartVnode.elm)
      } else {
        // 如果没有找到，说明是一个新的节点（创建）
        parentElm.insertBefore(createElement(newStartVnode), oldStartVnode.elm)
      }
      // 新数据（指针）+1
      newStartVnode = newCh[++newStartIdx]
    }
  }
  // 结束while 只有两种情况（新增和删除）
  // 1. oldStartIdx > oldEndIdx
  // 2. newStartIdx > newEndIdx
  if (oldStartIdx > oldEndIdx) {
    const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
    for (let i = newStartIdx; i <= newEndIdx; i++) {
      parentElm.insertBefore(createElement(newCh[i]), before)
    }
  } else {
    // 进入删除操作
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
      parentElm.removeChild(oldCh[i].elm)
    }
  }
}