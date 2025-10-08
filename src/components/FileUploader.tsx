import React from 'react'
import Papa from 'papaparse'
import { parseTimeToMillis } from '../utils/parseTime'


export type ParsedRow = { time: string; timeMs: number; [key: string]: string | number }


export function FileUploader({ onData }: { onData: (rows: ParsedRow[]) => void }) {
  const handleFile = (f?: File) => {
    if (!f) return
    Papa.parse<string[]>(f, {
      worker: true,
      skipEmptyLines: true,
      complete: (res) => {
        const data = res.data as string[][]
        if (data.length < 2) return
        const headers = data[0]
        const rows = data.slice(1).map(row => {
          const obj: any = {}
          headers.forEach((h, i) => {
            obj[h] = row[i]
          })
          try {
            const timeMs = parseTimeToMillis(String(obj[headers[0]]))
            obj.time = String(obj[headers[0]])
            obj.timeMs = timeMs
          } catch (e) {
            console.error('time parse error', e)
            obj.time = obj[headers[0]]
            obj.timeMs = 0
          }
          return obj as ParsedRow
        })
// normalize to relative time from first sample
        const base = rows[0]?.timeMs ?? 0
        const normalized = rows.map(r => ({ ...r, relTimeMs: (r.timeMs as number) - base }))
        onData(normalized as ParsedRow[])
      }
    })
  }


  return (
    <div>
      <input className="file-input" type="file" accept=".csv,text/csv" onChange={e => handleFile(e.target.files?.[0])} />
    </div>
  )
}
