export function Input({ onChange }: { onChange: (value: string) => void }) {
    return <input onChange={(e) => onChange(e.target.value || "")} />
}