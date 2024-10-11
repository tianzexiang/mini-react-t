import { EFFECT_TAG } from "../constants"

class Committer {
  constructor(reconciler) {
    this.reconciler = reconciler
  }

  commitRoot() {
    /** 
      * 需要先执行删除的commit，有以下几点考虑：
      * 1. 释放资源：先删除不需要的节点可以尽早释放内存和其他资源，特别是在大型应用中，这可以提高性能。
      * 2. 避免不必要的操作：如果先添加新节点再删除旧节点，可能会导致一些不必要的中间状态和操作。先删除可以避免这些多余的步骤。
      * 3. DOM 操作优化：在 DOM 操作中，删除节点通常比添加节点更快。先执行删除可以让后续的添加操作在一个更"干净"的 DOM 树上进行。
      * 4. 防止 ID 冲突：如果有使用相同 ID 的新旧元素，先删除旧元素可以防止 ID 冲突。
      * 5. 动画和过渡效果：在某些情况下，先删除元素可以让离开动画更自然地执行，而不会被新元素的进入动画干扰。
      */
    this.reconciler.deletions.forEach(this.commitWork)
    this.commitWork(this.reconciler.wipFiber.child)
    // commit阶段，更新currentRoot为wipFiber
    this.reconciler.currentRoot = this.reconciler.wipFiber
    this.reconciler.wipFiber = null
  }

  commitWork(fiber) {
    if(!fiber) {
      return 
    }
    // 拿到父容器的dom，将fiber的真实dom添加到父容器中
    const container = fiber.parent.dom
    // container.appendChild(fiber.dom)
    if (fiber.effectTag === EFFECT_TAG.PLACEMENT && fiber.dom !== null) {
      container.appendChild(fiber.dom)
    } else if (fiber.effectTag === EFFECT_TAG.UPDATE && fiber.dom !== null) {
      fiber.updateDom()
    } else if (fiber.effectTag === EFFECT_TAG.DELETION) {
      container.removeChild(fiber.dom)
    }
    
    // 处理子fiber
    this.commitWork(fiber.child)
    // 处理兄弟fiber
    this.commitWork(fiber.sibling)
  }

}

export default Committer
