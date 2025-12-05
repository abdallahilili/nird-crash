import { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, BookOpen, Target, Users, Lightbulb, ArrowRight, Pause } from 'lucide-react';
import nirdPresentationVideo from "../../assets/videos/video2.mp4";
// import posterImage from '../assets/video/poster.jpg'; // Optionnel: image de prévisualisation
import './WelcomePage.css';

// src\assets\videos\video1.mp4
const WelcomePage = ({ onStartGame }) => {
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const videoRef = useRef(null);

  const handlePlayPause = () => {
    if (videoRef.current) {
      if (isVideoPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsVideoPlaying(!isVideoPlaying);
    }
  };

  const handleVideoEnd = () => {
    setIsVideoPlaying(false);
  };

  const features = [
    {
      icon: <Target className="w-8 h-8" />,
      title: 'Découvrez le NIRD',
      description: 'Apprenez les valeurs et la mission du Nouvel Institut de Recherche Digitale'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'Jeu Éducatif',
      description: 'Trouvez des mots, résolvez des énigmes et progressez à travers les niveaux'
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: 'Communauté',
      description: 'Rejoignez une communauté passionnée par l\'innovation et la recherche'
    },
    {
      icon: <Lightbulb className="w-8 h-8" />,
      title: 'Innovation',
      description: 'Explorez les concepts clés de l\'innovation digitale et technologique'
    }
  ];

  return (
    <div className="welcome-page">
      {/* Hero Section */}
      <motion.section 
        className="welcome-hero"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="hero-content">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="hero-logo"
          >
            <span className="logo-icon-large">🎯</span>
            <h1 className="hero-title">NIRD Crash</h1>
          </motion.div>
          
          <motion.p 
            className="hero-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            Découvrez le Nouvel Institut de Recherche Digitale à travers un jeu interactif et éducatif
          </motion.p>

          <motion.button
            className="btn btn-primary btn-hero"
            onClick={onStartGame}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Commencer l'aventure</span>
            <ArrowRight className="w-5 h-5" />
          </motion.button>
        </div>
      </motion.section>

      {/* Video Section */}
      <motion.section 
        className="welcome-video-section"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
      >
        <div className="video-container">
          <h2 className="section-title">
            <Play className="w-6 h-6" />
            Présentation du NIRD
          </h2>
          
          <div className="video-wrapper">
            <div className="local-video-container">
              <video
                ref={videoRef}
                className="local-video"
                controls
                // poster={posterImage} // Optionnel: image de prévisualisation
                onEnded={handleVideoEnd}
                onPlay={() => setIsVideoPlaying(true)}
                onPause={() => setIsVideoPlaying(false)}
              >
                <source src={nirdPresentationVideo} type="video/mp4" />
                <source src={nirdPresentationVideo.replace('.mp4', '.webm')} type="video/webm" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              
              {/* Bouton de lecture personnalisé (optionnel) */}
              {!isVideoPlaying && (
                <motion.button
                  className="custom-play-button"
                  onClick={handlePlayPause}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Play className="w-12 h-12" />
                </motion.button>
              )}
              
              {/* Contrôles personnalisés (optionnel) */}
              <div className="video-controls">
                <button 
                  className="control-btn"
                  onClick={handlePlayPause}
                  aria-label={isVideoPlaying ? "Pause" : "Lecture"}
                >
                  {isVideoPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
          
          <p className="video-description">
            Découvrez en vidéo la mission et les valeurs du Nouvel Institut de Recherche Digitale
          </p>
        </div>
      </motion.section>

      {/* About NIRD Section */}
      <motion.section 
        className="welcome-about"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        <div className="about-container">
          <h2 className="section-title">À propos du NIRD</h2>
          
          <div className="about-content">
            <div className="about-text">
              <p className="about-paragraph">
                Le <strong>Nouvel Institut de Recherche Digitale (NIRD)</strong> est une organisation 
                dédiée à l'innovation, à la recherche et au développement de solutions numériques 
                pour répondre aux défis contemporains.
              </p>
              
              <p className="about-paragraph">
                Notre mission est de promouvoir l'excellence dans la recherche digitale, de favoriser 
                la collaboration entre les différents acteurs du secteur, et de contribuer au 
                développement d'une société plus connectée et innovante.
              </p>

              <div className="about-values">
                <h3 className="values-title">Nos Valeurs</h3>
                <ul className="values-list">
                  <li>✨ <strong>Innovation</strong> - Penser différemment, créer l'avenir</li>
                  <li>🤝 <strong>Collaboration</strong> - Ensemble, nous sommes plus forts</li>
                  <li>🌱 <strong>Durabilité</strong> - Des solutions responsables pour demain</li>
                  <li>🎯 <strong>Excellence</strong> - La qualité avant tout</li>
                  <li>🌍 <strong>Impact</strong> - Créer un changement positif</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Features Section */}
      <motion.section 
        className="welcome-features"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <div className="features-container">
          <h2 className="section-title">Pourquoi jouer à NIRD Crash ?</h2>
          
          <div className="features-grid">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.4 + index * 0.1 }}
                whileHover={{ y: -8, scale: 1.02 }}
              >
                <div className="feature-icon">
                  {feature.icon}
                </div>
                <h3 className="feature-title">{feature.title}</h3>
                <p className="feature-description">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* CTA Section */}
      <motion.section 
        className="welcome-cta"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.6 }}
      >
        <div className="cta-container">
          <h2 className="cta-title">Prêt à commencer ?</h2>
          <p className="cta-description">
            Rejoignez l'aventure NIRD et découvrez un monde d'innovation et de découvertes !
          </p>
          <motion.button
            className="btn btn-primary btn-large btn-cta"
            onClick={onStartGame}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <span>Lancer le jeu</span>
            <ArrowRight className="w-6 h-6" />
          </motion.button>
        </div>
      </motion.section>
    </div>
  );
};

export default WelcomePage;