import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./UI.css";

const EVENTS = [
  {
    id: 1,
    name: "Dancing",
    emoji: "💃",
    tagline: "Move. Groove. Conquer.",
    description: "From classical to hip-hop, solo to crew — the stage is set for dancers to unleash their art. Compete, collaborate, and let every beat tell your story through movement.",
    highlights: ["Solo Dance", "Group Dance", "Dance Battle"],
    color: "#ff006e",
    gradient: "linear-gradient(135deg, #ff006e, #ff4d94)"
  },
  {
    id: 2,
    name: "Singing",
    emoji: "🎤",
    tagline: "Your Voice. Your Stage.",
    description: "Whether you're a soulful crooner or a rock powerhouse, the mic is yours. Solo artists and bands take center stage in a night that celebrates the power of voice.",
    highlights: ["Solo Singing", "Duet", "Band Performance"],
    color: "#3a86ff",
    gradient: "linear-gradient(135deg, #3a86ff, #6ba3ff)"
  },
  {
    id: 3,
    name: "Drama",
    emoji: "🎭",
    tagline: "Act. Feel. Transform.",
    description: "Step into another world. From gripping monologues to full-cast plays, drama at Verve pushes boundaries and provokes thought. Every performance is a journey.",
    highlights: ["One Act Play", "Street Play", "Monologue"],
    color: "#8338ec",
    gradient: "linear-gradient(135deg, #8338ec, #a56cf5)"
  },
  {
    id: 4,
    name: "Fashion Show",
    emoji: "👗",
    tagline: "Style Without Limits.",
    description: "The runway comes alive with bold designs, daring themes, and unforgettable walks. Teams bring their creative vision to life in a spectacle of fabric, light, and attitude.",
    highlights: ["Theme Round", "Western Wear", "Traditional Fusion"],
    color: "#00ffa5",
    gradient: "linear-gradient(135deg, #00ffa5, #33ffc0)"
  },
  {
    id: 5,
    name: "Celebrity Night",
    emoji: "⭐",
    tagline: "The Night You Won't Forget.",
    description: "The grand finale of Verve 2k26. A star-studded evening with live performances by celebrated artists, lighting up the stage and closing the fest in legendary style.",
    highlights: ["Live Concert", "Celebrity Meet", "Grand Finale"],
    color: "#ffd700",
    gradient: "linear-gradient(135deg, #ffd700, #ffed4a)"
  }
];

export default function EventsPage({ onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".event-showcase-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 40, rotateX: 10 },
        { opacity: 1, y: 0, rotateX: 0, duration: 0.5, stagger: 0.1, ease: "power3.out" }
      );
    }
  }, []);

  return (
    <div className="sponsors-overlay">
      <div className="sponsors-container glass custom-scroll" ref={containerRef}>
        <button className="sponsors-close-btn" onClick={onClose}>
          &times;
        </button>
        <div className="sponsors-header">
          <h2>EVENTS</h2>
          <p>Compete. Create. Celebrate.</p>
        </div>

        <div className="events-showcase-grid">
          {EVENTS.map((event) => (
            <div className="event-showcase-card" key={event.id} style={{ '--event-color': event.color, '--event-gradient': event.gradient }}>
              <div className="event-card-glow"></div>
              <div className="event-card-content">
                <div className="event-card-icon">{event.emoji}</div>
                <h3 className="event-card-title">{event.name}</h3>
                <span className="event-card-tagline">{event.tagline}</span>
                <p className="event-card-desc">{event.description}</p>
                <div className="event-card-highlights">
                  {event.highlights.map((h, i) => (
                    <span className="event-highlight-tag" key={i} style={{ borderColor: event.color, color: event.color }}>{h}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
