import { gameExperienceBoard } from '../content/gameExperienceData'
import { SectionHeading } from './SectionHeading'

/**
 * 在首页补充游戏策划路线的游玩样本，直接说明品类覆盖和策划观察来源。
 */
export function GameExperienceBoard() {
  return (
    <section
      id="game-experience"
      className="sketch-frame rounded-[2.2rem] px-6 py-7 md:px-10 md:py-10"
    >
      <div className="grid gap-8 lg:grid-cols-[1.08fr_0.92fr] lg:items-start">
        <div className="space-y-6">
          <SectionHeading
            eyebrow={gameExperienceBoard.eyebrow}
            title={gameExperienceBoard.title}
            description={gameExperienceBoard.description}
          />

          <div className="flex flex-wrap gap-3">
            {gameExperienceBoard.badges.map((badge) => (
              <span key={badge} className="badge-chip">
                {badge}
              </span>
            ))}
          </div>
        </div>

        <article
          className="sticky-note notebook-shadow rounded-[1.8rem] px-5 py-5"
          style={{
            backgroundColor: 'var(--sticky-blue)',
            transform: 'rotate(1.6deg)',
          }}
        >
          <p className="font-hand text-[1.6rem] text-[var(--ink)]">
            {gameExperienceBoard.noteTitle}
          </p>
          <p className="mt-3 leading-8 text-[var(--ink-muted)]">
            {gameExperienceBoard.noteSummary}
          </p>

          <ul className="mt-4 space-y-3">
            {gameExperienceBoard.lenses.map((lens) => (
              <li
                key={lens.title}
                className="rounded-[1.2rem] border-2 border-[rgba(38,54,63,0.16)] bg-[rgba(255,255,255,0.58)] px-4 py-3"
              >
                <p className="font-hand text-[1.25rem] text-[var(--ink)]">
                  {lens.title}
                </p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-muted)]">
                  {lens.detail}
                </p>
              </li>
            ))}
          </ul>
        </article>
      </div>

      <div className="game-ledger mt-8">
        <div className="game-ledger__header">
          <p className="game-ledger__eyebrow">{gameExperienceBoard.ledgerTitle}</p>
          <p className="game-ledger__summary">{gameExperienceBoard.ledgerSummary}</p>
        </div>

        <div className="game-ledger__grid">
          {gameExperienceBoard.buckets.map((bucket, index) => (
            <article
              key={bucket.title}
              className="game-ledger__card"
              style={{
                backgroundColor: bucket.tone,
                transform: index % 2 === 0 ? 'rotate(-0.8deg)' : 'rotate(0.9deg)',
              }}
            >
              <div className="game-ledger__card-head">
                <p className="game-ledger__card-title">{bucket.title}</p>
                <p className="game-ledger__card-summary">{bucket.summary}</p>
              </div>

              <ul className="game-ledger__list">
                {bucket.entries.map((entry) => (
                  <li key={entry.name} className="game-ledger__item">
                    <div className="min-w-0">
                      <p className="game-ledger__name">{entry.name}</p>
                      {entry.note ? (
                        <p className="game-ledger__note">{entry.note}</p>
                      ) : null}
                    </div>
                    <span className="game-ledger__proof">{entry.proof}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-end">
        <div className="contact-tagline max-w-[34rem]">
          <p className="contact-tagline__text text-[1.45rem] md:text-[1.75rem]">
            {gameExperienceBoard.closingTitle}
          </p>
          <p className="mt-3 text-base leading-8 text-[var(--ink-muted)]">
            {gameExperienceBoard.closingNote}
          </p>
        </div>
      </div>
    </section>
  )
}
