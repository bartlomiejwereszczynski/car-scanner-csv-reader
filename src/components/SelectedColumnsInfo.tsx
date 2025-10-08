import React, { useState } from 'react'

interface SelectedColumnsInfoProps {
  selected: string[]
  visibleData: Record<string, any>[]
}

const SelectedColumnsInfo: React.FC<SelectedColumnsInfoProps> = ({ selected, visibleData }) => {
  const [isVisible, setIsVisible] = useState(false) // domyślnie ukryte

  if (!selected.length) return null

  return (
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', background: 'rgba(255,255,255,0.95)', padding: '0.5rem 1rem', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', zIndex: 1000 }}>
      <button onClick={() => setIsVisible((v) => !v)} style={{ marginBottom: 4 }}>
        {isVisible ? 'Ukryj dane' : 'Pokaż dane'}
      </button>
      {isVisible && (
        <div style={{ display: 'inline-flex', gap: '1rem', flexWrap: 'wrap', fontSize: 12 }}>
          {selected.map((col) => {
            const lastValue = visibleData.length ? visibleData[visibleData.length - 1][col] : ''
            return (
              <div key={col} style={{ padding: '0.2rem 0.5rem', background: '#f0f0f0', borderRadius: 4 }}>
                {col}: {lastValue}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default SelectedColumnsInfo
