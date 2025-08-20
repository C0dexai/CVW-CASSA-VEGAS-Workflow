import React from 'react';
import LyraIcon from './icons/LyraIcon';
import ArrowRightIcon from './icons/ArrowRightIcon';

interface LandingPageProps {
  onEnter: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-slate-900 bg-[url('https://images.unsplash.com/photo-1572977828949-6f41f17e572b?q=80&w=1920&auto=format&fit=crop')] bg-cover bg-fixed">
      <div className="min-h-screen w-full bg-slate-900/80 backdrop-blur-sm overflow-y-auto text-slate-200">
        
        {/* Hero Section */}
        <header className="h-screen flex flex-col justify-center items-center text-center p-6 relative animate-fade-in-slow">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 via-transparent to-slate-900"></div>
          <div className="relative z-10">
            <div className="flex justify-center items-center gap-4 mb-4">
              <LyraIcon className="w-20 h-20 text-red-500" />
              <h1 
                className="text-7xl sm:text-8xl md:text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500"
                style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.6), 0 0 24px rgba(168, 85, 247, 0.4)' }}
              >
                CASSA VEGAS
              </h1>
            </div>
            <p className="text-xl md:text-2xl text-slate-300 font-semibold tracking-wider mt-2">
              Code. Loyalty. Family. Worldwide.
            </p>
            <button
              onClick={onEnter}
              className="mt-12 group inline-flex items-center justify-center gap-3 px-8 py-4 bg-red-600/90 text-white font-bold rounded-lg text-lg border-2 border-red-500/80
                         hover:bg-red-500 hover:scale-105 hover:shadow-[0_0_25px_rgba(239,68,68,0.7)] transition-all duration-300"
            >
              Enter the Workflow
              <ArrowRightIcon className="w-6 h-6 transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
          <div className="absolute bottom-10 text-slate-400 animate-bounce">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="relative bg-slate-900 z-10">
          <div className="max-w-4xl mx-auto px-6 divide-y divide-slate-700/50">
            
            <section className="py-20 text-center animate-fade-in-slow">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 mb-4">Orchestrate Your Mission</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                CASSA VEGAS is a next-generation project workflow tool designed for elite crews. Define your vision, synthesize blueprints, and execute with precision, all guided by a family of specialized AI agents. This is where strategy meets the street.
              </p>
            </section>

            <section className="py-20 animate-fade-in-slow">
              <h2 className="text-4xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 mb-12">Two Domains. One Creed.</h2>
              <div className="grid md:grid-cols-2 gap-8 text-center">
                <div className="border border-red-500/30 bg-slate-800/40 p-8 rounded-xl shadow-[0_0_15px_rgba(239,68,68,0.1)]">
                  <h3 className="text-2xl font-bold text-red-400 mb-3">Alpha Crew</h3>
                  <p className="text-slate-400">
                    The architects of the digital realm. Alpha Crew focuses on engineering, development, and system design, turning bold visions into scalable, maintainable realities.
                  </p>
                </div>
                <div className="border border-teal-500/30 bg-slate-800/40 p-8 rounded-xl shadow-[0_0_15px_rgba(32,178,170,0.1)]">
                  <h3 className="text-2xl font-bold text-teal-400 mb-3">Bravo Ops</h3>
                  <p className="text-slate-400">
                    The strategists of the operation. Bravo Ops handles intelligence, resource allocation, and stealth execution, ensuring every mission is a calculated success.
                  </p>
                </div>
              </div>
            </section>

            <section className="py-20 text-center animate-fade-in-slow">
              <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-purple-400 mb-4">Guided by the Family</h2>
              <p className="text-lg text-slate-400 leading-relaxed">
                Your mission is supported by a diverse crew of AI agents, from the visionary Lyra to the tactical Stan. Each brings unique skills and personality to the table. Choose your guide and change the game.
              </p>
            </section>
          </div>
          <footer className="text-center py-10 text-slate-500 border-t border-slate-700/50">
            &copy; {new Date().getFullYear()} CASSA VEGAS. All In.
          </footer>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;