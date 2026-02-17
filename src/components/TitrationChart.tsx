import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { getTitrationData } from '../utils/doseCalc';

export default function TitrationChart({ titrationWeeks, unit }) {
  if (!titrationWeeks || titrationWeeks.length === 0) return null;

  const data = getTitrationData(titrationWeeks, unit);

  return (
    <div className="titration-chart">
      <h3 className="titration-title">Titration Schedule</h3>
      <p className="titration-subtitle">Recommended 6-week ramp-up</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="week"
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 13 }}
            tickFormatter={(w) => `Wk ${w}`}
          />
          <YAxis
            stroke="#6b7280"
            tick={{ fill: '#9ca3af', fontSize: 13 }}
            tickFormatter={(v) => `${v}${unit}`}
            width={70}
          />
          <Tooltip
            contentStyle={{
              background: '#1f2937',
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#f9fafb',
              fontSize: '14px',
            }}
            formatter={(value) => [`${value} ${unit}`, 'Dose']}
            labelFormatter={(w) => `Week ${w}`}
          />
          <Line
            type="stepAfter"
            dataKey="dose"
            stroke="#d1d5db"
            strokeWidth={2}
            dot={{ fill: '#d1d5db', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
