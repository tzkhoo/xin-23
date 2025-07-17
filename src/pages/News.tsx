import { Clock, ExternalLink } from 'lucide-react';
import { StarField } from '@/components/StarField';
import { Button } from '@/components/ui/button';

const newsItems = [
  {
    id: 1,
    title: 'Hong Kong Markets Rally on Positive Economic Data',
    summary: 'Hang Seng Index closes 2.3% higher as latest GDP figures exceed expectations, boosting investor confidence.',
    time: '2 hours ago',
    category: 'Markets',
    priority: 'high'
  },
  {
    id: 2,
    title: 'BOCHK Launches New Green Finance Initiative',
    summary: 'Bank of China (Hong Kong) announces HK$50 billion commitment to sustainable finance projects.',
    time: '4 hours ago',
    category: 'Banking',
    priority: 'medium'
  },
  {
    id: 3,
    title: 'Fed Signals Potential Rate Cuts in Q2',
    summary: 'Federal Reserve hints at monetary policy adjustments, impacting global currency markets.',
    time: '6 hours ago',
    category: 'Global',
    priority: 'high'
  },
  {
    id: 4,
    title: 'ESG Investing Trends Shape Asian Markets',
    summary: 'Sustainable investment strategies gain momentum across Asia-Pacific region with record inflows.',
    time: '8 hours ago',
    category: 'ESG',
    priority: 'medium'
  },
  {
    id: 5,
    title: 'Cryptocurrency Regulations Update',
    summary: 'Hong Kong regulators provide clarity on digital asset trading frameworks for institutional investors.',
    time: '12 hours ago',
    category: 'Crypto',
    priority: 'low'
  }
];

export default function News() {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'border-l-primary bg-primary/10';
      case 'medium':
        return 'border-l-secondary bg-secondary/10';
      default:
        return 'border-l-accent bg-accent/10';
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-32">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Financial <span className="text-accent glow-red">News</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Stay updated with the latest market movements and financial insights powered by AI analysis
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-6">
          {newsItems.map((item, index) => (
            <div
              key={item.id}
              className={`glass-panel p-6 border-l-4 ${getPriorityColor(item.priority)} 
                         hover:scale-102 transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted text-muted-foreground">
                    {item.category}
                  </span>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3 h-3" />
                    {item.time}
                  </div>
                </div>
                <Button size="sm" variant="ghost" className="glass-button">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
              
              <h2 className="text-xl font-bold mb-3 hover:text-primary transition-colors cursor-pointer">
                {item.title}
              </h2>
              
              <p className="text-muted-foreground leading-relaxed">
                {item.summary}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button className="bg-primary hover:bg-primary/80 shadow-glow">
            Load More News
          </Button>
        </div>
      </div>
    </div>
  );
}