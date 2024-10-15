import { VDOM_TYPE } from '../constants'
import Fiber from '../react-reconciler/fiber'
import Reconciler from '../react-reconciler'

function createRoot(container) {
  // 返回一个对象，包含render方法
  return {
    render(element) {
      // root fiber
      const wipRoot = new Fiber({
        dom: container,
        props: {
          children: [element]
        },
        alternate: Reconciler.currentRoot
      })

      Reconciler.startWorkLoop(wipRoot)
    }
  }
}

function createElement(type, props, ...children) {
  // 返回一个对象，包含type和props
  return {
    type,
    props: {
      ...props,
      children: children.map(child =>
        typeof child === 'string' ? createTextElement(child) : child
      )
    }
  }
}

function createTextElement(text) {
  // 返回一个对象，包含type和props
  return {
    type: VDOM_TYPE.TEXT_ELEMENT,
    props: {
      nodeValue: text,
      children: []
    }
  }
}


export const useState = Reconciler.hook.useState

export {
  createRoot,
  createElement,
}

