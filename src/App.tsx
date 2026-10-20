import React, { useState, useEffect, useCallback } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProblemPage } from './pages/ProblemPage';
import { LandscapeOrientationPrompt } from './components/LandscapeOrientationPrompt';

export const App: React.FC = () => {
  // Dynamically compute optimal desktop-reduction scale to fit the viewport perfectly
  const computeOptimalScale = useCallback(() => {
    if (typeof window === 'undefined') return 0.9;
    const h = window.innerHeight;
    const w = window.innerWidth;

    // Mobile landscape or small screen heights
    if (h < 640 || w < 1024) {
      // Unzoomed desktop layout height is ~580px - 600px
      const scaleByH = (h - 36) / 590;
      const scaleByW = (w - 16) / 1120;
      const targetScale = Math.min(scaleByH, scaleByW);
      return Math.max(0.40, Math.min(0.85, Number(targetScale.toFixed(2))));
    }

    return 0.9; // Standard desktop default
  }, []);

  const [uiScale, setUiScale] = useState<number>(() => computeOptimalScale());
  const [hasUserManuallyAdjusted, setHasUserManuallyAdjusted] = useState<boolean>(false);

  // Auto-adapt scale on screen resize or orientation change unless user has manually customized it
  useEffect(() => {
    const handleResize = () => {
      if (!hasUserManuallyAdjusted) {
        setUiScale(computeOptimalScale());
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, [computeOptimalScale, hasUserManuallyAdjusted]);

  const handleSetUiScale = (newScaleOrUpdater: number | ((prev: number) => number)) => {
    setHasUserManuallyAdjusted(true);
    setUiScale(newScaleOrUpdater);
  };

  const handleResetScale = () => {
    setHasUserManuallyAdjusted(false);
    setUiScale(computeOptimalScale());
  };

  return (
    <HashRouter>
      <div className="h-[100dvh] w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
        <LandscapeOrientationPrompt />
        <Navbar
          uiScale={uiScale}
          setUiScale={handleSetUiScale}
          onResetScale={handleResetScale}
        />

        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/problem/:slug"
              element={<ProblemPage uiScale={uiScale} setUiScale={handleSetUiScale} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
