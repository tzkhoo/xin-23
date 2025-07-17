import { StarField } from '@/components/StarField';
import { ChatInterface } from '@/components/ChatInterface';
import aiOrbImage from '@/assets/ai-orb.png';

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden">
      <StarField />
      
      <div className="relative z-10 container mx-auto px-6 pt-16 pb-32">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in">
          <div className="flex justify-center mb-8">
            <div className="relative">
              <img 
                src={aiOrbImage} 
                alt="Xin AI Orb" 
                className="w-24 h-24 animate-float glow-red"
              />
              <div className="absolute inset-0 bg-gradient-red-glow rounded-full animate-pulse-glow"></div>
            </div>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-bold mb-4">
            <span className="text-foreground">Xin</span>
            <span className="text-primary glow-red"> AI</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-2">
            BOCHK AI Agent - by HKUSTeam
          </p>
          
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent mx-auto"></div>
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
