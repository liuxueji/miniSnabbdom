### 介绍

前面已经把，不同节点的情况和相同节点且旧节点没有子节点情况讲解了，这篇文章来介绍以下，相同节点情况下，旧虚拟虚拟节点有子节点并且新虚拟节点也有子节点的情况，需要按照规定的比较顺序比较，比较的规则如下：

> 为了方便书写，我会进行简写：
>
> 旧前：旧虚拟节点的头部指针
>
> 旧后：旧虚拟节点的尾部指针
>
> 新前：新虚拟节点的头部指针
>
> 新前：新虚拟节点的头部指针

![image-20220621175424737](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621175424737.png)

比较会有六种情况：

> 比较永远都是从第一种情况开始匹配！！！

1. 旧前 -- 新前
2. 旧后 -- 新后
3. 旧前 -- 新后
4. 旧后 -- 新前
5. 查找
6. 创建或者删除

情况一：旧前 -- 新前

> 情况一匹配成功，此时旧前和新前的指针会++

![image-20220621180141730](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621180141730.png)

情况二：旧后 -- 新后

>情况二匹配成功，此时旧后和新后的指针会--

![image-20220621180425538](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621180425538.png)

情况三：旧前 -- 新后

> 情况二匹配成功，此时旧前会++和新后的指针会--

![image-20220621185856626](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621185856626.png)

情况四：旧后 -- 新前

> 情况二匹配成功，此时旧后会--和新前的指针会++

![image-20220621190754737](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621190754737.png)

情况五：查找

> 新节点添加到页面，并且如果旧节点有新节点的值，那么旧节点值赋值为undefined



### 实现

首先，我们需要为新旧虚拟节点添加key值，并且创建一个updateChildren()方法，用来处理旧虚拟虚拟节点有子节点并且新虚拟节点也有子节点的情况

#### 创建updateChildren

根据上面的分析，分为以下几种情况：

- 情况一：旧前和新前

  如果旧前节点的key和新前节点的key相同，情况一规则命中

  ```
        deepPatch(oldStartVnode, newStartVnode)
        if (newStartVnode) newStartVnode.elm = oldStartVnode.elm
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = oldCh[++newStartIdx]
  ```

  

- 情况二：旧后和新后

  如果旧后节点的key和新后节点的key相同，情况二规则秒中

  ```
        deepPatch(oldEndVnode, newEndVnode)
        if (newEndVnode) newEndVnode.elm = oldEndVnode.elm
        oldStartVnode = oldCh[++oldStartIdx]
        newStartVnode = newCh[++newStartIdx]
  ```

  

- 情况三：旧前和新后

  如果旧前节点的key和新后节点的key相同，情况二规则秒中

  ```
        deepPatch(oldStartVnode, newEndVnode)
        if (newEndVnode) newEndVnode.elm = oldEndVnode.elm
        // 把旧前指定的节点移动到旧后指定的节点的后面
        parentElm.insertBefore(oldStartVnode.elm, oldEndVnode.elm)
        oldStartVnode = oldCh[++oldStartIdx]
        newEndVnode = newCh[--newEndIdx]
  ```

  

- 情况四：旧后和新前

  如果旧后节点的key和新前节点的key相同，情况二规则秒中

  ```
        deepPatch(oldEndVnode, newStartVnode)
        if (newStartVnode) newStartVnode.elm = oldEndVnode.elm
        // 将旧后指定节点移动到旧前指定的节点前面
        parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm)
        oldEndVnode = oldCh[--oldEndIdx]
        newStartVnode = newCh[++newStartIdx]
  ```

- 情况五：查找

- 最后进行新增和删除

  > 主要分两种情况：旧前指针大于旧后指针、新前指针大于新后指针

  - 旧前指针大于旧后指针

    > 此时进行新增操作

    ```
    const before = newCh[newEndIdx + 1] ? newCh[newEndIdx + 1].elm : null
        for (let i = newStartIdx; i <= newEndIdx; i++) {
          parentElm.insertBefore(createElement(newCh[i]), before)
        }
    ```

    

  - 新前指针大于新后指针

    > 此时进行删除操作

    ```
    for (let i = oldStartIdx; i <= oldEndIdx; i++) {
          parentElm.removeChild(oldCh[i].elm)
        }
    ```

    

代码

updateChildren.js

```
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
      console.log(oldStartVnode)
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
```

演示

示例一：

![image-20220621232853213](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621232853213.png)

![情况一](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/%E6%83%85%E5%86%B5%E4%B8%80.gif)

示例二：

> 旧前 -- 新后  => 旧后 -- 新前 => 旧前 -- 新前 => 旧前 -- 新前
>
> 比较永远都是从第一种情况开始匹配！！

![image-20220621233539255](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621233539255.png)

![示例6](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/%E7%A4%BA%E4%BE%8B6.gif)

示例三：

> 当新节点数大于旧节点数，此时需要新增节点

![image-20220621233810668](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621233810668.png)

![示例7](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/%E7%A4%BA%E4%BE%8B7.gif)

示例四：

> 当新节点数小于旧节点数，此时需要删除节点

![image-20220621233950206](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220621233950206.png)

![示例8](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/%E7%A4%BA%E4%BE%8B8.gif)

### 总结

updateChildren函数是diff算法的核心函数，也是diff算法种最复杂的部分，负责旧虚拟节点和新虚拟节点均存在子节点的情况，在更新节点时，会按照特定的规则进行替换，目的就是实现最小更新，一共有五种规则：

1. 旧前 -- 新前
2. 旧后 -- 新后
3. 旧前 -- 新后
4. 旧后 -- 新前
5. 查找

最后再根据新旧节点个数，判断需要新增节点还是删除节点操作。