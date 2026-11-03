import { useEffect, useState } from 'react'
import type { TextObject } from '../types/objects.js'
import { dispatch } from '../editor.js'
import { updateTextStyleOnActiveSlide } from '../functions/editorActions.js'
import { Button } from './Button.js'
import { Select } from './Select.js'
import type { SelectOption } from './Select.js'
import { TextInput } from './TextInput.js'
import styles from './TextStylePanel.module.css'

type TextStylePanelProps = {
    object: TextObject,
}

const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 200

const FONT_OPTIONS: SelectOption[] = [
    'Arial',
    'Verdana',
    'Georgia',
    'Times New Roman',
    'Courier New',
    'Trebuchet MS',
    'Tahoma',
    'Impact',
].map(font => ({ value: font, label: font }))

function TextStylePanel({ object }: TextStylePanelProps) {
    const [fontFamily, setFontFamily] = useState(object.fontFamily)
    const [fontSize, setFontSize] = useState(String(object.fontSize))
    const [fontColor, setFontColor] = useState(object.fontColor)

    useEffect(() => {
        /* eslint-disable react-hooks/set-state-in-effect -- лабораторная требует синхронизацию через useEffect */
        setFontFamily(object.fontFamily)
        setFontSize(String(object.fontSize))
        setFontColor(object.fontColor)
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [object.id, object.fontFamily, object.fontSize, object.fontColor])

    function apply(style: { fontFamily: string, fontSize: number, fontColor: string }) {
        dispatch(updateTextStyleOnActiveSlide, { id: object.id, ...style })
    }

    function handleFontFamily(value: string) {
        setFontFamily(value)
        apply({ fontFamily: value, fontSize: object.fontSize, fontColor })
    }

    function handleFontSizeText(value: string) {
        setFontSize(value)
        const size = Number(value)
        if (value.trim() === '' || !Number.isFinite(size) || size < MIN_FONT_SIZE || size > MAX_FONT_SIZE) {
            return
        }
        apply({ fontFamily, fontSize: Math.round(size), fontColor })
    }

    function changeFontSize(delta: number) {
        const size = Math.min(Math.max(object.fontSize + delta, MIN_FONT_SIZE), MAX_FONT_SIZE)
        setFontSize(String(size))
        apply({ fontFamily, fontSize: size, fontColor })
    }

    function handleFontColor(value: string) {
        setFontColor(value)
        apply({ fontFamily, fontSize: object.fontSize, fontColor: value })
    }

    return (
        <section className={styles.panel}>
            <h3 className={styles.title}>Текст</h3>
            <div className={styles.field}>
                <span>Шрифт</span>
                <Select value={fontFamily} options={FONT_OPTIONS} onChange={handleFontFamily} />
            </div>
            <div className={styles.field}>
                <span>Размер</span>
                <div className={styles.sizeControls}>
                    <Button text="−" onClick={() => changeFontSize(-1)} disabled={object.fontSize <= MIN_FONT_SIZE} />
                    <TextInput
                        className={styles.sizeInput}
                        type="number"
                        min={MIN_FONT_SIZE}
                        max={MAX_FONT_SIZE}
                        value={fontSize}
                        onChange={handleFontSizeText}
                    />
                    <Button text="+" onClick={() => changeFontSize(1)} disabled={object.fontSize >= MAX_FONT_SIZE} />
                </div>
            </div>
            <div className={styles.field}>
                <span>Цвет</span>
                <TextInput type="color" value={fontColor} onChange={handleFontColor} />
            </div>
        </section>
    )
}

export {
    TextStylePanel,
}
