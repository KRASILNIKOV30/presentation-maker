import type { Point, Size, TextObject, ImageObject, SlideObject } from './types/objects.js'
import type {
    Slide,
    Background,
    ColorBackground,
    ImageBackground,
    GradientBackground,
    NoneBackground,
} from './types/slide.js'
import type { Presentation } from './types/presentation.js'
import {
    createDefaultSlide,
    createPresentation,
    updatePresentationName,
    updateSlide,
    savePresentation,
    loadPresentation,
} from './functions/presentation.js'
import {
    addSlide,
    removeSlides,
    moveSlide,
    setActiveSlide,
    duplicateSlide,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
} from './functions/slide.js'
import {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
} from './functions/objects.js'
import { generateId } from './utils/id.js'

export {
    createDefaultSlide,
    createPresentation,
    updatePresentationName,
    updateSlide,
    savePresentation,
    loadPresentation,
    addSlide,
    removeSlides,
    moveSlide,
    setActiveSlide,
    duplicateSlide,
    setSlideBackgroundColor,
    setSlideBackgroundImage,
    setSlideBackgroundGradient,
    clearSlideBackground,
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
    generateId,
}

export type {
    Point,
    Size,
    TextObject,
    ImageObject,
    SlideObject,
    Slide,
    Background,
    ColorBackground,
    ImageBackground,
    GradientBackground,
    NoneBackground,
    Presentation,
}
