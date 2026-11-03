import { describe, it, expect } from 'vitest'
import type { Slide } from '../types/slide.js'
import type { SlideObject } from '../types/objects.js'
import {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
} from '../functions/objects.js'

function makeText(id: string): SlideObject {
    return {
        id,
        type: 'text',
        position: { x: 1, y: 2 },
        size: { width: 10, height: 20 },
        content: 'hello',
        fontFamily: 'Arial',
        fontSize: 14,
        fontColor: '#000',
    }
}

function makeImage(id: string): SlideObject {
    return {
        id,
        type: 'image',
        position: { x: 3, y: 4 },
        size: { width: 30, height: 40 },
        src: 'a.png',
    }
}

function makeSlide(objects: SlideObject[] = []): Slide {
    return { id: 's1', name: 'S', background: { type: 'none' }, objects }
}

describe('addTextObject', () => {
    it('appends a text object', () => {
        const input = makeSlide([makeImage('i1')])
        const snapshot = structuredClone(input)
        const result = addTextObject(input, 'Hi', 5, 6, 100, 50, 'Roboto', 18, '#f00')
        expect(result).not.toBe(input)
        expect(result.objects).toHaveLength(2)
        expect(result.objects[0]).toBe(input.objects[0])
        expect(result.objects[1]).toMatchObject({
            type: 'text',
            content: 'Hi',
            position: { x: 5, y: 6 },
            size: { width: 100, height: 50 },
            fontFamily: 'Roboto',
            fontSize: 18,
            fontColor: '#f00',
        })
        expect(result.objects[1].id).toBeTruthy()
        expect(input).toEqual(snapshot)
    })
})

describe('addImageObject', () => {
    it('appends an image object', () => {
        const input = makeSlide([makeText('t1')])
        const snapshot = structuredClone(input)
        const result = addImageObject(input, 'pic.png', 7, 8, 200, 100)
        expect(result).not.toBe(input)
        expect(result.objects).toHaveLength(2)
        expect(result.objects[1]).toMatchObject({
            type: 'image',
            src: 'pic.png',
            position: { x: 7, y: 8 },
            size: { width: 200, height: 100 },
        })
        expect(result.objects[1].id).not.toBe('t1')
        expect(input).toEqual(snapshot)
    })
})

describe('removeObject', () => {
    it('removes the object by id and keeps the others', () => {
        const input = makeSlide([makeText('t1'), makeImage('i1')])
        const snapshot = structuredClone(input)
        const result = removeObject(input, 't1')
        expect(result).not.toBe(input)
        expect(result.objects).toHaveLength(1)
        expect(result.objects[0]).toBe(input.objects[1])
        expect(input).toEqual(snapshot)
    })

    it('does nothing for an unknown id', () => {
        const input = makeSlide([makeText('t1')])
        const snapshot = structuredClone(input)
        const result = removeObject(input, 'zzz')
        expect(result).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('moveObject', () => {
    it('changes only the position of the target object', () => {
        const input = makeSlide([makeText('t1'), makeImage('i1')])
        const snapshot = structuredClone(input)
        const result = moveObject(input, 't1', 50, 60)
        expect(result).not.toBe(input)
        expect(result.objects[0]).toEqual({ ...makeText('t1'), position: { x: 50, y: 60 } })
        expect(result.objects[1]).toBe(input.objects[1])
        expect(input).toEqual(snapshot)
    })

    it('leaves the slide equal for an unknown id', () => {
        const input = makeSlide([makeText('t1')])
        const snapshot = structuredClone(input)
        expect(moveObject(input, 'zzz', 1, 1)).toEqual(snapshot)
        expect(input).toEqual(snapshot)
    })
})

describe('resizeObject', () => {
    it('changes only the size of the target object', () => {
        const input = makeSlide([makeImage('i1'), makeText('t1')])
        const snapshot = structuredClone(input)
        const result = resizeObject(input, 'i1', 300, 400)
        expect(result).not.toBe(input)
        expect(result.objects[0]).toEqual({ ...makeImage('i1'), size: { width: 300, height: 400 } })
        expect(result.objects[1]).toBe(input.objects[1])
        expect(input).toEqual(snapshot)
    })
})

describe('updateTextObjectStyle', () => {
    it('updates font settings of a text object', () => {
        const input = makeSlide([makeText('t1'), makeImage('i1')])
        const snapshot = structuredClone(input)
        const result = updateTextObjectStyle(input, 't1', 'Courier', 22, '#00f')
        expect(result).not.toBe(input)
        expect(result.objects[0]).toEqual({
            ...makeText('t1'),
            fontFamily: 'Courier',
            fontSize: 22,
            fontColor: '#00f',
        })
        expect(result.objects[1]).toBe(input.objects[1])
        expect(input).toEqual(snapshot)
    })

    it('does not affect an image object with the same id', () => {
        const input = makeSlide([makeImage('i1')])
        const snapshot = structuredClone(input)
        const result = updateTextObjectStyle(input, 'i1', 'Courier', 22, '#00f')
        expect(result.objects[0]).toEqual(snapshot.objects[0])
        expect(input).toEqual(snapshot)
    })
})
