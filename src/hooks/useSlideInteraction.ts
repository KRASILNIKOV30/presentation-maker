import { useEffect, useRef, useState } from 'react'
import type { MouseEvent as ReactMouseEvent } from 'react'
import type { Slide } from '../types/slide.js'
import type { SlideObject } from '../types/objects.js'
import { dispatch } from '../editor.js'
import { moveObjectsOnActiveSlide, resizeObjectOnActiveSlide } from '../functions/editorActions.js'

type DragPreview = {
    ids: string[],
    dx: number,
    dy: number,
}

type ResizePreview = {
    id: string,
    width: number,
    height: number,
}

type DragData = {
    ids: string[],
    origins: { id: string, x: number, y: number }[],
    startX: number,
    startY: number,
    dx: number,
    dy: number,
    moved: boolean,
}

type ResizeData = {
    id: string,
    startX: number,
    startY: number,
    startWidth: number,
    startHeight: number,
    width: number,
    height: number,
}

type SlideInteractionParams = {
    slide: Slide,
    scale: number,
    selectedIds: string[],
    onSelect: (ids: string[]) => void,
}

const DRAG_THRESHOLD = 3
const MIN_SIZE = 30

function useSlideInteraction({ slide, scale, selectedIds, onSelect }: SlideInteractionParams) {
    const [dragPreview, setDragPreview] = useState<DragPreview | null>(null)
    const [resizePreview, setResizePreview] = useState<ResizePreview | null>(null)
    const dragRef = useRef<DragData | null>(null)
    const resizeRef = useRef<ResizeData | null>(null)
    const stopTrackingRef = useRef<(() => void) | null>(null)
    // true when the click that follows mouseup must not change the selection
    const skipClickRef = useRef(false)

    useEffect(() => () => stopTrackingRef.current?.(), [])

    function track(onMove: (event: MouseEvent) => void, onUp: () => void) {
        stopTrackingRef.current?.()
        function stop() {
            document.removeEventListener('mousemove', onMove)
            document.removeEventListener('mouseup', handleUp)
            stopTrackingRef.current = null
        }
        function handleUp() {
            stop()
            onUp()
        }
        document.addEventListener('mousemove', onMove)
        document.addEventListener('mouseup', handleUp)
        stopTrackingRef.current = stop
    }

    function handleObjectMouseDown(event: ReactMouseEvent, object: SlideObject) {
        if (event.button !== 0) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        skipClickRef.current = false
        let ids = selectedIds
        if (!selectedIds.includes(object.id)) {
            ids = event.shiftKey ? [...selectedIds, object.id] : [object.id]
            onSelect(ids)
            skipClickRef.current = true
        }
        dragRef.current = {
            ids,
            origins: slide.objects
                .filter(item => ids.includes(item.id))
                .map(item => ({ id: item.id, x: item.position.x, y: item.position.y })),
            startX: event.clientX,
            startY: event.clientY,
            dx: 0,
            dy: 0,
            moved: false,
        }
        track(handleDragMove, handleDragEnd)
    }

    function handleDragMove(event: MouseEvent) {
        const data = dragRef.current
        if (!data) {
            return
        }
        const screenDx = event.clientX - data.startX
        const screenDy = event.clientY - data.startY
        if (!data.moved && Math.hypot(screenDx, screenDy) < DRAG_THRESHOLD) {
            return
        }
        data.moved = true
        data.dx = screenDx / scale
        data.dy = screenDy / scale
        setDragPreview({ ids: data.ids, dx: data.dx, dy: data.dy })
    }

    function handleDragEnd() {
        const data = dragRef.current
        dragRef.current = null
        if (!data || !data.moved) {
            return
        }
        skipClickRef.current = true
        setDragPreview(null)
        dispatch(
            moveObjectsOnActiveSlide,
            data.origins.map(origin => ({
                id: origin.id,
                x: Math.round(origin.x + data.dx),
                y: Math.round(origin.y + data.dy),
            })),
        )
    }

    function handleObjectClick(event: ReactMouseEvent, object: SlideObject) {
        event.stopPropagation()
        if (skipClickRef.current) {
            skipClickRef.current = false
            return
        }
        if (event.shiftKey) {
            onSelect(selectedIds.filter(id => id !== object.id))
        } else {
            onSelect([object.id])
        }
    }

    function handleSlideMouseDown() {
        skipClickRef.current = false
    }

    function handleSlideClick() {
        if (skipClickRef.current) {
            skipClickRef.current = false
            return
        }
        if (selectedIds.length > 0) {
            onSelect([])
        }
    }

    function handleResizeMouseDown(event: ReactMouseEvent, object: SlideObject) {
        if (event.button !== 0) {
            return
        }
        event.preventDefault()
        event.stopPropagation()
        skipClickRef.current = false
        resizeRef.current = {
            id: object.id,
            startX: event.clientX,
            startY: event.clientY,
            startWidth: object.size.width,
            startHeight: object.size.height,
            width: object.size.width,
            height: object.size.height,
        }
        track(handleResizeMove, handleResizeEnd)
    }

    function handleResizeMove(event: MouseEvent) {
        const data = resizeRef.current
        if (!data) {
            return
        }
        data.width = Math.max(data.startWidth + (event.clientX - data.startX) / scale, MIN_SIZE)
        data.height = Math.max(data.startHeight + (event.clientY - data.startY) / scale, MIN_SIZE)
        setResizePreview({ id: data.id, width: data.width, height: data.height })
    }

    function handleResizeEnd() {
        const data = resizeRef.current
        resizeRef.current = null
        skipClickRef.current = true
        setResizePreview(null)
        if (!data || (data.width === data.startWidth && data.height === data.startHeight)) {
            return
        }
        dispatch(resizeObjectOnActiveSlide, {
            id: data.id,
            width: Math.round(data.width),
            height: Math.round(data.height),
        })
    }

    return {
        dragPreview,
        resizePreview,
        handleObjectMouseDown,
        handleObjectClick,
        handleSlideMouseDown,
        handleSlideClick,
        handleResizeMouseDown,
    }
}

export {
    useSlideInteraction,
}
