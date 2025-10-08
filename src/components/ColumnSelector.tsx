import React from 'react';


export default function ColumnSelector({ columns, selected, onToggle }: {
  columns: string[];
  selected: string[];
  onToggle: (col: string) => void
}) {
  return (
    <div className="columns-list">
      {columns.map(col => (
        <div key={col}>
          <label>
            <input type="checkbox" checked={selected.includes(col)} onChange={() => onToggle(col)}/> {col}
          </label>
        </div>
      ))}
    </div>
  );
}
