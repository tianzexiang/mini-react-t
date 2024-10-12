import { VDOM_TYPE } from '../constants'

// 判断是否是事件
const isEvent = key => key.startsWith("on")
// 判断是否是属性
const isProperty = key => key !== "children" && !isEvent(key)
// 判断是否是新属性
const isNew = (prev, next) => key => prev[key] !== next[key]
// 判断是否是移除的属性
const isGone = (next) => key => !(key in next)

export default class Fiber {
  constructor({
    type,
    props,
    dom,
    parent,
    sibling,
    alternate,
    effectTag
  } = {}) {
    this.type = type
    this.props = props
    this.parent = parent
    this.dom = dom
    this.sibling = sibling
    this.alternate = alternate
    this.effectTag = effectTag

    this.createDom()
  }

  get isFunctionComponent() {
    return this.type instanceof Function
  }

  getChildren() {
    return this.isFunctionComponent ? [this.type(this.props)] : this.props.children
  }

  createDom() {
    if (this.dom || this.isFunctionComponent) return
    // 根据element的type创建dom节点
    this.dom = this.type === VDOM_TYPE.TEXT_ELEMENT ? document.createTextNode('') : document.createElement(this.type)
    // 将element的props添加到dom节点上
    // const isProperty = key => key !== 'children'
    // Object.keys(fiber.props).filter(isProperty).forEach(name => {
    //     dom[name] = fiber.props[name]
    // })
    this.updateDom({}, this.props)
  }

  updateDom(prevProps = this.alternate?.props || {}, nextProps = this.props) {
    if (!this.dom) return
    // 移除旧的属性
    Object.keys(prevProps).filter(isProperty).filter(isGone(nextProps)).forEach(name => {
      this.dom[name] = ''
    })
    // 添加新的或变化了的属性
    Object.keys(nextProps).filter(isProperty).filter(isNew(prevProps, nextProps)).forEach(name => {
      this.dom[name] = nextProps[name]
    })
    // 移除旧的或变化了的event
    Object.keys(prevProps).filter(isEvent).filter(key =>
      isGone(nextProps)(key) || isNew(prevProps, nextProps)(key)
    ).forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      this.dom.removeEventListener(eventType, prevProps[name])
    })
    // 添加新的event
    Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(name => {
      const eventType = name.toLowerCase().substring(2)
      this.dom.addEventListener(eventType, nextProps[name])
    })
  }
}