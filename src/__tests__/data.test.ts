import { describe, it, expect } from 'vitest'
import { createTestPresentation } from '../data.js'

describe('createTestPresentation', () => {
    it('has 5 slides with expected names and first slide active', () => {
        const p = createTestPresentation()
        expect(p.name).toBe('Тестовая презентация')
        expect(p.slides.map(slide => slide.name)).toEqual([
            'Слайд 1', 'Список', 'Итоги', 'Изображение', 'Фон-картинка',
        ])
        expect(p.activeSlideId).toBe(p.slides[0].id)
    })

    it('contains all background variants used and both object types', () => {
        const p = createTestPresentation()
        expect(p.slides[0].background).toEqual({ type: 'color', color: '#f0f0f0' })
        expect(p.slides[0].objects).toHaveLength(2)
        expect(p.slides[1].objects).toHaveLength(4)
        expect(p.slides[2].objects).toHaveLength(2)
        expect(p.slides[3].background.type).toBe('gradient')
        expect(p.slides[3].objects[0].type).toBe('image')
        expect(p.slides[4].background.type).toBe('image')
        expect(p.slides[4].objects[0].type).toBe('text')
    })
})
