class Hook {
  constructor(reconciler) {
    this.reconciler = reconciler
  }

  useState(initialState) {
    const fiber = this.reconciler.wipFiber
    const oldHook = fiber.alternate && fiber.alternate.hooks && fiber.alternate.hooks[fiber.hooksIndex]
    const hook = oldHook ? oldHook : { state: initialState, queue: [] }
    hook.queue.forEach(action => {
      if (action instanceof Function) {
        hook.state = action(hook.state)
      } else {
        hook.state = action
      }
    })

    fiber.hooks[fiber.hooksIndex++] = hook

    const setState = action => {
      hook.queue.push(action)
      this.reconciler.scheduleWork(fiber)
    }

    return [hook.state, setState]
  }
}

export default Hook
