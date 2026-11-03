import { useCallback } from 'react'
import type { Presentation } from '../types/presentation.js'
import { dispatch, setPreviewMode } from '../editor.js'
import { updatePresentationName, savePresentation } from '../functions/presentation.js'
import { addSlide } from '../functions/slide.js'
import { addImageToActiveSlide } from '../functions/editorActions.js'
import { useImageFilePicker } from '../hooks/useImageFilePicker.js'
import { Button } from './Button.js'
import { HiddenFileInput } from './HiddenFileInput.js'
import { TextInput } from './TextInput.js'
import styles from './Toolbar.module.css'

type ToolbarProps = {
    presentation: Presentation,
    canUndo: boolean,
    canRedo: boolean,
    onUndo: () => void,
    onRedo: () => void,
}

function Toolbar({ presentation, canUndo, canRedo, onUndo, onRedo }: ToolbarProps) {
    const handleImageLoad = useCallback((dataUrl: string) => {
        dispatch(addImageToActiveSlide, { imageUrl: dataUrl })
    }, [])
    const { inputRef, open, handleChange } = useImageFilePicker(handleImageLoad)

    function handleSave() {
        const blob = new Blob([savePresentation(presentation)], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = `${presentation.name}.json`
        document.body.appendChild(link)
        link.click()
        link.remove()
        URL.revokeObjectURL(url)
    }

    return (
        <header className={styles.toolbar}>
            <TextInput
                className={styles.name}
                value={presentation.name}
                placeholder="Название презентации"
                onChange={value => dispatch(updatePresentationName, value)}
            />
            <Button text="+ Слайд" onClick={() => dispatch(addSlide)} />
            <Button text="+ Изображение" onClick={open} />
            <HiddenFileInput inputRef={inputRef} onChange={handleChange} />
            <Button text="↩ Отменить" onClick={onUndo} disabled={!canUndo} />
            <Button text="↪ Повторить" onClick={onRedo} disabled={!canRedo} />
            <Button text="Сохранить" onClick={handleSave} />
            <Button text="Просмотр" onClick={() => setPreviewMode(true)} />
        </header>
    )
}

export {
    Toolbar,
}
