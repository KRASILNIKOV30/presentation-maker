import type { Presentation } from '../types/presentation.js'
import type { Slide, Background } from '../types/slide.js'
import type { SlideObject } from '../types/objects.js'
import { generateId } from '../utils/id.js'
import { createDefaultSlide } from './presentation.js'

function addSlide(presentation: Presentation, slideName?: string): Presentation {
    const slide = createDefaultSlide(slideName ?? `Слайд ${presentation.slides.length + 1}`)
    return {
        ...presentation,
        slides: [...presentation.slides, slide],
        activeSlideId: presentation.activeSlideId ?? slide.id,
    }
}

function removeSlides(presentation: Presentation, slideIds: string[]): Presentation {
    const slides = presentation.slides.filter(slide => !slideIds.includes(slide.id))
    let activeSlideId = presentation.activeSlideId
    if (activeSlideId !== null && slideIds.includes(activeSlideId)) {
        const oldIndex = presentation.slides.findIndex(slide => slide.id === activeSlideId)
        const next = presentation.slides
            .slice(oldIndex)
            .find(slide => !slideIds.includes(slide.id))
        activeSlideId = next?.id ?? slides[slides.length - 1]?.id ?? null
    }
    return {
        ...presentation,
        slides,
        activeSlideId,
    }
}

function moveSlide(presentation: Presentation, slideId: string, newIndex: number): Presentation {
    const slide = presentation.slides.find(item => item.id === slideId)
    if (!slide) {
        return presentation
    }
    const rest = presentation.slides.filter(item => item.id !== slideId)
    const index = Math.min(Math.max(newIndex, 0), presentation.slides.length - 1)
    return {
        ...presentation,
        slides: [...rest.slice(0, index), slide, ...rest.slice(index)],
    }
}

function setActiveSlide(presentation: Presentation, slideId: string): Presentation {
    if (!presentation.slides.some(slide => slide.id === slideId)) {
        return presentation
    }
    return {
        ...presentation,
        activeSlideId: slideId,
    }
}

function copyBackground(background: Background): Background {
    if (background.type === 'gradient') {
        return { ...background, colors: [...background.colors] }
    }
    return { ...background }
}

function copyObject(object: SlideObject): SlideObject {
    return {
        ...object,
        id: generateId(),
        position: { ...object.position },
        size: { ...object.size },
    }
}

function duplicateSlide(presentation: Presentation, slideId: string): Presentation {
    const index = presentation.slides.findIndex(slide => slide.id === slideId)
    if (index === -1) {
        return presentation
    }
    const original = presentation.slides[index]
    const copy: Slide = {
        ...original,
        id: generateId(),
        name: `${original.name} (копия)`,
        background: copyBackground(original.background),
        objects: original.objects.map(copyObject),
    }
    return {
        ...presentation,
        slides: [
            ...presentation.slides.slice(0, index + 1),
            copy,
            ...presentation.slides.slice(index + 1),
        ],
    }
}

function setSlideBackgroundColor(slide: Slide, color: string): Slide {
    return {
        ...slide,
        background: { type: 'color', color },
    }
}

function setSlideBackgroundImage(slide: Slide, imageUrl: string): Slide {
    return {
        ...slide,
        background: { type: 'image', src: imageUrl },
    }
}

function setSlideBackgroundGradient(slide: Slide, colors: string[], angle = 0, kind: 'linear' | 'radial' = 'linear'): Slide {
    return {
        ...slide,
        background: { type: 'gradient', colors: [...colors], angle, kind },
    }
}

function clearSlideBackground(slide: Slide): Slide {
    return {
        ...slide,
        background: { type: 'none' },
    }
}

export {
    addSlide,
    removeSlides,
    moveSlide,
    setActiveSlide,
    duplicateSlide,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
}
