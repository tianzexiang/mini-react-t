import { createElement } from "./mini-react/react-dom"

export default function App() {
  return createElement('h1', { id: 'title' }, 'Hello World')
}