import { createElement } from './mini-react/1/react-dom/index.js'

export function sleep(time) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}


// 新增：创建深层嵌套的虚拟 DOM 结构
export function createNestedStructure(depth) {
  if (depth === 0) {
    return createElement('div', { className: 'nested-div' }, `Depth: ${depth}`)
  }
  return createElement(
    'div',
    { className: 'nested-div' },
    `Depth: ${depth}`,
    createNestedStructure(depth - 1)
  )
}
