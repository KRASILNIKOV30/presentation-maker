import { useEffect, useState } from 'react'
import type { RefObject } from 'react'

type ElementSize = {
    width: number,
    height: number,
}

function useElementSize(ref: RefObject<HTMLElement | null>): ElementSize {
    const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

    useEffect(() => {
        const element = ref.current
        if (!element) {
            return
        }
        const observer = new ResizeObserver(entries => {
            const { width, height } = entries[0].contentRect
            setSize(prev => prev.width === width && prev.height === height ? prev : { width, height })
        })
        observer.observe(element)
        return () => observer.disconnect()
    }, [ref])

    return size
}

export {
    useElementSize,
}
export type {
    ElementSize,
}
