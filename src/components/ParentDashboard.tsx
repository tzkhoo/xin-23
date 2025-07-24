import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Eye, EyeOff, Users, TrendingUp, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useState } from 'react';

export const ParentDashboard = () => {
  const [visibilitySettings, setVisibilitySettings] = useState({
    portfolioValue: true,
    transactions: false,
    investments: true,
    performance: false
  });

  return (
    <div className="space-y-6 p-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-parent mb-2">Parents Portal</h2>
        <p className="text-muted-foreground">Secure wealth management and generational access control</p>
      </div>

      {/* Access Control Panel */}
      <Card className="border-parent/30 bg-parent/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-parent">
            <Shield className="w-5 h-5" />
            Generational Access Control
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground mb-4">
            Control what your heirs can see and modify. Ensure privacy while preparing for inheritance.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {Object.entries(visibilitySettings).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between p-3 rounded-lg bg-white/20 border border-parent/20 min-h-[60px]">
                <div className="flex items-center gap-2 flex-1">
                  {value ? <Eye className="w-4 h-4 text-parent flex-shrink-0" /> : <EyeOff className="w-4 h-4 text-muted-foreground flex-shrink-0" />}
                  <span className="text-sm font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                </div>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => 
                    setVisibilitySettings(prev => ({ ...prev, [key]: checked }))
                  }
                  className="flex-shrink-0"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Wealth Overview */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="border-parent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Total Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-parent">$2.4M</div>
            <div className="text-xs text-green-400 flex items-center gap-1">
              <TrendingUp className="w-3 h-3" />
              +12.3% YTD
            </div>
          </CardContent>
        </Card>

        <Card className="border-parent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Protected Assets</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-parent">$1.8M</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Lock className="w-3 h-3" />
              75% of portfolio
            </div>
          </CardContent>
        </Card>

        <Card className="border-parent/20">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">Authorized Viewers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-parent">3</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Users className="w-3 h-3" />
              Active heirs
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="border-parent/20">
        <CardHeader>
          <CardTitle className="text-parent">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-3">
          <Button variant="outline" className="border-parent/40 text-parent hover:bg-parent/10">
            Modify Access Permissions
          </Button>
          <Button variant="outline" className="border-parent/40 text-parent hover:bg-parent/10">
            View Heir Activity
          </Button>
          <Button variant="outline" className="border-parent/40 text-parent hover:bg-parent/10">
            Estate Planning Tools
          </Button>
          <Button variant="outline" className="border-parent/40 text-parent hover:bg-parent/10">
            Generate Reports
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};