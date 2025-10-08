import React                   from 'react';
import { parseCsv, ParsedRow } from '../utils/parseCsv';

export interface FileUploaderProps {
  onData: (data: ParsedRow[]) => void;
}

export const FileUploader: React.FC<FileUploaderProps> = ({ onData }) => {
  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === 'string') {
        try {
          const parsed = parseCsv(text);
          onData(parsed);
        } catch (err) {
          console.error('CSV parsing error:', err);
          alert('Couldn\'t read the file. Check its format');
        }
      }
    };
    reader.readAsText(file, 'utf-8');
  };

  return (
    <div>
      <label style={{ display: 'block', marginBottom: 8 }}>
        Choose a CSV file:
      </label>
      <input
        type="file"
        accept=".csv"
        onChange={handleFile}
        style={{ cursor: 'pointer' }}
      />
    </div>
  );
};
