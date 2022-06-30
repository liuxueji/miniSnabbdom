import createElement from '../handle/createElement'
import updateChildren from './updateChildren'
export default function deepPatch(oldVnode, newVnode) {
  // 新虚拟节点没有子节点的情况
  if (newVnode.children === undefined) {
    // 如果新旧虚拟节点的文本内容不一样的情况，通过innerText进行替换
    if (oldVnode.text !== newVnode.text) {
      // console.log('新虚拟节点没有子节点的情况')
      oldVnode.elm.innerText = newVnode.text
    }
  } else { // 新虚拟节点有子节点的情况
    // 旧虚拟节点有子节点情况
    if (oldVnode.children.length > 0) {
      // 新旧虚拟节点都有子节点的情况
      // console.log('新旧虚拟节点都有子节点的情况');

      updateChildren(oldVnode.elm, oldVnode.children, newVnode.children)
    } else {
      console.log('新虚拟节点有子节点的情况,旧虚拟节点没有子节点情况')
      // 删除旧节点内容
      oldVnode.elm.innerHTML = ''
      // 遍历新虚拟节点的子节点
      for (let child of newVnode.children) {
        // 调用虚拟节点转为真实节点方法
        let childDom = createElement(child)
        // 将新节点添加到页面中
        oldVnode.elm.appendChild(childDom)
      }
    }
  }
}