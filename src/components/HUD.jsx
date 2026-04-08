import { useEffect, useState } from "react";
import "./UI.css";
import SponsorsPage from "./SponsorsPage.jsx";
import ContactPage from "./ContactPage.jsx";


export default function HUD() {
  const [firecrackers, setFirecrackers] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [promptText, setPromptText] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showSponsors, setShowSponsors] = useState(false);
  const [showContact, setShowContact] = useState(false);


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
                <p className="panel-subtitle">Latest updates from the core of the Verve ecosystem.</p>
                <div className="news-cards">
                    <div className="news-card bg-neon-pink">
                        <span className="news-badge">LATEST</span>
                        <h4>Cybernetics Track Announced</h4>
                        <p>Explore the future of man and machine with our new interactive tech labs.</p>
                    </div>
                    <div className="news-card bg-neon-blue">
                        <span className="news-badge">UPDATE</span>
                        <h4>Guest Speaker Reveal</h4>
                        <p>Industry leaders are set to take the main stage on Day 2.</p>
                    </div>
                </div>
                <button className="cyber-outline-btn mt-4">VIEW ALL NEWS</button>
            </div>
        )
    }

    if (type === "theme") {
        return (
            <div className="panel-content theme-content">
                <div className="theme-banner">
                    <h3 className="glitch-heading">A VORTEX OF VANDALISM</h3>
                </div>
                <div className="theme-text">
                    <p>
                        Step into the Vortex of Vandalism, where the polite silence of the norm is shattered by the raw, electric roar of rebellion. Channeling the gritty soul of counterculture, this year is a riot of unapologetic style, dripping with absolute chaos and punk-fueled energy.
                    </p>
                    <p>
                        We are here to deface the ordinary and embrace the anarchy of the new. It’s time to tear down the establishment and paint the town in the colors of disorder. <span className="highlight-text">Welcome to the revolution.</span>
                    </p>
                </div>
            </div>
        )
    }

    if (type === "about us") {
        return (
            <div className="panel-content about-content">
                <div className="about-header">
                    <h3 className="cyber-text">Who We Are</h3>
                </div>
                <div className="about-body">
                    <p className="lead-text">Verve 2k26 is an amalgamation of technology, culture, and chaos.</p>
                    <p>We are visionaries, designers, hackers, and creators breaking boundaries. From rogue algorithms to underground art styles, our community thrives on the edge of innovation. Join us to reshape reality and construct the unimaginable.</p>
                </div>
            </div>
        )
    }

    if (type === "history") {
        return (
            <div className="panel-content history-content">
                <div className="cyber-timeline">
                    <div className="timeline-node">
                        <div className="timeline-dot bg-cyan"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">2024: The Awakening</h4>
                            <p>Over 5000+ attendees joined the first tech symposium, laying the groundwork for our cyberpunk reality.</p>
                        </div>
                    </div>
                    <div className="timeline-node">
                        <div className="timeline-dot bg-magenta"></div>
                        <div className="timeline-content">
                            <h4 className="year-title">2025: Cyber Renaissance</h4>
                            <p>Introduced the AI robotics track, pushing the boundaries of human-machine interaction.</p>
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
          <a href="#">Schedule</a>
          <a href="#">Events</a>
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
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Schedule</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Events</a>
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
              <button className="btn-primary" style={{ background: '#' + activeBuilding.color.toString(16).padStart(6, '0') }}>
                {activeBuilding.action}
              </button>
              <button className="btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}

      {showSponsors && <SponsorsPage onClose={() => setShowSponsors(false)} />}
      {showContact && <ContactPage onClose={() => setShowContact(false)} />}
    </div>

  );
}
