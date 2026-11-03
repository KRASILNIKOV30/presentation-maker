import styles from './Select.module.css'

type SelectOption = {
    value: string,
    label: string,
}

type SelectProps = {
    value: string,
    options: SelectOption[],
    onChange: (value: string) => void,
    disabled?: boolean,
    className?: string,
}

function Select({ value, options, onChange, disabled, className }: SelectProps) {
    const classes = className ? `${styles.select} ${className}` : styles.select
    return (
        <select
            className={classes}
            value={value}
            disabled={disabled}
            onChange={event => onChange(event.target.value)}
        >
            {options.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
            ))}
        </select>
    )
}

export {
    Select,
}
export type {
    SelectOption,
}
