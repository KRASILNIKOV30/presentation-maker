import { describe, it, expect } from 'vitest'
import type { Presentation } from '../types/presentation.js'
import type { Slide } from '../types/slide.js'
import {
    removeSlides,
    moveSlide,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
} from '../functions/slide.js'

function makeSlide(id: string): Slide {
    return { id, name: `Slide ${id}`, background: { type: 'none' }, objects: [] }
}

function makePresentation(ids: string[], activeSlideId: string | null): Presentation {
    return { id: 'p1', name: 'Test', slides: ids.map(makeSlide), activeSlideId }
}

const ids = (p: Presentation): string[] => p.slides.map(slide => slide.id)

describe('removeSlides', () => {
    it('removes one slide', () => {
        const input = makePresentation(['a', 'b', 'c'], 'a')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['b'])
        expect(ids(result)).toEqual(['a', 'c'])
        expect(result.activeSlideId).toBe('a')
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('removes several slides', () => {
        const input = makePresentation(['a', 'b', 'c', 'd'], 'a')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['b', 'd'])
        expect(ids(result)).toEqual(['a', 'c'])
        expect(input).toEqual(snapshot)
    })

    it('activates the next slide when the active one is removed', () => {
        const input = makePresentation(['a', 'b', 'c'], 'b')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['b'])
        expect(result.activeSlideId).toBe('c')
        expect(input).toEqual(snapshot)
    })

    it('skips other removed slides when choosing the new active one', () => {
        const input = makePresentation(['a', 'b', 'c', 'd'], 'b')
        const result = removeSlides(input, ['b', 'c'])
        expect(result.activeSlideId).toBe('d')
    })

    it('falls back to the last slide when nothing follows the active one', () => {
        const input = makePresentation(['a', 'b', 'c'], 'c')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['c'])
        expect(result.activeSlideId).toBe('b')
        expect(input).toEqual(snapshot)
    })

    it('sets active to null when all slides are removed', () => {
        const input = makePresentation(['a', 'b'], 'a')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['a', 'b'])
        expect(result.slides).toEqual([])
        expect(result.activeSlideId).toBeNull()
        expect(input).toEqual(snapshot)
    })

    it('ignores unknown ids', () => {
        const input = makePresentation(['a', 'b'], 'a')
        const snapshot = structuredClone(input)
        const result = removeSlides(input, ['zzz'])
        expect(result).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('moveSlide', () => {
    it('moves to the start', () => {
        const input = makePresentation(['a', 'b', 'c'], 'a')
        const snapshot = structuredClone(input)
        const result = moveSlide(input, 'c', 0)
        expect(ids(result)).toEqual(['c', 'a', 'b'])
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('moves to the end', () => {
        const input = makePresentation(['a', 'b', 'c'], 'a')
        const snapshot = structuredClone(input)
        const result = moveSlide(input, 'a', 2)
        expect(ids(result)).toEqual(['b', 'c', 'a'])
        expect(input).toEqual(snapshot)
    })

    it('moves to the middle', () => {
        const input = makePresentation(['a', 'b', 'c', 'd'], 'a')
        const snapshot = structuredClone(input)
        const result = moveSlide(input, 'a', 2)
        expect(ids(result)).toEqual(['b', 'c', 'a', 'd'])
        expect(input).toEqual(snapshot)
    })

    it('clamps an out-of-range index', () => {
        const input = makePresentation(['a', 'b', 'c'], 'a')
        const snapshot = structuredClone(input)
        expect(ids(moveSlide(input, 'a', 99))).toEqual(['b', 'c', 'a'])
        expect(ids(moveSlide(input, 'c', -5))).toEqual(['c', 'a', 'b'])
        expect(input).toEqual(snapshot)
    })

    it('returns the presentation unchanged for an unknown id', () => {
        const input = makePresentation(['a', 'b'], 'a')
        const snapshot = structuredClone(input)
        const result = moveSlide(input, 'zzz', 0)
        expect(result).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('slide background', () => {
    it('sets a color background', () => {
        const input = makeSlide('a')
        const snapshot = structuredClone(input)
        const result = setSlideBackgroundColor(input, '#fff')
        expect(result.background).toEqual({ type: 'color', color: '#fff' })
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('sets an image background', () => {
        const input = makeSlide('a')
        const snapshot = structuredClone(input)
        const result = setSlideBackgroundImage(input, 'bg.png')
        expect(result.background).toEqual({ type: 'image', src: 'bg.png' })
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('sets a gradient background with default angle 0 and copied colors', () => {
        const input = makeSlide('a')
        const snapshot = structuredClone(input)
        const colors = ['#000', '#fff']
        const colorsSnapshot = structuredClone(colors)
        const result = setSlideBackgroundGradient(input, colors)
        expect(result.background).toEqual({ type: 'gradient', colors: ['#000', '#fff'], angle: 0, kind: 'linear' })
        if (result.background.type === 'gradient') {
            expect(result.background.colors).not.toBe(colors)
        }
        expect(colors).toEqual(colorsSnapshot)
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('sets a gradient background with a custom angle', () => {
        const input = makeSlide('a')
        const snapshot = structuredClone(input)
        const result = setSlideBackgroundGradient(input, ['#000', '#fff'], 90)
        expect(result.background).toEqual({ type: 'gradient', colors: ['#000', '#fff'], angle: 90, kind: 'linear' })
        expect(input).toEqual(snapshot)
    })

    it('sets a radial gradient background', () => {
        const result = setSlideBackgroundGradient(makeSlide('a'), ['#000', '#fff'], 0, 'radial')
        expect(result.background).toEqual({ type: 'gradient', colors: ['#000', '#fff'], angle: 0, kind: 'radial' })
    })

    it('clears the background', () => {
        const input: Slide = { ...makeSlide('a'), background: { type: 'color', color: '#fff' } }
        const snapshot = structuredClone(input)
        const result = clearSlideBackground(input)
        expect(result.background).toEqual({ type: 'none' })
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })
})
