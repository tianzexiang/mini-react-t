// import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createRoot, createElement } from './mini-react/react-dom/index.js' 

const renderer = createRoot(document.getElementById('root'))
renderer.render(createElement(App, { text: 'Hello, World!' }))



