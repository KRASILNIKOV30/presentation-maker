import type { SlideObject } from './objects.js'

type NoneBackground = {
    type: 'none',
}

type ColorBackground = {
    type: 'color',
    color: string,
}

type ImageBackground = {
    type: 'image',
    src: string,
}

type GradientBackground = {
    type: 'gradient',
    colors: string[],
    angle: number,
    kind: 'linear' | 'radial',
}

type Background = NoneBackground | ColorBackground | ImageBackground | GradientBackground

type Slide = {
    id: string,
    name: string,
    background: Background,
    objects: SlideObject[],
}

export type {
    Slide,
    Background,
    ColorBackground,
    ImageBackground,
    GradientBackground,
    NoneBackground,
}
