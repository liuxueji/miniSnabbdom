### 介绍

上篇文章介绍了patch函数的部分功能：将真实节点转为虚拟节点、判断不是同一节点的情况（div节点与ul节点）如何进行暴力替换、第三个参数为字符串和数组的虚拟节点转化为真实节点的方法。

没有实现的功能是相同节点的情况，所以本篇文章主要实现新虚拟节点和旧虚拟节点相同的情况。

首先来分析，如果是相同节点，有如下情况：

- 新虚拟节点没有子节点

  此时，新虚拟节点第三个参数为字符串，可以直接把旧虚拟节点替换为新字符串

  > 这里不需要考虑旧虚拟节点第三个参数的情况，不管是数组还是字符串，都直接替换

- 新虚拟节点有子节点

  - 新虚拟节点有子节点，旧虚拟节点也有子节点

    > 这里是diff算法的核心，这里先不介绍，后面会专门介绍

  - 新虚拟节点有子节点，旧虚拟节点没有子节点

    > 此时不需要考虑旧虚拟节点，把旧的内容删除，然后将新内容加入

### 实现

实现新的虚拟节点和旧的虚拟节点是同一个节点的情况

#### 创建新的方法deepPatch()

传入新的虚拟节点和旧的虚拟节点，让deepPatch()这个方法进行判断

> 将新虚拟节点定义为 `h('div',{},'hello')`，此时进入相同节点的判断条件，调用deepPatch方法
>
> ![image-20220620181000417](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620181000417.png)
>
> ![image-20220620180726392](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620180726392.png)

- 新虚拟节点没有子节点的情况

  > h('div',{},'hello')，新节点这种情况
  >
  > 需要判断新旧节点的文本内容是否一样，如果一样就不需要处理，提高性能，如果不一样，就进行替换
  >
  > 判断条件：`newVnode.text !== oldVnode.text`

  - 如果新旧虚拟节点的文本内容不一样的情况，通过innerText进行替换

    ![](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620181636288.png)

    ![image-20220620181623384](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620181623384.png)

- 新虚拟节点有子节点的情况

  - 旧虚拟节点有子节点情况

    > 根据节点children长度是否大于0来判断是否有子节点
    >
    > 这里是最复杂的情况，后面单独讨论

  - 旧虚拟节点没有子节点情况

    - 删除旧节点内容

      > 只需要将旧节点的elm中的文本清空就行 `innerHTML = ''`

    - 遍历新虚拟节点的子节点，调用虚拟节点转为真实节点方法

      > 这里虚拟节点转为真实节点的方法上面文章介绍过，就是判断节点值为字符串还是数组，字符串就直接替换文本，数组就需要递归调用方法

    - 将新节点添加到页面中

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

// 新旧虚拟节点相同，且新虚拟节点无子节点
let vnode3 = h('div', {}, 'helloWorld')

// 新旧虚拟节点相同，且新虚拟节点有节点
let vnode4 = h('div', {}, [
  h('div', {}, 'a'),
  h('div', {}, 'b'),
  h('div', {}, 'c')
])

// patch(container, vnode1)
// patch(container, vnode2)
// patch(container, vnode3)
patch(container, vnode4)
```

deepPatch.js

```
import createElement from '../handle/createElement'
export default function deepPatch(oldVnode, newVnode) {
  // 新虚拟节点没有子节点的情况
  if (newVnode.children === undefined) {
    // 如果新旧虚拟节点的文本内容不一样的情况，通过innerText进行替换
    if (oldVnode.text !== newVnode.text) {
      console.log('新虚拟节点没有子节点的情况')
      oldVnode.elm.innerText = newVnode.text
    }
  } else { // 新虚拟节点有子节点的情况
    // 旧虚拟节点有子节点情况
    if (oldVnode.children.lenth > 0) {
      // 这里是最复杂的情况，后面单独讨论
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
```

测试

- 情况一：新虚拟节点没有子节点的情况，直接替换

![image-20220620182522517](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620182522517.png)

![image-20220620182533085](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620182533085.png)

- 情况二：新虚拟节点有子节点，并且旧虚拟节点没有子节点

![image-20220620182627677](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620182627677.png)

![image-20220620182638814](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220620182638814.png)

### 总结

本次讨论的是新旧虚拟节点为同一节点的情况，在同一节点基础上，又有两种情况：

新虚拟节点没有子节点，直接替换

新虚拟虚拟节点有子节点，旧虚拟节点没有子节点，直接删除旧节点内容，将新虚拟节点转为真实节点后插入到页面。

最后还有一种情况没有讨论：新虚拟节点有子节点，旧虚拟节点也有子节点的情况，这个是diff算法的核心内容，后续会详细介绍。

这种判断难度不大，但是有很多种情况需要讨论，很容易绕晕，需要理清思路再动手实现，还有我觉得如果将每种情况拆开讨论，会比较好理解
