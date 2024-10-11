import { createElement } from "./mini-react/react-dom"

const handleInput = (value, renderer) => {
  console.log("🚀 ~ handleInput ~ value:", value)
  renderer.render(Demo(value, renderer))
}

export const Demo = (value, renderer) => {
  console.log("🚀 ~ Demo ~ value:", value)
  return createElement('div', { id: 'demo' }, createElement('input', { value, onInput: e => handleInput(e.target.value, renderer) }), createElement('p', null, value))
}