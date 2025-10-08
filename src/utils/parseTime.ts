// Parses HH:mm:ss.SSS into milliseconds since midnight
export function parseTimeToMillis(timeStr: string): number {
// Accepts variants like 17:08:33.334 or 07:05:02 or 17:08:33.4
  const parts = timeStr.trim().split(':');
  if (parts.length !== 3) throw new Error('Invalid time format: ' + timeStr);
  const [hStr, mStr, sStr] = parts;
  const h = parseInt(hStr, 10);
  const m = parseInt(mStr, 10);
  const [secStr, msStr = '0'] = sStr.split('.');
  const s = parseInt(secStr, 10);
  const ms = parseInt(msStr.padEnd(3, '0').slice(0, 3), 10);
  return h * 3600000 + m * 60000 + s * 1000 + ms;
}


export function formatMillisAsTime(ms: number): string {
// ms since start (not since midnight) -> format +s.ms or HH:mm:ss.SSS when needed
  if (ms < 24 * 3600000) {
    const h = Math.floor(ms / 3600000);
    const m = Math.floor((ms % 3600000) / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const msPart = ms % 1000;
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(msPart).padStart(3, '0')}`;
  }
  return `${ms}ms`;
}
