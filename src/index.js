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