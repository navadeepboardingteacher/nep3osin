import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Alert } from '../lib/alertsEngine';
import { Bell, AlertTriangle, Info, CheckCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface AlertsPanelProps {
  alerts: Alert[];
}

export default function AlertsPanel({ alerts }: AlertsPanelProps) {
  const getAlertIcon = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-orange-400" />;
      case 'success': return <CheckCircle className="w-4 h-4 text-green-400" />;
      default: return <Info className="w-4 h-4 text-cyan-400" />;
    }
  };

  const getSeverityColor = (severity: Alert['severity']) => {
    switch (severity) {
      case 'critical': return 'border-l-red-500 bg-red-500/10';
      case 'warning': return 'border-l-orange-500 bg-orange-500/10';
      case 'success': return 'border-l-green-500 bg-green-500/10';
      default: return 'border-l-cyan-500 bg-cyan-500/10';
    }
  };

  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString('ne-NP', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return timestamp;
    }
  };

  return (
    <Card className="glass-card h-full flex flex-col">
      <CardHeader className="pb-2 flex-shrink-0">
        <CardTitle className="text-sm text-cyan-400 flex items-center gap-2">
          <Bell className="w-4 h-4" />
          Alerts
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-hidden p-2">
        <div className="space-y-2 overflow-y-auto h-[calc(100vh-350px)] scrollbar-thin pr-2">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={cn('p-3 rounded-lg border-l-4 glass', getSeverityColor(alert.severity))}
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-0.5">{getAlertIcon(alert.severity)}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white">{alert.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alert.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-muted-foreground">{formatTime(alert.timestamp)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
          {alerts.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No alerts yet</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
