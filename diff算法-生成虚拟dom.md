diff算法主要是三步：生成虚拟节点、将新旧虚拟节点对比（核心）、新节点替换旧节点。

### 环境搭建

本篇文章主要是搭建环境，并且生成虚拟节点（h函数），搭建环境前面已经讲过了，分为四步

```
npm init -y
npm i webpack@5 webpack-cli@3 webpack-dev-server@3 -S
新建webpack.config.js
配置webpack.config.js
```

webpack.config.js

> 入口文件 `/src/index.js`，出口文件 `/public/xuni/index.js`
>
> 引用时，只需要引用`public/xuni/index.js`，此时的文件是虚拟文件

```
module.exports = {
  entry: {
    index: './src/index.js'
  },
  output: {
    path: __dirname + "/public",
    // 将src/index.js打包成虚拟目录下的 index.js虚拟文件
    filename: './xuni/[name].js'
  },
  devServer: {
    contentBase: './public',
    inline: true
  }
}
```

index.html

```
<!DOCTYPE html>
<html lang="en">

<head>
  <title>Document</title>
</head>

<body>
  <script src="./xuni/index.js"></script>
</body>

</html>
```

目录结构

![image-20220618095534189](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220618095534189.png)

最后配置webpack命令

```
  "scripts": {
    "dev": "webpack-dev-server --open"
  }
```

执行 `npm run dev` 就可以运行了

![image-20220618095706298](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220618095706298.png)

此时，环境就已经搭建好了

### 虚拟节点

#### 说明

接下来就开始写虚拟节点了，在前面我们介绍的snabbdom中，是通过h函数转变成虚拟节点的，接下来我们也写一个h函数，且接收三个参数

我写的h函数主要处理两种情况：第三个参数的类型是字符串还是数组

> 还可以判断很多种情况，例如：是否为对象、是否为数字等等。

- 字符串

  - 参数

    ```
    let vnode1 = h('div',{},'helloWorld')
    ```

  - 返回值

    ```
    {
      children:undefined
      data:{}
      elm:undefined
      key:undefined
      sel:'div'
      text:'helloWorld'
    }
    ```

    

- 数组

  - 参数

    ```
    let vnode2 = h('ul', {}, [
      h('li', {}, 'a'),
      h('li', {}, 'b'),
      h('ul', {}, [
        h('li', {}, 'c'),
        h('li', {}, 'd')
      ])
    ])
    ```

    

  - 返回值

    ```
    {
      children:Array()
      data:{},
      elm:undefined
      key:undefined
      sel:'ul'
      text:undefined
    }
    ```

    

因为第三个参数有两种情况，所以写h函数肯定需要进行判断，如果是字符串，就处理字符串，如果是数组，就处理数组。

#### 实现

- 创建h函数，接收三个参数

  > `function (sel, data, params)` 

  - 判断第三个参数，是字符串还是数组

    >typeof params === 'string'

    - 如果是字符串（没有children）

      - 返回vnode函数，并传入 `vnode(sel,data,undefined,params,undefined)`

    - 如果是数组（children有内容）

      >`Array.isArray(params)`

      > 补充：判断数组的方式：`Array.isArray(arr)`、`Array.prototype === arr.__protp__`

      - 定义空数组，遍历数组，将每一个对象push到空数组中
      - 返回vnode函数，传入`vnode(sel,data,children,undefined,undefined)`

- 创建vnode函数，接收六个参数

  - 字符串形式

    ![image-20220618105120585](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220618105120585.png)

  - 数组形式

    ![image-20220618105134886](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220618105134886.png)

代码

index.js

```
import h from './handle/h'
// 第三个参数为字符串的情况
let vnode1 = h('div', {}, 'helloWorld')
console.log(vnode1)

// 第三个参数为数组的情况
let vnode2 = h('ul', {}, [
  h('li', {}, 'a'),
  h('li', {}, 'b'),
  h('ul', {}, [
    h('li', {}, 'c'),
    h('li', {}, 'd')
  ])
])
console.log(vnode2)
```

h.js

```
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



### 总结

通过自定义h函数，将数据转换成虚拟节点，数据有两种形式，分别为字符串和数组，区别是有无子元素。当数据为字符串时，此时是没有子元素的，当数据为数组是，此时有子元素
