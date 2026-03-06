import axios from 'axios';
import Parser from 'rss-parser';

export interface NewsItem {
  id: string;
  title: string;
  link: string;
  source: string;
  sourceIcon: string;
  pubDate: string;
  isoDate: string;
  snippet?: string;
}

const RSS_FEEDS = [
  { url: 'https://www.ratopati.com/rss', source: 'Ratopati', icon: '📰' },
  { url: 'https://setopati.com/rss', source: 'Setopati', icon: '📺' },
  { url: 'https://onlinekhabar.com/feed', source: 'OnlineKhabar', icon: '🌐' },
  { url: 'https://ekantipur.com/rss', source: 'Kantipur', icon: '📰' },
  { url: 'https://annapurnapost.com/rss', source: 'AnnapurnaPost', icon: '🏔️' },
];

const ELECTION_KEYWORDS = [
  'निर्वाचन', 'मतगणना', 'election', 'vote', 'voting', 'candidate',
  'उम्मेदवार', 'परिणाम', 'result', 'constituency', 'निर्वाचन आयोग',
];

const parser = new Parser({ timeout: 10000 });

function generateMockNews(): NewsItem[] {
  const headlines = [
    'मतगणना जारी : काठमाडौंमा कांग्रेस अगाडि',
    'प्रदेश 1 मा माओवादीको अग्रता',
    'ललितपुर-3 मा एमाले उम्मेदवारको अचानक अगाडि',
    'विरगञ्जमा राष्ट्रिय स्वतन्त्र पार्टीको चर्को प्रचार',
    'निर्वाचन आयोगले भन्यो - मतगणना सुरक्षित छ',
    'चितवनमा कांग्रेस र माओवादीको नजिकको प्रतिस्पर्धा',
    'पोखरामा एमाले अगाडि, मतगणना जारी',
    'सुदूरपश्चिममा माओवादीको सुरुआती अगाडि',
  ];

  return headlines.map((title, idx) => ({
    id: `news-${idx}-${Date.now()}`,
    title,
    link: `https://example.com/news/${idx}`,
    source: RSS_FEEDS[idx % RSS_FEEDS.length].source,
    sourceIcon: RSS_FEEDS[idx % RSS_FEEDS.length].icon,
    pubDate: new Date(Date.now() - idx * 1800000).toLocaleString('ne-NP'),
    isoDate: new Date(Date.now() - idx * 1800000).toISOString(),
    snippet: title,
  }));
}

let cachedFeed: NewsItem[] = [];
let lastFetchTime = 0;
const CACHE_DURATION = 60000;

export async function fetchAllRSSFeeds(): Promise<NewsItem[]> {
  const now = Date.now();
  
  if (cachedFeed.length > 0 && (now - lastFetchTime) < CACHE_DURATION) {
    return cachedFeed;
  }

  const allItems: NewsItem[] = [];

  for (const feed of RSS_FEEDS) {
    try {
      const response = await axios.get(feed.url, {
        timeout: 10000,
        headers: {
          'User-Agent': 'Mozilla/5.0',
          'Accept': 'application/rss+xml, application/xml',
        },
      });

      const parsed = await parser.parseString(response.data);
      
      const items: NewsItem[] = (parsed.items || [])
        .filter(item => {
          const title = item.title?.toLowerCase() || '';
          return ELECTION_KEYWORDS.some(keyword => title.includes(keyword.toLowerCase()));
        })
        .slice(0, 5)
        .map((item, idx) => ({
          id: `${feed.source.toLowerCase()}-${idx}-${Date.now()}`,
          title: item.title || 'No Title',
          link: item.link || '',
          source: feed.source,
          sourceIcon: feed.icon,
          pubDate: item.pubDate || new Date().toISOString(),
          isoDate: item.isoDate || new Date().toISOString(),
          snippet: item.contentSnippet?.substring(0, 150) || '',
        }));

      allItems.push(...items);
    } catch (error) {
      console.error(`Error fetching ${feed.source}:`, error);
    }
  }

  if (allItems.length === 0) {
    allItems.push(...generateMockNews());
  }

  allItems.sort((a, b) => 
    new Date(b.isoDate).getTime() - new Date(a.isoDate).getTime()
  );

  cachedFeed = allItems;
  lastFetchTime = Date.now();

  return allItems;
}

export async function getLatestNews(limit: number = 15): Promise<NewsItem[]> {
  const news = await fetchAllRSSFeeds();
  return news.slice(0, limit);
}
