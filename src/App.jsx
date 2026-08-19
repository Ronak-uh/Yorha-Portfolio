import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useHoverSound } from '/src/hooks/useHoverSound.js'; 
import HackingMiniGame from './HackingMiniGame'; 
import ShapeGrid from './ShapeGrid'; // <-- Import the new component

// --- REUSABLE COMPONENTS ---

// THE LINUX-STYLE BOOT SEQUENCE WITH 8-SECOND AUDIO
const BootSequence = ({ onComplete }) => {
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  const BOOT_LINES = [
    { text: "INITIALIZING KERNEL ARCHITECTURE...", status: "OK" },
    { text: "MOUNTING VIRTUAL FILE SYSTEMS...", status: "OK" },
    { text: "CHECKING SYSTEM MEMORY INTEGRITY...", status: "OK" },
    { text: "LOADING AUDIO DRIVERS...", status: "OK" },
    { text: "CALIBRATING TACTICAL SENSORS...", status: "OK" },
    { text: "ESTABLISHING SECURE COMM UPLINK...", status: "OK" },
    { text: "DECRYPTING UI ASSETS...", status: "OK" },
    { text: "WAKING UP POD PROGRAM...", status: "OK" },
    { text: "BYPASSING FIREWALL ROUTING...", status: "OK" },
    { text: "SYNCING NEURAL NETWORK...", status: "OK" }
  ];

  useEffect(() => {
    const bootAudio = new Audio(`${import.meta.env.BASE_URL}boot.mp3`);
    bootAudio.volume = 0.5;
    
    const playPromise = bootAudio.play();
    if (playPromise !== undefined) {
      playPromise.catch(e => console.warn("Audio blocked pending user interaction:", e));
    }

    const lineInterval = setInterval(() => {
      setLogs(prev => {
        if (prev.length < BOOT_LINES.length) {
          return [...prev, BOOT_LINES[prev.length]];
        }
        return prev;
      });
    }, 600);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const next = prev + Math.floor(Math.random() * 5) + 2;
        return next >= 100 ? 100 : next;
      });
    }, 250);

    const endTimer = setTimeout(() => {
      onComplete();
    }, 8000);

    return () => {
      bootAudio.pause(); 
      clearInterval(lineInterval);
      clearInterval(progressInterval);
      clearTimeout(endTimer);
    };
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-black text-white p-6 md:p-12 font-mono text-sm md:text-base flex flex-col justify-end cursor-none relative overflow-hidden z-[300]">
      <div className="crt-overlay"></div>
      
      <div className="max-w-4xl w-full mx-auto space-y-2 mb-10 z-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking-widest mb-8 text-[#dad4bb]">YoRHa OS [Version 11.42.3]</h1>
        
        {logs.map((log, i) => (
          <div key={i} className="flex justify-between w-full md:pr-8 animate-fade-in">
            <span>&gt; {log.text}</span>
            <span className="text-[#dad4bb]">[{log.status}]</span>
          </div>
        ))}

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-3 border border-white p-[2px]">
            <div 
              className="h-full bg-white transition-all duration-75" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span className="w-12 text-right">{progress}%</span>
        </div>

        <div className="mt-6 h-8">
          {progress === 100 && (
            <p className="text-xl tracking-widest animate-pulse text-[#dad4bb]">GLORY TO MANKIND.</p>
          )}
        </div>
      </div>
    </div>
  );
};

const CustomCursor = ({ destructState }) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (destructState === 'DESTROYED') {
    return (
      <div 
        className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] flex items-center justify-center transition-transform duration-75 ease-out"
        style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
      >
        <div className="w-2 h-2 bg-white border border-black"></div>
      </div>
    );
  }

  return (
    <div 
      className="fixed top-0 left-0 w-8 h-8 pointer-events-none z-[100] flex items-center justify-center transition-transform duration-75 ease-out"
      style={{ transform: `translate(${mousePos.x - 16}px, ${mousePos.y - 16}px)` }}
    >
      <div className={`absolute w-full h-[2px] opacity-70 ${destructState === 'DESTRUCTING' ? 'bg-red-600' : 'bg-nier-accent'}`}></div>
      <div className={`absolute h-full w-[2px] opacity-70 ${destructState === 'DESTRUCTING' ? 'bg-red-600' : 'bg-nier-accent'}`}></div>
      <div className={`w-2 h-2 border ${destructState === 'DESTRUCTING' ? 'bg-red-600 border-black' : 'bg-nier-text border-nier-bg'}`}></div>
    </div>
  );
};

const FloatingPod = ({ targetPos, destructState }) => {
  const [roamPos, setRoamPos] = useState({ x: -100, y: -100 });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setRoamPos({
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50
      });
    }

    const roamInterval = setInterval(() => {
      setRoamPos({
        x: Math.random() * (window.innerWidth - 100) + 50,
        y: Math.random() * (window.innerHeight - 100) + 50
      });
    }, 4000);

    return () => clearInterval(roamInterval);
  }, []);

  if (destructState === 'DESTRUCTING' || destructState === 'DESTROYED') return null;

  const isTargeting = targetPos.active;
  const currentX = isTargeting ? targetPos.x : roamPos.x;
  const currentY = isTargeting ? targetPos.y : roamPos.y;

  return (
    <div 
      className="fixed pointer-events-none z-[90] transition-all ease-in-out"
      style={{ 
        transitionDuration: isTargeting ? '400ms' : '4000ms',
        transform: `translate(${currentX}px, ${currentY}px)`,
      }}
    >
      <div className="relative animate-bounce">
        <div className={`w-6 h-8 border-[2px] border-black flex flex-col items-center justify-center transition-colors duration-300 ${isTargeting ? 'bg-black' : 'bg-[#dad4bb]'}`}>
          <div className={`w-2 h-2 rounded-full transition-colors duration-300 ${isTargeting ? 'bg-red-600 animate-pulse' : 'bg-black'}`}></div>
        </div>
        <div className="absolute -top-2 left-1 w-[2px] h-2 bg-black"></div>
        <div className="absolute -bottom-2 right-1 w-[2px] h-2 bg-black"></div>
        <div className="absolute top-2 -left-2 w-2 h-[2px] bg-black"></div>
        {isTargeting && (
          <div className="absolute top-1/2 left-8 w-12 h-[1px] bg-red-600/50 -translate-y-1/2"></div>
        )}
      </div>
    </div>
  );
};

const SectionHeader = ({ title, onHoverEnter, onHoverLeave, recruiterMode }) => {
  return (
    <div 
      key={title} 
      className="mb-8 flex items-end w-max cursor-none"
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
    >
      <h2 className={`text-2xl font-bold text-nier-text border-b-2 border-nier-border inline-block pr-4 pb-1 tracking-widest uppercase typewriter ${!recruiterMode ? 'chromatic-hover' : ''}`}>
        {title}
      </h2>
      {!recruiterMode && <div className="w-3 h-6 bg-nier-text animate-blink ml-1 mb-1"></div>}
    </div>
  );
};

const NavButton = ({ label, isActive, onClick, onHoverEnter, onHoverLeave, recruiterMode }) => (
  <button
    onClick={onClick}
    onMouseEnter={onHoverEnter}
    onMouseLeave={onHoverLeave}
    className={`block w-full text-left px-4 py-2 border-l-4 font-bold tracking-wider transition-all duration-150 group cursor-none ${
      isActive 
        ? 'border-nier-accent bg-nier-text text-nier-bg' 
        : 'border-transparent text-nier-text hover:bg-nier-border hover:text-nier-bg hover:pl-6'
    }`}
  >
    <span className={`${!recruiterMode ? 'group-hover:animate-glitch' : ''} inline-block`}>{label}</span>
  </button>
);

const PluginChip = ({ skillName, cost, delay = "0ms", onHoverEnter, onHoverLeave, recruiterMode }) => (
  <div 
    onMouseEnter={onHoverEnter}
    onMouseLeave={onHoverLeave}
    className="flex items-center border border-nier-border bg-nier-light text-nier-text mb-1 w-full max-w-md hover:bg-nier-text hover:text-nier-bg transition-colors opacity-0 animate-fade-in cursor-none"
    style={{ animationDelay: recruiterMode ? '0ms' : delay }}
  >
    <div className="w-6 h-6 border-r border-nier-border flex items-center justify-center bg-black/5">
      <span className="text-xs">♦</span>
    </div>
    <div className="flex-1 px-3 py-1 text-sm font-bold tracking-wider">
      {skillName}
    </div>
    <div className="px-3 border-l border-nier-border text-xs flex items-center">
      [{cost}]
    </div>
  </div>
);

// --- MAIN APP COMPONENT ---

export default function App() {
  const initialSafeMode = typeof window !== 'undefined' && localStorage.getItem('nierSafeMode') === 'true';
  const [recruiterMode, setRecruiterMode] = useState(initialSafeMode);

  const [activeTab, setActiveTab] = useState('SYSTEM_STATUS');
  
  const [hasEntered, setHasEntered] = useState(initialSafeMode); 
  const [isBooting, setIsBooting] = useState(!initialSafeMode);
  
  const [podPos, setPodPos] = useState({ x: -100, y: -100, active: false });

  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const bgMusicRef = useRef(null);

  const [destructState, setDestructState] = useState('IDLE');
  const spaceCount = useRef(0);
  const spaceTimer = useRef(null);

  const [isHacking, setIsHacking] = useState(false);
  const [isFileUnlocked, setIsFileUnlocked] = useState(false);

  const [isPersonalLogUnlocked, setIsPersonalLogUnlocked] = useState(false);

  const { playHover, stopHover } = useHoverSound(`${import.meta.env.BASE_URL}hover.mp3`);

  useEffect(() => {
    localStorage.setItem('nierSafeMode', recruiterMode);
  }, [recruiterMode]);

  const playClick = useCallback(() => {
    try {
      const audio = new Audio(`${import.meta.env.BASE_URL}click.mp3`);
      audio.volume = 0.2; 
      audio.play();
    } catch (error) {
      console.warn("Audio blocked pending user interaction.");
    }
  }, []);

  const safePlayClick = useCallback(() => {
    if (!recruiterMode) playClick();
  }, [recruiterMode, playClick]);

  const handleBootComplete = useCallback(() => {
    setIsBooting(false);
  }, []);

  const handleUnitClick = () => {
    if (recruiterMode) return;
    
    safePlayClick();
    setIsPersonalLogUnlocked(true);
    setActiveTab('CLASSIFIED_LOGS');
  };

  const handleElementHover = (e, offsetX = -40, offsetY = 10) => {
    if (recruiterMode) return;
    playHover();
    const rect = e.currentTarget.getBoundingClientRect();
    setPodPos({
      x: rect.left + offsetX,
      y: rect.top + offsetY,
      active: true
    });
  };

  const handleElementLeave = () => {
    if (recruiterMode) return;
    stopHover();
    setPodPos(prev => ({ ...prev, active: false }));
  };

  useEffect(() => {
    if (!isBooting && !recruiterMode && hasEntered) {
      setPodPos(prev => ({ ...prev, active: false }));
    }
  }, [isBooting, recruiterMode, hasEntered]);

  const handleHackSuccess = useCallback(() => {
    safePlayClick();
    setIsHacking(false);
    setIsFileUnlocked(true);
  }, [safePlayClick]);

  const handleHackFail = useCallback(() => {
    safePlayClick();
    setIsHacking(false);
    alert("Hack failed. Returning to menu.");
  }, [safePlayClick]);

  useEffect(() => {
    bgMusicRef.current = new Audio(`${import.meta.env.BASE_URL}bg-music.mp3`); 
    bgMusicRef.current.loop = true;
    bgMusicRef.current.volume = 0.3; 

    return () => {
      if (bgMusicRef.current) {
        bgMusicRef.current.pause();
      }
    };
  }, []);

  useEffect(() => {
    if (!bgMusicRef.current) return;
    
    if (isAudioPlaying && destructState !== 'DESTROYED' && !recruiterMode) {
      bgMusicRef.current.play().catch(e => console.log("Audio play blocked", e));
    } else {
      bgMusicRef.current.pause();
    }
  }, [isAudioPlaying, destructState, recruiterMode]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space' && destructState === 'IDLE' && !isBooting && !isHacking && !recruiterMode && hasEntered) {
        e.preventDefault(); 
        spaceCount.current += 1;
        clearTimeout(spaceTimer.current);
        
        if (spaceCount.current >= 5) {
          setDestructState('WARNING');
          spaceCount.current = 0;
          playClick(); 
        } else {
          spaceTimer.current = setTimeout(() => {
            spaceCount.current = 0;
          }, 1000);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [destructState, isBooting, isHacking, recruiterMode, hasEntered, playClick]);

  const confirmDestruct = () => {
    playClick();
    setDestructState('DESTRUCTING');
    setIsAudioPlaying(false); 
    
    setTimeout(() => {
      setDestructState('DESTROYED');
    }, 2500);
  };

  const cancelDestruct = () => {
    playClick();
    setDestructState('IDLE');
    spaceCount.current = 0;
  };

  if (!hasEntered && !recruiterMode) {
    return (
      <div 
        className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono cursor-pointer relative"
        onClick={() => {
          playClick();
          setHasEntered(true);
        }}
      >
        <div className="crt-overlay"></div>
        <p className="text-xl tracking-widest animate-pulse font-bold z-10 hover:text-red-500 transition-colors">
          &gt; SYSTEM OFFLINE. CLICK TO INITIALIZE_
        </p>
      </div>
    );
  }

  if (isBooting && !recruiterMode && hasEntered) {
    return <BootSequence onComplete={handleBootComplete} />;
  }

  if (destructState === 'DESTROYED' && !recruiterMode) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white font-mono cursor-none relative">
        <div className="crt-overlay"></div>
        <CustomCursor destructState={destructState} />
        
        <p className="text-2xl tracking-widest animate-pulse font-bold z-10">&gt; CONNECTION LOST</p>
        <button 
          onMouseEnter={(e) => handleElementHover(e, -40, 10)}
          onMouseLeave={handleElementLeave}
          onClick={() => {
            playClick();
            setIsBooting(true);
            setDestructState('IDLE');
            setActiveTab('SYSTEM_STATUS');
          }}
          className="mt-12 px-8 py-3 border border-white text-white hover:bg-white hover:text-black uppercase tracking-widest font-bold transition-colors cursor-none z-10"
        >
          Reboot System
        </button>
      </div>
    );
  }

  return (
    <div className={`min-h-screen text-nier-text p-4 md:p-8 relative overflow-hidden cursor-none ${destructState === 'DESTRUCTING' ? 'bg-black' : 'bg-nier-bg'}`}>
      
      {/* SHAPEGRID REACT BITS BACKGROUND */}
      {destructState !== 'DESTRUCTING' && (
        <div className="fixed inset-0 z-0">
          <ShapeGrid 
            direction="diagonal" 
            speed={0.5} 
            squareSize={40} 
            borderColor="rgba(0, 0, 0, 0.08)" 
            hoverFillColor="rgba(0, 0, 0, 0.04)" 
            shape="square" 
            hoverTrailAmount={1} 
          />
        </div>
      )}

      {/* SAFE MODE TOGGLE BUTTON */}
      <div className="fixed bottom-4 left-4 z-[150]">
        <button
          onClick={() => {
            if (!recruiterMode) playClick(); 
            setRecruiterMode(!recruiterMode);
            if (!recruiterMode) setIsAudioPlaying(false);
          }}
          onMouseEnter={(e) => handleElementHover(e, 40, 0)}
          onMouseLeave={handleElementLeave}
          className={`px-4 py-2 border-2 font-bold tracking-widest uppercase text-xs transition-colors cursor-none ${
            recruiterMode 
              ? 'border-green-600 bg-green-600 text-white' 
              : 'border-nier-border text-nier-text hover:bg-nier-border'
          }`}
        >
          [ SIMPLE_MODE : {recruiterMode ? 'ON' : 'OFF'} ]
        </button>
      </div>

      {!recruiterMode && <div className="crt-overlay"></div>}

      {/* AUDIO TOGGLE BUTTON */}
      {destructState === 'IDLE' && !recruiterMode && (
        <div className="fixed bottom-4 right-4 z-[150]">
          <button
            onClick={() => {
              safePlayClick();
              setIsAudioPlaying(!isAudioPlaying);
            }}
            onMouseEnter={(e) => handleElementHover(e, -40, 0)}
            onMouseLeave={handleElementLeave}
            className={`px-4 py-2 border-2 font-bold tracking-widest uppercase text-xs transition-colors cursor-none ${
              isAudioPlaying 
                ? 'border-nier-text bg-nier-text text-nier-bg' 
                : 'border-nier-border text-nier-text hover:bg-nier-border'
            }`}
          >
            [ AUDIO_UPLINK : {isAudioPlaying ? 'ONLINE' : 'OFFLINE'} ]
          </button>
        </div>
      )}

      {/* EASTER EGG WARNING MODAL */}
      {destructState === 'WARNING' && !recruiterMode && (
        <div className="fixed inset-0 z-[200] bg-black/80 flex items-center justify-center p-4">
          <div className="bg-nier-bg border-4 border-red-600 p-8 max-w-lg w-full animate-pulse shadow-[0_0_50px_rgba(220,38,38,0.5)] z-20 relative">
            <h2 className="text-4xl text-red-600 font-bold mb-4 uppercase tracking-tighter flex items-center gap-3">
              <span className="text-5xl">⚠</span> WARNING
            </h2>
            <p className="text-nier-text font-bold mb-8 tracking-widest uppercase leading-relaxed">
              Initiating Black Box overload. Self-destruct sequence requested. All unsaved data and unit functionality will be permanently lost.
            </p>
            <div className="flex gap-4 font-mono">
              <button 
                onMouseEnter={(e) => handleElementHover(e, -30, 10)} 
                onMouseLeave={handleElementLeave} 
                onClick={confirmDestruct}
                className="flex-1 border-2 border-red-600 bg-red-600 text-white font-bold py-3 hover:bg-black hover:text-red-600 transition-colors uppercase tracking-widest cursor-none"
              >
                Confirm
              </button>
              <button 
                onMouseEnter={(e) => handleElementHover(e, -30, 10)} 
                onMouseLeave={handleElementLeave} 
                onClick={cancelDestruct}
                className="flex-1 border-2 border-nier-text bg-nier-text text-nier-bg font-bold py-3 hover:bg-nier-bg hover:text-nier-text transition-colors uppercase tracking-widest cursor-none"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ALWAYS RENDER CUSTOM CURSOR */}
      <CustomCursor destructState={destructState} />
      
      {!recruiterMode && <FloatingPod targetPos={podPos} destructState={destructState} />}

      <div className={`max-w-6xl mx-auto border-2 border-nier-border bg-[#dad4bb] relative z-10 shadow-2xl flex flex-col md:flex-row h-[85vh] animate-fade-in cursor-none ${destructState === 'DESTRUCTING' && !recruiterMode ? 'animate-extreme-glitch opacity-80' : ''}`}>
        
        {/* Left Sidebar Navigation */}
        <div className="w-full md:w-64 border-b-2 md:border-b-0 md:border-r-2 border-nier-border bg-[#dad4bb]/80 flex flex-col cursor-none">
          <div className={`p-6 border-b-2 border-nier-border relative overflow-hidden group cursor-none ${destructState === 'DESTRUCTING' && !recruiterMode ? 'bg-red-600 text-white' : ''}`}>
            {!recruiterMode && <div className="absolute top-0 left-0 w-full h-1 bg-nier-text/20 group-hover:translate-y-24 transition-transform duration-1000"></div>}
            <h1 className="text-xl font-bold tracking-widest cursor-none">YoRHa OS</h1>
            
            {/* CLICK TRIGGER FOR PERSONAL LOGS */}
            <p 
              className={`text-xs opacity-70 mt-1 select-none cursor-none ${!recruiterMode ? 'hover:text-nier-accent' : ''}`}
              onClick={handleUnitClick}
            >
              UNIT: R.CHAVHAN
            </p>

          </div>
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto cursor-none">
            <NavButton recruiterMode={recruiterMode} label="SYSTEM_STATUS" isActive={activeTab === 'SYSTEM_STATUS'} onClick={() => { safePlayClick(); setActiveTab('SYSTEM_STATUS'); }} onHoverEnter={(e) => handleElementHover(e)} onHoverLeave={handleElementLeave}/>
            <NavButton recruiterMode={recruiterMode} label="PLUG-IN_CHIPS" isActive={activeTab === 'PLUG-IN_CHIPS'} onClick={() => { safePlayClick(); setActiveTab('PLUG-IN_CHIPS'); }} onHoverEnter={(e) => handleElementHover(e)} onHoverLeave={handleElementLeave}/>
            <NavButton recruiterMode={recruiterMode} label="DATA_ARCHIVES" isActive={activeTab === 'DATA_ARCHIVES'} onClick={() => { safePlayClick(); setActiveTab('DATA_ARCHIVES'); }} onHoverEnter={(e) => handleElementHover(e)} onHoverLeave={handleElementLeave}/>
            <NavButton recruiterMode={recruiterMode} label="COMBAT_LOGS" isActive={activeTab === 'COMBAT_LOGS'} onClick={() => { safePlayClick(); setActiveTab('COMBAT_LOGS'); }} onHoverEnter={(e) => handleElementHover(e)} onHoverLeave={handleElementLeave}/>
            <NavButton recruiterMode={recruiterMode} label="COMM_NETWORK" isActive={activeTab === 'COMM_NETWORK'} onClick={() => { safePlayClick(); setActiveTab('COMM_NETWORK'); }} onHoverEnter={(e) => handleElementHover(e)} onHoverLeave={handleElementLeave}/>
            
            {/* HIDDEN TAB UNLOCKED BY CLICKING UNIT: R.CHAVHAN */}
            {isPersonalLogUnlocked && (
              <div className="pt-4 mt-2 border-t border-dashed border-nier-border animate-fade-in cursor-none">
                <NavButton 
                  recruiterMode={recruiterMode} 
                  label="[ CLASSIFIED_LOGS ]" 
                  isActive={activeTab === 'CLASSIFIED_LOGS'} 
                  onClick={() => { safePlayClick(); setActiveTab('CLASSIFIED_LOGS'); }} 
                  onHoverEnter={(e) => handleElementHover(e)} 
                  onHoverLeave={handleElementLeave}
                />
              </div>
            )}
          </nav>
        </div>

        {/* Right Content Area */}
        <div className="flex-1 p-8 overflow-y-auto bg-transparent relative cursor-none">
          
          <div className={`absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 m-4 cursor-none ${destructState === 'DESTRUCTING' && !recruiterMode ? 'border-red-600 animate-pulse' : 'border-nier-text'}`}></div>
          <div className={`absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 m-4 cursor-none ${destructState === 'DESTRUCTING' && !recruiterMode ? 'border-red-600 animate-pulse' : 'border-nier-text'}`}></div>

          {/* TAB 1: ABOUT (SYSTEM STATUS) */}
          {activeTab === 'SYSTEM_STATUS' && (
            <div className="animate-fade-in opacity-0 cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="System_Status :: Initialization" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              <div className={`space-y-4 border border-nier-border p-6 bg-[#dad4bb]/90 transition-colors duration-300 cursor-none ${!recruiterMode ? 'hover:border-nier-text' : ''}`}>
                <p className="font-bold cursor-none">&gt;&gt; USER_ID: RONAK_CHAVHAN</p>
                <p className="cursor-none">&gt;&gt; DESIGNATION: Computer Science Student | Software Developer | Backend Enthusiast</p>
                <p className="mt-4 leading-relaxed cursor-none">
                  &gt;&gt; OBJECTIVE_DATA: Computer Science engineering student focused on software development, debugging, and efficient application building. 
                  Strong programming foundation with a growing interest in backend systems, scalable design, and creative problem solving.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-8 border-t border-nier-border pt-4 text-sm cursor-none">
                  <div className="cursor-none"><strong className="cursor-none">LOCATION:</strong> Navi Mumbai, India</div>
                  <div className="cursor-none"><strong className="cursor-none">STATUS:</strong> <span className={`text-green-600 font-bold cursor-none ${!recruiterMode ? 'animate-pulse' : ''}`}>ONLINE</span></div>
                  <div className="cursor-none"><strong className="cursor-none">EDUCATION:</strong> B.Tech CSE (ITM Skills Univ.)</div>
                  <div className="cursor-none"><strong className="cursor-none">SOFT_SKILLS:</strong> Communication, Problem Solving</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SKILLS (PLUG-IN CHIPS) */}
          {activeTab === 'PLUG-IN_CHIPS' && (
            <div className="animate-fade-in opacity-0 cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="Plug-in_Chips :: Capabilities" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              <p className={`text-sm mb-6 opacity-80 inline-block cursor-none ${!recruiterMode ? 'typewriter' : ''}`}>&gt;&gt; ALLOCATING MEMORY TO EQUIPPED SKILL CHIPS...</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 cursor-none">
                <div className="cursor-none">
                  <h3 className="font-bold mb-2 text-sm text-nier-accent cursor-none">&gt; CORE_LANGUAGES</h3>
                  <PluginChip recruiterMode={recruiterMode} skillName="C++" cost="4" delay="200ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="Python" cost="4" delay="300ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="JavaScript" cost="3" delay="400ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="HTML/CSS" cost="2" delay="500ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                </div>
                
                <div className="cursor-none">
                  <h3 className="font-bold mb-2 text-sm text-nier-accent cursor-none">&gt; FRAMEWORKS_&_BACKEND</h3>
                  <PluginChip recruiterMode={recruiterMode} skillName="React.js" cost="5" delay="200ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="Node.js / Express.js" cost="5" delay="300ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="SQL / MongoDB" cost="4" delay="400ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="Firebase" cost="3" delay="500ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                </div>

                <div className="mt-4 cursor-none">
                  <h3 className="font-bold mb-2 text-sm text-nier-accent cursor-none">&gt; TOOLS_&_INFRASTRUCTURE</h3>
                  <PluginChip recruiterMode={recruiterMode} skillName="Git / GitHub" cost="2" delay="600ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="AWS / Docker" cost="6" delay="700ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="DevOps" cost="5" delay="800ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="Figma / Canva" cost="2" delay="900ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                </div>

                <div className="mt-4 cursor-none">
                  <h3 className="font-bold mb-2 text-sm text-nier-accent cursor-none">&gt; ADVANCED_MODULES</h3>
                  <PluginChip recruiterMode={recruiterMode} skillName="Generative AI & LLMs" cost="8" delay="600ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="MediaPipe" cost="4" delay="700ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                  <PluginChip recruiterMode={recruiterMode} skillName="OpenCV" cost="5" delay="800ms" onHoverEnter={(e) => handleElementHover(e, -20, 5)} onHoverLeave={handleElementLeave} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: PROJECTS (DATA ARCHIVES) */}
          {activeTab === 'DATA_ARCHIVES' && (
            <div className="animate-fade-in opacity-0 cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="Data_Archives :: Executed_Projects" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              
              <div className="space-y-6 cursor-none">

                {/* Classified File Section */}
                <div className={`border border-nier-border p-5 bg-[#dad4bb]/90 cursor-none`}>
                  <h3 className="text-lg font-bold mb-2 cursor-none">&gt;&gt; CLASSIFIED_DATA :: PROJECT_ARTFILTER</h3>
                  
                  {/* Hide hacking interface completely in Safe Mode */}
                  {!isFileUnlocked && !isHacking && !recruiterMode && (
                    <div className="flex flex-col items-center justify-center py-6 border border-dashed border-red-600 bg-red-600/10 cursor-none">
                      <span className="text-red-600 font-bold mb-3 tracking-widest text-center cursor-none">ACCESS DENIED. ENCRYPTION DETECTED.</span>
                      <button 
                        onClick={() => { safePlayClick(); setIsHacking(true); }}
                        onMouseEnter={(e) => handleElementHover(e, -35, 5)} onMouseLeave={handleElementLeave}
                        className="px-6 py-2 bg-red-600 text-white font-bold hover:bg-black uppercase tracking-widest cursor-none"
                      >
                        Initiate Hack
                      </button>
                    </div>
                  )}

                  {isHacking && !isFileUnlocked && !recruiterMode && (
                    <HackingMiniGame 
                      onHackSuccess={handleHackSuccess}
                      onHackFail={handleHackFail}
                    />
                  )}

                  {/* Show decrypted data if unlocked OR if in recruiter mode */}
                  {(isFileUnlocked || recruiterMode) && (
                    <div className="animate-fade-in border-l-4 border-green-600 pl-4 py-2 mt-3 cursor-none">
                      {!recruiterMode && <span className="text-green-600 font-bold text-xs tracking-widest mb-2 block cursor-none">DECRYPTION SUCCESSFUL</span>}
                      <div className="flex justify-between items-start mb-2 cursor-none">
                        <h3 className="text-md font-bold cursor-none">ArtFilter</h3>
                        <a href="https://github.com/Ronak-uh/ArtFilter" target="_blank" rel="noreferrer" onMouseEnter={(e) => handleElementHover(e, -20, 5)} onMouseLeave={handleElementLeave} className={`text-xs border border-green-600 text-green-600 px-2 py-1 hover:bg-green-600 hover:text-black cursor-none ${!recruiterMode ? 'hover:animate-glitch' : ''}`}>
                          ACCESS_REPO
                        </a>
                      </div>
                      <ul className={`list-square list-inside text-sm space-y-2 cursor-none`}>
                        <li className="cursor-none">Developed a dynamic image processing application for applying artistic filters.</li>
                        <li className="cursor-none">Engineered optimized pixel-manipulation algorithms for real-time performance.</li>
                        <li className="cursor-none">Designed a seamless, user-friendly interface for media transformation.</li>
                      </ul>
                    </div>
                  )}
                </div>

                {/* Existing Projects */}
                <div 
                  onMouseEnter={(e) => handleElementHover(e, -35, 10)}
                  onMouseLeave={handleElementLeave}
                  className={`border border-nier-border p-5 bg-[#dad4bb]/90 transition-all duration-300 transform opacity-0 animate-fade-in cursor-none ${!recruiterMode ? 'hover:bg-nier-bg hover:-translate-y-1 hover:shadow-lg' : ''}`} 
                  style={{ animationDelay: recruiterMode ? '0ms' : '200ms' }}
                >
                  <div className="flex justify-between items-start mb-2 cursor-none">
                    <h3 className="text-lg font-bold cursor-none">&gt;&gt; MapBorne - Indian Transport Accessibility</h3>
                    <a href="https://github.com/Ronak-uh/MapBorne.git" target="_blank" rel="noreferrer" className={`text-xs border border-nier-text px-2 py-1 hover:bg-nier-text hover:text-nier-bg cursor-none ${!recruiterMode ? 'hover:animate-glitch' : ''}`}>ACCESS_REPO</a>
                  </div>
                  <ul className={`list-square list-inside text-sm space-y-2 mt-3 cursor-none`}>
                    <li className="cursor-none">Interactive platform with time based route analysis.</li>
                    <li className="cursor-none">Improved route processing efficiency by 30% via optimized API calls.</li>
                    <li className="cursor-none">Reduced data fetch delay by ~40% through Firebase sync optimization.</li>
                  </ul>
                </div>

                <div 
                  onMouseEnter={(e) => handleElementHover(e, -35, 10)}
                  onMouseLeave={handleElementLeave}
                  className={`border border-nier-border p-5 bg-[#dad4bb]/90 transition-all duration-300 transform opacity-0 animate-fade-in cursor-none ${!recruiterMode ? 'hover:bg-nier-bg hover:-translate-y-1 hover:shadow-lg' : ''}`} 
                  style={{ animationDelay: recruiterMode ? '0ms' : '400ms' }}
                >
                  <div className="flex justify-between items-start mb-2 cursor-none">
                    <h3 className="text-lg font-bold cursor-none">&gt;&gt; Unravel - Automated Blog Publishing</h3>
                    <a href="https://github.com/Ronak-uh/Unravel.git" target="_blank" rel="noreferrer" className={`text-xs border border-nier-text px-2 py-1 hover:bg-nier-text hover:text-nier-bg cursor-none ${!recruiterMode ? 'hover:animate-glitch' : ''}`}>ACCESS_REPO</a>
                  </div>
                  <ul className={`list-square list-inside text-sm space-y-2 mt-3 cursor-none`}>
                    <li className="cursor-none">Automated publishing pipeline with audit tracking.</li>
                    <li className="cursor-none">Reduced manual publishing effort by ~60% through workflow automation.</li>
                    <li className="cursor-none">Lowered error rate by ~50% in repeated posting cycles.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACHIEVEMENTS (COMBAT LOGS) */}
          {activeTab === 'COMBAT_LOGS' && (
            <div className="animate-fade-in opacity-0 cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="Combat_Logs :: Achievements" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 cursor-none">
                <div onMouseEnter={(e) => handleElementHover(e, -20, 5)} onMouseLeave={handleElementLeave} className={`border-l-4 border-nier-accent pl-4 py-2 bg-[#dad4bb]/80 transition-colors animate-fade-in opacity-0 cursor-none ${!recruiterMode ? 'hover:bg-nier-bg' : ''}`} style={{ animationDelay: recruiterMode ? '0ms' : '200ms' }}>
                  <h4 className="font-bold uppercase tracking-wider cursor-none">Hackathon Participant</h4>
                  <p className="text-sm mt-1 cursor-none">Competed in multiple hackathons, building deployable solutions under 24-72 hour time constraints.</p>
                </div>
                
                <div onMouseEnter={(e) => handleElementHover(e, -20, 5)} onMouseLeave={handleElementLeave} className={`border-l-4 border-nier-accent pl-4 py-2 bg-[#dad4bb]/80 transition-colors animate-fade-in opacity-0 cursor-none ${!recruiterMode ? 'hover:bg-nier-bg' : ''}`} style={{ animationDelay: recruiterMode ? '0ms' : '300ms' }}>
                  <h4 className="font-bold uppercase tracking-wider cursor-none">Efficiency Expert</h4>
                  <p className="text-sm mt-1 cursor-none">Optimized API calls in MapBorne improving efficiency by 30%.</p>
                </div>

                <div onMouseEnter={(e) => handleElementHover(e, -20, 5)} onMouseLeave={handleElementLeave} className={`border-l-4 border-nier-accent pl-4 py-2 bg-[#dad4bb]/80 transition-colors animate-fade-in opacity-0 cursor-none ${!recruiterMode ? 'hover:bg-nier-bg' : ''}`} style={{ animationDelay: recruiterMode ? '0ms' : '400ms' }}>
                  <h4 className="font-bold uppercase tracking-wider cursor-none">Automation Builder</h4>
                  <p className="text-sm mt-1 cursor-none">Reduced manual efforts by 60% in Unravel via workflow automation.</p>
                </div>
                
                <div className={`border-l-4 border-nier-border pl-4 py-2 bg-[#dad4bb]/50 opacity-60 cursor-none`} style={{ animationDelay: recruiterMode ? '0ms' : '500ms' }}>
                  <h4 className="font-bold uppercase tracking-wider cursor-none">Certifications</h4>
                  <p className="text-sm mt-1 cursor-none">[ DATA NOT FOUND / AWAITING CLEARANCE ]</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: CONTACT (COMM NETWORK) */}
          {activeTab === 'COMM_NETWORK' && (
            <div className="animate-fade-in opacity-0 flex flex-col items-center justify-center h-full cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="Comm_Network :: Establish_Link" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              
              <div className={`w-full max-w-md border-2 border-nier-border bg-[#dad4bb]/90 p-8 mt-4 text-center transform transition-transform duration-300 cursor-none ${!recruiterMode ? 'hover:scale-105' : ''}`}>
                <div className={`w-16 h-16 rounded-full border-2 border-nier-text mx-auto mb-6 flex items-center justify-center cursor-none ${!recruiterMode ? 'animate-pulse' : ''}`}>
                  <span className="text-2xl cursor-none">⚡</span>
                </div>
                
                <div className="space-y-4 font-mono cursor-none">
                  <a href="mailto:ronakchavhan89@gmail.com" onMouseEnter={(e) => handleElementHover(e, -30, 5)} onMouseLeave={handleElementLeave} className={`block w-full border border-nier-border py-2 transition-colors group cursor-none ${!recruiterMode ? 'hover:bg-nier-text hover:text-nier-bg' : ''}`}>
                    <span className={`inline-block cursor-none ${!recruiterMode ? 'group-hover:animate-glitch' : ''}`}>ronakchavhan89@gmail.com</span>
                  </a>
                  
                  <div className={`block w-full border border-nier-border py-2 text-sm opacity-80 cursor-none`}>
                    TEL: 9967595336
                  </div>

                  <a href="https://linkedin.com/in/ronak-chavhan-b3343a32b/" target="_blank" rel="noreferrer" onMouseEnter={(e) => handleElementHover(e, -30, 5)} onMouseLeave={handleElementLeave} className={`block w-full border border-nier-border py-2 transition-colors group cursor-none ${!recruiterMode ? 'hover:bg-nier-text hover:text-nier-bg' : ''}`}>
                    <span className={`inline-block cursor-none ${!recruiterMode ? 'group-hover:animate-glitch' : ''}`}>LINKEDIN_PROFILE</span>
                  </a>
                  <a href="https://github.com/Ronak-uh" target="_blank" rel="noreferrer" onMouseEnter={(e) => handleElementHover(e, -30, 5)} onMouseLeave={handleElementLeave} className={`block w-full border border-nier-border py-2 transition-colors group cursor-none ${!recruiterMode ? 'hover:bg-nier-text hover:text-nier-bg' : ''}`}>
                    <span className={`inline-block cursor-none ${!recruiterMode ? 'group-hover:animate-glitch' : ''}`}>GITHUB_ARCHIVE</span>
                  </a>

                  <div className={`mt-8 pt-6 border-t border-nier-border cursor-none`}>
                    <a 
                      href="./Ronak_Chavhan_Resume.pdf" 
                      download="Ronak_Chavhan_Resume.pdf"
                      onMouseEnter={(e) => handleElementHover(e, -30, 5)} 
                      onMouseLeave={handleElementLeave}
                      onClick={safePlayClick}
                      className={`block w-full bg-nier-text text-nier-bg py-3 font-bold transition-colors cursor-none ${!recruiterMode ? 'hover:bg-nier-accent hover:animate-pulse' : ''}`}
                    >
                      DOWNLOAD_DOSSIER (RESUME)
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HIDDEN EASTER EGG TAB: PERSONAL LOGS */}
          {activeTab === 'CLASSIFIED_LOGS' && (
            <div className="animate-fade-in opacity-0 cursor-none" style={{ animationDelay: recruiterMode ? '0ms' : '100ms' }}>
              <SectionHeader recruiterMode={recruiterMode} title="Classified_Logs :: Personal_Data" onHoverEnter={(e) => handleElementHover(e, -35, 5)} onHoverLeave={handleElementLeave} />
              
              <div className="space-y-6 cursor-none">
                <div 
                  onMouseEnter={(e) => handleElementHover(e, -35, 10)}
                  onMouseLeave={handleElementLeave}
                  className={`border border-nier-border p-5 bg-[#dad4bb]/90 transition-colors duration-300 cursor-none ${!recruiterMode ? 'hover:border-nier-text' : ''}`}
                >
                  <h3 className={`text-lg font-bold mb-4 text-red-600 cursor-none ${!recruiterMode ? 'animate-pulse' : ''}`}>&gt;&gt; WARNING: UNAUTHORIZED ACCESS DETECTED</h3>
                  <p className="mb-4 opacity-80 font-mono text-sm cursor-none">Decrypted personal logs for Unit R.CHAVHAN...</p>
                  
                  <ul className={`list-square list-inside text-sm space-y-4 cursor-none`}>
                    <li className="cursor-none"><strong className="cursor-none">HARDWARE_MODIFICATION:</strong> Highly proficient in local hardware maintenance, including DIY laptop LCD replacements, custom thermal paste applications, and tracking the latest RTX 50-series performance metrics.</li>
                    <li className="cursor-none"><strong className="cursor-none">VIRTUAL_SIMULATIONS:</strong> Actively engaged in high-difficulty combat scenarios. Current favorite simulations include <em className="cursor-none">Clair Obscur: Expedition 33</em> and <em className="cursor-none">Lies of P</em>.</li>
                    <li className="cursor-none"><strong className="cursor-none">DATA_CONSUMPTION:</strong> Archiving literary records. Highest-rated archive is <em className="cursor-none">The Beginning After The End</em> by TurtleMe. Currently processing <em className="cursor-none">What Do You Wish For With Muddy Eyes: Record of Highserk War</em> by Torutonen.</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

        </div>
        
        {/* FOOTER DISCLAIMER */}
        <div className="absolute -bottom-8 left-0 w-full text-center text-xs opacity-40 cursor-none z-20">
          UI inspired by Nier: Automata. Background Music © Square Enix. Educational/Portfolio purposes only.
        </div>
      </div>
    </div>
  );
}