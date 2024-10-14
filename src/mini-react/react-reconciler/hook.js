import Fiber from "./fiber"

class Hook {
  constructor(reconciler) {
    this.reconciler = reconciler
  }

  useState = (initialState) => {
    // 拿到当前正在构筑的fiber
    const wipFiber = this.reconciler.nextUnitOfWork
    // 拿到当前fiber的hooks
    const oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[wipFiber.hooksIndex]
    // 如果当前fiber有hooks，则使用旧的hooks，否则使用新的hooks
    const hook = oldHook ? oldHook : { state: initialState, queue: [] }
    // 遍历hooks的队列，执行队列中的函数，更新hooks的state
    while(hook.queue.length) {
      const action = hook.queue.shift()
      if (action instanceof Function) {
        hook.state = action(hook.state)
      } else {
        hook.state = action
      }
    }

    // 将更新后的hooks添加到当前fiber的hooks中用作缓存，并更新hooksIndex
    wipFiber.hooks[wipFiber.hooksIndex++] = hook

    const setState = action => {
      hook.queue.push(action)
      this.reconciler.scheduleWork(new Fiber({
        dom: this.reconciler.currentRoot.dom,
        props: this.reconciler.currentRoot.props,
        alternate: this.reconciler.currentRoot
      }))
    }

    return [hook.state, setState]
  }
}

export default Hook
