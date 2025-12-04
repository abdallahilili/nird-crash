import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './ParticleSystem.css';

const ParticleSystem = ({ 
  active = false, 
  position = { x: 0, y: 0 }, 
  type = 'confetti',
  count = 30,
  colors = ['#FFD93D', '#4CAF50', '#2563EB', '#FF6B6B', '#9B59B6'],
  duration = 2000,
  onComplete = () => {}
}) => {
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    if (active) {
      // Generate particles
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: `particle-${Date.now()}-${i}`,
        color: colors[Math.floor(Math.random() * colors.length)],
        angle: (Math.random() * 360),
        velocity: 3 + Math.random() * 5,
        size: type === 'confetti' ? 8 + Math.random() * 6 : 4 + Math.random() * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
      }));
      
      setParticles(newParticles);

      // Clear particles after duration
      const timer = setTimeout(() => {
        setParticles([]);
        onComplete();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [active, count, colors, duration, type, onComplete]);

  if (!active || particles.length === 0) return null;

  return (
    <div 
      className="particle-system-container"
      style={{
        position: 'fixed',
        left: position.x,
        top: position.y,
        pointerEvents: 'none',
        zIndex: 1000,
      }}
    >
      <AnimatePresence>
        {particles.map((particle) => {
          // Calculate trajectory based on angle and velocity
          const radians = (particle.angle * Math.PI) / 180;
          const endX = Math.cos(radians) * particle.velocity * 100;
          const endY = Math.sin(radians) * particle.velocity * 100 + 200; // gravity effect

          return (
            <motion.div
              key={particle.id}
              className={`particle particle-${type}`}
              style={{
                position: 'absolute',
                width: particle.size,
                height: particle.size,
                backgroundColor: type === 'confetti' ? particle.color : undefined,
                borderRadius: type === 'star' ? '0%' : '50%',
              }}
              initial={{
                x: 0,
                y: 0,
                opacity: 1,
                rotate: particle.rotation,
                scale: 1,
              }}
              animate={{
                x: endX,
                y: endY,
                opacity: 0,
                rotate: particle.rotation + particle.rotationSpeed * 360,
                scale: type === 'confetti' ? 0.5 : 0,
              }}
              transition={{
                duration: duration / 1000,
                ease: [0.25, 0.46, 0.45, 0.94], // Custom easing
              }}
            >
              {type === 'star' && (
                <svg width={particle.size} height={particle.size} viewBox="0 0 24 24">
                  <path
                    fill={particle.color}
                    d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                  />
                </svg>
              )}
              {type === 'sparkle' && (
                <div
                  style={{
                    width: '100%',
                    height: '100%',
                    background: `radial-gradient(circle, ${particle.color} 0%, transparent 70%)`,
                  }}
                />
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};

export default ParticleSystem;
