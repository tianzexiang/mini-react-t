// import { createRoot } from 'react-dom/client'
import { Demo } from './App.jsx'
import './index.css'
import { createRoot } from './mini-react/react-dom/index.js' 

const root = createRoot(document.getElementById('root'))
root.render(Demo('test', root))



