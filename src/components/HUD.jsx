import { useEffect, useState } from "react";
import "./UI.css";
import SponsorsPage from "./SponsorsPage.jsx";
import ContactPage from "./ContactPage.jsx";
import SchedulePage from "./SchedulePage.jsx";
import EventsPage from "./EventsPage.jsx";


export default function HUD() {
  const [firecrackers, setFirecrackers] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [promptText, setPromptText] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showContact, setShowContact] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [showEvents, setShowEvents] = useState(false);


  useEffect(() => {
    const handleFirecracker = (e) => setFirecrackers(e.detail);
    const handleBuilding = (e) => {
      setActiveBuilding(e.detail);
      setPromptText(null);
    };
    const handlePromptShow = (e) => setPromptText(e.detail);
    const handlePromptHide = () => setPromptText(null);

    window.addEventListener("updateFirecracker", handleFirecracker);
    window.addEventListener("updateBuilding", handleBuilding);
    window.addEventListener("showInteractionPrompt", handlePromptShow);
    window.addEventListener("hideInteractionPrompt", handlePromptHide);
    
    return () => {
      window.removeEventListener("updateFirecracker", handleFirecracker);
      window.removeEventListener("updateBuilding", handleBuilding);
      window.removeEventListener("showInteractionPrompt", handlePromptShow);
      window.removeEventListener("hideInteractionPrompt", handlePromptHide);
    };
  }, []);

  const handleLaunch = (e) => {
    if (e && e.preventDefault) e.preventDefault();
    if (e && e.stopPropagation) e.stopPropagation();
    if (firecrackers > 0) {
      window.dispatchEvent(new CustomEvent("launchFirecracker"));
    }
  };

  const handleClose = () => {
    window.dispatchEvent(new CustomEvent("closeBuilding"));
    setActiveBuilding(null);
  };

  const handleInteract = () => {
    window.dispatchEvent(new CustomEvent("triggerInteract"));
  };

  const handleNav = (buildingName) => {
      window.dispatchEvent(new CustomEvent("navigateToBuilding", { detail: buildingName }));
  };

  const renderPanelContent = () => {
    if (!activeBuilding) return null;
    
    const type = activeBuilding.title.toLowerCase();

    if (type === "headlines") {
        return (
            <div className="panel-content headlines-content">
                <p className="panel-subtitle">What's buzzing at Verve 2k26</p>
                <div className="news-cards">
                    <div className="news-card bg-neon-pink">
                        <span className="news-badge">🌸 OPEN INVITE</span>
                        <h4>Everyone Is Welcome!</h4>
                        <p>Verve 2k26 opens its doors to all — students, artists, creators & dreamers. No boundaries, just pure celebration. Come be part of something extraordinary!</p>
                    </div>
                    <div className="news-card bg-neon-blue">
                        <span className="news-badge">🔥 ANNOUNCEMENT</span>
                        <h4>Verve 2k26 Is Here!</h4>
                        <p>The most wonderful cultural extravaganza returns with a breathtaking new theme — Midnight Bloom. Three days of dancing, singing, drama, fashion & a star-studded celebrity night await you.</p>
                    </div>
                    <div className="news-card bg-neon-green">
                        <span className="news-badge">⭐ DAY 3 SPECIAL</span>
                        <h4>Celebrity Night Confirmed</h4>
                        <p>The grand finale on April 23rd promises an unforgettable celebrity night. Stay tuned for the big reveal!</p>
                    </div>
                    <div className="news-card bg-neon-purple">
                        <span className="news-badge">🎉 3 DAYS</span>
                        <h4>21st – 23rd April</h4>
                        <p>Fashion Show, Music Night, Drama, Dance Battles & the ultimate Celebrity Night — three days packed with non-stop energy and creativity.</p>
                    </div>
                </div>
            </div>
        )
    }

    if (type === "theme") {
        return (
            <div className="panel-content theme-content midnight-bloom-theme">
                <div className="theme-banner midnight-banner">
                    <div className="bloom-petals">
                        <span className="petal">🌸</span>
                        <span className="petal">✨</span>
                        <span className="petal">🌺</span>
                    </div>
                    <h3 className="bloom-heading">MIDNIGHT BLOOM</h3>
                    <div className="bloom-subtitle">Verve 2k26 Theme</div>
                </div>
                <div className="theme-text midnight-text">
                    <p>
                        When the world sleeps, creativity awakens. <span className="bloom-highlight">Midnight Bloom</span> is the theme of Verve 2k26 — a celebration of beauty that flourishes in darkness, of art that blossoms when no one is watching.
                    </p>
                    <p>
                        Like a rare flower that blooms only under the midnight sky, this fest is a tribute to the bold, the dreamers, and the ones who dare to shine in the dark. Every performance, every act, every moment is a petal unfolding under the stars.
                    </p>
                    <p className="bloom-closing">
                        🌙 Let the night bloom. Let your talent blossom. <span className="bloom-highlight">Welcome to Midnight Bloom.</span>
                    </p>
                </div>
            </div>
        )
    }


    if (type === "about us") {
        return (
            <div className="panel-content about-content">
                <div className="about-header">
                    <h3 className="cyber-text">What is Verve?</h3>
                </div>
                <div className="about-body">
                    <p className="lead-text">Verve is the flagship annual cultural festival — a grand celebration of art, talent, and creative expression.</p>
                    <p>Every year, Verve brings together thousands of students across colleges for three electrifying days of competition, performance, and pure entertainment. From its humble beginnings, it has grown into one of the most anticipated cultural extravaganzas.</p>
                    
                    <div className="about-highlights">
                        <div className="about-stat">
                            <span className="stat-icon">🎭</span>
                            <span className="stat-label">5+ Events</span>
                        </div>
                        <div className="about-stat">
                            <span className="stat-icon">📅</span>
                            <span className="stat-label">3 Days</span>
                        </div>
                        <div className="about-stat">
                            <span className="stat-icon">🌸</span>
                            <span className="stat-label">Midnight Bloom</span>
                        </div>
                    </div>

                    <p>This year's theme, <strong style={{color: '#c77dff'}}>Midnight Bloom</strong>, captures the essence of beauty that thrives in the dark — creativity, passion, and brilliance that blooms when the world isn't watching.</p>
                    <p>Whether you dance, sing, act, or simply love the vibe — <strong style={{color: '#00ffa5'}}>Verve is for you.</strong></p>
                </div>
            </div>
        )
    }

    if (type === "history") {
        return (
            <div className="panel-content history-content">
                <p className="panel-subtitle">The Legacy of Verve</p>
                <div className="cyber-timeline">
                    <div className="timeline-node">
                        <div className="timeline-dot bg-cyan"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">The Beginning</h4>
                            <p>Verve was born from a simple idea — give students a platform to express, compete, and celebrate. What started as a small cultural gathering quickly became the most talked-about fest on campus.</p>
                        </div>
                    </div>
                    <div className="timeline-node">
                        <div className="timeline-dot bg-magenta"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">Verve 2k24 — The Awakening</h4>
                            <p>The fest roared back to life with spectacular performances, packed auditoriums, and a sea of enthusiastic participants. Dance, drama, and music took center stage as Verve proved it was here to stay.</p>
                        </div>
                    </div>
                    <div className="timeline-node">
                        <div className="timeline-dot bg-gold"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">Verve 2k25 — Vortex of Vandalism</h4>
                            <p>Last year's punk-fueled theme shattered all expectations. With rebellious energy, underground art vibes, and a raw counterculture aesthetic, Verve 2k25 redefined what a college fest could be.</p>
                        </div>
                    </div>
                    <div className="timeline-node">
                        <div className="timeline-dot bg-bloom"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">Verve 2k26 — Midnight Bloom 🌸</h4>
                            <p>And now, we bloom. This year's theme embraces beauty in the dark — 3 days of fashion, dance, drama, music, and a grand celebrity night. The biggest Verve yet is upon us.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return <p className="default-desc">{activeBuilding.description}</p>;
  };

  return (
    <div className="ui-overlay">
      <span id="active-building-flag" style={{display: 'none'}}>{activeBuilding ? "true" : ""}</span>

      <div className="navbar">
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowSchedule(true); }}>Schedule</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowEvents(true); }}>Events</a>
        </div>
        <div className="nav-logo">
          <h1>VERVE</h1>
        </div>
        <div className="nav-links">
          <a href="#" onClick={(e) => { e.preventDefault(); setShowSponsors(true); }}>Sponsors</a>
          <a href="#" onClick={(e) => { e.preventDefault(); setShowContact(true); }}>Contact Us</a>

        </div>
        <div className={`hamburger ${mobileMenuOpen ? "active" : ""}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <span></span>
            <span></span>
            <span></span>
        </div>
      </div>

      {mobileMenuOpen && (
          <div className="mobile-menu-overlay glass">
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowSchedule(true); }}>Schedule</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowEvents(true); }}>Events</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowSponsors(true); }}>Sponsors</a>
              <a href="#" onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); setShowContact(true); }}>Contact Us</a>
          </div>

      )}

      {/* Modern Game Controls Panel */}
      <div className="instructions-panel game-theme-panel">
        <h3 className="cyber-title">CONTROLS</h3>
        <div className="control-list">
            <div className="control-item">
                <div className="keys-wrapper">
                    <kbd className="cyber-key">W</kbd>
                    <div className="key-row">
                        <kbd className="cyber-key">A</kbd>
                        <kbd className="cyber-key">S</kbd>
                        <kbd className="cyber-key">D</kbd>
                    </div>
                </div>
                <span className="control-desc">Move</span>
            </div>
            
            <div className="control-item">
                <div className="keys-wrapper align-center">
                   <kbd className="cyber-key space-key">SPACE</kbd>
                </div>
                <span className="control-desc">Jump</span>
            </div>
            
            <div className="control-item">
                <div className="mouse-icon">
                    <div className="mouse-wheel"></div>
                    <div className="mouse-left active"></div>
                </div>
                <span className="control-desc">Left Click to Move Camera</span>

            </div>
            
            <div className="control-item">
                <div className="keys-wrapper align-center">
                   <kbd className="cyber-key">F</kbd>
                </div>
                <span className="control-desc">Launch Rocket</span>
            </div>
        </div>
      </div>

      <div className="hud-top">
        <div className="hud-item" onClick={handleLaunch} onTouchStart={handleLaunch} style={{cursor: firecrackers > 0 ? "pointer" : "default"}}>
          <span className="hud-icon">🧨</span>
          <span className="hud-text">x {firecrackers} (Press F)</span>
        </div>
      </div>

      {/* Styled Fast Navigation Buttons */}
      <div className="bottom-nav">
          <button className="cyber-button" onClick={() => handleNav("Headlines")}><span>HEADLINES</span></button>
          <button className="cyber-button" onClick={() => handleNav("Theme")}><span>THEME</span></button>
          <button className="cyber-button" onClick={() => handleNav("About Us")}><span>ABOUT</span></button>
          <button className="cyber-button" onClick={() => handleNav("History")}><span>HISTORY</span></button>
      </div>

      {/* Disabled old style interactive E prompt, changed to visually match */}
      {promptText && !activeBuilding && (
        <div className="interaction-prompt cyber-prompt" onClick={handleInteract}>
          <kbd className="cyber-key small-key">E</kbd>
          <span>INTERACT: <strong>{promptText.toUpperCase()}</strong></span>
        </div>
      )}

      {activeBuilding && (
        <div className="building-panel-overlay">
            <div className="building-panel glass custom-scroll" style={{ borderColor: '#' + activeBuilding.color.toString(16).padStart(6, '0'), boxShadow: `0 0 30px #${activeBuilding.color.toString(16).padStart(6, '0')}88` }}>
              <h2 style={{ backgroundImage: `linear-gradient(to right, #${activeBuilding.color.toString(16).padStart(6, '0')}, #ffffff)` }}>
                {activeBuilding.title}
              </h2>
            
            <div className="panel-inner-content">
                {renderPanelContent()}
            </div>

            <div className="panel-actions">
              <button className="btn-primary" style={{ background: '#' + activeBuilding.color.toString(16).padStart(6, '0') }} onClick={() => {
                const type = activeBuilding.title.toLowerCase();
                if (type === 'about us') { handleClose(); setShowEvents(true); }
                else if (type === 'headlines') { handleClose(); setShowSchedule(true); }
                else handleClose();
              }}>
                {activeBuilding.action}
              </button>
              <button className="btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showSponsors && <SponsorsPage onClose={() => setShowSponsors(false)} />}
      {showContact && <ContactPage onClose={() => setShowContact(false)} />}
      {showSchedule && <SchedulePage onClose={() => setShowSchedule(false)} />}
      {showEvents && <EventsPage onClose={() => setShowEvents(false)} />}
    </div>

  );
}
