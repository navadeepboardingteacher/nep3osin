import axios from 'axios';
import * as cheerio from 'cheerio';

export interface ElectionResult {
  id: string;
  constituency: string;
  constituencyName: string;
  candidate: string;
  party: string;
  partyCode: string;
  votes: number;
  percentage: number;
  margin: number;
  isLeading: boolean;
  status: 'counting' | 'completed' | 'pending';
  lastUpdated: string;
}

export interface PartySummary {
  party: string;
  partyCode: string;
  seats: number;
  totalVotes: number;
  percentage: number;
  color: string;
}

export interface ScrapedData {
  results: ElectionResult[];
  parties: PartySummary[];
  totalSeats: number;
  countedSeats: number;
  lastUpdated: string;
}

const PARTY_COLORS: Record<string, string> = {
  'नेपाली कांग्रेस': '#2E7D32',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': '#6A1B9A',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': '#DC143C',
  'जनता समाजवादी पार्टी, नेपाल': '#FF6F00',
  'राष्ट्रीय स्वतन्त्र पार्टी': '#00ACC1',
  'बहुजन समाजवादी पार्टी नेपाल': '#1565C0',
  'निर्वाचन स्वतन्त्र': '#9E9E9E',
};

const PARTY_CODES: Record<string, string> = {
  'नेपाली कांग्रेस': 'NEP',
  'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)': 'MAO',
  'नेपाल कम्युनिष्ट पार्टी (एमाले)': 'CPN',
  'जनता समाजवादी पार्टी, नेपाल': 'SJF',
  'राष्ट्रीय स्वतन्त्र पार्टी': 'RSP',
  'बहुजन समाजवादी पार्टी नेपाल': 'BSP',
  'निर्वाचन स्वतन्त्र': 'IND',
};

const CONSTITUENCIES = [
  'काठमाडौं-1', 'काठमाडौं-2', 'काठमाडौं-3', 'काठमाडौं-4', 'काठमाडौं-5',
  'ललितपुर-1', 'ललितपुर-2', 'ललितपुर-3',
  'भक्तपुर-1', 'भक्तपुर-2',
  'कास्की-1', 'कास्की-2', 'कास्की-3',
  'चितवन-1', 'चितवन-2', 'चितवन-3',
  'पोखरा-1', 'पोखरा-2', 'पोखरा-3',
  'बुटवल-1', 'बुटवल-2',
  'जनकपुर-1', 'जनकपुर-2',
  'विरगञ्ज-1', 'विरगञ्ज-2',
  'धरान-1', 'धरान-2',
  'इटहरी-1', 'इटहरी-2',
];

const CANDIDATES = [
  { name: 'शेरबहादुर देउवा', party: 'नेपाली कांग्रेस' },
  { name: 'पुष्पकमल दाहाल', party: 'नेपाल कम्युनिष्ट पार्टी (माओवादी केन्द्र)' },
  { name: 'केपी शर्मा ओली', party: 'नेपाल कम्युनिष्ट पार्टी (एमाले)' },
  { name: 'राजेन्द्रप्रसाद लौकाहार', party: 'जनता समाजवादी पार्टी, नेपाल' },
  { name: 'रवि लामिछाने', party: 'राष्ट्रीय स्वतन्त्र पार्टी' },
  { name: 'उपेन्द्र यादव', party: 'जनता समाजवादी पार्टी, नेपाल' },
  { name: 'अमरेश कुमार Singh', party: 'बहुजन समाजवादी पार्टी नेपाल' },
];

let cachedData: ScrapedData | null = null;
let cacheTimestamp: number = 0;
const CACHE_DURATION = 20000;

function generateMockResults(): ElectionResult[] {
  return CONSTITUENCIES.map((constituency, idx) => {
    const shuffled = [...CANDIDATES].sort(() => Math.random() - 0.5);
    const leading = shuffled[0];
    const baseVotes = Math.floor(Math.random() * 15000) + 5000;
    const margin = Math.floor(Math.random() * 3000) + 100;
    
    return {
      id: `result-${idx}`,
      constituency: constituency.replace(/-/g, '').replace(/\d/g, '').trim(),
      constituencyName: constituency,
      candidate: leading.name,
      party: leading.party,
      partyCode: PARTY_CODES[leading.party] || 'IND',
      votes: baseVotes,
      percentage: Math.random() * 20 + 40,
      margin: margin,
      isLeading: true,
      status: Math.random() > 0.2 ? 'counting' : 'completed',
      lastUpdated: new Date().toISOString(),
    };
  });
}

export async function scrapeElectionResults(): Promise<ScrapedData> {
  const now = Date.now();
  
  if (cachedData && (now - cacheTimestamp) < CACHE_DURATION) {
    return cachedData;
  }

  // Always use mock data for demo (external scraping may be blocked on serverless)
  cachedData = processResults(generateMockResults());

  cacheTimestamp = Date.now();
  return cachedData!;
}

function processResults(rawResults: ElectionResult[]): ScrapedData {
  const constituencyMap = new Map<string, ElectionResult[]>();
  
  rawResults.forEach(result => {
    const existing = constituencyMap.get(result.constituency) || [];
    existing.push(result);
    constituencyMap.set(result.constituency, existing);
  });

  const processedResults: ElectionResult[] = [];
  
  constituencyMap.forEach((candidates) => {
    candidates.sort((a, b) => b.votes - a.votes);
    const leading = candidates[0];
    const second = candidates[1];
    
    leading.margin = second ? leading.votes - second.votes : 0;
    leading.isLeading = true;
    processedResults.push(leading);
    
    if (second) {
      second.margin = leading.votes - second.votes;
      second.isLeading = false;
      processedResults.push(second);
    }
  });

  const partyMap = new Map<string, { votes: number; seats: number }>();
  
  processedResults.filter(r => r.isLeading).forEach(result => {
    const partyData = partyMap.get(result.party) || { votes: 0, seats: 0 };
    partyData.votes += result.votes;
    partyData.seats += 1;
    partyMap.set(result.party, partyData);
  });

  const parties: PartySummary[] = Array.from(partyMap.entries())
    .map(([party, data]) => ({
      party,
      partyCode: PARTY_CODES[party] || 'IND',
      seats: data.seats,
      totalVotes: data.votes,
      percentage: (data.seats / processedResults.filter(r => r.isLeading).length) * 100,
      color: PARTY_COLORS[party] || '#9E9E9E',
    }))
    .sort((a, b) => b.seats - a.seats);

  return {
    results: processedResults,
    parties,
    totalSeats: 275,
    countedSeats: processedResults.filter(r => r.isLeading).length,
    lastUpdated: new Date().toISOString(),
  };
}

export async function getElectionResults(): Promise<ScrapedData> {
  return scrapeElectionResults();
}
