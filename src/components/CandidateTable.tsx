import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import { ElectionResult } from '../lib/ratopatiScraper';
import { Search, TrendingUp, Users } from 'lucide-react';
import { cn } from '../lib/utils';

interface CandidateTableProps {
  results: ElectionResult[];
}

const PARTY_COLORS: Record<string, string> = {
  'नेपाली कांग्रेस': 'bg-green-500/20 text-green-400 border-green-500/30',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': 'bg-red-500/20 text-red-400 border-red-500/30',
  'जनता समाजवादी पार्टी, नेपाल': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  'राष्ट्रीय स्वतन्त्र पार्टी': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  'निर्वाचन स्वतन्त्र': 'bg-gray-500/20 text-gray-400 border-gray-500/30',
};

export default function CandidateTable({ results }: CandidateTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'votes' | 'margin'>('votes');
  const [showOnlyLeading, setShowOnlyLeading] = useState(false);

  const filteredResults = useMemo(() => {
    let filtered = [...results];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (r) => r.candidate.toLowerCase().includes(query) ||
              r.constituency.toLowerCase().includes(query) ||
              r.party.toLowerCase().includes(query)
      );
    }

    if (showOnlyLeading) {
      filtered = filtered.filter((r) => r.isLeading);
    }

    filtered.sort((a, b) => {
      return sortBy === 'votes' ? b.votes - a.votes : b.margin - a.margin;
    });

    return filtered;
  }, [results, searchQuery, sortBy, showOnlyLeading]);

  const getPartyBadgeClass = (party: string) => {
    return PARTY_COLORS[party] || 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  return (
    <Card className="glass-card">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
            <Users className="w-4 h-4" />
            Live Vote Counts
          </CardTitle>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 bg-white/5 border-white/10 text-sm w-40"
              />
            </div>
            <Button
              variant={showOnlyLeading ? 'default' : 'outline'}
              size="sm"
              onClick={() => setShowOnlyLeading(!showOnlyLeading)}
              className={cn(showOnlyLeading && 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30')}
            >
              <TrendingUp className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Constituency</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Candidate</th>
                <th className="text-left text-xs text-muted-foreground font-medium py-2 px-2">Party</th>
                <th className="text-right text-xs text-muted-foreground font-medium py-2 px-2">Votes</th>
                <th className="text-right text-xs text-muted-foreground font-medium py-2 px-2">Margin</th>
                <th className="text-center text-xs text-muted-foreground font-medium py-2 px-2">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredResults.slice(0, 15).map((result, index) => (
                <tr key={result.id || index} className={cn('border-b border-white/5 hover:bg-white/5', result.isLeading && 'bg-cyan-500/5')}>
                  <td className="py-2 px-2 text-sm text-white font-medium">{result.constituencyName}</td>
                  <td className="py-2 px-2">
                    <div className="flex items-center gap-2">
                      {result.isLeading && <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />}
                      <span className="text-sm text-white">{result.candidate}</span>
                    </div>
                  </td>
                  <td className="py-2 px-2">
                    <span className={cn('text-xs px-2 py-0.5 rounded border', getPartyBadgeClass(result.party))}>
                      {result.partyCode}
                    </span>
                  </td>
                  <td className="py-2 px-2 text-right text-sm text-cyan-300 font-mono">{result.votes.toLocaleString()}</td>
                  <td className="py-2 px-2 text-right text-sm text-orange-300 font-mono">+{result.margin.toLocaleString()}</td>
                  <td className="py-2 px-2 text-center">
                    <span className={cn('text-xs px-2 py-0.5 rounded', result.status === 'completed' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400')}>
                      {result.status === 'completed' ? 'Done' : 'Counting'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
