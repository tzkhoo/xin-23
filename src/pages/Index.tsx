import { StarField } from '@/components/StarField';
import { ChatInterface } from '@/components/ChatInterface';
import { Dashboard } from '@/components/Dashboard';
import { NewsReels } from '@/components/NewsReels';
import premiumOrbImage from '@/assets/premium-ai-orb.png';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-4 sm:px-6 pt-8 sm:pt-12 pb-20">
        {/* Header - Mobile First */}
        <div className="text-center mb-8 sm:mb-12 animate-fade-in">
          <div className="flex justify-center mb-4 sm:mb-6">
            <div className="relative">
              <img 
                src={premiumOrbImage} 
                alt="Xin AI Premium Orb" 
                className="w-16 h-16 sm:w-20 sm:h-20 animate-float"
              />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3">
            <span className="text-foreground">Xin</span>
            <span className="text-primary"> AI</span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl text-muted-foreground mb-4">
            BOCHK AI Agent - by HKUSTeam
          </p>
          
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
        </div>

        {/* Chat Interface */}
        <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;
