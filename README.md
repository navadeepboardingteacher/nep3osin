# Nepal Election OSINT Dashboard (निर्वाचन 2082)

A production-ready real-time election intelligence dashboard for Nepal Election 2082, built with Vite + React.

## Features

- **Live Results Scraper**: Real-time election data from election.ratopati.com
- **RSS News Aggregator**: Fetches news from 5 major Nepali media sources
- **Alert Engine**: Intelligent alerts for vote lead changes
- **Interactive Map**: Constituency-level visualization with party colors
- **Party Performance Charts**: Seat projections and vote distribution
- **Real-time Updates**: Auto-refresh every 30 seconds
- **Search & Filter**: Search by candidate, constituency, or party

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **Styling**: TailwindCSS with glassmorphism design
- **Charts**: Recharts
- **Scraping**: Axios + Cheerio
- **RSS**: RSS Parser

## Getting Started

### Prerequisites

- Node.js 18+

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## Data Sources

### Primary Data Source
- **election.ratopati.com**: Constituency results, candidate votes, party leads

### Secondary RSS Feeds
- Ratopati, Setopati, OnlineKhabar, Kantipur, AnnapurnaPost

## Project Structure

```
/
├── src/
│   ├── components/
│   │   ├── ui/          # Card, Button, Input
│   │   ├── NepalMap.tsx
│   │   ├── ElectionCharts.tsx
│   │   ├── RSSFeed.tsx
│   │   ├── AlertsPanel.tsx
│   │   └── CandidateTable.tsx
│   ├── lib/
│   │   ├── ratopatiScraper.ts
│   │   ├── rssFetcher.ts
│   │   ├── alertsEngine.ts
│   │   └── utils.ts
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
└── tsconfig.json
```

## Monitoring Keywords

The system monitors for these keywords:
- निर्वाचन (Election)
- मतगणना (Vote Counting)
- Nepal Election
- Candidate names
- Constituency numbers

## Performance

- Results cached for 20 seconds
- RSS feeds cached for 60 seconds
- Auto-refresh every 30 seconds

## License

MIT License

---

**Nepal Election OSINT Dashboard | निर्वाचन 2082**

Built with Vite + React + TailwindCSS
