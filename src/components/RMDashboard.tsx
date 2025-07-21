import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Brain, MessageSquare, Mic, FileText, TrendingUp, Users, Target } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export const RMDashboard = () => {
  const recentAnalysis = [
    { client: 'John Chen', sentiment: 'Positive', intent: 'Investment Inquiry', confidence: 92 },
    { client: 'Maria Wong', sentiment: 'Concerned', intent: 'Risk Assessment', confidence: 87 },
    { client: 'David Liu', sentiment: 'Neutral', intent: 'Portfolio Review', confidence: 94 }
  ];

  const recommendations = [
    'Suggest ESG investment options for environmentally conscious clients',
    'Recommend high-yield bonds for risk-averse portfolio',
    'Propose tech stock diversification for growth-oriented clients'
  ];

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-rm mb-2">Relation Manager Dashboard</h2>
        <p className="text-muted-foreground">AI-Powered advisor tools and customer insights</p>
      </div>

      {/* AI Features Overview */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card className="border-rm/30 bg-rm/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Brain className="w-4 h-4 text-rm" />
              Intent Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rm">94%</div>
            <div className="text-xs text-muted-foreground">Accuracy Rate</div>
          </CardContent>
        </Card>

        <Card className="border-rm/30 bg-rm/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-rm" />
              Conversations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rm">127</div>
            <div className="text-xs text-muted-foreground">This week</div>
          </CardContent>
        </Card>

        <Card className="border-rm/30 bg-rm/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Mic className="w-4 h-4 text-rm" />
              Transcriptions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rm">89</div>
            <div className="text-xs text-muted-foreground">Calls analyzed</div>
          </CardContent>
        </Card>

        <Card className="border-rm/30 bg-rm/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground flex items-center gap-2">
              <Target className="w-4 h-4 text-rm" />
              Success Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-rm">87%</div>
            <div className="text-xs text-muted-foreground">Client satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Customer Analysis */}
      <Card className="border-rm/20">
        <CardHeader>
          <CardTitle className="text-rm flex items-center gap-2">
            <Users className="w-5 h-5" />
            Recent Customer Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentAnalysis.map((analysis, index) => (
              <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-glass border border-glass-border">
                <div className="flex items-center gap-3">
                  <div className="font-medium">{analysis.client}</div>
                  <Badge variant={
                    analysis.sentiment === 'Positive' ? 'default' : 
                    analysis.sentiment === 'Concerned' ? 'destructive' : 
                    'secondary'
                  }>
                    {analysis.sentiment}
                  </Badge>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{analysis.intent}</div>
                  <div className="text-xs text-muted-foreground">{analysis.confidence}% confidence</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* RAG Recommendations */}
      <Card className="border-rm/20">
        <CardHeader>
          <CardTitle className="text-rm flex items-center gap-2">
            <FileText className="w-5 h-5" />
            RAG-Powered Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, index) => (
              <div key={index} className="p-3 rounded-lg bg-rm/10 border border-rm/20">
                <div className="text-sm">{rec}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Briefing */}
      <Card className="border-rm/20">
        <CardHeader>
          <CardTitle className="text-rm">Latest Client Briefings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-lg bg-glass border border-glass-border">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">John Chen - Portfolio Discussion</div>
              <div className="text-xs text-muted-foreground">2 hours ago</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Client expressed interest in sustainable investing. Discussed ESG options and environmental impact considerations.
            </div>
          </div>
          
          <div className="p-4 rounded-lg bg-glass border border-glass-border">
            <div className="flex items-center justify-between mb-2">
              <div className="font-medium">Maria Wong - Risk Assessment</div>
              <div className="text-xs text-muted-foreground">5 hours ago</div>
            </div>
            <div className="text-sm text-muted-foreground">
              Client concerned about market volatility. Recommend conservative approach with balanced portfolio allocation.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};