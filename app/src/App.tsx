import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileFrame } from './components/layout/MobileFrame';
import { BottomNav } from './components/layout/BottomNav';
import { SheepAgentDrawer } from './components/assistant/SheepAgentDrawer';
import { HomePage } from './pages/HomePage';
import { DreamsPage } from './pages/DreamsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ParticleFxPage } from './pages/ParticleFxPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dreams' | 'home' | 'analytics' | 'particle'>('home');
  const [sheepOpen, setSheepOpen] = useState(false);

  return (
    <MobileFrame>
      <div className="relative h-full min-h-full">
        <div className="h-full overflow-y-auto scrollbar-hide">
          <AnimatePresence mode="wait">
            {activeTab === 'dreams' ? (
              <DreamsPage key="dreams" />
            ) : activeTab === 'particle' ? (
              <ParticleFxPage key="particle" onBack={() => setActiveTab('home')} />
            ) : activeTab === 'home' ? (
              <HomePage key="home" onOpenParticle={() => setActiveTab('particle')} />
            ) : (
              <AnalyticsPage key="analytics" onBack={() => setActiveTab('dreams')} />
            )}
          </AnimatePresence>
        </div>

        {activeTab !== 'particle' && (
          <>
            <SheepAgentDrawer open={sheepOpen} onClose={() => setSheepOpen(false)} />
            <BottomNav activeTab={activeTab} onTabChange={setActiveTab} onOpenSheep={() => setSheepOpen(true)} />
          </>
        )}
      </div>
    </MobileFrame>
  );
}

export default App;
