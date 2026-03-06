import { useEffect, useRef, useState } from 'react';
import { ElectionResult, PartySummary } from '../lib/ratopatiScraper';

interface NepalMapProps {
  results: ElectionResult[];
  parties: PartySummary[];
}

interface Marker {
  name: string;
  lat: number;
  lng: number;
}

const MARKERS: Marker[] = [
  { name: 'काठमाडौं-1', lat: 27.7172, lng: 85.3240 },
  { name: 'काठमाडौं-2', lat: 27.7272, lng: 85.3340 },
  { name: 'ललितपुर-1', lat: 27.4667, lng: 85.3000 },
  { name: 'भक्तपुर-1', lat: 27.6725, lng: 85.4260 },
  { name: 'कास्की-1', lat: 28.2096, lng: 83.9856 },
  { name: 'चितवन-1', lat: 27.5333, lng: 84.3333 },
  { name: 'पोखरा-1', lat: 28.2096, lng: 83.9856 },
  { name: 'बुटवल-1', lat: 27.7000, lng: 83.4333 },
  { name: 'जनकपुर-1', lat: 26.7278, lng: 85.8961 },
  { name: 'विरगञ्ज-1', lat: 27.0078, lng: 84.8533 },
  { name: 'धरान-1', lat: 26.8125, lng: 87.2833 },
  { name: 'इटहरी-1', lat: 26.6667, lng: 87.4167 },
];

const PARTY_COLORS: Record<string, string> = {
  'नेपाली कांग्रेस': '#2E7D32',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': '#6A1B9A',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': '#DC143C',
  'जनता समाजवादी पार्टी, नेपाल': '#FF6F00',
  'राष्ट्रीय स्वतन्त्र पार्टी': '#00ACC1',
};

export default function NepalMap({ results, parties }: NepalMapProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hovered, setHovered] = useState<{ name: string; votes: number; margin: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    const gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, width / 2);
    gradient.addColorStop(0, '#1e293b');
    gradient.addColorStop(1, '#0f172a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const leadingResults = results.filter(r => r.isLeading).slice(0, MARKERS.length);
    
    const minLat = 26.3, maxLat = 30.4, minLng = 80.0, maxLng = 88.2;
    const xScale = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
    const yScale = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * (height - 80) + 40;

    MARKERS.forEach((marker, idx) => {
      const result = leadingResults[idx];
      const x = xScale(marker.lng);
      const y = yScale(marker.lat);
      const color = result ? PARTY_COLORS[result.party] || '#9E9E9E' : '#9E9E9E';
      const isHovered = hovered?.name === marker.name;

      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = `${color}33`;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(x, y, isHovered ? 14 : 10, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      const shortName = marker.name.split('-')[0];
      ctx.fillText(shortName, x, y + 24);
    });
  }, [results, hovered]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const minLat = 26.3, maxLat = 30.4, minLng = 80.0, maxLng = 88.2;
    const width = canvas.width, height = canvas.height;
    const xScale = (lng: number) => ((lng - minLng) / (maxLng - minLng)) * (width - 80) + 40;
    const yScale = (lat: number) => ((maxLat - lat) / (maxLat - minLat)) * (height - 80) + 40;

    const leadingResults = results.filter(r => r.isLeading);

    let found = null;
    for (let i = 0; i < MARKERS.length; i++) {
      const m = MARKERS[i];
      const result = leadingResults[i];
      const cx = xScale(m.lng);
      const cy = yScale(m.lat);
      const dist = Math.sqrt((x - cx) ** 2 + (y - cy) ** 2);

      if (dist < 20) {
        found = { name: m.name, votes: result?.votes || 0, margin: result?.margin || 0 };
        break;
      }
    }

    setHovered(found);
  };

  return (
    <div className="relative">
      <canvas
        ref={canvasRef}
        width={400}
        height={400}
        className="w-full h-auto rounded-lg cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setHovered(null)}
      />
      {hovered && (
        <div className="absolute top-2 right-2 glass-card p-3 rounded-lg text-xs">
          <div className="font-bold text-cyan-400">{hovered.name}</div>
          {hovered.votes > 0 && (
            <>
              <div className="text-cyan-300 mt-1">{hovered.votes.toLocaleString()} votes</div>
              <div className="text-orange-300">+{hovered.margin.toLocaleString()} margin</div>
            </>
          )}
        </div>
      )}
    </div>
  );
}
