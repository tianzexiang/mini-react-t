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
    // 拿到父容器的dom，将fiber的真实dom添加到父容器中
    // 如果fiber没有dom(函数组件fiber相当于在当前有dom的fiber又向外套了一层)，则向上回溯，直到找到有dom的fiber
    const domParent = fiber.parent.dom;
    domParent.appendChild(fiber.dom)
    // 处理子fiber
    this.commitWork(fiber.child)
    // 处理兄弟fiber
    this.commitWork(fiber.sibling)
  }
}

export default Committer
