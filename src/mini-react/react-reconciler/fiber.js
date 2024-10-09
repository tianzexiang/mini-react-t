export default class Fiber {
  constructor({
    type,
    props,
    dom,
    parent,
    sibling
  } = {}) {
    this.type = type
    this.props = props
    this.parent = parent
    this.dom = dom
    this.sibling = sibling
  }
}