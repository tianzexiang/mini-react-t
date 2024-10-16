import { VDOM_TYPE } from '../constants'
// import { sleep } from '../../../utils'

function createRoot(container) {
  // 返回一个对象，包含render方法
  return {
    render(element) {
      // 根据element的type创建dom节点
      const dom = element.type === 'TEXT_ELEMENT' ? document.createTextNode('') : document.createElement(element.type)
      // 将element的props添加到dom节点上
      const isProperty = key => key !== 'children'
      Object.keys(element.props).filter(isProperty).forEach(name => {
          dom[name] = element.props[name]
      })
      /** 
       * 递归地将element的children添加到dom节点上
       * !NOTE: 这里需要提前递归调用该方法，并添加到dom上，最后再添加到container中，否则会一直触发回流
       */
      element.props.children.forEach(child =>
        createRoot(dom).render(child)
      )

      // await sleep(5000)
      // 将dom节点添加到container中
      container.appendChild(dom)
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
            typeof child === 'string' || typeof child === 'number' ? createTextElement(child) : child
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

export {
  createRoot,
  createElement
}

