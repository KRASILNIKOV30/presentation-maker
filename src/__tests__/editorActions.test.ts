import { describe, it, expect } from 'vitest'
import type { Presentation } from '../types/presentation.js'
import {
    setActiveSlideBackgroundColor,
    setActiveSlideBackgroundImage,
    clearActiveSlideBackground,
    addTextToActiveSlide,
    addImageToActiveSlide,
    setActiveSlideBackgroundGradient,
    removeObjectsFromActiveSlide,
    moveObjectsOnActiveSlide,
    resizeObjectOnActiveSlide,
    updateTextStyleOnActiveSlide,
    removeSlide,
} from '../functions/editorActions.js'

function make(activeSlideId: string | null = 'b'): Presentation {
    return {
        id: 'p',
        name: 'P',
        activeSlideId,
        slides: [
            { id: 'a', name: 'A', background: { type: 'none' }, objects: [] },
            { id: 'b', name: 'B', background: { type: 'none' }, objects: [] },
        ],
    }
}

describe('background modifiers', () => {
    it('set color on the active slide only, without mutation', () => {
        const p = make()
        const snapshot = structuredClone(p)
        const result = setActiveSlideBackgroundColor(p, '#123456')
        expect(result.slides[1].background).toEqual({ type: 'color', color: '#123456' })
        expect(result.slides[0]).toBe(p.slides[0])
        expect(p).toEqual(snapshot)
    })

    it('set image and clear', () => {
        const p = make()
        const withImage = setActiveSlideBackgroundImage(p, 'u')
        expect(withImage.slides[1].background).toEqual({ type: 'image', src: 'u' })
        expect(clearActiveSlideBackground(withImage).slides[1].background).toEqual({ type: 'none' })
    })

    it('are no-ops without an active slide', () => {
        const p = make(null)
        expect(setActiveSlideBackgroundColor(p, '#fff')).toBe(p)
        expect(setActiveSlideBackgroundImage(p, 'u')).toBe(p)
        expect(clearActiveSlideBackground(p)).toBe(p)
    })
})

describe('addTextToActiveSlide', () => {
    it('uses defaults', () => {
        const p = make()
        const result = addTextToActiveSlide(p)
        const object = result.slides[1].objects[0]
        expect(object).toMatchObject({
            type: 'text',
            content: 'Новый текст',
            position: { x: 100, y: 100 },
            size: { width: 300, height: 50 },
            fontFamily: 'Arial',
            fontSize: 24,
            fontColor: '#000000',
        })
        expect(p.slides[1].objects).toHaveLength(0)
    })

    it('applies overrides', () => {
        const result = addTextToActiveSlide(make(), { content: 'Hi', x: 1, fontSize: 10 })
        expect(result.slides[1].objects[0]).toMatchObject({ content: 'Hi', position: { x: 1, y: 100 }, fontSize: 10 })
    })

    it('is a no-op without an active slide', () => {
        const p = make(null)
        expect(addTextToActiveSlide(p)).toBe(p)
    })
})

describe('addImageToActiveSlide', () => {
    it('uses defaults and overrides', () => {
        const p = make()
        const result = addImageToActiveSlide(p, { imageUrl: 'u' })
        expect(result.slides[1].objects[0]).toMatchObject({
            type: 'image', src: 'u', position: { x: 200, y: 150 }, size: { width: 300, height: 200 },
        })
        const custom = addImageToActiveSlide(p, { imageUrl: 'u', width: 10 })
        expect(custom.slides[1].objects[0]).toMatchObject({ size: { width: 10, height: 200 } })
        expect(p.slides[1].objects).toHaveLength(0)
    })

    it('is a no-op without an active slide', () => {
        const p = make(null)
        expect(addImageToActiveSlide(p, { imageUrl: 'u' })).toBe(p)
    })
})

describe('removeSlide', () => {
    it('removes the slide and fixes active slide', () => {
        const p = make('b')
        const result = removeSlide(p, 'b')
        expect(result.slides.map(slide => slide.id)).toEqual(['a'])
        expect(result.activeSlideId).toBe('a')
        expect(p.slides).toHaveLength(2)
    })
})

describe('addTextToActiveSlide with null params (as dispatched)', () => {
    it('uses defaults', () => {
        const result = addTextToActiveSlide(make(), null)
        expect(result.slides[1].objects).toHaveLength(1)
    })
})

function makeWithObjects(activeSlideId: string | null = 'b'): Presentation {
    const p = make(activeSlideId)
    return {
        ...p,
        slides: [
            p.slides[0],
            {
                ...p.slides[1],
                objects: [
                    {
                        id: 't1', type: 'text', position: { x: 10, y: 20 }, size: { width: 100, height: 50 },
                        content: 'T', fontFamily: 'Arial', fontSize: 20, fontColor: '#000000',
                    },
                    { id: 'i1', type: 'image', position: { x: 30, y: 40 }, size: { width: 200, height: 100 }, src: 'u' },
                    { id: 'i2', type: 'image', position: { x: 50, y: 60 }, size: { width: 80, height: 80 }, src: 'v' },
                ],
            },
        ],
    }
}

describe('setActiveSlideBackgroundGradient', () => {
    it('sets a gradient on the active slide without mutation', () => {
        const p = make()
        const snapshot = structuredClone(p)
        const result = setActiveSlideBackgroundGradient(p, { colors: ['#000', '#fff'], angle: 45, kind: 'radial' })
        expect(result.slides[1].background).toEqual({
            type: 'gradient', colors: ['#000', '#fff'], angle: 45, kind: 'radial',
        })
        expect(result.slides[0]).toBe(p.slides[0])
        expect(p).toEqual(snapshot)
    })

    it('is a no-op without an active slide', () => {
        const p = make(null)
        expect(setActiveSlideBackgroundGradient(p, { colors: ['#000', '#fff'], angle: 0, kind: 'linear' })).toBe(p)
    })
})

describe('removeObjectsFromActiveSlide', () => {
    it('removes several objects at once without mutation', () => {
        const p = makeWithObjects()
        const snapshot = structuredClone(p)
        const result = removeObjectsFromActiveSlide(p, ['t1', 'i2'])
        expect(result.slides[1].objects.map(object => object.id)).toEqual(['i1'])
        expect(p).toEqual(snapshot)
    })

    it('is a no-op without an active slide', () => {
        const p = makeWithObjects(null)
        expect(removeObjectsFromActiveSlide(p, ['t1'])).toBe(p)
    })
})

describe('moveObjectsOnActiveSlide', () => {
    it('moves several objects at once without mutation', () => {
        const p = makeWithObjects()
        const snapshot = structuredClone(p)
        const result = moveObjectsOnActiveSlide(p, [{ id: 't1', x: 1, y: 2 }, { id: 'i2', x: 3, y: 4 }])
        const objects = result.slides[1].objects
        expect(objects[0].position).toEqual({ x: 1, y: 2 })
        expect(objects[1].position).toEqual({ x: 30, y: 40 })
        expect(objects[2].position).toEqual({ x: 3, y: 4 })
        expect(p).toEqual(snapshot)
    })

    it('is a no-op without an active slide', () => {
        const p = makeWithObjects(null)
        expect(moveObjectsOnActiveSlide(p, [{ id: 't1', x: 1, y: 2 }])).toBe(p)
    })
})

describe('resizeObjectOnActiveSlide', () => {
    it('resizes an object without mutation', () => {
        const p = makeWithObjects()
        const snapshot = structuredClone(p)
        const result = resizeObjectOnActiveSlide(p, { id: 'i1', width: 250, height: 120 })
        expect(result.slides[1].objects[1].size).toEqual({ width: 250, height: 120 })
        expect(p).toEqual(snapshot)
    })

    it('clamps to the minimum size 30x30', () => {
        const result = resizeObjectOnActiveSlide(makeWithObjects(), { id: 'i1', width: 5, height: -10 })
        expect(result.slides[1].objects[1].size).toEqual({ width: 30, height: 30 })
    })

    it('is a no-op without an active slide', () => {
        const p = makeWithObjects(null)
        expect(resizeObjectOnActiveSlide(p, { id: 'i1', width: 100, height: 100 })).toBe(p)
    })
})

describe('updateTextStyleOnActiveSlide', () => {
    it('updates the text style without mutation', () => {
        const p = makeWithObjects()
        const snapshot = structuredClone(p)
        const result = updateTextStyleOnActiveSlide(p, {
            id: 't1', fontFamily: 'Georgia', fontSize: 30, fontColor: '#ff0000',
        })
        expect(result.slides[1].objects[0]).toMatchObject({ fontFamily: 'Georgia', fontSize: 30, fontColor: '#ff0000' })
        expect(p).toEqual(snapshot)
    })

    it('clamps font size to 8..200', () => {
        const low = updateTextStyleOnActiveSlide(makeWithObjects(), {
            id: 't1', fontFamily: 'Arial', fontSize: 1, fontColor: '#000000',
        })
        const high = updateTextStyleOnActiveSlide(makeWithObjects(), {
            id: 't1', fontFamily: 'Arial', fontSize: 999, fontColor: '#000000',
        })
        expect(low.slides[1].objects[0]).toMatchObject({ fontSize: 8 })
        expect(high.slides[1].objects[0]).toMatchObject({ fontSize: 200 })
    })

    it('is a no-op without an active slide', () => {
        const p = makeWithObjects(null)
        expect(updateTextStyleOnActiveSlide(p, { id: 't1', fontFamily: 'Arial', fontSize: 10, fontColor: '#000' })).toBe(p)
    })
})
