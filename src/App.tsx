import React, { useEffect, useMemo, useState } from 'react';
import { FileUploader }                        from './components/FileUploader';
import ColumnSelector                          from './components/ColumnSelector';
import WindowControls                          from './components/WindowControls';
import SyncedChart                             from './components/SyncedChart';
import { ParsedRow }                           from './utils/parseCsv';

export default function App() {
  const [data, setData] = useState<ParsedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [startMs, setStartMs] = useState(0);
  const [windowMs, setWindowMs] = useState(10000);
  const [isPlaying, setIsPlaying] = useState(false);

  const onData = (rows: ParsedRow[]) => {
    console.log('onData', rows);
    setData(rows);
    const cols = Object.keys(rows[0] ?? {}).filter(
      (k) => k !== 'time' && k !== 'timeMs' && k !== 'relTimeMs',
    );
    setColumns(cols);
    setSelected(cols.slice(0, Math.min(3, cols.length)));
    setStartMs(0);
    setIsPlaying(false);
  };

  const toggle = (col: string) => {
    setSelected((prev) =>
      prev.includes(col) ? prev.filter((c) => c !== col) : [...prev, col],
    );
  };

  const min = 0;
  const max = data.length ? Math.max(...data.map((d) => d.relTimeMs as number)) : 0;

  const visible = useMemo(() => {
    if (!data.length) return [];
    const end = startMs + windowMs;
    return data.filter(
      (d) => (d.relTimeMs as number) >= startMs && (d.relTimeMs as number) <= end,
    );
  }, [data, startMs, windowMs]);

  useEffect(() => {
    if (!isPlaying) return;
    const step = 100;
    const id = setInterval(() => {
      setStartMs((prev) => {
        const next = prev + step;
        if (next + windowMs >= max) {
          clearInterval(id);
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    }, step);
    return () => clearInterval(id);
  }, [isPlaying, windowMs, max]);

  const handlePlayPause = () => setIsPlaying((p) => !p);
  const handleStop = () => {
    setIsPlaying(false);
    setStartMs(0);
  };

  return (
    <div style={{ width: '100%', padding: '1rem', boxSizing: 'border-box' }}>
      <h2>CSV Synced Charts (z odtwarzaniem i tytułami)</h2>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
        <FileUploader onData={onData}/>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <div style={{ marginBottom: 8 }}>Kolumny do wyświetlenia:</div>
          <ColumnSelector columns={columns} selected={selected} onToggle={toggle}/>
        </div>
      </div>

      <div style={{ marginTop: 16, width: '100%' }}>
        <WindowControls
          min={min}
          max={max}
          start={startMs}
          setStart={setStartMs}
          windowMs={windowMs}
          setWindowMs={setWindowMs}
          isPlaying={isPlaying}
          onPlayPause={handlePlayPause}
          onStop={handleStop}
        />
      </div>

      <div style={{ marginTop: 16, width: '100%' }}>
        {selected.length === 0 && (
          <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed #ccc' }}>
            Wybierz kolumnę do wyświetlenia
          </div>
        )}

        {selected.map((col) => (
          <div key={col} style={{ width: '100%', marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.5rem 0', textAlign: 'center' }}>{col}</h3>
            <div style={{ width: '100%', height: 250 }}>
              <SyncedChart data={visible} dataKey={col} syncId={'timeSync'}/>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 12, textAlign: 'center' }}>
        <small>
          Pierwsza kolumna musi być czasem w formacie <code>HH:mm:ss.SSS</code>.
        </small>
      </div>
    </div>
  );
}
