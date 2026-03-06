import { ElectionResult, PartySummary } from './ratopatiScraper';
import { NewsItem } from './rssFetcher';

export interface Alert {
  id: string;
  type: 'vote_lead_change' | 'new_news' | 'threshold_breach' | 'seat_projection' | 'live_update';
  severity: 'info' | 'warning' | 'critical' | 'success';
  title: string;
  message: string;
  timestamp: string;
  source?: string;
  read: boolean;
}

let previousResults: ElectionResult[] = [];
let alerts: Alert[] = [];
const MAX_ALERTS = 30;

function generateAlertId(): string {
  return `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export function createAlert(
  type: Alert['type'],
  severity: Alert['severity'],
  title: string,
  message: string,
  source?: string
): Alert {
  const alert: Alert = {
    id: generateAlertId(),
    type,
    severity,
    title,
    message,
    timestamp: new Date().toISOString(),
    source,
    read: false,
  };

  alerts.unshift(alert);
  
  if (alerts.length > MAX_ALERTS) {
    alerts = alerts.slice(0, MAX_ALERTS);
  }

  return alert;
}

export function checkAlerts(
  results: ElectionResult[],
  parties: PartySummary[],
  news: NewsItem[]
): Alert[] {
  const newAlerts: Alert[] = [];

  results.forEach((current) => {
    const previous = previousResults.find(
      p => p.constituency === current.constituency && p.candidate === current.candidate
    );

    if (previous && previous.isLeading !== current.isLeading) {
      createAlert(
        'vote_lead_change',
        'warning',
        `नयाँ अगाडि : ${current.candidate}`,
        `${current.constituencyName} मा ${current.candidate} ले ${current.isLeading ? 'अगाडि' : 'पछाडि'} आए`,
        'Election Data'
      );
      newAlerts.push(alerts[0]);
    }
  });

  previousResults = [...results];
  return newAlerts;
}

export function getAlerts(limit: number = 10): Alert[] {
  return alerts.slice(0, limit);
}

export function markAlertAsRead(alertId: string): void {
  const alert = alerts.find(a => a.id === alertId);
  if (alert) {
    alert.read = true;
  }
}

export function getUnreadCount(): number {
  return alerts.filter(a => !a.read).length;
}
