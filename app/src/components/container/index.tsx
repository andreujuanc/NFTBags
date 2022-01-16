import './index.css'

export function Container(
    {
        children,
        color,
    }: {
        color: string,
        children: any
    }
) {
    return (
        <div className='container' style={{
            backgroundColor: color
        }}>
            {children}
        </div>
    )
}