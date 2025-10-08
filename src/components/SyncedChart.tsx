import React                                                                          from 'react';
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { formatMillisAsTime }                                                         from '../utils/parseTime';


export default function SyncedChart({ data, dataKey, syncId }: { data: any[]; dataKey: string; syncId: string }) {
  return (
    <div className="chart-card" style={{ height: 250 }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} syncId={syncId} margin={{ top: 8, right: 24, left: 8, bottom: 8 }}>
          <CartesianGrid strokeDasharray="3 3"/>
          <XAxis
            dataKey="relTimeMs"
            type="number"
            domain={[data[0]?.relTimeMs ?? 0, data[data.length - 1]?.relTimeMs ?? 0]}
            tickFormatter={(v) => formatMillisAsTime(v as number)}
          />
          <YAxis/>
          <Tooltip labelFormatter={(v) => formatMillisAsTime(Number(v))} animationDuration={200}/>
          <Line type="monotone" dataKey={dataKey} stroke="#1976d2" dot={false} isAnimationActive={false}/>
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
