// import { createRoot } from 'react-dom/client'
// import App from './App.jsx'
import './index.css'
import { createRoot, createElement } from './mini-react/react-dom/index.js'  

const element = createElement('h1', { id: 'title' }, 'Hello World')
createRoot(document.getElementById('root')).render(element)



