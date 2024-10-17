import { createElement } from "./react-dom"
import { createNestedStructure } from '../../utils'
const App = createElement(
  'div',
  { id: 'app' },
  createElement('h1', null, 'Deep Nesting Performance Test'),
  createNestedStructure(3000)
)

export default App