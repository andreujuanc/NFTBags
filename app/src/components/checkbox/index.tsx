export function Checkbox({ onChange }: { onChange: (selected: boolean) => void }) {
    return <input type="checkbox" onChange={(e)=>onChange(e.target.checked)} />
}