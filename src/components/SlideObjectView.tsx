import type { CSSProperties } from 'react'
import type { SlideObject } from '../types/objects.js'
import styles from './SlideObjectView.module.css'

type SlideObjectViewProps = {
    object: SlideObject,
}

function SlideObjectView({ object }: SlideObjectViewProps) {
    const style: CSSProperties = {
        left: object.position.x,
        top: object.position.y,
        width: object.size.width,
        height: object.size.height,
    }
    switch (object.type) {
        case 'text':
            return (
                <div
                    className={`${styles.object} ${styles.text}`}
                    style={{
                        ...style,
                        fontFamily: object.fontFamily,
                        fontSize: object.fontSize,
                        color: object.fontColor,
                    }}
                >
                    {object.content}
                </div>
            )
        case 'image':
            return (
                <div className={styles.object} style={style}>
                    <img className={styles.image} src={object.src} alt="" draggable={false} />
                </div>
            )
    }
}

export {
    SlideObjectView,
}
