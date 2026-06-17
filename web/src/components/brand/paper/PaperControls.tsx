// web/src/components/brand/paper/PaperControls.tsx
// Exempt dir: native inputs allowed.
export interface PaperParams {
  mode: "deboss" | "emboss"
  azimuth: number
  elevation: number
  bevel: number
  depth: number
  grainFrequency: number
  grainOpacity: number
}

const NUM_FIELDS: { key: keyof PaperParams; label: string; min: number; max: number; step: number }[] = [
  { key: "azimuth", label: "Light azimuth", min: 0, max: 360, step: 1 },
  { key: "elevation", label: "Light elevation", min: 0, max: 90, step: 1 },
  { key: "bevel", label: "Bevel softness", min: 0, max: 8, step: 0.1 },
  { key: "depth", label: "Depth", min: 0, max: 6, step: 0.1 },
  { key: "grainFrequency", label: "Grain frequency", min: 0.1, max: 1.2, step: 0.01 },
  { key: "grainOpacity", label: "Grain opacity", min: 0, max: 0.2, step: 0.005 },
]

export function PaperControls({ value, onChange }: { value: PaperParams; onChange: (next: PaperParams) => void }) {
  return (
    <div style={{ display: "grid", gap: 12, padding: 16, fontFamily: "var(--font-inter), sans-serif", fontSize: 13, color: "#333" }}>
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <span style={{ width: 130 }}>Mode</span>
        <select value={value.mode} onChange={(e) => onChange({ ...value, mode: e.target.value as PaperParams["mode"] })}>
          <option value="deboss">Deboss (pressed in)</option>
          <option value="emboss">Emboss (raised)</option>
        </select>
      </label>
      {NUM_FIELDS.map((f) => (
        <label key={f.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={{ width: 130 }}>{f.label}</span>
          <input
            type="range"
            min={f.min}
            max={f.max}
            step={f.step}
            value={value[f.key] as number}
            onChange={(e) => onChange({ ...value, [f.key]: Number(e.target.value) })}
          />
          <span style={{ width: 48, textAlign: "right" }}>{value[f.key] as number}</span>
        </label>
      ))}
    </div>
  )
}
