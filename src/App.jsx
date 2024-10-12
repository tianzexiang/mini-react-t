import { createElement } from "./mini-react/react-dom"

export default function App(props) {
  return createElement('div', null, props.text)
}
