import type { Presentation } from '../types/presentation.js'
import { dispatch } from '../editor.js'
import { setActiveSlide } from '../functions/slide.js'
import { removeSlide } from '../functions/editorActions.js'
import { SlidePreview } from './SlidePreview.js'
import styles from './SlideList.module.css'

type SlideListProps = {
    presentation: Presentation,
}

const THUMBNAIL_SCALE = 0.18

function SlideList({ presentation }: SlideListProps) {
    return (
        <nav className={styles.list}>
            {presentation.slides.map((slide, index) => {
                const isActive = slide.id === presentation.activeSlideId
                return (
                    <div
                        key={slide.id}
                        className={isActive ? `${styles.item} ${styles.active}` : styles.item}
                        onClick={() => dispatch(setActiveSlide, slide.id)}
                        onContextMenu={event => {
                            event.preventDefault()
                            if (window.confirm(`Удалить слайд «${slide.name}»?`)) {
                                dispatch(removeSlide, slide.id)
                            }
                        }}
                    >
                        <span className={styles.index}>{index + 1}</span>
                        <div className={styles.thumbnail}>
                            <SlidePreview slide={slide} scale={THUMBNAIL_SCALE} />
                            <span className={styles.name}>{slide.name}</span>
                        </div>
                    </div>
                )
            })}
        </nav>
    )
}

export {
    SlideList,
}
