import type { PortfolioProject } from '../content/portfolioData'
import { MermaidDiagramCard } from './MermaidDiagramCard'

interface ProjectNotebookSheetLabels {
  ownedWork: string
  evidence: string
  delivery: string
  publicProofBoard: string
}

interface ProjectNotebookSheetProps {
  labels: ProjectNotebookSheetLabels
  project: PortfolioProject
  notebookIndex: number
}

/**
 * 以单层项目卡片呈现案例，突出主视觉、关键职责与落地方式。
 */
export function ProjectNotebookSheet({
  labels,
  project,
  notebookIndex,
}: ProjectNotebookSheetProps) {
  const primaryGalleryItem = project.gallery?.[0]
  const secondaryGalleryItems = project.gallery?.slice(1) ?? []
  const hasVisualShowcase = Boolean(primaryGalleryItem || project.diagram)

  return (
    <article className="sketch-frame overflow-hidden rounded-[2rem] bg-[rgba(255,255,255,0.8)] px-5 py-5 md:px-7 md:py-7">
      <div className="grid gap-6 xl:grid-cols-[1.16fr_0.84fr]">
        <div className="space-y-5">
          <header className="space-y-4">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="space-y-2">
                <p className="font-hand text-lg uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  Notebook 0{notebookIndex}
                </p>
                <h3 className="font-hand text-3xl font-semibold text-[var(--ink)] md:text-[2.6rem]">
                  {project.title}
                </h3>
                <p className="text-sm uppercase tracking-[0.18em] text-[var(--ink-soft)]">
                  {project.subtitle}
                </p>
              </div>

              <div className="rounded-[1.5rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.74)] px-4 py-3 text-sm leading-7 text-[var(--ink-muted)]">
                <p>{project.timeframe}</p>
                <p>{project.role}</p>
              </div>
            </div>

            <p className="font-hand text-lg font-semibold leading-8 text-[var(--ink)] md:text-[1.45rem]">
              {project.heroLine}
            </p>
            <p className="max-w-[68ch] leading-8 text-[var(--ink-muted)]">
              {project.coreQuestion}
            </p>
          </header>

          {hasVisualShowcase ? (
            <section className="space-y-4">
              {primaryGalleryItem ? (
                <figure className="overflow-hidden rounded-[1.8rem] border-2 border-[var(--line)] bg-[var(--paper)] shadow-[0_18px_30px_-22px_rgba(38,54,63,0.45)]">
                  <div className="bg-[rgba(214,238,245,0.42)] p-2 md:p-3">
                    <img
                      alt={primaryGalleryItem.alt}
                      className="block h-auto w-full rounded-[1.1rem]"
                      loading="lazy"
                      src={primaryGalleryItem.src}
                    />
                  </div>
                  <figcaption className="border-t-2 border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-5 py-4 text-base leading-8 text-[var(--ink-muted)]">
                    {primaryGalleryItem.caption}
                  </figcaption>
                </figure>
              ) : null}

              {project.diagram ? (
                <MermaidDiagramCard src={project.diagram.src} />
              ) : null}

              {secondaryGalleryItems.length > 0 ? (
                <div className="space-y-4">
                  {secondaryGalleryItems.map((image) => (
                    <figure
                      key={image.src}
                      className="overflow-hidden rounded-[1.8rem] border-2 border-[var(--line)] bg-[var(--paper)] shadow-[0_18px_30px_-22px_rgba(38,54,63,0.35)]"
                    >
                      <div className="bg-[rgba(214,238,245,0.38)] p-2 md:p-3">
                        <img
                          alt={image.alt}
                          className="block h-auto w-full rounded-[1.1rem]"
                          loading="lazy"
                          src={image.src}
                        />
                      </div>
                      <figcaption className="border-t-2 border-[var(--line)] bg-[rgba(255,255,255,0.82)] px-5 py-4 text-base leading-8 text-[var(--ink-muted)]">
                        {image.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              ) : null}
            </section>
          ) : (
            <section className="rounded-[1.8rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-5 py-5">
              <p className="font-hand text-[1.75rem] text-[var(--ink)]">
                {labels.publicProofBoard}
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-2">
                {project.publicArtifacts.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.3rem] border-2 border-dashed border-[var(--line)] bg-[var(--paper)] px-4 py-3 text-sm leading-7 text-[var(--ink-muted)]"
                  >
                    {item}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="grid gap-4">
          <section className="rounded-[1.7rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-5 py-5">
            <p className="font-hand text-[1.65rem] text-[var(--ink)]">
              {labels.ownedWork}
            </p>
            <ul className="mt-4 space-y-3">
              {project.ownedWorkstreams.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 leading-8 text-[var(--ink-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--ink)] bg-[var(--paper)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-[1.7rem] border-2 border-[var(--line)] bg-[var(--paper)] px-5 py-5">
            <p className="font-hand text-[1.65rem] text-[var(--ink)]">
              {labels.evidence}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.metrics.map((metric) => (
                <span key={metric} className="badge-chip">
                  {metric}
                </span>
              ))}
              {project.liveLink ? (
                <a
                  className="badge-chip badge-chip--link"
                  href={project.liveLink.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {project.liveLink.label}
                </a>
              ) : null}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {project.evidence.map((item) => (
                <span
                  key={item}
                  className="rounded-full border-2 border-dashed border-[var(--line)] px-3 py-2 text-sm text-[var(--ink-muted)]"
                >
                  {item}
                </span>
              ))}
            </div>
          </section>

          <section className="rounded-[1.7rem] border-2 border-[var(--line)] bg-[rgba(255,255,255,0.72)] px-5 py-5">
            <p className="font-hand text-[1.65rem] text-[var(--ink)]">
              {labels.delivery}
            </p>
            <ul className="mt-4 space-y-3">
              {project.deliveryChoices.map((item) => (
                <li
                  key={item}
                  className="flex items-start gap-3 leading-8 text-[var(--ink-muted)]"
                >
                  <span
                    aria-hidden="true"
                    className="mt-2 h-3 w-3 shrink-0 rounded-full border-2 border-[var(--ink)] bg-[rgba(255,255,255,0.82)]"
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </aside>
      </div>
    </article>
  )
}
