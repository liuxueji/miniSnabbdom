### 使用

前面我们已经成功将snabbdom引入并运行起来，现在我们来具体了解一下`snabbdom`，了解了`snabbdom`，就了解了`diff`算法。我们需要知道什么是虚拟节点，什么是真实节点，虚拟节点是如何替换成真实节点的，替换的规则是什么。

`index.js`

```
import {
  init,
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
  h,
} from "snabbdom";

const patch = init([
  classModule,
  propsModule,
  styleModule,
  eventListenersModule,
]);

// id容器
const container = document.getElementById("container");

```

`index.html`

```
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>

<body>
  <div id="container">原始数据</div>
  <script src="./xuni/bundle.js"></script>
</body>

</html>
```

此时展示的是`原始数据`

![image-20220617095031230](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220617095031230.png)

#### h函数

`h()`函数，我们在使用`Vue`的时候见过

```js
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```

- `h()`函数主要用来创建`vNode`的，即虚拟节点。

- 接收三个参数
  - 标签。可以是`div`、`ul`、`li`
  - 数据对象。可以是`key`值
  - 字符串或数组。可以是另一个`h函数`，实现嵌套

#### patch函数

- `patch`函数主要将`虚拟DOM`替换成`真实DOM`，当然也是有替换规则的
- 接收两个参数
  - 旧节点
  - 新节点。这里的新节点是虚拟节点，是个数据
- 过程：`patch函数`解析虚拟节点，将第一个参数设置为标签渲染的`DOM`中，第二个参数设置为数据对象，插入到指定标签，第三个参数设置为`DOM`数据，如果值为另一个h函数，那么需要使用递归。

`index.js`

```

const container = document.getElementById("container");

// h函数，接收三个参数，返回一个虚拟DOM
const vnode = h('div', {}, 'Hello');
// 将虚拟DOM渲染成真实DOM
patch(container, vnode);

```



#### 虚拟节点和真实节点

>DOM（Document Object Model，文档对象模型）是 JavaScript 操作 HTML 的接口.
>
>为什么需要虚拟节点？因为操作DOM很耗时
>
>为什么操作DOM耗时？
>
>原因一：线程切换。因为JS是单线程，操作DOM需要上一个线程完成，才能执行下一个线程，即上下文切换，这个过程很耗时；
>
>原因二：重新渲染。这个是耗时的关键因素，操作DOM会引起浏览器重新渲染，渲染分为重绘与重排。
>
>由于以上两个原因，我们需要高效的操作DOM，所以就有了虚拟节点

- 虚拟节点

  - 介绍：是以`javascript`对象作为基础的树，用对象的属性来描述节点，并且该对象最少包含标签名( `tag`)、属性(`attrs`)和子元素对象( `children`)三个属性。最终可以通过一系列操作使这棵树映射到真实环境上。

  - 结构：

    ```
    {
        children: undefined
        data: {}
        elm: div
        key: undefined
        sel: "div"
        text: "Hello"
    }
    ```

    

- 真实节点

  - 介绍：普通的`DOM`节点

  - 结构：

    ```
    <div>Hello</div>
    ```

#### diff算法

- 规则

  - `key`很重要。`key`是这个节点的唯一标识，`diff`算法会根据`diff`来判断它是不是新节点
  - 只有是同一虚拟节点，才进行精细化比较。如何定义是否为同一节点？必须是选择器相同且`key`相同
  - 只进行同层比较，不会进行跨层比较。如果层级不同，那么`diff`就会暴力删除旧的，新增新的。不过一般`vue`开发很少出现这种跨层级比较

- 使用

  - 情况一：新老节点不是同一个节点名称，暴力替换

    ```
    const vnode = h('div', {}, 'Hello');
    patch(container, vnode);
    
    const newVnode = h('h1', {}, 'helloWord')
    btn.onclick = function () {
      patch(vnode, newVnode);
    }
    ```

    ![diff1](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/diff1.gif)

  - 情况二：相同节点，没有`key`值，也是暴力替换

    ```
    const vnode = h('ul', {}, [
      h('li', {}, '1'),
      h('li', {}, '2'),
      h('li', {}, '3')
    ]);
    patch(container, vnode);
    
    const newVnode = h('ul', {}, [
      h('li', {}, '3'),
      h('li', {}, '1'),
      h('li', {}, '2')
    ]);
    btn.onclick = function () {
      patch(vnode, newVnode);
    }
    ```

    ![diff2](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/diff2.gif)

  - 情况三：相同节点，有`key`值，没有暴力替换

    ```
    const vnode = h('ul', {}, [
      h('li', {key:1}, '1'),
      h('li', {key:2}, '2'),
      h('li', {key:3}, '3')
    ]);
    patch(container, vnode);
    
    const newVnode = h('ul', {}, [
      h('li', {key:3}, '3'),
      h('li', {key:1}, '1'),
      h('li', {key:2}, '2')
    ]);
    btn.onclick = function () {
      patch(vnode, newVnode);
    }
    ```

    ![diff3](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/diff3.gif)

  

### 总结

当我们添加了`key`时，`patch`没有将旧节点暴力删除，只是更换了顺序，此时性能得到了提升。所以，如果想要提升性能，就必须添加`key`值！因为`key`是节点的唯一标识，`diff`算法会在更改前，判断是否为同一节点，如果是，那么就不需要删除。