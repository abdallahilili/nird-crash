import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

const Mentor = ({ message, isVisible, onClose, emotion = 'happy' }) => {
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (isVisible) {
      setDisplayedText('');
      let i = 0;
      // Typing effect
      const timer = setInterval(() => {
        setDisplayedText(message.slice(0, i + 1));
        i++;
        if (i >= message.length) clearInterval(timer);
      }, 25);
      return () => clearInterval(timer);
    }
  }, [isVisible, message]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 md:left-auto md:right-8 md:bottom-8 z-50 p-4 flex flex-col md:flex-row items-end gap-3 pointer-events-none w-full md:max-w-lg mx-auto md:mx-0"
        >
          {/* Avatar - Getafix Style */}
          <motion.div 
            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.1, type: "spring" }}
            className="w-20 h-20 md:w-24 md:h-24 shrink-0 bg-white rounded-full border-4 border-[#00843D] shadow-2xl overflow-hidden relative z-20"
          >
             <svg viewBox="0 0 100 100" className="w-full h-full bg-[#f0f4f8]">
                 {/* Body */}
                 <path d="M10,100 L90,100 L80,80 Q50,70 20,80 Z" fill="#D01C1F" />
                 {/* Beard */}
                 <motion.path 
                    d="M20,55 Q50,110 80,55 L80,65 Q50,120 20,65 Z" fill="white" stroke="#eee" strokeWidth="1"
                    animate={{ y: [0, 2, 0] }} transition={{ repeat: Infinity, duration: 2 }}
                 />
                 {/* Head */}
                 <circle cx="50" cy="45" r="22" fill="#F5D0A9" />
                 {/* Eyes */}
                 <circle cx="42" cy="42" r="3" fill="#333" />
                 <circle cx="58" cy="42" r="3" fill="#333" />
                 {/* Nose */}
                 <circle cx="50" cy="50" r="4" fill="#E5B089" />
                 {/* Hat (Druid style) */}
                 <path d="M28,30 Q50,10 72,30 L78,25 L22,25 Z" fill="#34495E" />
             </svg>
          </motion.div>

          {/* Speech Bubble */}
          <motion.div 
            className="bg-white p-5 rounded-2xl rounded-bl-none shadow-xl border-2 border-[#00843D]/20 pointer-events-auto relative flex-1"
            initial={{ scale: 0.8, opacity: 0, x: -20 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
             <button 
                onClick={onClose}
                className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition-colors"
             >
                <X size={16} />
             </button>
             
             <div className="text-gray-800 text-sm md:text-base font-medium leading-relaxed font-mono min-h-[60px]">
                <span className="text-[#00843D] font-bold block mb-1 uppercase text-xs tracking-wider">Le Sage a dit :</span>
                {displayedText}
                <span className="animate-pulse inline-block w-2 h-4 bg-[#00843D] ml-1 align-middle"></span>
             </div>
             
             <button 
                onClick={onClose}
                className="mt-3 text-xs bg-[#00843D]/10 text-[#00843D] px-3 py-1 rounded-full font-bold hover:bg-[#00843D]/20 transition-colors"
             >
                J'ai compris
             </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Mentor;
