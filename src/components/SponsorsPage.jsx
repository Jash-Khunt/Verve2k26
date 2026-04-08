import "./UI.css";

const SPONSORS = [
    { id: 1, src: "/photo/1.png", title: "On track education by mamta jain", role: "Title Sponsor", glow: "#ff006e" },
    { id: 2, src: "/photo/2.png", title: "Yarittu", role: "Clothing Partner", glow: "#3a86ff" },
    { id: 3, src: "/photo/5.jpeg", title: "Meet Makeover", role: "MakeUp Partner", glow: "#8338ec" },
    { id: 4, src: "/photo/4.png", title: "The Old Roastery", role: "Stall Partner", glow: "#00ffa5" },
    { id: 5, src: "/photo/3.jpeg", title: "Book Heaven", role: "Stall Partner", glow: "#00ffa5" },
    { id: 6, src: "/photo/6.png", title: "Chetan Immitation", role: "Jewellery Partner", glow: "#00f2fe" }
];

export default function SponsorsPage({ onClose }) {
    const platinum = SPONSORS.slice(0, 2);
    const gold = SPONSORS.slice(2, 4);
    const silver = SPONSORS.slice(4, 6);

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
                <div className="sponsors-row sponsors-row--pair">
                    {platinum.map((s) => (
                        <div className="sponsor-card" key={s.id} style={{ '--glow-color': s.glow }}>
                            <div className="sponsor-card-inner">
                                <div className="sponsor-image-wrapper">
                                    <img src={s.src} alt={s.role} className="sponsor-image" />
                                </div>
                                <div className="sponsor-info">
                                    <h4 style={{ color: s.glow, margin: '0 0 5px 0' }}>{s.title}</h4>
                                    <p>{s.role}</p>
                                </div>
                            </div>
                        </div>
                    ))}
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
                                    <h4 style={{ color: s.glow, margin: '0 0 5px 0' }}>{s.title}</h4>
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
                                    <h4 style={{ color: s.glow, margin: '0 0 5px 0' }}>{s.title}</h4>
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
