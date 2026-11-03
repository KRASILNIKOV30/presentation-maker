import type { Presentation } from './types/presentation.js'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Modifier<P = any> = (model: Presentation, params: P) => Presentation

type EditorChangeHandler = () => void

type HistoryState = {
    canUndo: boolean,
    canRedo: boolean,
}

const MAX_HISTORY = 100

let state: Presentation | null = null
let past: Presentation[] = []
let future: Presentation[] = []
const changeHandlers = new Set<EditorChangeHandler>()
let previewMode = false
let previewSlideIndex = 0

function notify(): void {
    changeHandlers.forEach(handler => handler())
}

function setInitialState(presentation: Presentation): void {
    state = presentation
    past = []
    future = []
}

function getState(): Presentation | null {
    return state
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function dispatch<P = any>(modifier: Modifier<P>, params: P | null = null): void {
    if (state === null) {
        console.error('Editor state is not initialized. Call setInitialState first.')
        return
    }
    const next = modifier(state, params as P)
    if (next === state) {
        return
    }
    past = [...past, state].slice(-MAX_HISTORY)
    future = []
    state = next
    notify()
}

function undo(): void {
    const previous = past[past.length - 1]
    if (state === null || previous === undefined) {
        return
    }
    past = past.slice(0, -1)
    future = [state, ...future]
    state = previous
    notify()
}

function redo(): void {
    const next = future[0]
    if (state === null || next === undefined) {
        return
    }
    future = future.slice(1)
    past = [...past, state]
    state = next
    notify()
}

function getCanUndo(): boolean {
    return past.length > 0
}

function getCanRedo(): boolean {
    return future.length > 0
}

function getHistoryState(): HistoryState {
    return { canUndo: getCanUndo(), canRedo: getCanRedo() }
}

function addEditorChangeHandler(handler: EditorChangeHandler): () => void {
    changeHandlers.add(handler)
    return () => {
        changeHandlers.delete(handler)
    }
}

function setPreviewMode(mode: boolean): void {
    previewMode = mode
    if (mode && state !== null) {
        const index = state.slides.findIndex(slide => slide.id === state?.activeSlideId)
        previewSlideIndex = Math.max(index, 0)
    }
    notify()
}

function getPreviewMode(): boolean {
    return previewMode
}

function getPreviewSlideIndex(): number {
    return previewSlideIndex
}

function setPreviewSlideIndex(index: number): void {
    previewSlideIndex = index
    notify()
}

export {
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
}
export type {
    Modifier,
    EditorChangeHandler,
    HistoryState,
}
