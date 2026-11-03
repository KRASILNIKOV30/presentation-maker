import type { Presentation } from './types/presentation.js'
import type { Slide } from './types/slide.js'
import { createPresentation, updateSlide } from './functions/presentation.js'
import { addSlide, setActiveSlide, setSlideBackgroundColor, setSlideBackgroundGradient, setSlideBackgroundImage } from './functions/slide.js'
import { addTextObject, addImageObject } from './functions/objects.js'

const IMAGE_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="180" viewBox="0 0 320 180"><rect width="320" height="180" fill="#ffd54f"/><circle cx="160" cy="90" r="50" fill="#ff7043"/><text x="160" y="98" font-size="24" text-anchor="middle" fill="#ffffff" font-family="Arial">SVG</text></svg>`

const BACKGROUND_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="96" height="54" viewBox="0 0 96 54"><rect width="96" height="54" fill="#bbdefb"/><circle cx="20" cy="14" r="10" fill="#64b5f6"/><circle cx="76" cy="40" r="14" fill="#90caf9"/></svg>`

function toDataUrl(svg: string): string {
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function addSlideWithContent(
    presentation: Presentation,
    name: string,
    fill: (slide: Slide) => Slide,
): Presentation {
    const withSlide = addSlide(presentation, name)
    const slideId = withSlide.slides[withSlide.slides.length - 1].id
    return updateSlide(withSlide, slideId, fill)
}

function createTestPresentation(): Presentation {
    let presentation = createPresentation('Тестовая презентация')
    const firstId = presentation.slides[0].id

    presentation = updateSlide(presentation, firstId, slide => {
        let result = setSlideBackgroundColor(slide, '#f0f0f0')
        result = addTextObject(result, 'Добро пожаловать!', 50, 50, 400, 60, 'Arial', 32, '#333333')
        return addTextObject(result, 'Лабораторная работа #2', 50, 120, 400, 40, 'Arial', 20, '#666666')
    })

    presentation = addSlideWithContent(presentation, 'Список', slide => {
        let result = setSlideBackgroundColor(slide, '#ffffff')
        result = addTextObject(result, 'Список задач:', 50, 50, 300, 40, 'Arial', 24, '#000000')
        result = addTextObject(result, '1. Разработать интерфейс', 50, 100, 300, 30, 'Arial', 18, '#333333')
        result = addTextObject(result, '2. Добавить интерактивность', 50, 140, 300, 30, 'Arial', 18, '#333333')
        return addTextObject(result, '3. Выделить общие компоненты', 50, 180, 300, 30, 'Arial', 18, '#333333')
    })

    presentation = addSlideWithContent(presentation, 'Итоги', slide => {
        const result = setSlideBackgroundColor(slide, '#e8f5e9')
        const withTitle = addTextObject(result, 'Итоги работы:', 50, 50, 300, 40, 'Arial', 24, '#2e7d32')
        return addTextObject(withTitle, 'Готово!', 50, 120, 200, 60, 'Arial', 36, '#4caf50')
    })

    presentation = addSlideWithContent(presentation, 'Изображение', slide => {
        const result = setSlideBackgroundGradient(slide, ['#667eea', '#764ba2'], 135, 'linear')
        return addImageObject(result, toDataUrl(IMAGE_SVG), 320, 180, 320, 180)
    })

    presentation = addSlideWithContent(presentation, 'Фон-картинка', slide => {
        const result = setSlideBackgroundImage(slide, toDataUrl(BACKGROUND_SVG))
        return addTextObject(result, 'Слайд с картинкой на фоне', 50, 50, 500, 50, 'Arial', 28, '#0d47a1')
    })

    return setActiveSlide(presentation, firstId)
}

export {
    createTestPresentation,
}
