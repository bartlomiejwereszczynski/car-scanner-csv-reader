import React, { useEffect, useMemo, useState } from 'react';
import { FileUploader }                        from './components/FileUploader';
import ColumnSelector                          from './components/ColumnSelector';
import WindowControls                          from './components/WindowControls';
import SyncedChart                             from './components/SyncedChart';
import { ParsedRow }                           from './utils/parseCsv';
import SelectedColumnsInfo                     from './components/SelectedColumnsInfo';

export default function App() {
  const [data, setData] = useState<ParsedRow[]>([]);
  const [columns, setColumns] = useState<string[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [startMs, setStartMs] = useState(0);
  const [windowMs, setWindowMs] = useState(10000);
  const [isPlaying, setIsPlaying] = useState(false);

  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const onData = (rows: ParsedRow[]) => {
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
  const handleStop = () => setIsPlaying(false);

  return (
    <div style={{
      width: '100%',
      height: '100vh',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      padding: '1rem',
    }}>
      <h2>CSV Synced Charts (z odtwarzaniem i tytułami)</h2>

      {/* Pływający komponent pokazujący zaznaczone kolumny */}
      <SelectedColumnsInfo selected={selected} visibleData={visible} />

      {isDesktop ? (
        <div style={{ display: 'flex', flex: 1, gap: '1rem' }}>
          <div style={{ width: 300, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <FileUploader onData={onData}/>
            <div>
              <div style={{ marginBottom: 8 }}>Kolumny do wyświetlenia:</div>
              <ColumnSelector columns={columns} selected={selected} onToggle={toggle}/>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {selected.length === 0 && (
                <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed #ccc' }}>
                  Wybierz kolumnę do wyświetlenia
                </div>
              )}
              {selected.map((col) => {
                const lastValue = visible.length ? visible[visible.length - 1][col] : '';
                return (
                  <div key={col} style={{ width: '100%', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                      {col} {lastValue !== '' && `(ostatnia: ${lastValue})`}
                    </h3>
                    <div style={{ width: '100%', height: 250 }}>
                      <SyncedChart data={visible} dataKey={col} syncId={'timeSync'}/>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, gap: '1rem' }}>
          <FileUploader onData={onData}/>
          <div>
            <div style={{ marginBottom: 8 }}>Kolumny do wyświetlenia:</div>
            <ColumnSelector columns={columns} selected={selected} onToggle={toggle}/>
          </div>
          <div style={{ flex: 1, overflowY: 'auto' }}>
            {selected.length === 0 && (
              <div style={{ textAlign: 'center', padding: '1rem', border: '1px dashed #ccc' }}>
                Wybierz kolumnę do wyświetlenia
              </div>
            )}
            {selected.map((col) => {
              const lastValue = visible.length ? visible[visible.length - 1][col] : '';
              return (
                <div key={col} style={{ width: '100%', marginBottom: '1.5rem' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0', textAlign: 'center' }}>
                    {col} {lastValue !== '' && `(ostatnia: ${lastValue})`}
                  </h3>
                  <div style={{ width: '100%', height: 250 }}>
                    <SyncedChart data={visible} dataKey={col} syncId={'timeSync'}/>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Pływające kontrolki przypięte do dołu okna */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        width: '100%',
        background: 'rgba(255,255,255,0.95)',
        padding: '0.5rem 1rem',
        boxShadow: '0 -2px 5px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}>
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
    </div>
  );
}
