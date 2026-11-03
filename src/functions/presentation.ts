import type { Presentation } from '../types/presentation.js'
import type { Slide } from '../types/slide.js'
import { generateId } from '../utils/id.js'

function createDefaultSlide(name: string): Slide {
    return {
        id: generateId(),
        name,
        background: { type: 'none' },
        objects: [],
    }
}

function createPresentation(name: string): Presentation {
    const slide = createDefaultSlide('Слайд 1')
    return {
        id: generateId(),
        name,
        slides: [slide],
        activeSlideId: slide.id,
    }
}

function updatePresentationName(
    presentation: Presentation,
    name: string,
): Presentation {
    return {
        ...presentation,
        name,
    }
}

function updateSlide(
    presentation: Presentation,
    slideId: string,
    updater: (slide: Slide) => Slide,
): Presentation {
    if (!presentation.slides.some(slide => slide.id === slideId)) {
        return presentation
    }
    return {
        ...presentation,
        slides: presentation.slides.map(slide => slide.id === slideId ? updater(slide) : slide),
    }
}

function savePresentation(presentation: Presentation): string {
    return JSON.stringify(presentation, null, 2)
}

function loadPresentation(json: string): Presentation {
    return JSON.parse(json) as Presentation
}

export {
    createDefaultSlide,
    createPresentation,
    updatePresentationName,
    updateSlide,
    savePresentation,
    loadPresentation,
}
