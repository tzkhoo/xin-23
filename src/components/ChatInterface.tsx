import { useState } from 'react';
import { Send, Bot, User, Expand, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ParentDashboard } from './ParentDashboard';
import { RMDashboard } from './RMDashboard';

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

  const getThemeColors = () => {
    if (userType === 1) return { primary: 'parent', bg: 'parent/5', border: 'parent/20' };
    if (userType === 2) return { primary: 'rm', bg: 'rm/5', border: 'rm/20' };
    if (isAdvancedMode) return { primary: 'advanced', bg: 'advanced/5', border: 'advanced/20' };
    return { primary: 'primary', bg: 'primary/5', border: 'primary/20' };
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

  const getRightPanelContent = () => {
    const colors = getThemeColors();
    
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Market Overview</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-panel p-4">
            <div className="text-sm text-muted-foreground">HSI</div>
            <div className={`text-lg font-bold text-${colors.primary}`}>17,234</div>
            <div className="text-xs text-green-400">+1.2%</div>
          </div>
          <div className="glass-panel p-4">
            <div className="text-sm text-muted-foreground">USD/HKD</div>
            <div className="text-lg font-bold">7.85</div>
            <div className="text-xs text-red-400">-0.1%</div>
          </div>
        </div>
        {isAdvancedMode && (
          <div className="mt-4 p-3 rounded-lg bg-advanced/10 border border-advanced/20">
            <div className="text-sm font-medium text-advanced mb-2">Advanced Analytics</div>
            <div className="text-xs text-muted-foreground">Enhanced AI insights and predictive models active</div>
          </div>
        )}
      </div>
    );
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

  const colors = getThemeColors();

  // Show different views based on user type
  if (userType === 1) {
    return <ParentDashboard />;
  }
  
  if (userType === 2) {
    return <RMDashboard />;
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      {/* Mode Selection - only show for Client view */}
      <div className="grid grid-cols-1 gap-4 mb-6">
        {chatModes.map((mode) => (
          <button
            key={mode.id}
            onClick={() => setSelectedMode(mode.id)}
            className={`
              p-4 rounded-xl border backdrop-blur-md transition-all duration-300
              ${selectedMode === mode.id 
                ? `bg-${colors.primary}/20 border-${colors.primary}/40 shadow-glow scale-105` 
                : 'bg-glass border-glass-border hover:scale-102'
              }
            `}
          >
            <div className="font-medium">{mode.title}</div>
            <div className="text-xs text-muted-foreground mt-1">{mode.description}</div>
          </button>
        ))}
      </div>

      {/* Advanced Mode Toggle */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <div className="flex items-center gap-2 p-3 rounded-lg bg-glass border border-glass-border">
          <Zap className={`w-4 h-4 ${isAdvancedMode ? `text-${colors.primary}` : 'text-muted-foreground'}`} />
          <span className="text-sm font-medium">Advanced Mode</span>
          <Switch
            checked={isAdvancedMode}
            onCheckedChange={setIsAdvancedMode}
          />
        </div>
      </div>

      {/* Chat Interface */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Chat Area */}
        <div className={`md:col-span-2 glass-panel p-6 ${
          isAdvancedMode ? `border-${colors.primary}/40 bg-${colors.bg}` : ''
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
                       <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${colors.primary}`}>
                         {message.isUser ? (
                           <User className="w-4 h-4 text-foreground" />
                         ) : (
                           <Bot className={`w-4 h-4 text-${colors.primary}-foreground`} />
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
                               ? `bg-${colors.primary} text-${colors.primary}-foreground`
                               : isAdvancedMode
                                 ? `bg-${colors.primary}/20 border border-${colors.primary}/40 backdrop-blur-md`
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
                       <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-${colors.primary}`}>
                         <Bot className={`w-4 h-4 text-${colors.primary}-foreground`} />
                      </div>
                      
                      {/* Message content */}
                      <div className="flex flex-col gap-1">
                        <div className="text-xs font-medium text-left">Xin AI</div>
                         <div className={isAdvancedMode 
                           ? `bg-${colors.primary}/20 border border-${colors.primary}/40 backdrop-blur-md px-4 py-2 rounded-xl`
                           : 'glass-panel px-4 py-2 rounded-xl'
                         }>
                          <div className="flex items-center space-x-2">
                             <div className={`animate-spin rounded-full h-4 w-4 border-b-2 border-${colors.primary}`}></div>
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

          {/* Input Area */}
          <div className="flex gap-2">
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Type your message..."
              className={`flex-1 ${
                isAdvancedMode 
                  ? `bg-${colors.primary}/10 border-${colors.primary}/40` 
                  : 'bg-glass border-glass-border'
              }`}
              disabled={isLoading}
            />
            <Button 
              size="icon" 
              onClick={handleSendMessage} 
              className={`bg-${colors.primary} hover:bg-${colors.primary}/80`}
              disabled={isLoading || !inputValue.trim()}
            >
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Right Panel */}
        <div className="glass-panel p-6">
          {getRightPanelContent()}
        </div>
      </div>

      {/* User Type Slider */}
      <div className="mt-8 p-6 glass-panel">
        <div className="text-center mb-4">
          <h3 className="text-lg font-semibold mb-2">User Perspective</h3>
          <p className="text-sm text-muted-foreground">Switch between different user views</p>
        </div>
        
        <div className="max-w-md mx-auto">
          <Slider
            value={[userType]}
            onValueChange={(value) => setUserType(value[0])}
            max={2}
            step={1}
            className="mb-4"
          />
          
          <div className="flex justify-between text-sm">
            <span className={userType === 0 ? `text-${colors.primary} font-medium` : 'text-muted-foreground'}>
              Client
            </span>
            <span className={userType === 1 ? 'text-parent font-medium' : 'text-muted-foreground'}>
              Parents
            </span>
            <span className={userType === 2 ? 'text-rm font-medium' : 'text-muted-foreground'}>
              Relation Manager
            </span>
          </div>
          
          <div className="text-center mt-2">
            <span className="text-xs text-muted-foreground">
              Current: <span className="font-medium">{getUserTypeLabel(userType)}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};