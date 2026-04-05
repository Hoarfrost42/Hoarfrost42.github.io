interface SectionHeadingProps {
  eyebrow: string
  title: string
  description: string
}

/**
 * 统一处理区块标题与简短说明，保持全页信息层级一致。
 */
export function SectionHeading({
  eyebrow,
  title,
  description,
}: SectionHeadingProps) {
  return (
    <header className="max-w-3xl space-y-3">
      <p className="font-hand text-lg uppercase tracking-[0.24em] text-[var(--ink-soft)]">
        {eyebrow}
      </p>
      <div className="space-y-3">
        <h2 className="ink-title text-4xl md:text-5xl">{title}</h2>
        <span className="marker-line" aria-hidden="true" />
      </div>
      <p className="max-w-[62ch] text-base leading-8 text-[var(--ink-muted)] md:text-lg">
        {description}
      </p>
    </header>
  )
}
