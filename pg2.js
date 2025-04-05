// Main App Component
const App = () => {
  // State for timer
  const [timeLeft, setTimeLeft] = React.useState(5 * 60); // 5 minutes in seconds
  // State for numbers
  const [numbers, setNumbers] = React.useState([]);
  // State for user input
  const [userInput, setUserInput] = React.useState('');
  // State for player images
  const [playerImages, setPlayerImages] = React.useState({
    player1: '/placeholder.svg?height=150&width=150',
    player2: '/placeholder.svg?height=150&width=150'
  });
  
  const canvasRef = React.useRef(null);

  // Initialize the game
  React.useEffect(() => {
    // Generate 6 random numbers
    generateRandomNumbers();
    
    // Set random player images
    setRandomPlayerImages();
    
    // Start the timer
    const timerInterval = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timerInterval);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);
    
    return () => clearInterval(timerInterval);
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Generate 6 random numbers
  const generateRandomNumbers = () => {
    const newNumbers = [];
    for (let i = 0; i < 6; i++) {
      newNumbers.push(Math.floor(Math.random() * 20) + 1); // Random numbers between 1-20
    }
    setNumbers(newNumbers);
  };

  // Set random player images
  const setRandomPlayerImages = () => {
    // In a real app, you would fetch these from an API
    // For this example, we'll use placeholder images
    const player1Image = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;
    const player2Image = `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? 'men' : 'women'}/${Math.floor(Math.random() * 99)}.jpg`;
    
    setPlayerImages({
      player1: player1Image,
      player2: player2Image
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("User input:", userInput);
    // Here you would validate the answer and update scores
    setUserInput('');
  };

  // Setup canvas animation for mathematical symbols
  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas to full screen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Handle resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Mathematical symbols and elements
    const symbols = [
      "π", "∑", "∫", "√", "∞", "≠", "≈", "±", "÷", "×",
      "1", "2", "3", "4", "5", "6", "7", "8", "9", "0",
      "=", "+", "-", "α", "β", "γ", "θ", "λ", "Δ", "Ω"
    ];

    // Create particles
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

    // Create polygons
    const polygons = [];
    for (let i = 0; i < 30; i++) {
      polygons.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 30 + 15,
        sides: Math.floor(Math.random() * 5) + 3, // 3 to 7 sides
        speed: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.3 + 0.05,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.005
      });
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw polygons
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

        // Update polygon position
        polygon.y += polygon.speed;
        polygon.rotation += polygon.rotationSpeed;

        // Reset if off screen
        if (polygon.y - polygon.size > canvas.height) {
          polygon.y = -polygon.size;
          polygon.x = Math.random() * canvas.width;
        }
      });

      // Draw symbols
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

        // Update particle position
        particle.y += particle.speed;
        particle.rotation += particle.rotationSpeed;

        // Reset if off screen
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

  return (
    <div className="app">
      {/* Animated background */}
      <div className="canvas-container">
        <canvas ref={canvasRef} className="canvas-background"></canvas>
      </div>
      
      {/* Game content */}
      <div className="game-container">
        {/* Timer */}
        <div className="timer-box">
          <div className="timer">{formatTime(timeLeft)}</div>
        </div>
        
        {/* Numbers display */}
        <div className="numbers-box">
          {numbers.map((number, index) => (
            <div key={index} className="number">{number}</div>
          ))}
        </div>
        
        {/* Input field */}
        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              className="input-field"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              placeholder="Enter your answer..."
              autoFocus
            />
          </form>
        </div>
        
        {/* Submit button */}
        <button className="submit-button" onClick={handleSubmit}>
          SUBMIT
        </button>
        
        {/* Players */}
        <div className="players-container">
          <div className="player-box">
            <img 
              src={playerImages.player1 || "/placeholder.svg"} 
              alt="Player 1" 
              className="player-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.svg?height=150&width=150';
              }}
            />
            <div className="player-name">PLAYER 1</div>
          </div>
          
          <div className="player-box">
            <img 
              src={playerImages.player2 || "/placeholder.svg"} 
              alt="Player 2" 
              className="player-image"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/placeholder.svg?height=150&width=150';
              }}
            />
            <div className="player-name">PLAYER 2</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Render the App
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);