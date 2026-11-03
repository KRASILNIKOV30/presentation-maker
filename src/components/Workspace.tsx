import { useCallback, useRef, useState } from 'react'
import type { Presentation } from '../types/presentation.js'
import type { Slide } from '../types/slide.js'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants.js'
import { dispatch } from '../editor.js'
import { removeObjectsFromActiveSlide } from '../functions/editorActions.js'
import { useDeleteHotkey } from '../hooks/useHotkeys.js'
import { useElementSize } from '../hooks/useElementSize.js'
import { EditableSlide } from './EditableSlide.js'
import { SlideProperties } from './SlideProperties.js'
import styles from './Workspace.module.css'

type WorkspaceProps = {
    presentation: Presentation,
}

type SlideEditorProps = {
    slide: Slide,
}

const MIN_SCALE = 0.1

function SlideEditor({ slide }: SlideEditorProps) {
    const canvasRef = useRef<HTMLDivElement>(null)
    const { width, height } = useElementSize(canvasRef)
    const [selectedIds, setSelectedIds] = useState<string[]>([])

    // ids of objects that were removed (e.g. by undo) are dropped from the selection
    const validSelectedIds = selectedIds.filter(id => slide.objects.some(object => object.id === id))

    const scale = width > 0 && height > 0
        ? Math.max(Math.min(width / SLIDE_WIDTH, height / SLIDE_HEIGHT), MIN_SCALE)
        : MIN_SCALE

    const hasSelection = validSelectedIds.length > 0
    const selectionKey = validSelectedIds.join(',')
    const handleDelete = useCallback(() => {
        dispatch(removeObjectsFromActiveSlide, selectionKey.split(','))
        setSelectedIds([])
    }, [selectionKey])
    useDeleteHotkey(hasSelection, handleDelete)

    return (
        <>
            <div ref={canvasRef} className={styles.canvas}>
                {width > 0 && (
                    <EditableSlide
                        slide={slide}
                        scale={scale}
                        selectedIds={validSelectedIds}
                        onSelect={setSelectedIds}
                    />
                )}
            </div>
            <SlideProperties slide={slide} selectedIds={validSelectedIds} />
        </>
    )
}

function Workspace({ presentation }: WorkspaceProps) {
    const slide = presentation.slides.find(item => item.id === presentation.activeSlideId)
    if (!slide) {
        return (
            <div className={styles.workspace}>
                <div className={styles.placeholder}>
                    <p className={styles.placeholderTitle}>Нет слайдов</p>
                    <p>Нажмите «+ Слайд» на панели инструментов, чтобы добавить слайд.</p>
                </div>
            </div>
        )
    }
    return (
        <div className={styles.workspace}>
            <SlideEditor key={slide.id} slide={slide} />
        </div>
    )
}

export {
    Workspace,
}
