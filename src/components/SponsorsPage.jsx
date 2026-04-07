import "./UI.css";

const SPONSORS = [
    { id: 1, src: "/photo/first.png", title: "Platinum Sponsor", role: "Title Sponsor", glow: "#ff006e" },
    { id: 2, src: "/photo/second.png", title: "Gold Sponsor", role: "Co-Sponsor", glow: "#3a86ff" },
    { id: 3, src: "/photo/third.jpeg", title: "Gold Sponsor", role: "Tech Partner", glow: "#00f2fe" },
    { id: 4, src: "/photo/fourth.png", title: "Silver Sponsor", role: "Media Partner", glow: "#8338ec" },
    { id: 5, src: "/photo/fifth.png", title: "Silver Sponsor", role: "Beverage Partner", glow: "#00ffa5" }
];

export default function SponsorsPage({ onClose }) {
    const platinum = SPONSORS[0];
    const gold = SPONSORS.slice(1, 3);
    const silver = SPONSORS.slice(3, 5);

    return (
        <div className="sponsors-overlay">
            <div className="sponsors-container glass custom-scroll">
                <button className="sponsors-close-btn" onClick={onClose}>
                    &times;
                </button>
                <div className="sponsors-header">
                    <h2>OUR SPONSORS</h2>
                    <p>The visionaries powering Verve 2k26.</p>
                </div>

                {/* Platinum — single centered */}
                <div className="sponsors-row sponsors-row--single">
                    <div className="sponsor-card" style={{ '--glow-color': platinum.glow }}>
                        <div className="sponsor-card-inner">
                            <div className="sponsor-image-wrapper">
                                <img src={platinum.src} alt={platinum.role} className="sponsor-image" />
                            </div>
                            <div className="sponsor-info">
                                <h4 style={{ color: platinum.glow }}>{platinum.title}</h4>
                                <p>{platinum.role}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gold — 2 per row */}
                <div className="sponsors-row sponsors-row--pair">
                    {gold.map((s) => (
                        <div className="sponsor-card" key={s.id} style={{ '--glow-color': s.glow }}>
                            <div className="sponsor-card-inner">
                                <div className="sponsor-image-wrapper">
                                    <img src={s.src} alt={s.role} className="sponsor-image" />
                                </div>
                                <div className="sponsor-info">
                                    <h4 style={{ color: s.glow }}>{s.title}</h4>
                                    <p>{s.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Silver — 2 per row */}
                <div className="sponsors-row sponsors-row--pair">
                    {silver.map((s) => (
                        <div className="sponsor-card" key={s.id} style={{ '--glow-color': s.glow }}>
                            <div className="sponsor-card-inner">
                                <div className="sponsor-image-wrapper">
                                    <img src={s.src} alt={s.role} className="sponsor-image" />
                                </div>
                                <div className="sponsor-info">
                                    <h4 style={{ color: s.glow }}>{s.title}</h4>
                                    <p>{s.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
