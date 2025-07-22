import { useState } from 'react';
import { Send, Bot, User, Expand, Zap, Building2, Users, Crown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParentDashboard } from './ParentDashboard';
import { RMDashboard } from './RMDashboard';
import { Dashboard } from './Dashboard';
import { NewsReels } from './NewsReels';

interface ChatMode {
  id: string;
  title: string;
  description: string;
  color: string;
}

const chatModes: ChatMode[] = [
  {
    id: 'finance',
    title: 'Finance Research',
    description: 'Financial analysis and research',
    color: 'bg-primary/20 border-primary/40'
  }
];

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

export const ChatInterface = () => {
  const [selectedMode, setSelectedMode] = useState<string>('finance');
  const [isAdvancedMode, setIsAdvancedMode] = useState(false);
  const [userType, setUserType] = useState<number>(0); // 0: Client, 1: Parents, 2: RM
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      content: 'Give me a stock name/symbol and I\'ll find you the latest research!',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const getUserTypeLabel = (type: number) => {
    switch(type) {
      case 0: return 'Client';
      case 1: return 'Parents';
      case 2: return 'Relation Manager';
      default: return 'Client';
    }
  };

  const getThemeClasses = () => {
    if (userType === 1) return {
      primary: 'bg-parent',
      primaryHover: 'hover:bg-parent/80',
      text: 'text-parent',
      bg: 'bg-parent/5',
      border: 'border-parent/20',
      foreground: 'text-parent-foreground'
    };
    if (userType === 2) return {
      primary: 'bg-rm',
      primaryHover: 'hover:bg-rm/80',
      text: 'text-rm',
      bg: 'bg-rm/5',
      border: 'border-rm/20',
      foreground: 'text-rm-foreground'
    };
    if (isAdvancedMode) return {
      primary: 'bg-advanced',
      primaryHover: 'hover:bg-advanced/80',
      text: 'text-advanced',
      bg: 'bg-advanced/5', 
      border: 'border-advanced/20',
      foreground: 'text-advanced-foreground'
    };
    return {
      primary: 'bg-primary',
      primaryHover: 'hover:bg-primary/80',
      text: 'text-primary',
      bg: 'bg-primary/5',
      border: 'border-primary/20',
      foreground: 'text-primary-foreground'
    };
  };

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

    try {
      // Send to n8n webhook
      console.log('Sending to n8n webhook:', {
        message: currentInput,
        mode: selectedMode,
        timestamp: new Date().toISOString(),
        user_id: 'user_' + Date.now()
      });

      // Use the production webhook URL with POST method
      const response = await fetch('https://wonder1.app.n8n.cloud/webhook/b9ab99b4-ccf9-43ca-a406-3b14c47362ec', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: currentInput,
          mode: isAdvancedMode ? 'advanced_finance' : selectedMode,
          user_type: getUserTypeLabel(userType),
          timestamp: new Date().toISOString(),
          user_id: 'user_' + Date.now()
        }),
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', response.headers);

      if (response.ok) {
        const aiResponseData = await response.json();
        console.log('Received response from n8n:', aiResponseData);
        
        // Handle different response formats from n8n
        let responseContent = '';
        if (aiResponseData.response) {
          responseContent = aiResponseData.response;
        } else if (aiResponseData.ai_response) {
          responseContent = aiResponseData.ai_response;
        } else if (aiResponseData.output) {
          responseContent = aiResponseData.output;
        } else if (aiResponseData.result) {
          responseContent = aiResponseData.result;
        } else if (aiResponseData.message && aiResponseData.message !== 'Workflow was started') {
          responseContent = aiResponseData.message;
        } else if (aiResponseData.text) {
          responseContent = aiResponseData.text;
        } else {
          responseContent = `I understand you're asking about "${currentInput}". As your BOCHK AI Agent in ${isAdvancedMode ? 'Advanced Finance' : chatModes.find(m => m.id === selectedMode)?.title} mode for ${getUserTypeLabel(userType)}, I'm here to help you with that.`;
        }
        
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          content: responseContent,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
      } else {
        const errorText = await response.text();
        console.error('API request failed:', response.status, errorText);
        
        if (response.status === 404) {
          throw new Error('Webhook not found. Please ensure your n8n workflow is active.');
        } else {
          throw new Error(`API request failed: ${response.status} ${errorText}`);
        }
      }
    } catch (error) {
      console.error('Error calling n8n webhook:', error);
      // Fallback response
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: `I'm experiencing connectivity issues. Please try again in a moment. Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
        isUser: false,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiResponse]);
    } finally {
      setIsLoading(false);
    }
  };


  const renderMessageContent = (content: string) => {
    // Check for markdown image syntax: ![alt](url) or direct image URLs
    const markdownImageRegex = /!\[(.*?)\]\((.*?)\)/g;
    const urlImageRegex = /(https?:\/\/[^\s]+\.(?:png|jpg|jpeg|gif|webp|svg))/gi;
    
    let processedContent = content;
    const images: { element: JSX.Element; placeholder: string }[] = [];
    
    // Handle markdown images first
    let match;
    while ((match = markdownImageRegex.exec(content)) !== null) {
      const placeholder = `__IMAGE_${images.length}__`;
      const imageElement = (
        <Dialog key={`md-${match.index}`}>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer">
              <img 
                src={match[2]} 
                alt={match[1]} 
                className="max-w-full h-auto rounded-lg mt-2 mb-2 block hover:opacity-80 transition-opacity"
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>{match[1] || 'Chart View'}</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={match[2]} 
                alt={match[1]} 
                className="max-w-full max-h-[70vh] h-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
      images.push({ element: imageElement, placeholder });
      processedContent = processedContent.replace(match[0], placeholder);
    }
    
    // Handle direct image URLs
    processedContent = processedContent.replace(urlImageRegex, (url) => {
      const placeholder = `__IMAGE_${images.length}__`;
      const imageElement = (
        <Dialog key={`url-${images.length}`}>
          <DialogTrigger asChild>
            <div className="relative group cursor-pointer">
              <img 
                src={url} 
                alt="Chart" 
                className="max-w-full h-auto rounded-lg mt-2 mb-2 block hover:opacity-80 transition-opacity"
                style={{ maxWidth: '100%', height: 'auto' }}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors rounded-lg flex items-center justify-center">
                <Expand className="w-6 h-6 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl w-full">
            <DialogHeader>
              <DialogTitle>Chart View</DialogTitle>
            </DialogHeader>
            <div className="flex justify-center">
              <img 
                src={url} 
                alt="Chart" 
                className="max-w-full max-h-[70vh] h-auto rounded-lg"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
      images.push({ element: imageElement, placeholder });
      return placeholder;
    });
    
    // Split content by image placeholders and reconstruct with images
    const parts = processedContent.split(/(__IMAGE_\d+__)/);
    
  return parts.map((part, index) => {
      const imageMatch = part.match(/^__IMAGE_(\d+)__$/);
      if (imageMatch) {
        const imageIndex = parseInt(imageMatch[1]);
        return images[imageIndex]?.element || part;
      }
      return part ? <span key={index}>{part}</span> : null;
    }).filter(Boolean);
  };

  const themeClasses = getThemeClasses();

  // Show different views based on user type
  if (userType === 1) {
    return (
      <>
        <ParentDashboard />
        <PremiumUserTypeSlider userType={userType} setUserType={setUserType} />
      </>
    );
  }
  
  if (userType === 2) {
    return (
      <>
        <RMDashboard />
        <PremiumUserTypeSlider userType={userType} setUserType={setUserType} />
      </>
    );
  }

  return (
    <>
      <div className="w-full max-w-6xl mx-auto p-4 sm:p-6">
        {/* Mode Selection - only show for Client view */}
        <div className="grid grid-cols-1 gap-3 sm:gap-4 mb-4 sm:mb-6">
          {chatModes.map((mode) => (
            <button
              key={mode.id}
              onClick={() => setSelectedMode(mode.id)}
              className={`
                p-4 rounded-xl border backdrop-blur-md transition-all duration-300
                ${selectedMode === mode.id 
                  ? `${themeClasses.bg} ${themeClasses.border} shadow-glow scale-105` 
                  : 'bg-glass border-glass-border hover:scale-102'
                }
              `}
            >
              <div className="font-medium">{mode.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{mode.description}</div>
            </button>
          ))}
        </div>

        {/* Chat Interface */}
        <div className="w-full">
          <div className={`glass-panel p-6 ${
            isAdvancedMode ? `${themeClasses.border} ${themeClasses.bg}` : ''
          }`}>
            {/* Messages */}
            <div className="h-96 overflow-y-auto mb-4 space-y-4">
              {messages.length === 0 ? (
                <div className="text-center text-muted-foreground py-16">
                  <div className="text-lg font-medium mb-2">Ready to assist you</div>
                  <div className="text-sm">Ask me anything about banking, finance, or investments</div>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`flex items-start gap-2 ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.primary}`}>
                          {message.isUser ? (
                            <User className={`w-4 h-4 ${themeClasses.foreground}`} />
                          ) : (
                            <Bot className={`w-4 h-4 ${themeClasses.foreground} ${isAdvancedMode ? 'glow-effect' : ''}`} />
                          )}
                        </div>
                        
                        {/* Message content */}
                        <div className="flex flex-col gap-1">
                          <div className={`text-xs font-medium ${message.isUser ? 'text-right' : 'text-left'}`}>
                            {message.isUser ? 'You' : 'Xin AI'}
                          </div>
                          <div
                            className={`
                              max-w-xs lg:max-w-md px-4 py-2 rounded-xl
                              ${message.isUser 
                                ? `${themeClasses.primary} ${themeClasses.foreground}`
                                : isAdvancedMode
                                  ? `${themeClasses.bg} ${themeClasses.border} backdrop-blur-md border`
                                  : 'glass-panel'
                              }
                            `}
                          >
                            {renderMessageContent(message.content)}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="flex justify-start">
                      <div className="flex items-start gap-2 flex-row">
                        {/* Avatar */}
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${themeClasses.primary}`}>
                          <Bot className={`w-4 h-4 ${themeClasses.foreground}`} />
                        </div>
                        
                        {/* Message content */}
                        <div className="flex flex-col gap-1">
                          <div className="text-xs font-medium text-left">Xin AI</div>
                          <div className={isAdvancedMode 
                            ? `${themeClasses.bg} ${themeClasses.border} backdrop-blur-md px-4 py-2 rounded-xl border`
                            : 'glass-panel px-4 py-2 rounded-xl'
                          }>
                            <div className="flex items-center space-x-2">
                              <div className={`animate-spin rounded-full h-4 w-4 border-b-2 ${themeClasses.text.replace('text-', 'border-')}`}></div>
                              <span>AI is thinking...</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Advanced Mode Toggle */}
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="flex items-center gap-2 p-3 rounded-lg bg-glass border border-glass-border">
                <Zap className={`w-4 h-4 ${isAdvancedMode ? themeClasses.text : 'text-muted-foreground'}`} />
                <span className="text-sm font-medium">Advanced Mode</span>
                <Switch
                  checked={isAdvancedMode}
                  onCheckedChange={setIsAdvancedMode}
                />
              </div>
            </div>

            {/* Input Area */}
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className={`flex-1 ${
                  isAdvancedMode 
                    ? `${themeClasses.bg} ${themeClasses.border} border` 
                    : 'bg-glass border-glass-border'
                }`}
                disabled={isLoading}
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage} 
                className={`${themeClasses.primary} ${themeClasses.primaryHover} ${themeClasses.foreground}`}
                disabled={isLoading || !inputValue.trim()}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard - Only for Client */}
      <div className="animate-fade-in" style={{ animationDelay: '600ms' }}>
        <Dashboard />
      </div>

      {/* News Reels - Only for Client */}
      <div className="animate-fade-in" style={{ animationDelay: '900ms' }}>
        <NewsReels />
      </div>
      
      <PremiumUserTypeSlider userType={userType} setUserType={setUserType} />
    </>
  );
};

// Premium User Type Slider Component
const PremiumUserTypeSlider = ({ userType, setUserType }: { userType: number, setUserType: (type: number) => void }) => {
  const getUserIcon = (type: number) => {
    switch(type) {
      case 0: return Building2;
      case 1: return Crown;
      case 2: return Users;
      default: return Building2;
    }
  };

  const getSliderBg = () => {
    switch(userType) {
      case 0: return 'bg-gradient-to-r from-primary to-primary-glow';
      case 1: return 'bg-gradient-to-r from-parent to-parent-light';
      case 2: return 'bg-gradient-to-r from-rm to-rm-light';
      default: return 'bg-gradient-to-r from-primary to-primary-glow';
    }
  };

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white/10 backdrop-blur-md rounded-full p-2 border border-white/20">
        <div className="relative flex rounded-full overflow-hidden">
          {/* Sliding background indicator */}
          <div 
            className={`absolute top-0 bottom-0 w-1/3 ${getSliderBg()} rounded-full transition-transform duration-300 ease-out`}
            style={{ 
              transform: `translateX(${userType * 100}%)` 
            }}
          />
          
          {/* Option buttons */}
          {[
            { id: 0, label: 'BOCHK Client', icon: Building2 },
            { id: 1, label: 'Parents', icon: Crown },
            { id: 2, label: 'Relation Manager', icon: Users }
          ].map((option) => {
            const Icon = option.icon;
            const isActive = userType === option.id;
            
            return (
              <button
                key={option.id}
                onClick={() => setUserType(option.id)}
                className={`
                  relative z-10 flex items-center gap-2 px-6 py-3 rounded-full transition-all duration-300
                  ${isActive 
                    ? 'text-white font-semibold shadow-lg' 
                    : 'text-white/70 hover:text-white/90'
                  }
                `}
              >
                <Icon className="w-4 h-4" />
                <span className="text-sm whitespace-nowrap">
                  {option.id === 2 ? (
                    <>
                      <div>Relationship</div>
                      <div>Manager</div>
                    </>
                  ) : option.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};