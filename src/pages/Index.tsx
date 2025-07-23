import { StarField } from '@/components/StarField';
import { ChatInterface } from '@/components/ChatInterface';
import { Dashboard } from '@/components/Dashboard';
import { NewsReels } from '@/components/NewsReels';
import bankAiLogo from '@/assets/bank-ai-logo.png';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">
        {/* Header - Mobile First */}
        <div className="text-center mb-4 animate-fade-in">
          <div className="flex justify-center mb-3">
            <div className="relative">
              <img 
                src={bankAiLogo} 
                alt="Bank AI Logo" 
                className="w-12 h-12 sm:w-16 sm:h-16 animate-float"
              />
            </div>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-2">
            <span className="text-foreground">Xin</span>
            <span className="text-primary ml-1">AI</span>
          </h1>
          
          <p className="text-lg sm:text-xl md:text-2xl text-muted-foreground mb-3">
            BOCHK AI Agent - by HKUSTeam
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>

        {/* Chat Interface */}
        <div className="animate-fade-in mt-2" style={{ animationDelay: '300ms' }}>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;
