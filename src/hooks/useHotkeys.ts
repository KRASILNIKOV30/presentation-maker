import { useEffect } from 'react'
import { getPreviewMode, redo, undo } from '../editor.js'

const NON_TEXT_INPUT_TYPES = ['checkbox', 'radio', 'button', 'submit', 'reset', 'file', 'range', 'color', 'image']

function isEditableTarget(target: EventTarget | null): boolean {
    if (!(target instanceof HTMLElement)) {
        return false
    }
    if (target instanceof HTMLInputElement) {
        return !NON_TEXT_INPUT_TYPES.includes(target.type)
    }
    return target instanceof HTMLTextAreaElement
        || target instanceof HTMLSelectElement
        || target.isContentEditable
}

function useHotkeys() {
    useEffect(() => {
        function handleKeyDown(event: KeyboardEvent) {
            if (!(event.ctrlKey || event.metaKey) || event.altKey || isEditableTarget(event.target)) {
                return
            }
            const key = event.key.toLowerCase()
            if (key === 'z' && !event.shiftKey) {
                event.preventDefault()
                undo()
            } else if (key === 'y' || (key === 'z' && event.shiftKey)) {
                event.preventDefault()
                redo()
            }
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [])
}

function useDeleteHotkey(enabled: boolean, onDelete: () => void) {
    useEffect(() => {
        if (!enabled) {
            return
        }
        function handleKeyDown(event: KeyboardEvent) {
            if (
                (event.key !== 'Delete' && event.key !== 'Backspace')
                || isEditableTarget(event.target)
                || getPreviewMode()
            ) {
                return
            }
            event.preventDefault()
            onDelete()
        }
        document.addEventListener('keydown', handleKeyDown)
        return () => document.removeEventListener('keydown', handleKeyDown)
    }, [enabled, onDelete])
}

export {
    isEditableTarget,
    useHotkeys,
    useDeleteHotkey,
}
