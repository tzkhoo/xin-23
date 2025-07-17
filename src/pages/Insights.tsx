import { TrendingUp, TrendingDown, DollarSign, PieChart } from 'lucide-react';
import { StarField } from '@/components/StarField';

const insights = [
  {
    title: 'Portfolio Performance',
    value: '+12.5%',
    trend: 'up',
    description: 'Year-to-date returns'
  },
  {
    title: 'Monthly Savings',
    value: 'HK$15,200',
    trend: 'up',
    description: 'Average monthly deposits'
  },
  {
    title: 'Investment Risk',
    value: 'Moderate',
    trend: 'stable',
    description: 'Current risk profile'
  },
  {
    title: 'Diversification',
    value: '85%',
    trend: 'up',
    description: 'Portfolio diversification score'
  }
];

export default function Insights() {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-32">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Investment <span className="text-primary glow-red">Insights</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your financial progress and discover new opportunities with AI-powered analytics
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {insights.map((insight, index) => (
            <div
              key={insight.title}
              className="glass-panel p-6 hover:scale-105 transition-transform duration-300"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="p-2 rounded-lg bg-primary/20">
                  {insight.trend === 'up' ? (
                    <TrendingUp className="w-5 h-5 text-primary" />
                  ) : insight.trend === 'down' ? (
                    <TrendingDown className="w-5 h-5 text-red-400" />
                  ) : (
                    <PieChart className="w-5 h-5 text-secondary" />
                  )}
                </div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    insight.trend === 'up'
                      ? 'bg-green-500/20 text-green-400'
                      : insight.trend === 'down'
                      ? 'bg-red-500/20 text-red-400'
                      : 'bg-secondary/20 text-secondary'
                  }`}
                >
                  {insight.trend}
                </span>
              </div>
              <div className="text-2xl font-bold mb-2">{insight.value}</div>
              <div className="text-sm text-muted-foreground">{insight.description}</div>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6">Market Analysis</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Hang Seng Index</span>
                <span className="text-green-400">+1.2%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>USD/HKD</span>
                <span className="text-red-400">-0.1%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>NASDAQ</span>
                <span className="text-green-400">+0.8%</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Gold (USD/oz)</span>
                <span className="text-green-400">+0.3%</span>
              </div>
            </div>
          </div>

          <div className="glass-panel p-8">
            <h2 className="text-2xl font-bold mb-6">AI Recommendations</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4">
                <div className="font-medium">Rebalance Portfolio</div>
                <div className="text-sm text-muted-foreground">
                  Consider increasing technology sector allocation
                </div>
              </div>
              <div className="border-l-4 border-secondary pl-4">
                <div className="font-medium">ESG Opportunity</div>
                <div className="text-sm text-muted-foreground">
                  Green bonds showing strong performance potential
                </div>
              </div>
              <div className="border-l-4 border-accent pl-4">
                <div className="font-medium">Risk Assessment</div>
                <div className="text-sm text-muted-foreground">
                  Current portfolio aligns with your risk tolerance
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}