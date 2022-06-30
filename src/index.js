import h from './handle/h'
import patch from './handle/patch'

const container = document.getElementById('container')
const btn = document.getElementById('btn')


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

// 以下是：新旧虚拟节点相同，且新旧虚拟节点都有子节点
let vnode5 = h('ul', {}, [
  h('li', {
    key: 'a'
  }, 'a'),
  h('li', {
    key: 'b'
  }, 'b'),
  h('li', {
    key: 'c'
  }, 'c'),
  h('li', {
    key: 'd'
  }, 'd')
])

let vnode6 = h('ul', {}, [
  h('li', {
    key: 'd'
  }, 'd'),
  h('li', {
    key: 'b'
  }, 'b'),
  h('li', {
    key: 'c'
  }, 'c'),
  h('li', {
    key: 'a'
  }, 'a')
])

// let vnode6 = h('ul', {}, [
//   h('li', {
//     key: 'd'
//   }, 'd'),
//   h('li', {
//     key: 'c'
//   }, 'c'),
//   h('li', {
//     key: 'b'
//   }, 'b'),
//   h('li', {
//     key: 'a'
//   }, 'a')
// ])
let vnode7 = h('ul', {}, [
  h('li', {
    key: 'd'
  }, 'd'),
  h('li', {
    key: 'c'
  }, 'c'),
  h('li', {
    key: 'b'
  }, 'b'),
  h('li', {
    key: 'a'
  }, 'a')
])
let vnode8 = h('ul', {}, [
  h('li', {
    key: 'd'
  }, 'd'),
  h('li', {
    key: 'c'
  }, 'c'),
  h('li', {
    key: 'b'
  }, 'b'),
  h('li', {
    key: 'a'
  }, 'a')
])


// patch(container, vnode1)
// patch(container, vnode2)
// patch(container, vnode3)
patch(container, vnode5)

btn.onclick = function () {
  patch(vnode5, vnode6)
}