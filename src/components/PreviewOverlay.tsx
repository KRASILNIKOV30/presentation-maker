import type { KeyboardEvent } from 'react'
import { createPortal } from 'react-dom'
import type { Presentation } from '../types/presentation.js'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants.js'
import { getPreviewSlideIndex, setPreviewSlideIndex } from '../editor.js'
import { Button } from './Button.js'
import { SlidePreview } from './SlidePreview.js'
import styles from './PreviewOverlay.module.css'

type PreviewOverlayProps = {
    presentation: Presentation,
    onClose: () => void,
}

const CONTROLS_HEIGHT = 80

function PreviewOverlay({ presentation, onClose }: PreviewOverlayProps) {
    const total = presentation.slides.length
    const index = Math.min(Math.max(getPreviewSlideIndex(), 0), Math.max(total - 1, 0))
    const slide = presentation.slides[index]

    function goTo(newIndex: number) {
        if (newIndex >= 0 && newIndex < total) {
            setPreviewSlideIndex(newIndex)
        }
    }

    function handleKeyDown(event: KeyboardEvent) {
        switch (event.key) {
            case 'Escape':
                onClose()
                break
            case 'ArrowLeft':
                goTo(index - 1)
                break
            case 'ArrowRight':
                goTo(index + 1)
                break
        }
    }

    const scale = Math.min(
        window.innerWidth / SLIDE_WIDTH,
        (window.innerHeight - CONTROLS_HEIGHT) / SLIDE_HEIGHT,
    )

    return createPortal(
        <div className={styles.overlay} tabIndex={0} autoFocus onKeyDown={handleKeyDown}>
            {slide ? (
                <div className={styles.stage}>
                    <SlidePreview slide={slide} scale={scale} />
                </div>
            ) : (
                <div className={styles.stage}>
                    <p className={styles.message}>В презентации нет слайдов</p>
                </div>
            )}
            <div className={styles.controls}>
                <Button text="Назад" onClick={() => goTo(index - 1)} disabled={index <= 0} />
                <span className={styles.counter}>{total === 0 ? 0 : index + 1} / {total}</span>
                <Button text="Далее" onClick={() => goTo(index + 1)} disabled={index >= total - 1} />
                <Button text="Закрыть" onClick={onClose} />
            </div>
        </div>,
        document.body,
    )
}

export {
    PreviewOverlay,
}
