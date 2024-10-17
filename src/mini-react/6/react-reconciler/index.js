import Fiber from './fiber'
import { EFFECT_TAG } from '../constants'
import Committer from './commit'
import Hook from './hook'

class Reconciler {
  constructor() {
    this.nextUnitOfWork = null
    this.wipRoot = null
    this.currentRoot = null
    this.deletions = []
    this.committer = new Committer(this)
    this.hook = new Hook(this)
  }

  /**
 * @description: 根据虚拟dom创建子fiber并完成父子兄的连接,
 * 这个函数主要完成以下几个工作
 * 1. 根据虚拟dom创建子fiber
 * 2. 根据规则判断fiber节点是新增还是更新还是删除
 * 3. 完成父子兄的连接
 * @param {*} elements
 * @param {*} fiber
 */
  reconcileChildren(elements, fiber) {
    let index = 0
    let oldFiber = fiber.alternate && fiber.alternate.child
    let preSibling = null
    // 遍历elements和oldFiber，比较是否需要更新
    // 为什么使用两个判断条件？两者可能因为增加和删除导致长度不一致
    // 1. index < elements.length 说明还有新的虚拟dom需要处理
    // 2. oldFiber 说明还有旧的fiber需要处理
    // 3. 两个条件都满足，说明新旧fiber都需要处理
    while (index < elements.length || oldFiber) {
      const element = elements[index]
      let newFiber = null
      // 判断是否是相同类型
      const sameType = oldFiber && element && oldFiber.type === element.type
      
      // 对于新构建的fiber，只有新增和更新两种情况
      // 对于旧fiber，只有删除一种情况
      // 替换实际上是删除旧fiber，新增新fiber
      if (sameType) {
        // 更新
        newFiber = new Fiber({
          type: oldFiber.type,
          props: element.props,
          dom: oldFiber.dom,
          parent: fiber,
          alternate: oldFiber,
          effectTag: EFFECT_TAG.UPDATE
        })
      }
  
      if (!sameType && element) {
        // 新增
        newFiber = new Fiber({
          type: element.type,
          props: element.props,
          dom: null,
          parent: fiber,
          alternate: null,
          effectTag: EFFECT_TAG.PLACEMENT
        })
      }
  
      if (oldFiber && !sameType) {
        // 稍后需要删除的旧fiber
        // 为什么需要删除？因为界面上已经插入了当前fiber的dom，如果不对旧fiber进行标记删除，则会造成重复渲染
        oldFiber.effectTag = EFFECT_TAG.DELETION
        this.deletions.push(oldFiber)
      }
  
      if (index === 0) {
        // 第一个子fiber，直接设置为fiber的child
        fiber.child = newFiber
      } else {
        // 如果不是第一个子fiber，则只需要关注它的兄弟fiber即可，因为一次遍历只处理同层级的兄弟fiber
        preSibling.sibling = newFiber
      }
  
      if (oldFiber) {
        // 移动到下一个兄弟fiber，类比index++
        oldFiber = oldFiber.sibling
      }
      // 更新兄弟fiber
      preSibling = newFiber
      index++
    }
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
  
    // 第二步 将当前fiber节点的真实dom添加到父节点中，注意，这一步会触发浏览器回流重绘，需要优化
    // if(fiber.parent) {
    //   fiber.parent.dom.appendChild(fiber.dom)
    // }
  
    // 创建子fiber
    // const elements = fiber.props.children
    // elements.forEach((childElement, index) => {
    //   const childFiber = new Fiber({
    //     type: childElement.type,
    //     props: childElement.props,
    //     parent: fiber,
    //     dom: null
    //   })
    //   let preSibling
    //   if (index === 0) {
    //     // 第一个子fiber，直接设置为fiber的child
    //     // root fiber不存在兄弟fiber
    //     fiber.child = childFiber
    //   } else {
    //     // 如果不是第一个子fiber，则只需要关注它的兄弟fiber即可，因为一次遍历只处理同层级的兄弟fiber
    //     // 找到前一个兄弟fiber，它的sibling指向下一个兄弟fiber
    //     preSibling.sibling = childFiber
    //   }
    //   // 更新兄弟fiber
    //   preSibling = childFiber
    // })
    const elements = fiber.getChildren()
    this.reconcileChildren(elements, fiber)
  
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
      console.log("🚀 ~ Reconciler ~ workLoop ~ this.nextUnitOfWork:", this.nextUnitOfWork)
      this.nextUnitOfWork = this.performUnitOfWork(this.nextUnitOfWork)
      shouldYield = deadline.timeRemaining() < 1
    }

    // 构造完成fiber时，调用commitRoot函数，将wipRoot的真实dom添加到父节点中
    // 1. wipRoot存在，说明wipRoot未commit
    // 2. nextUnitOfWork不存在，说明已经向上查回溯到了wipRoot，说明render已结束
    if (this.wipRoot && !this.nextUnitOfWork) { 
      this.committer.commitRoot()
    }
    requestIdleCallback(this.workLoop.bind(this))
  }

  scheduleWork(fiber) {
    this.wipRoot = fiber
    this.nextUnitOfWork = fiber
    this.deletions = []
  }

  startWorkLoop(wipRoot) {
    this.scheduleWork(wipRoot)
    requestIdleCallback(this.workLoop.bind(this))
  }
}

export default new Reconciler()

