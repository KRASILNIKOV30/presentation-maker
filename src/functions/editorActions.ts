import type { Presentation } from '../types/presentation.js'
import type { Slide } from '../types/slide.js'
import { updateSlide } from './presentation.js'
import {
    removeSlides,
    setSlideBackgroundGradient,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    clearSlideBackground,
} from './slide.js'
import {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
} from './objects.js'

type AddTextParams = Partial<{
    content: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
}>

type ObjectMove = {
    id: string,
    x: number,
    y: number,
}

type ObjectResize = {
    id: string,
    width: number,
    height: number,
}

type TextStyleParams = {
    id: string,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
}

type GradientParams = {
    colors: string[],
    angle: number,
    kind: 'linear' | 'radial',
}

const MIN_OBJECT_SIZE = 30
const MIN_FONT_SIZE = 8
const MAX_FONT_SIZE = 200

function clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max)
}

type AddImageParams = {
    imageUrl: string,
    x?: number,
    y?: number,
    width?: number,
    height?: number,
}

function updateActiveSlide(
    presentation: Presentation,
    updater: (slide: Slide) => Slide,
): Presentation {
    if (presentation.activeSlideId === null) {
        return presentation
    }
    return updateSlide(presentation, presentation.activeSlideId, updater)
}

function setActiveSlideBackgroundColor(presentation: Presentation, color: string): Presentation {
    return updateActiveSlide(presentation, slide => setSlideBackgroundColor(slide, color))
}

function setActiveSlideBackgroundImage(presentation: Presentation, imageUrl: string): Presentation {
    return updateActiveSlide(presentation, slide => setSlideBackgroundImage(slide, imageUrl))
}

function clearActiveSlideBackground(presentation: Presentation): Presentation {
    return updateActiveSlide(presentation, clearSlideBackground)
}

function addTextToActiveSlide(presentation: Presentation, params: AddTextParams | null = null): Presentation {
    const {
        content = 'Новый текст',
        x = 100,
        y = 100,
        width = 300,
        height = 50,
        fontFamily = 'Arial',
        fontSize = 24,
        fontColor = '#000000',
    } = params ?? {}
    return updateActiveSlide(presentation, slide =>
        addTextObject(slide, content, x, y, width, height, fontFamily, fontSize, fontColor),
    )
}

function addImageToActiveSlide(presentation: Presentation, params: AddImageParams): Presentation {
    const { imageUrl, x = 200, y = 150, width = 300, height = 200 } = params
    return updateActiveSlide(presentation, slide =>
        addImageObject(slide, imageUrl, x, y, width, height),
    )
}

function setActiveSlideBackgroundGradient(presentation: Presentation, params: GradientParams): Presentation {
    return updateActiveSlide(presentation, slide =>
        setSlideBackgroundGradient(slide, params.colors, params.angle, params.kind),
    )
}

function removeObjectsFromActiveSlide(presentation: Presentation, objectIds: string[]): Presentation {
    return updateActiveSlide(presentation, slide =>
        objectIds.reduce(removeObject, slide),
    )
}

function moveObjectsOnActiveSlide(presentation: Presentation, moves: ObjectMove[]): Presentation {
    return updateActiveSlide(presentation, slide =>
        moves.reduce((result, move) => moveObject(result, move.id, move.x, move.y), slide),
    )
}

function resizeObjectOnActiveSlide(presentation: Presentation, params: ObjectResize): Presentation {
    return updateActiveSlide(presentation, slide =>
        resizeObject(
            slide,
            params.id,
            Math.max(params.width, MIN_OBJECT_SIZE),
            Math.max(params.height, MIN_OBJECT_SIZE),
        ),
    )
}

function updateTextStyleOnActiveSlide(presentation: Presentation, params: TextStyleParams): Presentation {
    return updateActiveSlide(presentation, slide =>
        updateTextObjectStyle(
            slide,
            params.id,
            params.fontFamily,
            clamp(params.fontSize, MIN_FONT_SIZE, MAX_FONT_SIZE),
            params.fontColor,
        ),
    )
}

function removeSlide(presentation: Presentation, slideId: string): Presentation {
    return removeSlides(presentation, [slideId])
}

export {
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
}
export type {
    AddTextParams,
    AddImageParams,
    ObjectMove,
    ObjectResize,
    TextStyleParams,
    GradientParams,
}
