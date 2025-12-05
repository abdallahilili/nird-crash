import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { RotateCcw, TrendingUp, TrendingDown, Wallet, ListChecks, ArrowRight, Globe, Cpu } from 'lucide-react';
import Confetti from 'react-confetti';

const ResultView = ({ choice, onReset }) => {
  const isSuccess = choice.type === 'opensource';
  // Track window size for correct confetti positioning
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  // Animated number logic
  const springValue = useSpring(0, { stiffness: 40, damping: 20, delay: 0.5 });
  const displayValue = useTransform(springValue, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    
    // Animate number
    springValue.set(Math.abs(choice.cost));

    return () => window.removeEventListener('resize', handleResize);
  }, [choice.cost, springValue]);

  return (
    <div className="flex flex-col items-center justify-center w-full relative">
      {isSuccess && windowSize.width > 0 && (
        <div className="fixed inset-0 pointer-events-none z-50">
           <Confetti 
             width={windowSize.width} 
             height={windowSize.height} 
             recycle={false} 
             numberOfPieces={500} 
             gravity={0.2}
             colors={['#00843D', '#FFC72C', '#D01C1F', '#FFFFFF']}
           />
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="bg-white/95 backdrop-blur-md p-5 md:p-8 rounded-3xl shadow-2xl max-w-xl w-full text-center border border-white/50 relative overflow-hidden"
      >
        {/* Decorative background blob */}
        <div className={`absolute -top-20 -left-20 w-40 h-40 rounded-full blur-3xl opacity-20 ${isSuccess ? 'bg-green-500' : 'bg-red-500'}`}></div>

        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-gray-800 relative z-10">
          Bilan de la décision
        </h2>

        {/* Financial Result with Animated Counter */}
        <div className="flex flex-col gap-4 justify-center items-center w-full mb-6 relative z-10">
            {isSuccess ? (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full px-5 py-4 bg-green-50 border-2 border-green-200 text-green-700 rounded-2xl font-bold flex items-center justify-between gap-3 shadow-lg text-lg md:text-xl"
                >
                    <span className="flex items-center gap-2"><Wallet size={24} /> Économies</span>
                    <span className="flex items-center gap-1 text-2xl md:text-3xl font-black">
                        +<motion.span>{displayValue}</motion.span> UM
                    </span>
                </motion.div>
            ) : (
                <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="w-full px-5 py-4 bg-red-50 border-2 border-red-100 text-red-700 rounded-2xl font-bold flex items-center justify-between gap-3 shadow-lg text-lg md:text-xl"
                >
                    <span className="flex items-center gap-2"><Wallet size={24} /> Coût</span>
                    <span className="flex items-center gap-1 text-2xl md:text-3xl font-black">
                        -<motion.span>{displayValue}</motion.span> UM
                    </span>
                </motion.div>
            )}
        </div>

        {/* Qualitative Consequences List */}
        <div className="w-full text-left bg-gray-50/80 rounded-2xl p-5 mb-8 border border-gray-100 relative z-10">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                <ListChecks size={16} />
                Impacts Structurels
            </h3>
            <ul className="space-y-4">
                {choice.consequences.map((consequence, index) => (
                    <motion.li 
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.15 + 0.5 }}
                        className="flex items-start gap-3 text-sm md:text-base text-gray-700 leading-snug"
                    >
                        <div className={`mt-0.5 min-w-[20px] p-1 rounded-full ${isSuccess ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                            {index === 0 ? <Wallet size={12} /> : 
                             index === 1 ? <Cpu size={12} /> :
                             index === 2 ? <Globe size={12} /> :
                             <ArrowRight size={12} />}
                        </div>
                        <span className="font-medium">{consequence}</span>
                    </motion.li>
                ))}
            </ul>
        </div>

        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onReset}
            className="w-full px-6 py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-md hover:shadow-xl flex items-center justify-center gap-2 relative z-10"
        >
            <RotateCcw size={20} />
            <span>Nouvelle Décision</span>
        </motion.button>
      </motion.div>
    </div>
  );
};

export default ResultView;
