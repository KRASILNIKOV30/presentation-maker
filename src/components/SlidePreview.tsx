import type { Slide } from '../types/slide.js'
import { SLIDE_WIDTH, SLIDE_HEIGHT } from '../constants.js'
import { getBackgroundStyle } from '../utils/slideStyle.js'
import { SlideObjectView } from './SlideObjectView.js'
import styles from './SlidePreview.module.css'

type SlidePreviewProps = {
    slide: Slide,
    scale?: number,
    className?: string,
}

function SlidePreview({ slide, scale = 1, className }: SlidePreviewProps) {
    const outerClass = className ? `${styles.outer} ${className}` : styles.outer
    return (
        <div
            className={outerClass}
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
            >
                {slide.objects.map(object => (
                    <SlideObjectView key={object.id} object={object} />
                ))}
            </div>
        </div>
    )
}

export {
    SlidePreview,
}
