import type { Slide } from '../types/slide.js'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants.js'
import { useSlideInteraction } from '../hooks/useSlideInteraction.js'
import { getBackgroundStyle } from '../utils/slideStyle.js'
import { SlideObjectView } from './SlideObjectView.js'
import styles from './EditableSlide.module.css'

type EditableSlideProps = {
    slide: Slide,
    scale: number,
    selectedIds: string[],
    onSelect: (ids: string[]) => void,
}

const SELECTION_COLOR = '#1a73e8'
const HANDLE_SIZE = 10

function EditableSlide({ slide, scale, selectedIds, onSelect }: EditableSlideProps) {
    const {
        dragPreview,
        resizePreview,
        handleObjectMouseDown,
        handleObjectClick,
        handleSlideMouseDown,
        handleSlideClick,
        handleResizeMouseDown,
    } = useSlideInteraction({ slide, scale, selectedIds, onSelect })

    return (
        <div
            className={styles.outer}
            style={{ width: SLIDE_WIDTH * scale, height: SLIDE_HEIGHT * scale }}
        >
            <div
                className={styles.inner}
                style={{
                    ...getBackgroundStyle(slide.background),
                    width: SLIDE_WIDTH,
                    height: SLIDE_HEIGHT,
                    transform: `scale(${scale})`,
                }}
                onMouseDown={handleSlideMouseDown}
                onClick={handleSlideClick}
            >
                {slide.objects.map(object => {
                    const isSelected = selectedIds.includes(object.id)
                    const shift = dragPreview?.ids.includes(object.id) ? dragPreview : null
                    const size = resizePreview?.id === object.id ? resizePreview : object.size
                    const width = size.width
                    const height = size.height
                    return (
                        <div
                            key={object.id}
                            className={styles.item}
                            style={{
                                left: object.position.x + (shift?.dx ?? 0),
                                top: object.position.y + (shift?.dy ?? 0),
                                width,
                                height,
                                outline: isSelected ? `${2 / scale}px solid ${SELECTION_COLOR}` : undefined,
                                boxShadow: isSelected ? `0 0 ${8 / scale}px rgba(26, 115, 232, 0.5)` : undefined,
                            }}
                            onMouseDown={event => handleObjectMouseDown(event, object)}
                            onClick={event => handleObjectClick(event, object)}
                        >
                            <SlideObjectView
                                object={{ ...object, position: { x: 0, y: 0 }, size: { width, height } }}
                            />
                            {isSelected && (
                                <div
                                    className={styles.handle}
                                    style={{
                                        width: HANDLE_SIZE / scale,
                                        height: HANDLE_SIZE / scale,
                                        right: -HANDLE_SIZE / 2 / scale,
                                        bottom: -HANDLE_SIZE / 2 / scale,
                                    }}
                                    onMouseDown={event => handleResizeMouseDown(event, object)}
                                    onClick={event => event.stopPropagation()}
                                />
                            )}
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export {
    EditableSlide,
}
