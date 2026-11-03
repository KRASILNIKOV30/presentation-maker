import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { App } from './components/App.js'
import { createTestPresentation } from './data.js'
import { addEditorChangeHandler, setInitialState } from './editor.js'

setInitialState(createTestPresentation())

const root = createRoot(document.getElementById('root')!)

function renderApp() {
    root.render(
        <StrictMode>
            <App />
        </StrictMode>,
    )
}

addEditorChangeHandler(renderApp)
renderApp()
