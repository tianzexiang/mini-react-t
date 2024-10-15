import Fiber from './fiber'

class Reconciler {
  constructor() {
    this.nextUnitOfWork = null
    this.wipRoot = null
  }

  /**
   * @description: 这个函数主要完成以下几个工作
   * 1. 依依据fiber创建真实dom并关联到当前fiber
   * 2. 根据虚拟dom创建子fiber并完成父子兄的连接（reconcileChildren）
   * 3. 处理完当前fiber查找是否有子fiber需要处理，有则返回
   * 4. 若没有子fiber需要处理则返回兄弟fiber
   * 5. 若都没有则向上回溯父fiber
   * @param {*} fiber 
   */
  performUnitOfWork(fiber) {
    // 将当前fiber节点的真实dom添加到父节点中，注意，这一步会触发浏览器回流重绘，需要优化
    if(fiber.parent) {
      fiber.parent.dom.appendChild(fiber.dom)
    }
  
    // 创建子fiber
    const elements = fiber.getChildren()
    elements.forEach((childElement, index) => {
      const childFiber = new Fiber({
        type: childElement.type,
        props: childElement.props,
        parent: fiber,
        dom: null
      })
      let preSibling
      if (index === 0) {
        // 第一个子fiber，直接设置为fiber的child
        // root fiber不存在兄弟fiber
        fiber.child = childFiber
      } else {
        // 如果不是第一个子fiber，则只需要关注它的兄弟fiber即可，因为一次遍历只处理同层级的兄弟fiber
        // 找到前一个兄弟fiber，它的sibling指向下一个兄弟fiber
        preSibling.sibling = childFiber
      }
      // 更新兄弟fiber
      preSibling = childFiber
    })
   
  
    // 如果存在子fiber(下一个工作单元)，则直接返回
    if (fiber.child) {
      return fiber.child
    }
    
    // 找到兄弟fiber
    let nextFiber = fiber
    while (nextFiber) {
      if (nextFiber.sibling) {
        return nextFiber.sibling
      }
      // 向上回溯
      nextFiber = nextFiber.parent
    }
    
  }

/**
 * @function workLoop
 * @description workLoop函数是react reconciler的核心逻辑，
 * 它会在浏览器的空闲时间里执行work，直到nextUnitOfWork为null时
 * @param {Fiber} nextUnitOfWork 下一个工作单元
 * @returns {function} 一个函数，接受一个参数deadline
 */
  workLoop(deadline) {
    let shouldYield = false
    while (this.nextUnitOfWork && !shouldYield) {
      this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork)
      shouldYield = deadline.timeRemaining() < 1
    }
    // 如果还有工作单元，则继续在空闲时间执行workLoop
    requestIdleCallback(this.workLoop.bind(this))
  }

  scheduleWork(fiber) {
    this.wipRoot = fiber
    this.nextUnitOfWork = fiber
  }

  startWorkLoop(wipRoot) {
    this.scheduleWork(wipRoot)
    requestIdleCallback(this.workLoop.bind(this))
  }
}

export default new Reconciler()

