import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

const ChoiceCard = ({ choice, onClick }) => {
  const isGood = choice.type === 'opensource';
  
  // Animated Counter for Cost
  const springValue = useSpring(0, { stiffness: 50, damping: 20 });
  const displayValue = useTransform(springValue, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    // Animate from 0 to actual cost
    springValue.set(Math.abs(choice.cost));
  }, [choice.cost, springValue]);

  return (
    <motion.button
      whileHover={{ scale: 1.05, y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      onClick={() => onClick(choice)}
      className="relative overflow-hidden w-full p-5 md:p-6 rounded-2xl shadow-md border-2 border-gray-200 hover:border-[#00843D] text-left transition-all duration-300 flex flex-col h-full bg-white group"
    >
      <div className="z-10 w-full">
        <div className={`inline-block px-2.5 py-1 rounded-full text-[10px] md:text-xs font-bold mb-2 md:mb-3 transition-colors ${isGood ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
          OPTION {isGood ? 'A' : 'B'}
        </div>
        
        <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-[#00843D] transition-colors leading-tight">
          {choice.title}
        </h3>
        <p className="text-gray-600 mb-4 md:mb-6 text-sm leading-relaxed">
          {choice.description}
        </p>
        
        <div className="mt-auto pt-3 md:pt-4 border-t border-gray-100 flex items-center justify-between">
          <div className="flex flex-col">
              <span className="text-xs text-gray-400 uppercase font-bold">Coût Estimé</span>
              <motion.span className="text-base md:text-xl font-bold text-gray-600 group-hover:text-[#00843D] tabular-nums">
                 <motion.span>{displayValue}</motion.span> UM
              </motion.span>
          </div>
          <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-[#00843D] group-hover:text-white transition-colors">
            <MousePointerClick className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.button>
  );
};

export default ChoiceCard;
