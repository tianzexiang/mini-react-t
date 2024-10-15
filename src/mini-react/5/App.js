import { createElement } from "./react-dom"

function App(props) {
  return createElement('div', { id: 'app' }, 'Hello World')
}

export default createElement(App, null)
