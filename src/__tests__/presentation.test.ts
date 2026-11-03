import { describe, it, expect } from 'vitest'
import type { Presentation } from '../types/presentation.js'
import type { Slide } from '../types/slide.js'
import {
    createDefaultSlide,
    createPresentation,
    updatePresentationName,
    updateSlide,
    savePresentation,
    loadPresentation,
} from '../functions/presentation.js'
import { addSlide, setActiveSlide, duplicateSlide } from '../functions/slide.js'

function makeSlide(id: string, overrides: Partial<Slide> = {}): Slide {
    return {
        id,
        name: `Slide ${id}`,
        background: { type: 'none' },
        objects: [],
        ...overrides,
    }
}

function makePresentation(slides: Slide[], activeSlideId: string | null = slides[0]?.id ?? null): Presentation {
    return { id: 'p1', name: 'Test', slides, activeSlideId }
}

describe('createDefaultSlide', () => {
    it('creates an empty slide with the given name', () => {
        const slide = createDefaultSlide('Name')
        expect(slide.name).toBe('Name')
        expect(slide.background).toEqual({ type: 'none' })
        expect(slide.objects).toEqual([])
        expect(slide.id).toBeTruthy()
    })
})

describe('createPresentation', () => {
    it('creates a presentation with one default slide that is active', () => {
        const p = createPresentation('My')
        expect(p.name).toBe('My')
        expect(p.slides).toHaveLength(1)
        expect(p.slides[0].name).toBe('Слайд 1')
        expect(p.slides[0].background).toEqual({ type: 'none' })
        expect(p.slides[0].objects).toEqual([])
        expect(p.activeSlideId).toBe(p.slides[0].id)
    })

    it('generates unique ids', () => {
        const a = createPresentation('A')
        const b = createPresentation('B')
        expect(a.id).not.toBe(b.id)
        expect(a.slides[0].id).not.toBe(b.slides[0].id)
    })
})

describe('updatePresentationName', () => {
    it('renames without mutating the input', () => {
        const input = makePresentation([makeSlide('a')])
        const snapshot = structuredClone(input)
        const result = updatePresentationName(input, 'New')
        expect(result.name).toBe('New')
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })
})

describe('savePresentation / loadPresentation', () => {
    it('roundtrips a presentation', () => {
        const input = makePresentation([makeSlide('a', { background: { type: 'gradient', colors: ['#000', '#fff'], angle: 45, kind: 'linear' } })])
        const snapshot = structuredClone(input)
        const json = savePresentation(input)
        expect(typeof json).toBe('string')
        expect(input).toEqual(snapshot)
        const loaded = loadPresentation(json)
        expect(loaded).toEqual(input)
        expect(loaded).not.toBe(input)
    })
})

describe('addSlide', () => {
    it('appends a slide with the default name and keeps the active slide', () => {
        const input = makePresentation([makeSlide('a')])
        const snapshot = structuredClone(input)
        const result = addSlide(input)
        expect(result).not.toBe(input)
        expect(result.slides).toHaveLength(2)
        expect(result.slides[1].name).toBe('Слайд 2')
        expect(result.activeSlideId).toBe('a')
        expect(input).toEqual(snapshot)
    })

    it('uses a custom name', () => {
        const input = makePresentation([makeSlide('a')])
        const snapshot = structuredClone(input)
        const result = addSlide(input, 'Custom')
        expect(result.slides[1].name).toBe('Custom')
        expect(input).toEqual(snapshot)
    })

    it('activates the new slide when there is no active slide', () => {
        const input = makePresentation([], null)
        const snapshot = structuredClone(input)
        const result = addSlide(input)
        expect(result.activeSlideId).toBe(result.slides[0].id)
        expect(result.slides[0].name).toBe('Слайд 1')
        expect(input).toEqual(snapshot)
    })
})

describe('setActiveSlide', () => {
    it('sets an existing slide as active', () => {
        const input = makePresentation([makeSlide('a'), makeSlide('b')])
        const snapshot = structuredClone(input)
        const result = setActiveSlide(input, 'b')
        expect(result.activeSlideId).toBe('b')
        expect(result).not.toBe(input)
        expect(input).toEqual(snapshot)
    })

    it('returns the presentation unchanged for an unknown id', () => {
        const input = makePresentation([makeSlide('a')])
        const snapshot = structuredClone(input)
        const result = setActiveSlide(input, 'nope')
        expect(result).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('duplicateSlide', () => {
    const source = (): Presentation => makePresentation([
        makeSlide('a', {
            background: { type: 'gradient', colors: ['#111', '#222'], angle: 10, kind: 'linear' },
            objects: [
                { id: 'o1', type: 'text', position: { x: 1, y: 2 }, size: { width: 3, height: 4 }, content: 'hi', fontFamily: 'Arial', fontSize: 12, fontColor: '#000' },
                { id: 'o2', type: 'image', position: { x: 5, y: 6 }, size: { width: 7, height: 8 }, src: 'x.png' },
            ],
        }),
        makeSlide('b'),
    ])

    it('inserts a copy right after the original with new ids', () => {
        const input = source()
        const snapshot = structuredClone(input)
        const result = duplicateSlide(input, 'a')
        expect(result).not.toBe(input)
        expect(result.slides).toHaveLength(3)
        expect(result.slides[0].id).toBe('a')
        expect(result.slides[2].id).toBe('b')
        const copy = result.slides[1]
        expect(copy.id).not.toBe('a')
        expect(copy.name).toBe('Slide a (копия)')
        expect(copy.objects).toHaveLength(2)
        expect(copy.objects[0].id).not.toBe('o1')
        expect(copy.objects[1].id).not.toBe('o2')
        expect(copy.objects[0].id).not.toBe(copy.objects[1].id)
        expect(copy.background).toEqual(input.slides[0].background)
        expect(result.activeSlideId).toBe('a')
        expect(input).toEqual(snapshot)
    })

    it('makes a deep copy independent of the original', () => {
        const input = source()
        const result = duplicateSlide(input, 'a')
        const copy = result.slides[1]
        const original = result.slides[0]
        expect(copy.objects[0].position).not.toBe(original.objects[0].position)
        expect(copy.objects[0].size).not.toBe(original.objects[0].size)
        expect(copy.objects[0].position).toEqual(original.objects[0].position)
        expect(copy.objects[1].size).toEqual(original.objects[1].size)
        expect(copy.objects).not.toBe(original.objects)
        expect(copy.background).not.toBe(original.background)
        if (copy.background.type === 'gradient' && original.background.type === 'gradient') {
            expect(copy.background.colors).not.toBe(original.background.colors)
        }
    })

    it('copies a non-gradient background', () => {
        const input = makePresentation([makeSlide('a', { background: { type: 'color', color: '#f00' } })])
        const result = duplicateSlide(input, 'a')
        expect(result.slides[1].background).toEqual({ type: 'color', color: '#f00' })
        expect(result.slides[1].background).not.toBe(input.slides[0].background)
    })

    it('returns the presentation unchanged for an unknown id', () => {
        const input = source()
        const snapshot = structuredClone(input)
        const result = duplicateSlide(input, 'nope')
        expect(result).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('updateSlide', () => {
    it('applies the updater only to the slide with given id', () => {
        const p = makePresentation([makeSlide('a'), makeSlide('b')])
        const result = updateSlide(p, 'b', slide => ({ ...slide, name: 'X' }))
        expect(result.slides[0]).toBe(p.slides[0])
        expect(result.slides[1].name).toBe('X')
        expect(p.slides[1].name).toBe('Slide b')
    })

    it('returns the same reference for unknown id', () => {
        const p = makePresentation([makeSlide('a')])
        expect(updateSlide(p, 'zzz', slide => ({ ...slide, name: 'X' }))).toBe(p)
    })
})
