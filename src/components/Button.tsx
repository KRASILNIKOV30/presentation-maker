import styles from './Button.module.css'

type ButtonProps = {
    text: string,
    onClick: () => void,
    className?: string,
    disabled?: boolean,
}

function Button({ text, onClick, className, disabled }: ButtonProps) {
    const classes = className ? `${styles.button} ${className}` : styles.button
    return (
        <button type="button" className={classes} onClick={onClick} disabled={disabled}>
            {text}
        </button>
    )
}

export {
    Button,
}
