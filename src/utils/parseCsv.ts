import Papa from "papaparse";

export interface ParsedRow {
  time: string;
  timeMs: number;
  relTimeMs: number;
  [key: string]: string | number;
}

function parseTimeToMs(time: string): number {
  const [h, m, s] = time.split(":");
  const [sec, ms] = s.split(".");
  return (
    Number(h) * 3600000 +
    Number(m) * 60000 +
    Number(sec) * 1000 +
    (ms ? Number(ms) : 0)
  );
}

/**
 * Interpoluje puste wartości w kolumnach numerycznych
 */
function interpolateMissingValues(rows: ParsedRow[], columns: string[]) {
  for (const col of columns) {
    const values = rows.map((r) => (r[col] === "" ? null : Number(r[col])));
    for (let i = 0; i < values.length; i++) {
      if (values[i] === null) {
        // znajdź poprzednią znaną wartość
        let prevIdx = i - 1;
        while (prevIdx >= 0 && values[prevIdx] === null) prevIdx--;

        // znajdź kolejną znaną wartość
        let nextIdx = i + 1;
        while (nextIdx < values.length && values[nextIdx] === null) nextIdx++;

        const prevVal = prevIdx >= 0 ? values[prevIdx] : null;
        const nextVal = nextIdx < values.length ? values[nextIdx] : null;

        if (prevVal != null && nextVal != null) {
          // interpolacja liniowa
          const ratio = (i - prevIdx) / (nextIdx - prevIdx);
          values[i] = prevVal + (nextVal - prevVal) * ratio;
        } else if (prevVal != null) {
          values[i] = prevVal; // brak następnej wartości – powiel poprzednią
        } else if (nextVal != null) {
          values[i] = nextVal; // brak poprzedniej wartości – powiel następną
        } else {
          values[i] = 0; // brak jakichkolwiek wartości
        }
      }
    }

    // przypisz interpolowane wartości z powrotem
    for (let i = 0; i < rows.length; i++) {
      rows[i][col] = values[i]!;
    }
  }
}

export function parseCsv(content: string): ParsedRow[] {
  const result = Papa.parse(content.trim(), {
    header: true,
    skipEmptyLines: true,
  });

  const rows = (result.data as any[]).map((row) =>
    Object.fromEntries(Object.entries(row).filter(([key, value]) => key !== ''))
  ).map((row: any) => ({
    ...row,
    time: row.time,
    timeMs: parseTimeToMs(row.time),
  }));

  const t0 = rows[0].timeMs;
  rows.forEach((r) => (r.relTimeMs = r.timeMs - t0));

  const numericCols = Object.keys(rows[0]).filter(
    (c) => c !== "time" && c !== "timeMs" && c !== "relTimeMs"
  );

  interpolateMissingValues(rows, numericCols);

  return rows;
}
