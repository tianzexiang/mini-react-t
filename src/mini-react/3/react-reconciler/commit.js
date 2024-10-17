class Committer {
  constructor(reconciler) {
    this.reconciler = reconciler
  }

  commitRoot() {
    this.commitWork(this.reconciler.wipRoot.child)
    this.reconciler.wipRoot = null
  }

  commitWork(fiber) {
    if(!fiber) {
      return 
    }
    // 处理子fiber
    this.commitWork(fiber.child)
    // 处理兄弟fiber
    this.commitWork(fiber.sibling)
    // 拿到父容器的dom，将fiber的真实dom添加到父容器中
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom)
  }
}

export default Committer
