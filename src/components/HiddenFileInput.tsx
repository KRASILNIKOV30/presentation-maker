import type { ChangeEvent, RefObject } from 'react'

type HiddenFileInputProps = {
    inputRef: RefObject<HTMLInputElement | null>,
    onChange: (event: ChangeEvent<HTMLInputElement>) => void,
    accept?: string,
}

function HiddenFileInput({ inputRef, onChange, accept = 'image/*' }: HiddenFileInputProps) {
    return <input ref={inputRef} type="file" hidden accept={accept} onChange={onChange} />
}

export {
    HiddenFileInput,
}
