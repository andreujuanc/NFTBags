import './index.css'

export function Input({ label, onChange }: {
    label: string,
    onChange: (value: string) => void
}) {
    return <input placeholder={label} onChange={(e) => onChange(e.target.value || "")} />
}