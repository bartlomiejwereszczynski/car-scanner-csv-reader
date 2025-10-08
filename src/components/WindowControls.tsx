import React from 'react'


export default function WindowControls({ min, max, start, setStart, windowMs, setWindowMs }: { min: number; max: number; start: number; setStart: (v:number)=>void; windowMs: number; setWindowMs: (v:number)=>void }){
  return (
    <div style={{display:'flex', gap:12, alignItems:'center'}}>
      <div style={{width:300}}>
        <label>Start (ms from session start): {start}</label>
        <input className="range" type="range" min={min} max={Math.max(min, max - windowMs)} step={50} value={start} onChange={e=>setStart(Number(e.target.value))} />
      </div>
      <div>
        <label>Window (ms)</label>
        <select value={windowMs} onChange={e=>setWindowMs(Number(e.target.value))}>
          <option value={2000}>2 s</option>
          <option value={5000}>5 s</option>
          <option value={10000}>10 s</option>
          <option value={30000}>30 s</option>
          <option value={60000}>60 s</option>
        </select>
      </div>
    </div>
  )
}
