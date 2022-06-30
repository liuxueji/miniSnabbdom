### 前言

本篇文章主要聊聊diff算法中snabbdom的测试环境搭建，复习webpack的使用。

我们为什么要了解diff算法呢？diff算法是vue和react的核心，将真实DOM转变成虚拟DOM（数据形式），再通过diff算法比较，如果虚拟DOM发生变化了，再操作真实DOM，达到减少真实DOM操作，提升性能。

### 介绍

`vue2`中的`diff`算法借鉴的是`snabbdom`。

`snabbdom`是一个精简化、模块化、功能强大、性能卓越的虚拟 `DOM` 库。

`Snabbdom` 则极其简单、高效并且可拓展，同时核心代码 ≈ `200` 行。我们提供了一个具有丰富功能同时支持自定义拓展的模块化结构。为了使核心代码更简洁，所有非必要的功能都将模块化引入。

你可以将 `Snabbdom` 改造成任何你想要的样子！选择或自定义任何你需要的功能。或者使用默认配置，便能获得一个高性能、体积小、拥有下列所有特性的虚拟 DOM 库。

### snabbdom的测环境搭建

- 引入`snabbdom`库，观察`snabbdom`身份证发现有别名，里面用的是js文件

  > npm i -S snabbdom  // -D 开发依赖 -S生产依赖 

- `snabbdom`库是`DOM`库，不能在`Node.js`环境运行，所有我们需要安装 `webpack`和`webpack-dev-server`开发环境，不需要安装任何`loader`

- 必须安装`webpck@5`，不能安装`@4`，因为`@4`没有读取身份证中`exports`的能力

  > npm i -D webpack@5 webpack-cli@3 webpack-dev-server@3

- 参考`webpack`官网，写好`webpack.config.js`

  - `webpackjs.com`照着配置

  - 导入`path`模块

  - 暴露对象

    - 入口
    - 出口（打包路径、打包出来的文件名）
    - 生产环境服务器（端口号、静态资源文件夹）

    ```
    module.exports = {
      // webpack5 不用配置mode
      // 入口
      entry: "./src/index.js",
      // 出口
      output: {
        // 虚拟打包路径，文件夹不会真正生成，而是在8080端口虚拟生成
        publicPath: "xuni",
        // 打包出来的文件名
        filename: "bundle.js",
      },
      // 配置webpack-dev-server
      devServer: {
        // 静态根目录
        contentBase: 'www',
        // 端口号
        port: 8080,
      },
    };
    ```

  - 设置打包命令

    > 找到`package.json`中的`scripts`添加`dev`命令
    >
    > ```
    > "scripts":{
    > 	"dev":"webpack-dev-server"
    > }
    > ```

  - 执行`npm run dev`

  - 接着在浏览器中输入`127.0.0.1:8080`会将`src/index.html`内容展示

复制官方`demo Example`，粘贴到入口文件

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
  // Init patch function with chosen modules
  classModule, // makes it easy to toggle classes
  propsModule, // for setting properties on DOM elements
  styleModule, // handles styling on elements with support for animations
  eventListenersModule, // attaches event listeners
]);

const container = document.getElementById("container");

const vnode = h("div#container.two.classes", {
  on: {
    click: function () {}
  }
}, [
  h("span", {
    style: {
      fontWeight: "bold"
    }
  }, "This is bold"),
  " and this is just normal text",
  h("a", {
    props: {
      href: "/foo"
    }
  }, "I'll take you places!"),
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

const newVnode = h(
  "div#container.two.classes", {
    on: {
      click: function () {}
    }
  },
  [
    h(
      "span", {
        style: {
          fontWeight: "normal",
          fontStyle: "italic"
        }
      },
      "This is now italic type"
    ),
    " and this is still just normal text",
    h("a", {
      props: {
        href: "/bar"
      }
    }, "I'll take you places!"),
  ]
);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
```

- 在index中新增

```
  <div id="container"></div>
  <script src="./xuni/bundle.js"></script>
```

- `#container`是一定要有的

- 通过`script`引入虚拟的`bundle.js`文件

  ![image-20220616104205180](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220616104205180.png)

- 成功跑测试样例

  ![](https://liuxueji.oss-cn-guangzhou.aliyuncs.com/image-20220616104215877.png)

到这里，我们的环境就已经搭建完成了，`snabbdom`就已经成功引入了