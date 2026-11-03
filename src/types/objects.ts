type Point = {
    x: number,
    y: number,
}

type Size = {
    width: number,
    height: number,
}

type SlideObjectBase = {
    id: string,
    position: Point,
    size: Size,
}

type TextObject = SlideObjectBase & {
    type: 'text',
    content: string,
    fontFamily: string,
    fontSize: number,
    fontColor: string,
}

type ImageObject = SlideObjectBase & {
    type: 'image',
    src: string,
}

type SlideObject = TextObject | ImageObject

export type {
    Point,
    Size,
    TextObject,
    ImageObject,
    SlideObject,
}
