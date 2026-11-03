import { getPreviewMode, getState, setPreviewMode } from '../editor.js'
import { useHistoryUI } from '../hooks/useHistoryUI.js'
import { useHotkeys } from '../hooks/useHotkeys.js'
import { PreviewOverlay } from './PreviewOverlay.js'
import { SlideList } from './SlideList.js'
import { Toolbar } from './Toolbar.js'
import { Workspace } from './Workspace.js'
import styles from './App.module.css'

function App() {
    const { canUndo, canRedo, onUndo, onRedo } = useHistoryUI()
    useHotkeys()
    const presentation = getState()
    if (presentation === null) {
        return <div>Загрузка...</div>
    }
    if (getPreviewMode()) {
        return <PreviewOverlay presentation={presentation} onClose={() => setPreviewMode(false)} />
    }
    return (
        <div className={styles.app}>
            <Toolbar
                presentation={presentation}
                canUndo={canUndo}
                canRedo={canRedo}
                onUndo={onUndo}
                onRedo={onRedo}
            />
            <div className={styles.mainArea}>
                <SlideList presentation={presentation} />
                <Workspace presentation={presentation} />
            </div>
        </div>
    )
}

export {
    App,
}
