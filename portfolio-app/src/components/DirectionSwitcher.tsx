import type { FocusTrack, FocusTrackId } from '../content/portfolioData'

interface DirectionSwitcherProps {
  activeTrackId: FocusTrackId
  tracks: FocusTrack[]
  onChange: (trackId: FocusTrackId) => void
}

/**
 * 在首页内切换两条求职方向，突出不同查看顺序而不拆成两套站点。
 */
export function DirectionSwitcher({
  activeTrackId,
  tracks,
  onChange,
}: DirectionSwitcherProps) {
  return (
    <div className="flex flex-col gap-3 md:flex-row">
      {tracks.map((track) => {
        const isActive = track.id === activeTrackId

        return (
          <button
            key={track.id}
            type="button"
            aria-pressed={isActive}
            className={`sketch-button w-full text-left md:w-auto ${
              isActive ? 'is-active' : ''
            }`}
            onClick={() => onChange(track.id)}
          >
            <span className="block font-hand text-lg tracking-[0.12em]">
              {track.eyebrow}
            </span>
            <span className="mt-1 block font-hand text-xl font-semibold">
              {track.shortLabel}
            </span>
          </button>
        )
      })}
    </div>
  )
}
