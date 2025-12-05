import React from 'react';
import { motion } from 'framer-motion';

const Director = ({ emotion }) => {
  // Mauritanian Colors
  const colors = {
    skin: "#F5D0A9",
    suitDark: "#2C3E50",
    suitLight: "#34495E",
    shirt: "#FFFFFF",
    tie: "#D35400",
    mauritanianGreen: "#00843D",
    mauritanianGold: "#FFC72C",
    mauritanianRed: "#D01C1F",
  };

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full max-w-[400px] max-h-[400px] drop-shadow-2xl"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* --- BACKGROUND ELEMENTS --- */}
        
        {/* Happy Sun Rays */}
        {emotion === 'happy' && (
          <motion.g
            initial={{ opacity: 0, scale: 0.5, rotate: 0 }}
            animate={{ opacity: 1, scale: 1.2, rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="origin-center"
            style={{ transformOrigin: "200px 200px" }}
          >
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg) => (
              <rect
                key={deg}
                x="195"
                y="0"
                width="10"
                height="400"
                fill={colors.mauritanianGold}
                opacity="0.15"
                transform={`rotate(${deg} 200 200)`}
              />
            ))}
          </motion.g>
        )}

        {/* Sad Storm Clouds */}
        {emotion === 'sad' && (
          <motion.g
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            <path
              d="M50,90 Q80,50 120,70 Q160,30 220,60 Q260,40 300,80 Q340,70 350,110 L50,110 Z"
              fill="#4A5568"
            />
            {/* Rain */}
            {[1, 2, 3, 4, 5].map((i) => (
              <motion.path
                key={i}
                d={`M${80 + i * 50},120 L${70 + i * 50},150`}
                stroke="#63B3ED"
                strokeWidth="2"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 30, opacity: [0, 1, 0] }}
                transition={{ repeat: Infinity, duration: 1, delay: i * 0.2, ease: "linear" }}
              />
            ))}
          </motion.g>
        )}

        {/* --- CHARACTER BODY --- */}
        
        <g transform="translate(0, 20)">
            {/* Torso/Suit */}
            <path d="M120,380 L120,250 Q120,220 150,220 L250,220 Q280,220 280,250 L280,380 Z" fill={colors.suitDark} />
            <path d="M190,220 L210,220 L210,380 L190,380 Z" fill={colors.suitLight} />
            
            {/* Shirt Collar */}
            <path d="M170,220 L200,250 L230,220" fill={colors.shirt} />
            
            {/* Tie */}
            <path d="M200,220 L190,230 L200,260 L210,230 Z" fill={colors.tie} />

            {/* Head */}
            <motion.ellipse 
                cx="200" cy="150" rx="60" ry="70" 
                fill={colors.skin} 
                initial={{ y: 0 }}
                animate={emotion === 'sad' ? { y: 15, rotate: 5 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 50 }}
            />

            {/* Hair */}
            <path d="M140,150 Q140,80 200,80 Q260,80 260,150 Q260,110 240,100 Q200,100 140,150" fill="#2D3748" />


            {/* --- FACIAL FEATURES --- */}

            {/* Eyes: Thinking */}
            {emotion === 'thinking' && (
            <g>
                <circle cx="180" cy="140" r="5" fill="#333" />
                <circle cx="220" cy="140" r="5" fill="#333" />
                <path d="M170,130 Q180,120 190,130" stroke="#333" strokeWidth="2" fill="none" />
                <path d="M210,130 Q220,120 230,130" stroke="#333" strokeWidth="2" fill="none" />
            </g>
            )}

            {/* Eyes: Sad (X eyes or closed down) */}
            {emotion === 'sad' && (
                <g transform="translate(0, 15)">
                    <path d="M170,140 Q180,135 190,140" stroke="#333" strokeWidth="3" fill="none" />
                    <path d="M210,140 Q220,135 230,140" stroke="#333" strokeWidth="3" fill="none" />
                    {/* Tear */}
                    <motion.circle
                        cx="230" cy="155" r="4"
                        fill="#63B3ED"
                        animate={{ y: [0, 20], opacity: [1, 0] }}
                        transition={{ repeat: Infinity, duration: 2, delay: 1 }}
                    />
                </g>
            )}

            {/* Eyes: Happy (Arcs) */}
            {emotion === 'happy' && (
            <g>
                <motion.path 
                    d="M170,145 Q180,130 190,145" stroke="#333" strokeWidth="3" fill="none" 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                />
                <motion.path 
                    d="M210,145 Q220,130 230,145" stroke="#333" strokeWidth="3" fill="none" 
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                />
            </g>
            )}

            {/* Mouth */}
            {emotion === 'thinking' && (
            <path d="M190,180 L210,180" stroke="#333" strokeWidth="2" />
            )}
            {emotion === 'sad' && (
            <path d="M180,185 Q200,165 220,185" stroke="#333" strokeWidth="3" fill="none" transform="translate(0, 15)" />
            )}
            {emotion === 'happy' && (
            <path d="M180,170 Q200,200 220,170" fill="#FFF" stroke="#333" strokeWidth="1" />
            )}
        </g>

        {/* --- ARMS & PROPS --- */}

        {/* Thinking Arm (Hand on chin) */}
        {emotion === 'thinking' && (
          <g transform="translate(0, 20)">
            <path d="M240,250 Q270,200 220,190" stroke={colors.suitDark} strokeWidth="20" strokeLinecap="round" fill="none" />
            <circle cx="220" cy="190" r="15" fill={colors.skin} />
            {/* Question Mark */}
            <motion.text
              x="260"
              y="120"
              fontSize="60"
              fill={colors.mauritanianGreen}
              fontWeight="bold"
              animate={{ y: [0, -10, 0], rotate: [0, 10, -10, 0], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              ?
            </motion.text>
          </g>
        )}

        {/* Sad Arms (Empty Pockets) */}
        {emotion === 'sad' && (
          <g transform="translate(0, 20)">
            {/* Arms hanging down */}
            <path d="M120,230 Q90,300 110,350" stroke={colors.suitDark} strokeWidth="25" strokeLinecap="round" fill="none" />
            <path d="M280,230 Q310,300 290,350" stroke={colors.suitDark} strokeWidth="25" strokeLinecap="round" fill="none" />
            
            {/* Empty pockets turned out */}
            <motion.path 
                d="M125,320 L110,360 L140,360 Z" 
                fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1"
                animate={{ rotate: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            />
            <motion.path 
                d="M275,320 L260,360 L290,360 Z" 
                fill="#E2E8F0" stroke="#CBD5E0" strokeWidth="1"
                animate={{ rotate: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 3, delay: 0.5, ease: "easeInOut" }}
            />

            {/* Money flying away - bills with wings */}
            <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {[1, 2, 3].map((i) => (
                    <motion.g
                        key={i}
                        initial={{ x: 280, y: 320, opacity: 1, scale: 0.5 }}
                        animate={{ x: 350 + i * 30, y: 50 - i * 20, opacity: 0, scale: 0.8, rotate: 20 }}
                        transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.8 }}
                    >
                         <text fontSize="24">💸</text>
                    </motion.g>
                ))}
            </motion.g>
          </g>
        )}

        {/* Happy Arms (Victory & Money Rain) */}
        {emotion === 'happy' && (
          <g>
            <g transform="translate(0, 20)">
                {/* Arms raised high */}
                <motion.path 
                    d="M130,240 Q90,200 100,140" 
                    stroke={colors.suitDark} strokeWidth="25" strokeLinecap="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                />
                <motion.path 
                    d="M270,240 Q310,200 300,140" 
                    stroke={colors.suitDark} strokeWidth="25" strokeLinecap="round" fill="none"
                    initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.5 }}
                />
                
                {/* Money Bag in Hand */}
                <motion.g
                    initial={{ scale: 0, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    transition={{ delay: 0.3, type: "spring" }}
                    transform="translate(260, 100)"
                >
                    <path d="M0,20 Q-20,80 20,80 Q60,80 40,20 L20,0 Z" fill={colors.mauritanianGold} stroke="#DAA520" strokeWidth="2" />
                    <text x="10" y="60" fontSize="24" fill="#FFF" fontWeight="bold" textAnchor="middle">UM</text>
                </motion.g>

                {/* Flag Badge on lapel */}
                <circle cx="230" cy="250" r="10" fill={colors.mauritanianGreen} />
                <path d="M225,245 Q230,255 235,245" stroke={colors.mauritanianGold} strokeWidth="2" fill="none" />
            </g>

            {/* RAINING MONEY EFFECT */}
            {[...Array(10)].map((_, i) => (
                <motion.text
                    key={`rain-${i}`}
                    x={Math.random() * 300 + 50}
                    y={-50}
                    fontSize={Math.random() * 15 + 15}
                    initial={{ y: -50, opacity: 0, rotate: 0 }}
                    animate={{ 
                        y: 400, 
                        opacity: [0, 1, 1, 0], 
                        rotate: Math.random() * 360 
                    }}
                    transition={{ 
                        repeat: Infinity, 
                        duration: Math.random() * 2 + 1.5, 
                        delay: Math.random() * 2,
                        ease: "linear"
                    }}
                >
                    💵
                </motion.text>
            ))}
          </g>
        )}

      </svg>
    </div>
  );
};

export default Director;
