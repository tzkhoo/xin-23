import { useState } from 'react';
import { Send, Bot, User, TrendingUp, DollarSign, PieChart, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const Dashboard = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: 'Ask me anything about your portfolio dashboard!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    // Simulate AI response for dashboard queries
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I can help you understand your portfolio metrics for "${currentInput}". Your dashboard shows strong diversification across sectors with a 12.5% YTD return.`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 space-y-8">
      <h2 className="text-3xl font-bold text-center mb-8">Portfolio Dashboard</h2>
      
      {/* Main Portfolio Visual */}
      <div className="glass-panel p-8 rounded-2xl">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Portfolio Overview */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <h3 className="text-2xl font-semibold mb-4">Portfolio Performance</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-gradient-to-r from-primary/20 to-primary/10 p-4 rounded-xl border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <DollarSign className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Total Value</span>
                  </div>
                  <div className="text-2xl font-bold text-primary">$2,847,592</div>
                  <div className="text-sm text-green-400">+12.5% YTD</div>
                </div>
                <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 p-4 rounded-xl border border-secondary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="w-5 h-5 text-secondary" />
                    <span className="text-sm text-muted-foreground">Today's Gain</span>
                  </div>
                  <div className="text-2xl font-bold text-secondary">$8,247</div>
                  <div className="text-sm text-green-400">+0.29%</div>
                </div>
              </div>
            </div>
            
            {/* Portfolio Allocation Chart Placeholder */}
            <div className="h-64 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl border border-glass-border flex items-center justify-center">
              <div className="text-center">
                <PieChart className="w-16 h-16 mx-auto mb-4 text-primary" />
                <div className="text-lg font-semibold mb-2">Portfolio Allocation</div>
                <div className="text-sm text-muted-foreground">Interactive chart will be displayed here</div>
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="space-y-4">
            <h4 className="text-lg font-semibold">Quick Stats</h4>
            <div className="space-y-3">
              <div className="glass-panel p-4">
                <div className="text-sm text-muted-foreground">Stocks</div>
                <div className="text-lg font-bold">65%</div>
                <div className="text-xs text-green-400">+2.1%</div>
              </div>
              <div className="glass-panel p-4">
                <div className="text-sm text-muted-foreground">Bonds</div>
                <div className="text-lg font-bold">25%</div>
                <div className="text-xs text-blue-400">+0.8%</div>
              </div>
              <div className="glass-panel p-4">
                <div className="text-sm text-muted-foreground">Cash</div>
                <div className="text-lg font-bold">10%</div>
                <div className="text-xs text-gray-400">0.0%</div>
              </div>
              <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-1">
                  <BarChart3 className="w-4 h-4 text-accent" />
                  <div className="text-sm text-muted-foreground">Risk Score</div>
                </div>
                <div className="text-lg font-bold text-accent">7.2/10</div>
                <div className="text-xs text-muted-foreground">Moderate-High</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RAG Chatbot for Dashboard */}
      <div className="glass-panel p-6 rounded-2xl">
        <h3 className="text-xl font-semibold mb-4">Dashboard Assistant</h3>
        
        {/* Messages */}
        <div className="h-48 overflow-y-auto mb-4 space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex items-start gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar */}
                <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center ${message.isUser ? 'bg-primary' : 'bg-secondary'}`}>
                  {message.isUser ? (
                    <User className="w-3 h-3 text-primary-foreground" />
                  ) : (
                    <Bot className="w-3 h-3 text-secondary-foreground" />
                  )}
                </div>
                
                {/* Message content */}
                <div className="flex flex-col gap-1">
                  <div className={`text-xs ${message.isUser ? 'text-right' : 'text-left'} text-muted-foreground`}>
                    {message.isUser ? 'You' : 'Dashboard AI'}
                  </div>
                  <div
                    className={`
                      max-w-sm px-3 py-2 rounded-lg text-sm
                      ${message.isUser 
                        ? 'bg-primary text-primary-foreground'
                        : 'glass-panel'
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center bg-secondary">
                  <Bot className="w-3 h-3 text-secondary-foreground" />
                </div>
                <div className="glass-panel px-3 py-2 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-secondary"></div>
                    <span className="text-sm">Analyzing...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="flex gap-2">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Ask about your portfolio..."
            className="flex-1 text-sm"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            size="sm"
            className="bg-secondary hover:bg-secondary/80 text-secondary-foreground"
          >
            <Send className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  );
};