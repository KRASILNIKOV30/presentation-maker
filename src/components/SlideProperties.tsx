import type { Slide } from '../types/slide.js'
import { dispatch } from '../editor.js'
import { addTextToActiveSlide } from '../functions/editorActions.js'
import { BackgroundPanel } from './BackgroundPanel.js'
import { Button } from './Button.js'
import { TextStylePanel } from './TextStylePanel.js'
import styles from './SlideProperties.module.css'

type SlidePropertiesProps = {
    slide: Slide,
    selectedIds: string[],
}

function SlideProperties({ slide, selectedIds }: SlidePropertiesProps) {
    const selectedObject = selectedIds.length === 1
        ? slide.objects.find(object => object.id === selectedIds[0])
        : undefined

    return (
        <aside className={styles.panel}>
            <h2 className={styles.title}>Свойства</h2>
            <div className={styles.row}>Объектов: {slide.objects.length}</div>
            <Button text="+ Текст" onClick={() => dispatch(addTextToActiveSlide)} />
            <hr className={styles.divider} />
            {selectedIds.length === 0 && <BackgroundPanel slide={slide} />}
            {selectedIds.length > 1 && <div className={styles.row}>Выбрано объектов: {selectedIds.length}</div>}
            {selectedObject?.type === 'text' && <TextStylePanel object={selectedObject} />}
            {selectedObject?.type === 'image' && <div className={styles.row}>Выбрано изображение</div>}
        </aside>
    )
}

export {
    SlideProperties,
}
