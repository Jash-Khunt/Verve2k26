import { useEffect, useState } from "react";
import "./UI.css";

export default function HUD() {
  const [firecrackers, setFirecrackers] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [promptText, setPromptText] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  const handleLaunch = () => {
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
                <p>Latest updates from the core of the Verve ecosystem.</p>
                <div className="image-grid">
                    <div className="image-placeholder bg-pink">Photo 1</div>
                    <div className="image-placeholder bg-blue">Photo 2</div>
                </div>
                <button className="view-all-btn">View All News</button>
            </div>
        )
    }

    if (type === "theme") {
        return (
            <div className="panel-content theme-content">
                <h3>A VORTEX OF VANDALISM</h3>
                <p>
                Step into the Vortex of Vandalism, where the polite silence of the norm is shattered by the raw, electric roar of rebellion. Channeling the gritty soul of counterculture, this year is a riot of unapologetic style, dripping with absolute chaos and punk-fueled energy.
                </p>
                <p>
                We are here to deface the ordinary and embrace the anarchy of the new. It’s time to tear down the establishment and paint the town in the colors of disorder. Welcome to the revolution.
                </p>
            </div>
        )
    }

    if (type === "about us") {
        return (
            <div className="panel-content about-content">
                <h3>Who We Are</h3>
                <p>Verve 2k26 is an amalgamation of technology, culture, and chaos. We are visionaries, designers, hackers, and creators breaking boundaries.</p>
            </div>
        )
    }

    if (type === "history") {
        return (
            <div className="panel-content history-content">
                <div className="timeline-item">
                    <h4>2024: The Awakening</h4>
                    <p>Over 5000+ attendees joined the tech symposium.</p>
                </div>
                <div className="timeline-item">
                    <h4>2025: Cyber Renaissance</h4>
                    <p>Introduced AI robotics track.</p>
                </div>
            </div>
        )
    }

    return <p>{activeBuilding.description}</p>;
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
          <a href="#">Sponsors</a>
          <a href="#">Contact Us</a>
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
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Sponsors</a>
              <a href="#" onClick={() => setMobileMenuOpen(false)}>Contact Us</a>
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
                    <div className="mouse-right active"></div>
                </div>
                <span className="control-desc">Right Click to Move Camera</span>
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
        <div className="hud-item" onClick={handleLaunch} style={{cursor: firecrackers > 0 ? "pointer" : "default"}}>
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
          <div className="building-panel glass custom-scroll" style={{ borderColor: '#' + activeBuilding.color.toString(16), boxShadow: `0 0 30px #${activeBuilding.color.toString(16)}88` }}>
            <h2 style={{ background: `linear-gradient(to right, #${activeBuilding.color.toString(16)}, #ffffff)` }}>
              {activeBuilding.title}
            </h2>
            
            <div className="panel-inner-content">
                {renderPanelContent()}
            </div>

            <div className="panel-actions">
              <button className="btn-primary" style={{ background: '#' + activeBuilding.color.toString(16) }}>
                {activeBuilding.action}
              </button>
              <button className="btn-secondary" onClick={handleClose}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
