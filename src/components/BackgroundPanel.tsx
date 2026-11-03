import { useEffect, useState } from 'react'
import type { Slide } from '../types/slide.js'
import { dispatch } from '../editor.js'
import {
    setActiveSlideBackgroundColor,
    setActiveSlideBackgroundImage,
    setActiveSlideBackgroundGradient,
    clearActiveSlideBackground,
} from '../functions/editorActions.js'
import { useImageFilePicker } from '../hooks/useImageFilePicker.js'
import { Button } from './Button.js'
import { HiddenFileInput } from './HiddenFileInput.js'
import { Select } from './Select.js'
import type { SelectOption } from './Select.js'
import { TextInput } from './TextInput.js'
import styles from './BackgroundPanel.module.css'

type BackgroundPanelProps = {
    slide: Slide,
}

type GradientKind = 'linear' | 'radial'

const KIND_OPTIONS: SelectOption[] = [
    { value: 'linear', label: 'Линейный' },
    { value: 'radial', label: 'Радиальный' },
]

function handleBackgroundImageLoad(dataUrl: string) {
    dispatch(setActiveSlideBackgroundImage, dataUrl)
}

function BackgroundPanel({ slide }: BackgroundPanelProps) {
    const { background } = slide
    const [isOpen, setIsOpen] = useState(true)
    const [kind, setKind] = useState<GradientKind>(background.type === 'gradient' ? background.kind : 'linear')
    const [firstColor, setFirstColor] = useState(background.type === 'gradient' ? background.colors[0] : '#667eea')
    const [secondColor, setSecondColor] = useState(background.type === 'gradient' ? background.colors[1] ?? '#764ba2' : '#764ba2')
    const [angle, setAngle] = useState(background.type === 'gradient' ? String(background.angle) : '90')
    const { inputRef, open, handleChange } = useImageFilePicker(handleBackgroundImageLoad)

    const gradient = background.type === 'gradient' ? background : null
    const gradientKind = gradient?.kind
    const gradientAngle = gradient?.angle
    const gradientFirst = gradient?.colors[0]
    const gradientSecond = gradient?.colors[1]

    useEffect(() => {
        if (gradientKind === undefined || gradientAngle === undefined || gradientFirst === undefined) {
            return
        }
        /* eslint-disable react-hooks/set-state-in-effect -- лабораторная требует синхронизацию через useEffect */
        setKind(gradientKind)
        setAngle(String(gradientAngle))
        setFirstColor(gradientFirst)
        if (gradientSecond !== undefined) {
            setSecondColor(gradientSecond)
        }
        /* eslint-enable react-hooks/set-state-in-effect */
    }, [slide.id, gradientKind, gradientAngle, gradientFirst, gradientSecond])

    function handleApplyGradient() {
        const parsed = Number(angle)
        const normalized = Number.isFinite(parsed) && angle.trim() !== '' ? Math.min(Math.max(parsed, 0), 360) : 0
        dispatch(setActiveSlideBackgroundGradient, {
            colors: [firstColor, secondColor],
            angle: normalized,
            kind,
        })
    }

    return (
        <section className={styles.panel}>
            <div className={styles.header}>
                <h3 className={styles.title}>Фон</h3>
                <Button text={isOpen ? 'Свернуть' : 'Развернуть'} onClick={() => setIsOpen(value => !value)} />
            </div>
            {isOpen && (
                <>
                    <div className={styles.row}>
                        <span>Цвет фона</span>
                        <TextInput
                            type="color"
                            value={background.type === 'color' ? background.color : '#ffffff'}
                            onChange={value => dispatch(setActiveSlideBackgroundColor, value)}
                        />
                    </div>
                    <Button text="Добавить фоновое изображение" onClick={open} />
                    <HiddenFileInput inputRef={inputRef} onChange={handleChange} />
                    <h4 className={styles.subtitle}>Градиент</h4>
                    <Select value={kind} options={KIND_OPTIONS} onChange={value => setKind(value as GradientKind)} />
                    <div className={styles.row}>
                        <span>Цвет 1</span>
                        <TextInput type="color" value={firstColor} onChange={setFirstColor} />
                    </div>
                    <div className={styles.row}>
                        <span>Цвет 2</span>
                        <TextInput type="color" value={secondColor} onChange={setSecondColor} />
                    </div>
                    <div className={styles.row}>
                        <span>Угол, °</span>
                        <TextInput
                            className={styles.angleInput}
                            type="number"
                            min={0}
                            max={360}
                            value={angle}
                            disabled={kind === 'radial'}
                            onChange={setAngle}
                        />
                    </div>
                    <Button text="Применить градиент" onClick={handleApplyGradient} />
                    <Button text="Убрать фон" onClick={() => dispatch(clearActiveSlideBackground)} />
                </>
            )}
        </section>
    )
}

export {
    BackgroundPanel,
}
