import vnode from './vnode.js'
export default function (sel, data, params) {
  // 第一种情况：第三个参数为字符串时
  if (typeof params === 'string') {
    // 返回vnode函数，此时无children
    return vnode(sel, data, undefined, params, undefined)
  } else if (Array.isArray(params)) { // 第二种情况：第三个参数为数组时
    // 创建子元素，将数组中每一项存入子元素中
    let children = []
    params.forEach(item => {
      children.push(item)
    })
    return vnode(sel, data, children, undefined, undefined)
  }
}