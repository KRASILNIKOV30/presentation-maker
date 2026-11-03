import { useCallback, useEffect, useState } from 'react'
import { addEditorChangeHandler, getCanRedo, getCanUndo, redo, undo } from '../editor.js'

function useHistoryUI() {
    const [canUndo, setCanUndo] = useState(getCanUndo())
    const [canRedo, setCanRedo] = useState(getCanRedo())

    useEffect(() => {
        function sync() {
            setCanUndo(getCanUndo())
            setCanRedo(getCanRedo())
        }
        sync()
        return addEditorChangeHandler(sync)
    }, [])

    const onUndo = useCallback(() => undo(), [])
    const onRedo = useCallback(() => redo(), [])

    return { canUndo, canRedo, onUndo, onRedo }
}

export {
    useHistoryUI,
}
