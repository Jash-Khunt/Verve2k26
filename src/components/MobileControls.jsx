import { useState, useRef, useEffect } from "react";
import "./UI.css";

export default function MobileControls() {
  const [isMobile, setIsMobile] = useState(false);
  const [showTutorial, setShowTutorial] = useState(true);
  const joyRef = useRef(null);
  const baseRef = useRef(null);

  useEffect(() => {
    // Check if device supports touch
    const checkMobile = () => {
      setIsMobile(/Mobi|Android/i.test(navigator.userAgent) || navigator.maxTouchPoints > 0);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    // Hide tutorial after a while
    const timer = setTimeout(() => setShowTutorial(false), 6000);
    return () => {
      window.removeEventListener("resize", checkMobile);
      clearTimeout(timer);
    };
  }, []);

  const handleTouchStart = (e) => {
    e.preventDefault();
    setShowTutorial(false);
    updateJoystick(e.touches[0]);
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    updateJoystick(e.touches[0]);
  };

  const handleTouchEnd = (e) => {
    e.preventDefault();
    if (joyRef.current) {
      joyRef.current.style.transform = `translate(0px, 0px)`;
    }
    window.dispatchEvent(new CustomEvent("moveJoystick", { detail: { x: 0, y: 0 } }));
  };

  const updateJoystick = (touch) => {
    if (!baseRef.current || !joyRef.current) return;
    const rect = baseRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    let dx = touch.clientX - centerX;
    let dy = touch.clientY - centerY;
    const maxRadius = rect.width / 2;
    const distance = Math.min(Math.sqrt(dx * dx + dy * dy), maxRadius);
    const angle = Math.atan2(dy, dx);
    
    const limitedX = Math.cos(angle) * distance;
    const limitedY = Math.sin(angle) * distance;
    
    joyRef.current.style.transform = `translate(${limitedX}px, ${limitedY}px)`;
    
    // Normalize to -1 to 1
    window.dispatchEvent(new CustomEvent("moveJoystick", { detail: { x: limitedX / maxRadius, y: limitedY / maxRadius } }));
  };

  const handleJump = (e) => {
    e.preventDefault();
    e.stopPropagation();
    window.dispatchEvent(new CustomEvent("jump"));
  };

  if (!isMobile) return null;

  return (
    <div className="mobile-controls">
      {/* Joystick */}
      <div 
        className="joystick-base" 
        ref={baseRef}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <div className="joystick-stick" ref={joyRef}></div>
      </div>

      {/* Jump Button */}
      <div className="action-button jump-btn" onTouchStart={handleJump}>
        Jump
      </div>
    </div>
  );
}
