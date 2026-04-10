import { useEffect, useRef } from "react";
import gsap from "gsap";
import "./UI.css";

const SCHEDULE = [
  {
    day: "Day 1",
    date: "21st April",
    tagline: "Where Style Meets Sound",
    events: [
      { name: "Fashion Show", emoji: "👗", time: "5:00 PM - 7:00 PM", description: "Glamour, style, and attitude — watch the trendsetters own the runway under the midnight sky." },
      { name: "Music Night", emoji: "🎵", time: "7:30 PM - 10:00 PM", description: "Feel the beats reverberate through your veins as live artists set the night on fire." }
    ],
    color: "#ff006e",
    glowColor: "rgba(255, 0, 110, 0.3)"
  },
  {
    day: "Day 2",
    date: "22nd April",
    tagline: "Drama. Dance. Domination.",
    events: [
      { name: "Drama Performances", emoji: "🎭", time: "3:00 PM - 5:30 PM", description: "Stories that stir souls — witness powerful acts that blur the line between stage and reality." },
      { name: "Dance Battles", emoji: "💃", time: "6:00 PM - 9:00 PM", description: "Crews collide, moves ignite, and the floor becomes a battleground of rhythm and passion." }
    ],
    color: "#8338ec",
    glowColor: "rgba(131, 56, 236, 0.3)"
  },
  {
    day: "Day 3",
    date: "23rd April",
    tagline: "The Grand Finale",
    events: [
      { name: "Celebrity Night", emoji: "⭐", time: "6:00 PM - 10:00 PM", description: "The ultimate crescendo — a star-studded night to close Verve 2k26 in legendary fashion." }
    ],
    color: "#00f2fe",
    glowColor: "rgba(0, 242, 254, 0.3)"
  }
];

export default function SchedulePage({ onClose }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const cards = containerRef.current?.querySelectorAll(".schedule-day-card");
    if (cards) {
      gsap.fromTo(cards,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, stagger: 0.15, ease: "back.out(1.4)" }
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
          <h2>EVENT SCHEDULE</h2>
          <p>3 Days of Culture, Creativity & Celebration</p>
        </div>

        <div className="schedule-timeline">
          {SCHEDULE.map((day, index) => (
            <div className="schedule-day-card" key={index} style={{ '--day-color': day.color, '--day-glow': day.glowColor }}>
              <div className="schedule-day-header">
                <div className="schedule-day-badge" style={{ background: day.color }}>
                  {day.day}
                </div>
                <div className="schedule-day-info">
                  <h3 className="schedule-date">{day.date}</h3>
                  <span className="schedule-tagline">{day.tagline}</span>
                </div>
              </div>

              <div className="schedule-events-list">
                {day.events.map((event, i) => (
                  <div className="schedule-event-item" key={i}>
                    <div className="schedule-event-emoji">{event.emoji}</div>
                    <div className="schedule-event-details">
                      <div className="schedule-event-top">
                        <h4>{event.name}</h4>
                        <span className="schedule-event-time">{event.time}</span>
                      </div>
                      <p>{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Decorative connector line */}
              {index < SCHEDULE.length - 1 && (
                <div className="schedule-connector">
                  <div className="schedule-connector-line" style={{ background: `linear-gradient(${day.color}, ${SCHEDULE[index + 1].color})` }}></div>
                  <div className="schedule-connector-dot" style={{ background: SCHEDULE[index + 1].color, boxShadow: `0 0 10px ${SCHEDULE[index + 1].color}` }}></div>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="schedule-footer">
          <p>🌸 Theme: <strong>Midnight Bloom</strong> — Where creativity blossoms under the stars</p>
        </div>
      </div>
    </div>
  );
}
