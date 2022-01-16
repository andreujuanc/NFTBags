import { useState } from 'react'
import './index.css'

type ButtonProps = {
    children: any
    onClick: () => any | Promise<any>
    disabled?: boolean
    className?: string
    lineHeight?: number
    color?: string
    backgroundColor?: string
}

export function Button(props: ButtonProps) {
    const [clicking, setClicking] = useState(false)

    const onClick = async () => {
        if (clicking || props.disabled) return
        setClicking(true)
        try {
            const result = props.onClick()
            if (result && typeof result.then === 'function') {
                await result
            }
            setClicking(false)
        } catch (ex: any) {
            setClicking(false)
        }

    }

    return (
        <button
            disabled={props.disabled}
            className={"button white-shadow-1 " + (props.className ?? '') + (clicking ? ' clicking' : "")} onClick={onClick}
            style={{
                lineHeight: props.lineHeight ?? '1.5',
                color: props.color,
                backgroundColor: props.backgroundColor
            }}
        >
            {props.children}

            {clicking && <><span className="dot one">.</span><span className="dot two">.</span><span className="dot three">.</span></>}
        </button>
    )
}