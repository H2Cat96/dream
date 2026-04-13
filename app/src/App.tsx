import { useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MobileFrame } from './components/layout/MobileFrame';
import { BottomNav } from './components/layout/BottomNav';
import { HomePage } from './pages/HomePage';
import { DreamsPage } from './pages/DreamsPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ParticleFxPage } from './pages/ParticleFxPage';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState<'dreams' | 'home' | 'analytics' | 'particle'>('home');

  return (
    <MobileFrame>
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
      {activeTab !== 'particle' && <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />}
    </MobileFrame>
  );
}

export default App;
