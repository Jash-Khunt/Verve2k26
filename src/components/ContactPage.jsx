import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import "./UI.css";


const EVENT_HEADS = [
    { id: 1, src: "/eventHead/JeelKhunt.PNG", title: "Jeel Khunt", role: "Event Head", glow: "#ff006e" },
    { id: 3, src: "/eventHead/DhrumilGabani.jpg", title: "Dhrumil Gabani", role: "Event Head", glow: "#00f2fe" },
    { id: 2, src: "/eventHead/Jeel_Donga.jpg.jpeg", title: "Jeel Donga", role: "Event Head", glow: "#3a86ff" },
];

const SAWC = [
    { id: 5, src: "/SAWC/princeViradiya.jpeg", title: "Prince Viradiya", role: "GS", glow: "#00ffa5" },
    { id: 4, src: "/SAWC/krishee.jpg", title: "Krishee Mehta", role: "LR", glow: "#8338ec" },
    { id: 6, src: "/SAWC/ronak.jpeg", title: "Ronak Talaviya", role: "CS", glow: "#ff006e" },
];

function ImageCard({ item, index }) {
    const [loaded, setLoaded] = useState(false);
    const cardRef = useRef(null);

    useEffect(() => {
        gsap.fromTo(cardRef.current, 
            { opacity: 0, y: 30, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.1 * index, ease: "back.out(1.7)" }
        );
    }, [index]);

    return (
        <div className="sponsor-card contact-card" style={{ '--glow-color': item.glow }} ref={cardRef}>
            <div className="sponsor-card-inner">
                <div className="sponsor-image-wrapper">
                    <div className={`contact-image-overlay ${loaded ? 'hidden' : ''}`}>
                        <div className="loader-glitch"></div>
                    </div>

                    <img 
                        src={item.src} 
                        alt={item.title} 
                        className={`sponsor-image contact-image ${loaded ? 'loaded' : ''}`} 
                        onLoad={() => setLoaded(true)}
                    />
                </div>
                <div className="sponsor-info">
                    <h4 style={{ color: item.glow }}>{item.title}</h4>
                    <p>{item.role}</p>
                </div>
            </div>
        </div>
    );
}

export default function ContactPage({ onClose }) {
    return (
        <div className="sponsors-overlay">
            <div className="sponsors-container contact-container glass custom-scroll">
                <button className="sponsors-close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="sponsors-header">
                    <h2>CONTACT US</h2>
                    <p>The minds behind Verve 2k26.</p>
                </div>

                <div className="contact-section-title">
                    <h3 style={{ color: '#00f2fe', textAlign: 'center', marginBottom: '20px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}>SAWC COMMITTEE</h3>
                </div>
                <div className="sponsors-row sponsors-row--pair contact-grid">
                    {SAWC.map((item, idx) => <ImageCard key={item.id} item={item} index={idx + EVENT_HEADS.length} />)}
                </div>

                <div className="contact-section-title" style={{ marginTop: '40px' }}>
                    <h3 style={{ color: '#00ffa5', textAlign: 'center', marginBottom: '20px', fontFamily: 'Orbitron, sans-serif', letterSpacing: '2px' }}>EVENT HEADS</h3>
                </div>
                <div className="sponsors-row sponsors-row--pair contact-grid">
                    {EVENT_HEADS.map((item, idx) => <ImageCard key={item.id} item={item} index={idx} />)}
                </div>

            </div>
        </div>
    );
}
