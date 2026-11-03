import { useCallback, useRef } from 'react'
import type { ChangeEvent } from 'react'

function useImageFilePicker(onLoad: (dataUrl: string) => void) {
    const inputRef = useRef<HTMLInputElement>(null)

    const open = useCallback(() => inputRef.current?.click(), [])

    const handleChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        const input = event.target
        const file = input.files?.[0]
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader()
            reader.onload = () => {
                if (typeof reader.result === 'string') {
                    onLoad(reader.result)
                }
            }
            reader.readAsDataURL(file)
        }
        input.value = ''
    }, [onLoad])

    return { inputRef, open, handleChange }
}

export {
    useImageFilePicker,
}
