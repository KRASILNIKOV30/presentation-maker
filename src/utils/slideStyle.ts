import type { CSSProperties } from 'react'
import type { Background } from '../types/slide.js'

function getBackgroundStyle(background: Background): CSSProperties {
    switch (background.type) {
        case 'none':
            return { background: '#ffffff' }
        case 'color':
            return { background: background.color }
        case 'image':
            return {
                backgroundImage: `url("${background.src}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }
        case 'gradient': {
            const colors = background.colors.join(', ')
            return {
                backgroundImage: background.kind === 'radial'
                    ? `radial-gradient(circle, ${colors})`
                    : `linear-gradient(${background.angle}deg, ${colors})`,
            }
        }
        default: {
            const unreachable: never = background
            return unreachable
        }
    }
}

export {
    getBackgroundStyle,
}
