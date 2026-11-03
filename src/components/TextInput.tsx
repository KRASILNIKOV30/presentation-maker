import styles from './TextInput.module.css'

type TextInputProps = {
    value: string,
    placeholder?: string,
    type?: 'text' | 'color' | 'number',
    onChange?: (value: string) => void,
    className?: string,
    disabled?: boolean,
    min?: number,
    max?: number,
}

function TextInput({ value, placeholder, type = 'text', onChange, className, disabled, min, max }: TextInputProps) {
    const classes = [styles.input, type === 'color' ? styles.color : '', className ?? '']
        .filter(Boolean)
        .join(' ')
    return (
        <input
            className={classes}
            type={type}
            value={value}
            placeholder={placeholder}
            disabled={disabled}
            min={min}
            max={max}
            onChange={event => onChange?.(event.target.value)}
        />
    )
}

export {
    TextInput,
}
