export function Button({
    children,
    onClick,
    disabled
}: {
    children: any,
    onClick?: () => any,
    disabled?: boolean
}
) {
    return (
        <button
            onClick={onClick}
            disabled={disabled}
        >
            {children}
        </button>
    )
}