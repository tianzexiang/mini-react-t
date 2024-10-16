import { createElement, useState } from "./react-dom"

function App(props) {
 
  // return createElement('div', null, props.text)
  const [count, setCount] = useState(0)
  const handleClick = () => {
    setCount(pre => pre + 1)
    setCount(pre => pre + 1)
  }
  return createElement('div', {
    onClick: handleClick
  }, createElement('h1', null, 'count: ', `${count}`))
}

export default createElement(App, null)
