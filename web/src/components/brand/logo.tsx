export function LogoMark({ className }: { className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      <rect x="1" y="1" width="5" height="5" rx="1" fill="white" opacity=".9" />
      <rect x="8" y="1" width="5" height="5" rx="1" fill="white" opacity=".5" />
      <rect x="1" y="8" width="5" height="5" rx="1" fill="white" opacity=".5" />
      <rect x="8" y="8" width="5" height="5" rx="1" fill="white" opacity=".9" />
    </svg>
  )
}
