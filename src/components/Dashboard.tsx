import { useState } from 'react';
import { Send, Bot, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PieChart as PieChartIcon } from 'lucide-react';

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

  const chartData = [
    { name: 'Stocks', value: 65, color: '#10B981' },
    { name: 'Bonds', value: 25, color: '#3B82F6' },
    { name: 'Cash', value: 10, color: '#6B7280' }
  ];

  return (
    <div className="w-full max-w-6xl mx-auto p-4 sm:p-6 space-y-6 sm:space-y-8">
      <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6 sm:mb-8">Portfolio Dashboard</h2>
      
      {/* Main Portfolio Visual */}
      <div className="glass-panel p-4 sm:p-6 lg:p-8 rounded-2xl">
        <div className="grid lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Portfolio Overview */}
          <div className="lg:col-span-2">
            <div className="mb-6">
              {/* Combined Total Value Card */}
              <div className="bg-gradient-to-r from-secondary/20 to-secondary/10 p-6 sm:p-8 rounded-xl border border-secondary/20 mb-6 text-center">
                <div className="text-base sm:text-lg text-muted-foreground mb-3">Total Portfolio Value</div>
                <div className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3">$2,847,592</div>
                <div className="flex items-center justify-center gap-4 text-base sm:text-lg">
                  <span className="text-green-400 font-medium">+12.5% this month</span>
                </div>
              </div>
            </div>
            
            {/* Interactive Portfolio Allocation Chart */}
            <Dialog>
              <DialogTrigger asChild>
                <div className="h-48 sm:h-64 bg-gradient-to-br from-primary/10 via-secondary/10 to-accent/10 rounded-xl border border-glass-border cursor-pointer hover:shadow-lg transition-all group p-4">
                  <div className="flex items-center justify-between h-full">
                    <div className="flex-1">
                      <div className="text-lg font-semibold mb-2">Portfolio Allocation</div>
                      <div className="text-sm text-muted-foreground mb-4">Click to view detailed breakdown</div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Stocks (65%)</span>
                          <span className="text-green-400">$1,849,935</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Bonds (25%)</span>
                          <span className="text-blue-400">$711,898</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Cash (10%)</span>
                          <span className="text-gray-400">$284,759</span>
                        </div>
                      </div>
                    </div>
                    <div className="w-24 h-24 sm:w-32 sm:h-32 flex items-center justify-center">
                      <div className="relative w-20 h-20 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-gray-500 flex items-center justify-center">
                        <div className="w-8 h-8 bg-background rounded-full"></div>
                        <PieChartIcon className="absolute w-6 h-6 text-primary" />
                      </div>
                    </div>
                  </div>
                </div>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Portfolio Allocation Details</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="w-full h-64 mb-6 flex items-center justify-center">
                    <div className="relative w-48 h-48 rounded-full bg-gradient-to-r from-green-500 via-blue-500 to-gray-500 flex items-center justify-center">
                      <div className="w-20 h-20 bg-background rounded-full flex items-center justify-center">
                        <PieChartIcon className="w-8 h-8 text-primary" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="glass-panel p-4">
                      <div className="text-sm text-muted-foreground">Stocks</div>
                      <div className="text-2xl font-bold">65%</div>
                      <div className="text-sm text-green-400">$1,849,935</div>
                    </div>
                    <div className="glass-panel p-4">
                      <div className="text-sm text-muted-foreground">Bonds</div>
                      <div className="text-2xl font-bold">25%</div>
                      <div className="text-sm text-blue-400">$711,898</div>
                    </div>
                    <div className="glass-panel p-4">
                      <div className="text-sm text-muted-foreground">Cash</div>
                      <div className="text-2xl font-bold">10%</div>
                      <div className="text-sm text-gray-400">$284,759</div>
                    </div>
                    <div className="glass-panel p-4">
                      <div className="text-sm text-muted-foreground">Risk Score</div>
                      <div className="text-2xl font-bold text-accent">7.2/10</div>
                      <div className="text-sm text-muted-foreground">Moderate-High</div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Dashboard Assistant - Replaces Quick Stats */}
          <div className="lg:col-span-1">
            <div className="glass-panel p-4 rounded-xl h-full">
              <h4 className="text-lg font-semibold mb-4">Dashboard Assistant</h4>
              
              {/* Messages */}
              <div className="h-32 sm:h-40 lg:h-48 overflow-y-auto mb-4 space-y-3">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                  >
                    <div className={`flex items-start gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                      {/* Avatar */}
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${message.isUser ? 'bg-primary' : 'bg-secondary'}`}>
                        {message.isUser ? (
                          <User className="w-3 h-3 text-primary-foreground" />
                        ) : (
                          <Bot className="w-3 h-3 text-secondary-foreground" />
                        )}
                      </div>
                      
                      {/* Message content */}
                      <div className="flex flex-col gap-1">
                        <div className={`text-xs ${message.isUser ? 'text-right' : 'text-left'} text-muted-foreground`}>
                          {message.isUser ? 'You' : 'AI'}
                        </div>
                        <div
                          className={`
                            max-w-xs px-3 py-2 rounded-lg text-xs
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
                      <div className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center bg-secondary">
                        <Bot className="w-3 h-3 text-secondary-foreground" />
                      </div>
                      <div className="glass-panel px-3 py-2 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-secondary"></div>
                          <span className="text-xs">Analyzing...</span>
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
                  placeholder="Ask about portfolio..."
                  className="flex-1 text-xs"
                  disabled={isLoading}
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={isLoading || !inputValue.trim()}
                  size="sm"
                  className="bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3"
                >
                  <Send className="w-3 h-3" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};