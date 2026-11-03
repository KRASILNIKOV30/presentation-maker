import { describe, it, expect, vi, beforeEach } from 'vitest'
import {
    setInitialState,
    getState,
    dispatch,
    undo,
    redo,
    getCanUndo,
    getCanRedo,
    getHistoryState,
    addEditorChangeHandler,
    setPreviewMode,
    getPreviewMode,
    getPreviewSlideIndex,
    setPreviewSlideIndex,
} from '../editor.js'
import { createTestPresentation } from '../data.js'
import { updatePresentationName } from '../functions/presentation.js'
import { setActiveSlide } from '../functions/slide.js'

describe('editor', () => {
    beforeEach(() => {
        setInitialState(createTestPresentation())
    })

    it('dispatch updates state and calls the handler', () => {
        const handler = vi.fn()
        const unsubscribe = addEditorChangeHandler(handler)
        dispatch(updatePresentationName, 'Новое имя')
        expect(getState()?.name).toBe('Новое имя')
        expect(handler).toHaveBeenCalledTimes(1)
        unsubscribe()
    })

    it('toggles preview mode starting from the active slide', () => {
        const handler = vi.fn()
        const p = createTestPresentation()
        setInitialState(p)
        dispatch(setActiveSlide, p.slides[2].id)
        const unsubscribe = addEditorChangeHandler(handler)
        setPreviewMode(true)
        expect(getPreviewMode()).toBe(true)
        expect(getPreviewSlideIndex()).toBe(2)
        setPreviewSlideIndex(3)
        expect(getPreviewSlideIndex()).toBe(3)
        setPreviewMode(false)
        expect(getPreviewMode()).toBe(false)
        expect(handler).toHaveBeenCalledTimes(3)
        unsubscribe()
    })

    it('undo and redo restore states', () => {
        const initial = getState()
        dispatch(updatePresentationName, 'A')
        dispatch(updatePresentationName, 'B')
        undo()
        expect(getState()?.name).toBe('A')
        undo()
        expect(getState()).toBe(initial)
        redo()
        expect(getState()?.name).toBe('A')
        redo()
        expect(getState()?.name).toBe('B')
    })

    it('does nothing when undo/redo stacks are empty', () => {
        const handler = vi.fn()
        const unsubscribe = addEditorChangeHandler(handler)
        const initial = getState()
        undo()
        redo()
        expect(getState()).toBe(initial)
        expect(handler).not.toHaveBeenCalled()
        unsubscribe()
    })

    it('clears the future on a new dispatch', () => {
        dispatch(updatePresentationName, 'A')
        undo()
        expect(getCanRedo()).toBe(true)
        dispatch(updatePresentationName, 'C')
        expect(getCanRedo()).toBe(false)
        redo()
        expect(getState()?.name).toBe('C')
    })

    it('reports canUndo / canRedo flags', () => {
        expect(getHistoryState()).toEqual({ canUndo: false, canRedo: false })
        dispatch(updatePresentationName, 'A')
        expect(getHistoryState()).toEqual({ canUndo: true, canRedo: false })
        undo()
        expect(getCanUndo()).toBe(false)
        expect(getCanRedo()).toBe(true)
    })

    it('setInitialState resets history', () => {
        dispatch(updatePresentationName, 'A')
        undo()
        setInitialState(createTestPresentation())
        expect(getHistoryState()).toEqual({ canUndo: false, canRedo: false })
    })

    it('does not record or notify a no-op dispatch', () => {
        const handler = vi.fn()
        const unsubscribe = addEditorChangeHandler(handler)
        dispatch(state => state)
        expect(getCanUndo()).toBe(false)
        expect(handler).not.toHaveBeenCalled()
        unsubscribe()
    })

    it('notifies all handlers and stops after unsubscribe', () => {
        const first = vi.fn()
        const second = vi.fn()
        const unsubscribeFirst = addEditorChangeHandler(first)
        const unsubscribeSecond = addEditorChangeHandler(second)
        dispatch(updatePresentationName, 'A')
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(1)
        unsubscribeFirst()
        undo()
        expect(first).toHaveBeenCalledTimes(1)
        expect(second).toHaveBeenCalledTimes(2)
        unsubscribeSecond()
    })

    it('caps history at 100 entries', () => {
        for (let i = 0; i < 120; i++) {
            dispatch(updatePresentationName, `N${i}`)
        }
        let steps = 0
        while (getCanUndo()) {
            undo()
            steps++
        }
        expect(steps).toBe(100)
    })
})
