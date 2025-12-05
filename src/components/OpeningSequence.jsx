import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Lock, Users, Play, ChevronRight, Globe, Server, Shield } from 'lucide-react';

const OpeningSequence = ({ onComplete }) => {
  const [act, setAct] = useState(1);
  const [count, setCount] = useState(10);

  useEffect(() => {
    // Act 1: Countdown (10s total, fast forwarded for effect if needed, but keeping 10s roughly)
    if (act === 1) {
      const timer = setInterval(() => {
        setCount((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setAct(2);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
    
    // Act 2: Comparison (5s) -> Act 3
    if (act === 2) {
      const timer = setTimeout(() => setAct(3), 5000);
      return () => clearTimeout(timer);
    }

    // Act 3: Flag/Impact (5s) -> Act 4
    if (act === 3) {
      const timer = setTimeout(() => setAct(4), 5000);
      return () => clearTimeout(timer);
    }
  }, [act]);

  const containerVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { 
      opacity: 1, 
      scale: 1,
      transition: { 
        duration: 0.5,
        ease: "easeOut"
      } 
    },
    exit: { 
      opacity: 0, 
      scale: 1.05,
      transition: { 
        duration: 0.5,
        ease: "easeIn"
      } 
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden font-sans">
        <button 
            onClick={onComplete}
            className="absolute top-6 right-6 px-5 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-full text-xs font-bold uppercase tracking-widest border border-white/20 transition-all z-50 hover:scale-105 active:scale-95"
        >
            Passer l'intro
        </button>

        <AnimatePresence mode="wait">
            {/* ACT 1: RED ALERT & COUNTDOWN */}
            {act === 1 && (
                <motion.div 
                    key="act1" 
                    variants={containerVariants}
                    initial="initial" animate="animate" exit="exit"
                    className="flex flex-col items-center justify-center gap-8 text-red-600 w-full h-full bg-black relative"
                >
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/20 via-black to-black" />
                    
                    <motion.div 
                        animate={{ 
                          scale: [1, 1.2, 1], 
                          opacity: [0.5, 1, 0.5],
                          rotate: [0, 5, -5, 0]
                        }} 
                        transition={{ 
                          repeat: Infinity, 
                          duration: 0.8,
                          ease: "easeInOut"
                        }}
                    >
                        <AlertTriangle size={100} strokeWidth={1.5} />
                    </motion.div>
                    
                    <div className="flex flex-col items-center z-10">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                            className="text-2xl md:text-4xl font-mono font-bold tracking-[0.2em] text-red-500 mb-4"
                        >
                            INITIALISATION DU SYSTÈME
                        </motion.h1>
                        <motion.div 
                            key={count}
                            initial={{ scale: 1.5, opacity: 0, rotate: -10 }}
                            animate={{ 
                              scale: 1, 
                              opacity: 1, 
                              rotate: 0,
                              color: count <= 3 ? "#ef4444" : count <= 6 ? "#f59e0b" : "#ffffff"
                            }}
                            transition={{
                              type: "spring",
                              stiffness: 200,
                              damping: 15
                            }}
                            className="text-8xl md:text-9xl font-black font-mono text-white tabular-nums"
                        >
                            00:{count.toString().padStart(2, '0')}
                        </motion.div>
                    </div>

                    <div className="absolute bottom-10 w-full px-10">
                        <div className="h-1 w-full bg-red-900 rounded-full overflow-hidden">
                            <motion.div 
                                className="h-full bg-red-500"
                                initial={{ width: "100%" }}
                                animate={{ width: "0%" }}
                                transition={{ duration: 10, ease: "linear" }}
                            />
                        </div>
                    </div>
                </motion.div>
            )}

            {/* ACT 2: SPLIT SCREEN COMPARISON */}
            {act === 2 && (
                <motion.div 
                    key="act2" 
                    variants={containerVariants}
                    initial="initial" animate="animate" exit="exit"
                    className="w-full h-full flex relative"
                >
                    {/* Left: Big Tech (Dark/Corporate) */}
                    <motion.div 
                        initial={{ x: '-100%' }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 20 }}
                        className="w-1/2 h-full bg-slate-900 flex flex-col items-center justify-center p-4 md:p-10 border-r border-white/10 relative overflow-hidden"
                    >
                         <motion.div 
                            animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-10 left-10 opacity-20"
                         ><Lock size={120} /></motion.div>
                         <motion.div 
                            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute bottom-10 right-10 opacity-20"
                         ><Server size={120} /></motion.div>
                         
                         <div className="z-10 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold text-gray-300 mb-2 uppercase tracking-tighter">Propriétaire</h2>
                            <p className="text-gray-500 text-sm md:text-lg">Dépendance & Coûts Cachés</p>
                         </div>
                    </motion.div>
                    
                    {/* Right: NIRD (Green/Open) */}
                    <motion.div 
                        initial={{ x: '100%' }} animate={{ x: 0 }} transition={{ type: 'spring', damping: 20 }}
                        className="w-1/2 h-full bg-[#00843D] flex flex-col items-center justify-center p-4 md:p-10 relative overflow-hidden"
                    >
                         <motion.div 
                            animate={{ y: [0, -10, 0] }} transition={{ repeat: Infinity, duration: 4 }}
                            className="absolute top-10 right-10 opacity-20 text-[#FFC72C]"
                         ><Users size={120} /></motion.div>
                         <motion.div 
                            animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 5 }}
                            className="absolute bottom-10 left-10 opacity-20 text-[#FFC72C]"
                         ><Shield size={120} /></motion.div>

                        <div className="z-10 text-center">
                            <h2 className="text-2xl md:text-4xl font-bold text-white mb-2 uppercase tracking-tighter">Open Source</h2>
                            <p className="text-[#FFC72C] text-sm md:text-lg">Liberté & Communauté</p>
                        </div>
                    </motion.div>

                    {/* VS Badge avec animation pulsante */}
                    <motion.div 
                        initial={{ scale: 0, rotate: -180 }} 
                        animate={{ 
                          scale: [1, 1.1, 1],
                          rotate: 0,
                          boxShadow: [
                            "0 0 50px rgba(255,255,255,0.5)",
                            "0 0 80px rgba(255,255,255,0.8)",
                            "0 0 50px rgba(255,255,255,0.5)"
                          ]
                        }} 
                        transition={{ 
                          delay: 0.5, 
                          type: 'spring',
                          scale: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
                          boxShadow: { duration: 1.5, repeat: Infinity }
                        }}
                        className="absolute inset-0 m-auto w-20 h-20 bg-white rounded-full flex items-center justify-center text-black font-black text-2xl z-20 shadow-[0_0_50px_rgba(255,255,255,0.5)] border-4 border-gray-100"
                    >
                        VS
                    </motion.div>
                </motion.div>
            )}

            {/* ACT 3: MAURITANIA REVEAL */}
            {act === 3 && (
                <motion.div 
                    key="act3" 
                    variants={containerVariants}
                    initial="initial" animate="animate" exit="exit"
                    className="flex flex-col items-center justify-center text-center p-6 bg-[#00843D] w-full h-full relative overflow-hidden"
                >
                    {/* Animated Background Rays */}
                    <motion.div 
                        className="absolute inset-0 z-0 opacity-10"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 30, ease: "linear", repeat: Infinity }}
                    >
                         <div className="w-[150vmax] h-[150vmax] bg-[conic-gradient(from_0deg,transparent_0deg,rgba(255,199,44,0.4)_20deg,transparent_40deg)] absolute -top-[75vmax] -left-[75vmax]" />
                    </motion.div>
                    
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }} 
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="z-10 relative flex flex-col items-center"
                    >
                        {/* Mauritania Flag Stylized */}
                        <div className="w-48 h-32 md:w-64 md:h-40 bg-[#00843D] relative mb-10 overflow-visible">
                             <motion.div 
                                initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3, type: 'spring' }}
                                className="absolute inset-0 flex items-center justify-center"
                             >
                                 <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                                    <path d="M50,15 C30,15 15,35 15,55 C15,75 30,85 50,85 C70,85 85,75 85,55 C85,35 70,15 50,15 M50,25 C65,25 75,40 75,55 C75,70 65,75 50,75 C35,75 25,70 25,55 C25,40 35,25 50,25" fill="#FFC72C" />
                                    <polygon points="50,30 54,42 66,42 56,50 60,62 50,55 40,62 44,50 34,42 46,42" fill="#FFC72C" />
                                 </svg>
                             </motion.div>
                        </div>

                        <motion.h2 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}
                            className="text-4xl md:text-6xl font-bold text-white mb-4 uppercase tracking-tighter"
                        >
                            Pour la Mauritanie
                        </motion.h2>
                        <motion.p 
                            initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.7 }}
                            className="text-[#FFC72C] text-xl md:text-2xl font-medium max-w-2xl"
                        >
                            Construisons notre souveraineté numérique ensemble.
                        </motion.p>
                    </motion.div>
                </motion.div>
            )}

            {/* ACT 4: ENTER THE VILLAGE */}
            {act === 4 && (
                <motion.div 
                    key="act4" 
                    variants={containerVariants}
                    initial="initial" animate="animate" exit="exit"
                    className="flex flex-col items-center justify-center bg-white text-black w-full h-full relative"
                >
                     <motion.div 
                        initial={{ scale: 0, rotate: 180 }} animate={{ scale: 1, rotate: 0 }} 
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                        className="mb-8 relative"
                     >
                        <div className="w-32 h-32 md:w-48 md:h-48 bg-[#00843D] rounded-[2rem] flex items-center justify-center shadow-2xl rotate-3 relative z-10 border-4 border-[#FFC72C]">
                             <span className="text-6xl md:text-8xl">🛖</span>
                        </div>
                        <div className="absolute inset-0 bg-[#FFC72C] rounded-[2rem] rotate-12 z-0 opacity-50 scale-105" />
                     </motion.div>
                     
                     <div className="text-center mb-12">
                         <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
                            className="text-5xl md:text-7xl font-black text-[#00843D] leading-none mb-2"
                         >
                            NIRD
                         </motion.h1>
                         <motion.h1 
                            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
                            className="text-5xl md:text-7xl font-black text-[#FFC72C] leading-none tracking-tight"
                         >
                            VILLAGE
                         </motion.h1>
                     </div>

                     <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={onComplete}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8 }}
                        className="group px-8 py-4 bg-[#D01C1F] text-white text-lg md:text-xl font-bold rounded-full shadow-[0_10px_30px_rgba(208,28,31,0.4)] hover:shadow-[0_15px_40px_rgba(208,28,31,0.6)] hover:bg-[#b01619] flex items-center gap-3 transition-all"
                     >
                        <Play fill="white" size={20} /> 
                        ENTRER DANS LE VILLAGE
                        <ChevronRight className="group-hover:translate-x-1 transition-transform" />
                     </motion.button>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
  );
};

export default OpeningSequence;
