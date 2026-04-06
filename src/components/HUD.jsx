import { useEffect, useState } from "react";
import "./UI.css";

export default function HUD() {
  const [firecrackers, setFirecrackers] = useState(0);
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [promptText, setPromptText] = useState(null);

  useEffect(() => {
    const handleFirecracker = (e) => setFirecrackers(e.detail);
    const handleBuilding = (e) => {
      setActiveBuilding(e.detail); // detail: { title, desc, action, color } or null
      setPromptText(null);
    };
    const handlePromptShow = (e) => setPromptText(e.detail); // e.detail is title string
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

  return (
    <div className="ui-overlay">
      {/* Hidden flag for THREEJS to know if panel is open */}
      <span id="active-building-flag" style={{display: 'none'}}>{activeBuilding ? "true" : ""}</span>

      {/* Modern Navbar */}
      <div className="navbar glass">
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
      </div>

      {/* Top Bar Stats */}
      <div className="hud-top">
        <div className="hud-item" onClick={handleLaunch} style={{cursor: firecrackers > 0 ? "pointer" : "default"}}>
          <span className="hud-icon">🧨</span>
          <span className="hud-text">{firecrackers} Launch!</span>
        </div>
      </div>

      {/* Interaction Prompt (Bottom center) */}
      {promptText && !activeBuilding && (
        <div className="interaction-prompt pulse" onClick={handleInteract}>
          <span className="key-hint">E</span> or Tap to interact with <strong>{promptText}</strong>
        </div>
      )}

      {/* Building Panel */}
      {activeBuilding && (
        <div className="building-panel-overlay">
          <div className="building-panel glass" style={{ borderColor: '#' + activeBuilding.color.toString(16) }}>
            <h2 style={{ background: `linear-gradient(to right, #${activeBuilding.color.toString(16)}, #ffffff)` }}>
              {activeBuilding.title}
            </h2>
            <p>{activeBuilding.description}</p>
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
