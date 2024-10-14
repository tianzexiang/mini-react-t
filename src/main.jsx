// import { createRoot } from 'react-dom/client'
import './index.css'

// import App1 from './mini-react/1/App.js'
// import { createRoot } from './mini-react/1/react-dom/index.js'

// import App2 from './mini-react/2/App.js'
// import { createRoot } from './mini-react/2/react-dom/index.js'

// import App3 from './mini-react/3/App.js'
// import { createRoot } from './mini-react/3/react-dom/index.js'

// import App4 from './mini-react/4/App.js'
// import { createRoot } from './mini-react/4/react-dom/index.js'

// import App5 from './mini-react/5/App.js'
// import { createRoot } from './mini-react/5/react-dom/index.js'


import AppFinal from './mini-react/final/App.js'
import { createRoot } from './mini-react/final/react-dom/index.js' 

const renderer = createRoot(document.getElementById('root'))
renderer.render(AppFinal)



