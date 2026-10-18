import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ProblemPage } from './pages/ProblemPage';

export const App: React.FC = () => {
  const [uiScale, setUiScale] = useState<number>(0.9); // Default 90% for clean screen fit

  return (
    <HashRouter>
      <div className="h-screen h-[100dvh] w-screen overflow-hidden flex flex-col bg-slate-950 text-slate-100 select-none">
        <Navbar uiScale={uiScale} setUiScale={setUiScale} />

        <div className="flex-1 min-h-0 flex flex-col overflow-y-auto lg:overflow-hidden">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/problem/:slug"
              element={<ProblemPage uiScale={uiScale} setUiScale={setUiScale} />}
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
