import type { FocusTrackId, PortfolioProject } from '../content/portfolioData'

interface ProjectSpotlightCardProps {
  project: PortfolioProject
  rank: number
  activeTrackId: FocusTrackId
}

/**
 * 单个项目的案例卡片，统一呈现目标、结果与适配方向。
 */
export function ProjectSpotlightCard({
  project,
  rank,
  activeTrackId,
}: ProjectSpotlightCardProps) {
  const directionSummary =
    activeTrackId === 'ai' ? project.primaryValue.ai : project.primaryValue.game

  return (
    <article className="sketch-frame group overflow-hidden rounded-[2rem] bg-[rgba(255,255,255,0.78)] px-5 py-5 transition duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 md:px-7 md:py-7">
      <div className="grid gap-6 lg:grid-cols-[1.18fr_0.82fr] lg:items-start">
        <div className="space-y-5">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <p className="font-hand text-lg text-[var(--ink-soft)]">
                Case 0{rank}
              </p>
              <h3 className="font-hand text-2xl font-semibold text-[var(--ink)] md:text-[2rem]">
                {project.title}
              </h3>
              <p className="max-w-[48ch] text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                {project.subtitle}
              </p>
            </div>
            <div className="space-y-2 rounded-[1.4rem] border-2 border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm text-[var(--ink-muted)]">
              <p>{project.timeframe}</p>
              <p>{project.role}</p>
            </div>
          </div>

          <p className="font-hand text-lg font-semibold leading-8 text-[var(--ink)]">
            {project.heroLine}
          </p>
          <p className="leading-8 text-[var(--ink-muted)]">{project.summary}</p>

          <div className="space-y-3">
            <p className="font-hand text-2xl text-[var(--ink)]">
              为什么适合当前路径
            </p>
            <p className="rounded-[1.4rem] border-2 border-dashed border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-4 py-4 leading-8 text-[var(--ink-muted)]">
              {directionSummary}
            </p>
          </div>

          <div className="space-y-3">
            <p className="font-hand text-2xl text-[var(--ink)]">
              项目亮点
            </p>
            <ul className="space-y-3">
              {project.highlights.map((highlight) => (
                <li
                  key={highlight}
                  className="flex items-start gap-3 leading-8 text-[var(--ink-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)]"
                  />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <aside className="space-y-5">
          <div
            className="sticky-note notebook-shadow rounded-[1.75rem] px-5 py-5"
            style={{
              backgroundColor: project.stickyTone,
              transform: project.tilt,
            }}
          >
            <p className="font-hand text-[1.65rem] text-[var(--ink)]">
              Result Notes
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.metrics.map((metric) => (
                <span key={metric} className="badge-chip">
                  {metric}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-[1.7rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.68)] px-5 py-5">
            <p className="font-hand text-[1.65rem] text-[var(--ink)]">
              Evidence Shelf
            </p>
            <ul className="mt-4 space-y-3">
              {project.evidence.map((item) => (
                <li
                  key={item}
                  className="flex items-center gap-3 text-sm leading-7 text-[var(--ink-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="h-2.5 w-2.5 rounded-full bg-[var(--ink)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </article>
  )
}
