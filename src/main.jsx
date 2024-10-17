// import { createRoot } from 'react-dom/client'
import './index.css'

// import App from './mini-react/1/App.js'
// import { createRoot } from './mini-react/1/react-dom/index.js'

// import App from './mini-react/2/App.js'
// import { createRoot } from './mini-react/2/react-dom/index.js'

import App from './mini-react/3/App.js'
import { createRoot } from './mini-react/3/react-dom/index.js'

// import App from './mini-react/4/App.js'
// import { createRoot } from './mini-react/4/react-dom/index.js'

// import App from './mini-react/5/App.js'
// import { createRoot } from './mini-react/5/react-dom/index.js'

// import App from './mini-react/6/App.js'
// import { createRoot } from './mini-react/6/react-dom/index.js' 

const renderer = createRoot(document.getElementById('root'))
console.time('render')
renderer.render(App)
console.timeEnd('render')



