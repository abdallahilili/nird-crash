import React, { useState, useEffect } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';
import { MousePointerClick } from 'lucide-react';

const ChoiceCard = ({ choice, onClick, isSelected = false, reaction = null }) => {
  const isGood = choice.type === 'opensource';
  
  // Animated Counter for Cost avec animation plus dynamique
  const springValue = useSpring(0, { 
    stiffness: 50, 
    damping: 20,
    velocity: isGood ? 5 : 3
  });
  const displayValue = useTransform(springValue, (current) => Math.round(current).toLocaleString());

  useEffect(() => {
    // Animate from 0 to actual cost avec rebond
    springValue.set(Math.abs(choice.cost));
  }, [choice.cost, springValue]);

  return (
    <motion.button
      whileHover={{ 
        scale: 1.05, 
        y: -5, 
        boxShadow: isGood ? 
          "0 20px 25px -5px rgba(34, 197, 94, 0.3), 0 10px 10px -5px rgba(34, 197, 94, 0.2)" :
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)"
      }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20, rotateX: -10 }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        borderColor: isSelected ? (isGood ? "#22c55e" : "#ef4444") : "#e5e7eb",
        boxShadow: isSelected ? 
          (isGood ? 
            "0 0 0 3px rgba(34, 197, 94, 0.3)" : 
            "0 0 0 3px rgba(239, 68, 68, 0.3)") :
          "0 1px 3px 0 rgba(0, 0, 0, 0.1)"
      }}
      transition={{ 
        type: "spring", 
        stiffness: 300, 
        damping: 20,
        borderColor: { duration: 0.3 }
      }}
      onClick={() => onClick(choice)}
      className={`relative overflow-hidden w-full p-5 md:p-6 rounded-2xl shadow-md border-2 text-left transition-all duration-300 flex flex-col h-full bg-white group ${
        isGood ? 'hover:border-green-500' : 'hover:border-gray-400'
      } ${isSelected ? (isGood ? 'bg-green-50' : 'bg-red-50') : ''}`}
    >
      {/* Effet de brillance au survol */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
        initial={{ x: '-100%' }}
        whileHover={{ x: '100%' }}
        transition={{ duration: 0.6 }}
      />
      
      {/* Indicateur de réaction */}
      {reaction && (
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          className={`absolute top-2 right-2 text-2xl z-10 ${
            reaction === 'correct' ? 'animate-bounce' : 'animate-pulse'
          }`}
        >
          {reaction === 'correct' ? '✅' : reaction === 'incorrect' ? '❌' : '🤔'}
        </motion.div>
      )}
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
