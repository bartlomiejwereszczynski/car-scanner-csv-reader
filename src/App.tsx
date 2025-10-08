import React, { useMemo, useState } from 'react'
import { FileUploader, ParsedRow } from './components/FileUploader'
import ColumnSelector from './components/ColumnSelector'
import WindowControls from './components/WindowControls'
import SyncedChart from './components/SyncedChart'


export default function App(){
  const [data, setData] = useState<ParsedRow[]>([])
  const [columns, setColumns] = useState<string[]>([])
  const [selected, setSelected] = useState<string[]>([])
  const [startMs, setStartMs] = useState(0)
  const [windowMs, setWindowMs] = useState(10000)


  const onData = (rows: ParsedRow[]) => {
    setData(rows)
    const cols = Object.keys(rows[0] ?? {}).filter(k=>k !== 'time' && k !== 'timeMs' && k !== 'relTimeMs')
    setColumns(cols)
    setSelected(cols.slice(0, Math.min(3, cols.length)))
    setStartMs(0)
  }


  const toggle = (col: string) => {
    setSelected(prev => prev.includes(col) ? prev.filter(c=>c!==col) : [...prev, col])
  }


  const min = 0
  const max = data.length ? Math.max(...data.map(d=>d.relTimeMs as number)) : 0


// visible data based on startMs and windowMs
  const visible = useMemo(() => {
    if (!data.length) return []
    const end = startMs + windowMs
    return data.filter(d => (d.relTimeMs as number) >= startMs && (d.relTimeMs as number) <= end)
  }, [data, startMs, windowMs])


  return (
    <div className="app">
      <h2>CSV Synced Charts</h2>


      <div className="controls">
        <FileUploader onData={onData} />
        <div style={{width:20}} />
        <div style={{flex:1}}>
          <div style={{marginBottom:8}}>Columns (wybierz które wyświetlić):</div>
          <ColumnSelector columns={columns} selected={selected} onToggle={toggle} />
        </div>
      </div>


      <WindowControls min={min} max={max} start={startMs} setStart={setStartMs} windowMs={windowMs} setWindowMs={setWindowMs} />


      <div style={{height:12}} />


      <div className="charts">
        {selected.length === 0 && <div className="chart-card">Wybierz kolumnę do wyświetlenia</div>}
        {selected.map(col => (
          <SyncedChart key={col} data={visible} dataKey={col} syncId={'timeSync'} />
        ))}
      </div>


      <div style={{marginTop:12}}>
        <small>Note: first column must be time in <code>HH:mm:ss.SSS</code> (no date). Other columns should be numeric values.</small>
      </div>


    </div>
  )
}
