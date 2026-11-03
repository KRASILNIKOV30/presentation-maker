import type { Slide } from '../types/slide.js'
import type { TextObject, ImageObject, SlideObject } from '../types/objects.js'
import { generateId } from '../utils/id.js'

function updateObject(
    slide: Slide,
    objectId: string,
    updater: (object: SlideObject) => SlideObject,
): Slide {
    return {
        ...slide,
        objects: slide.objects.map(object => object.id === objectId ? updater(object) : object),
    }
}

function addTextObject(
    slide: Slide,
    content: string,
    x: number,
    y: number,
    width: number,
    height: number,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
): Slide {
    const object: TextObject = {
        id: generateId(),
        type: 'text',
        position: { x, y },
        size: { width, height },
        content,
        fontFamily,
        fontSize,
        fontColor,
    }
    return {
        ...slide,
        objects: [...slide.objects, object],
    }
}

function addImageObject(
    slide: Slide,
    imageUrl: string,
    x: number,
    y: number,
    width: number,
    height: number,
): Slide {
    const object: ImageObject = {
        id: generateId(),
        type: 'image',
        position: { x, y },
        size: { width, height },
        src: imageUrl,
    }
    return {
        ...slide,
        objects: [...slide.objects, object],
    }
}

function removeObject(slide: Slide, objectId: string): Slide {
    return {
        ...slide,
        objects: slide.objects.filter(object => object.id !== objectId),
    }
}

function moveObject(slide: Slide, objectId: string, newX: number, newY: number): Slide {
    return updateObject(slide, objectId, object => ({
        ...object,
        position: { x: newX, y: newY },
    }))
}

function resizeObject(slide: Slide, objectId: string, newWidth: number, newHeight: number): Slide {
    return updateObject(slide, objectId, object => ({
        ...object,
        size: { width: newWidth, height: newHeight },
    }))
}

function updateTextObjectStyle(
    slide: Slide,
    objectId: string,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
): Slide {
    return updateObject(slide, objectId, object => {
        if (object.type !== 'text') {
            return object
        }
        return { ...object, fontFamily, fontSize, fontColor }
    })
}

export {
    addTextObject,
    addImageObject,
    removeObject,
    moveObject,
    resizeObject,
    updateTextObjectStyle,
}
