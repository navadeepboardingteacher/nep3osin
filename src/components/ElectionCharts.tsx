import { PartySummary } from '../lib/ratopatiScraper';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts';

interface ElectionChartsProps {
  parties: PartySummary[];
  totalSeats: number;
  countedSeats: number;
}

const COLORS = ['#DC143C', '#2E7D32', '#6A1B9A', '#FF6F00', '#00ACC1', '#1565C0', '#FFB300', '#9E9E9E'];

export function PartySeatChart({ parties }: { parties: PartySummary[] }) {
  const data = parties.slice(0, 6).map((p) => ({ name: p.partyCode, seats: p.seats }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} layout="vertical" margin={{ left: 10, right: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
        <XAxis type="number" stroke="#94a3b8" />
        <YAxis dataKey="name" type="category" width={40} stroke="#94a3b8" />
        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
        <Bar dataKey="seats" fill="#06b6d4" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function PartyVotePieChart({ parties }: { parties: PartySummary[] }) {
  const data = parties.slice(0, 5).map((p) => ({ name: p.partyCode, value: p.totalVotes }));

  return (
    <ResponsiveContainer width="100%" height={200}>
      <PieChart>
        <Pie data={data} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
          {data.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: 'rgba(15, 23, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px' }} />
      </PieChart>
    </ResponsiveContainer>
  );
}

export default function ElectionCharts({ parties, totalSeats, countedSeats }: ElectionChartsProps) {
  return (
    <div className="space-y-4">
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm text-cyan-400 mb-2">Seat Projection</h3>
        <PartySeatChart parties={parties} />
      </div>
      <div className="glass-card rounded-lg p-4">
        <h3 className="text-sm text-cyan-400 mb-2">Vote Distribution</h3>
        <PartyVotePieChart parties={parties} />
      </div>
    </div>
  );
}
