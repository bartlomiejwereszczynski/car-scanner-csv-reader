import React from 'react'

export default function WindowControls({
                                         min,
                                         max,
                                         start,
                                         setStart,
                                         windowMs,
                                         setWindowMs,
                                         isPlaying,
                                         onPlayPause,
                                         onStop
                                       }: {
  min: number
  max: number
  start: number
  setStart: (v: number) => void
  windowMs: number
  setWindowMs: (v: number) => void
  isPlaying: boolean
  onPlayPause: () => void
  onStop: () => void
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%' }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
        <button onClick={onPlayPause}>{isPlaying ? '⏸️ Pauza' : '▶️ Odtwórz'}</button>
        <button onClick={onStop}>⏹️ Stop</button>
        <label>Okno (ms)</label>
        <select value={windowMs} onChange={(e) => setWindowMs(Number(e.target.value))}>
          <option value={2000}>2 s</option>
          <option value={5000}>5 s</option>
          <option value={10000}>10 s</option>
          <option value={30000}>30 s</option>
          <option value={60000}>60 s</option>
          <option value={120000}>120 s</option>
        </select>
      </div>

      <div style={{ width: '100%' }}>
        <input
          className="range"
          style={{ width: '100%' }}
          type="range"
          min={min}
          max={Math.max(min, max - windowMs)}
          step={50}
          value={start}
          onChange={(e) => setStart(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
