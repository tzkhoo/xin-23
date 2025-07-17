import { Bot, BarChart3, Newspaper } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const navigationItems = [
  {
    id: 'xin-ai',
    label: 'Xin AI',
    icon: Bot,
    path: '/',
    glowColor: 'bg-secondary/20 border-secondary/40 shadow-[0_0_20px_hsl(180_50%_30%/0.4)]'
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: BarChart3,
    path: '/insights',
    glowColor: 'bg-muted border-glass-border shadow-[0_0_20px_hsl(0_0%_100%/0.2)]'
  },
  {
    id: 'news',
    label: 'News',
    icon: Newspaper,
    path: '/news',
    glowColor: 'bg-accent/20 border-accent/40 shadow-[0_0_20px_hsl(315_60%_60%/0.4)]'
  }
];

export const Navigation = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="flex items-center gap-4 px-6 py-2 glass-panel" style={{ width: '115%' }}>
        {navigationItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          
          return (
            <Link
              key={item.id}
              to={item.path}
              className={`
                flex flex-col items-center gap-1 px-3 py-2 rounded-full
                backdrop-blur-md border transition-all duration-300
                ${isActive 
                  ? item.glowColor + ' scale-110' 
                  : 'bg-glass border-glass-border hover:scale-105 hover:' + item.glowColor
                }
              `}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};