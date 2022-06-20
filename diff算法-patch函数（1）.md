### 介绍

上篇文章实现了h函数，h函数功能是生成虚拟节点，下一步我们就来写patch函数，patch函数的功能就是，拿新的虚拟节点和旧的虚拟节点进行对比，然后通过一系列比较，从而把新的虚拟节点生成为真实的DOM节点，放到页面中，这是patch函数的功能，也是diff算法的核心。

前面我们也介绍了，旧的虚拟节点和新的虚拟节点对比规则有很多，例如：不相同的标签，暴力删除；相同节点不同层级，暴力删除；相同节点，存在key会进行替换等等。我们接下来就由简到深的实现patch函数。

我们先来观察一下snabbdom中的patch是如何使用的

![image-20220619151648518](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220619151648518.png)

```
<div id="container">原始数据</div>
```

在snabbdom中，patch接收的是两个参数，第一个为旧的真实DOM节点，第二个为新的虚拟DOM节点，但是我们介绍时，是拿新的虚拟节点和旧的虚拟节点进行对比，所以我们的第一步，是将真实DOM转为虚拟DOM，然后再将新的虚拟节点和旧的虚拟节点对比。第二步

### 实现

- 创建patch，接收两个参数：新节点和旧节点

  > 本篇文章主要讨论不是同一个节点的情况，直接暴力删除。
  >
  > patch传入新旧节点，并输出![image-20220619165929208](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220619165929208.png)

  - 判断旧节点是否为虚拟DOM

    > 如果是真实DOM，旧需要转为虚拟DOM。
    >
    > 如何比较？需要知道真实DOM和虚拟DOM有何区别，真实DOM中有很多属性，但是肯定没有sel属性，而虚拟DOM有sel属性，根据这个属性来判断是否为虚拟节点

    - 不是虚拟节点，就将真实节点变为虚拟节点

      > 通过前面写的方法vnode，vnode需要传入五个属性：sel、data、children、text、elm
      >
      > 所以需要根据真实节点，获取到上述五个属性：
      >
      > 最后可以看看转变为的虚拟节点：
      >
      > 此时，就完成了第一个参数转为虚拟DOM了

  - 判断是否为同一个节点

    > 通过两个节点的sel属性，来判断。
    >
    > 如果是同一个节点，那么就要分析很多种情况，这里暂时不分析。
    >
    > 主要分析不是同一个节点的情况。

    - 是同一个节点：暂不分析

    - 不是同一个节点：暴力替换

      - 把新的虚拟节点创建为DOM节点

        > 这里封装一个 createElement() ，传入的参数为新节点
        >
        > 这里根据虚拟DOM创建DOM节点有两种情况：第三个参数为字符串或者第三个参数为数组。
        >
        > 如果是字符串的话，直接插入到标签中即可
        >
        > 如果是数组的话，需要递归
        >
        > 通过判断节点是否有children属性，vnode.children

        - 第三个参数为字符串

          > 如果没有children属性，就是字符串，直接通过innerText插入字符串就行

        - 第三个参数为数组

          > 如果children是数组，就是有子节点，通过递归创建节点

        - 补充elm属性

      - 删除页面旧节点

        > 拿到旧虚拟节点，节点中 elm属性就是真实节点，通过oldVnode.elm就能拿到真实节点，再通过oldVnodeElm.parentNode.removeChild(oldVnodeElm)删除

      - 将新的DOM节点放入页面中

        > 判断新节点是否存在，如果存在，将新节点在旧节点的父节点内创建真实节点。

代码

index.js

```
import h from './handle/h'
import patch from './handle/patch'

const container = document.getElementById('container')


// 第三个参数为字符串的情况
let vnode1 = h('span', {}, 'helloWorld')

// 第三个参数为数组的情况
let vnode2 = h('ul', {}, [
  h('li', {}, 'a'),
  h('li', {}, 'b'),
  h('ul', {}, [
    h('li', {}, 'c'),
    h('li', {}, 'd')
  ])
])

patch(container, vnode1)
// patch(container, vnode2)
```

patch.js

```
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
  if (oldVnode.sel === newVnode.sel) {
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
```

vnode.js

```
export default function (sel, data, children, text, elm) {
  return {
    sel,
    data,
    children,
    text,
    elm
  }
}
```

createElement.js

```
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
```

效果

原始数据：

![image-20220619173211430](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220619173211430.png)

情况一：字符串替换

![image-20220620180237910](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620180237910.png)

情况二：数组替换

![image-20220619173244822](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220619173244822.png)

### 总结

当我们创建了新的虚拟节点，需要通过patch函数，将新的虚拟节点替换旧节点，并展示到页面中。主要思路：将旧的真实节点转为旧的虚拟节点，再将新的虚拟节点和旧的虚拟节点进行比较（核心），本篇文章主要对，不同节点进行比较，不同节点时，通过暴力替换，将虚拟节点转为真实节点，此时有两种情况：字符串和数组，字符串直接插入到元素中即可，数组需要递归。最后删除旧节点，放入新节点。