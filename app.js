const App = () => {
  const [showUsernameInput, setShowUsernameInput] = React.useState(false);
  const [showSpectateModal, setShowSpectateModal] = React.useState(false);
  const [showOfflineModal, setShowOfflineModal] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [isMatchmaking, setIsMatchmaking] = React.useState(false);
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    const symbols = [
      "π", "∑", "∫", "√", "∞", "≠", "≈", "±", "÷", "×",
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "=", "+", "-", "α", "β", "γ", "θ", "λ", "Δ", "Ω","(","}",")"
    ];

    const particles = [];
    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 20 + 10,
        speed: Math.random() * 0.5 + 0.1,
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        opacity: Math.random() * 0.5 + 0.1,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01
      });
    }

    const polygons = [];
    for (let i = 0; i < 30; i++) {
      polygons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 15,
        sides: Math.floor(Math.random() * 5) + 3,
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.05,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      polygons.forEach(polygon => {
        ctx.save();
        ctx.globalAlpha = polygon.opacity;
        ctx.strokeStyle = "#8cb55a";
        ctx.lineWidth = 1;

        ctx.translate(polygon.x, polygon.y);
        ctx.rotate(polygon.rotation);

        ctx.beginPath();
        for (let i = 0; i < polygon.sides; i++) {
          const angle = (Math.PI * 2 * i) / polygon.sides;
          const x = polygon.size * Math.cos(angle);
          const y = polygon.size * Math.sin(angle);

          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.closePath();
        ctx.stroke();
        ctx.restore();

        polygon.y += polygon.speed;
        polygon.rotation += polygon.rotationSpeed;

        if (polygon.y - polygon.size > canvas.height) {
          polygon.y = -polygon.size;
          polygon.x = Math.random() * canvas.width;
        }
      });

      particles.forEach(particle => {
        ctx.save();
        ctx.globalAlpha = particle.opacity;
        ctx.fillStyle = "#ffffff";
        ctx.font = `${particle.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        ctx.translate(particle.x, particle.y);
        ctx.rotate(particle.rotation);
        ctx.fillText(particle.symbol, 0, 0);
        ctx.restore();

        particle.y += particle.speed;
        particle.rotation += particle.rotationSpeed;

        if (particle.y - particle.size > canvas.height) {
          particle.y = -particle.size;
          particle.x = Math.random() * canvas.width;
        }
      });

      requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const liveMatches = [
    { id: 1, player1: "Alice", player2: "Bob", status: "In Progress" },
    { id: 2, player1: "Charlie", player2: "David", status: "Waiting for Player" },
    { id: 3, player1: "Eve", player2: "Frank", status: "In Progress" }
  ];

  const handleQuickMatch = () => {
    setShowUsernameInput(true);
  };

  const handleSpectate = () => {
    setShowSpectateModal(true);
  };

  const handleOfflineMatch = () => {
    setShowOfflineModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (username.trim()) {
      setShowUsernameInput(false);
      setIsMatchmaking(true);

      // Simulate match search (replace with actual backend matchmaking later)
      setTimeout(() => {
        console.log("Match found for", username);
        setIsMatchmaking(false);
        // Navigate to game or update state here
      }, 3000);
    }
  };

  return (
    <div className="app">
      <div className="canvas-container">
        <canvas ref={canvasRef} className="canvas-background"></canvas>
      </div>

      <div className="content">
        <div className="card">
          <h1 className="title">LET'S DUEL</h1>

          <div className="button-container">
            <button onClick={handleQuickMatch} className="button">QUICKMATCH</button>
            <button onClick={handleSpectate} className="button">SPECTATE</button>
            <button onClick={handleOfflineMatch} className="button">OFFLINE MATCH</button>
          </div>
        </div>
      </div>

      {showUsernameInput && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Enter Username</h2>
              <button onClick={() => setShowUsernameInput(false)} className="close-button">×</button>
            </div>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your username"
                className="input"
                autoFocus
              />
              <button type="submit" className="button">START MATCH</button>
            </form>
          </div>
        </div>
      )}

      {showSpectateModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Live Matches</h2>
              <button onClick={() => setShowSpectateModal(false)} className="close-button">×</button>
            </div>
            <ul style={{ listStyle: "none", padding: 0 }}>
              {liveMatches.map((match) => (
                <li key={match.id} className="card" style={{ marginBottom: "1rem" }}>
                  <p><strong>{match.player1}</strong> vs <strong>{match.player2}</strong></p>
                  <p>Status: {match.status}</p>
                  <button className="button">Watch</button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {showOfflineModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h2 className="modal-title">Offline Match</h2>
              <button onClick={() => setShowOfflineModal(false)} className="close-button">×</button>
            </div>
            <div style={{ padding: "20px" }}>
              <button className="button" style={{ marginBottom: "10px", width: "100%" }}>
                Play vs Computer
              </button>
              <button className="button" style={{ width: "100%" }}>
                2 Players - Same Device
              </button>
            </div>
          </div>
        </div>
      )}

      {isMatchmaking && (
        <div className="matchmaking-overlay">
          <div className="spinner"></div>
          <p>Matchmaking in progress...</p>
        </div>
      )}
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
