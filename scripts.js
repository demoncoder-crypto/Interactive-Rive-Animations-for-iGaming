// Rive animations setup
document.addEventListener('DOMContentLoaded', () => {
    // Game state
    let currentGame = 'slot';
    let balance = 1000;
    let lastWin = 0;
    let betAmount = 10;
    let isAnimating = false;

    // DOM Elements
    const riveCanvas = document.getElementById('rive-canvas');
    const balanceDisplay = document.getElementById('balance-amount');
    const winDisplay = document.getElementById('win-amount');
    const betInput = document.getElementById('bet-amount');
    
    const slotButton = document.getElementById('slot-button');
    const rouletteButton = document.getElementById('roulette-button');
    const cardButton = document.getElementById('card-button');
    
    const spinButton = document.getElementById('spin-button');
    const dealButton = document.getElementById('deal-button');
    const resetButton = document.getElementById('reset-button');

    // Update the UI
    function updateUI() {
        balanceDisplay.textContent = balance;
        winDisplay.textContent = lastWin;
        betInput.value = betAmount;

        // Show/hide action buttons based on current game
        spinButton.style.display = (currentGame === 'slot' || currentGame === 'roulette') ? 'block' : 'none';
        dealButton.style.display = (currentGame === 'card') ? 'block' : 'none';
        
        // Update active game button
        [slotButton, rouletteButton, cardButton].forEach(btn => btn.classList.remove('active'));
        
        if (currentGame === 'slot') slotButton.classList.add('active');
        if (currentGame === 'roulette') rouletteButton.classList.add('active');
        if (currentGame === 'card') cardButton.classList.add('active');
    }

    // Initialize Rive
    let riveInstance = null;
    let artboard = null;
    let inputs = {};
    
    // References to reels elements (for slot machine)
    let slotReels = [];
    let rouletteWheel = null;
    let cardElements = [];

    // Load the default Rive animation
    async function loadRiveAnimation(animationName = 'slot') {
        try {
            // Clean up previous instance
            if (riveInstance) {
                riveInstance.cleanup();
            }
            
            // Clear the canvas area completely first
            riveCanvas.innerHTML = '';

            // Instead of loading a file, we'll create placeholder animations
            // In a real application, you would load .riv files
            const r = new rive.Rive({
                canvas: riveCanvas,
                autoplay: true,
                stateMachines: 'State Machine 1',
                onLoad: () => {
                    console.log(`${animationName} animation loaded`);
                    artboard = riveInstance.renderer;
                    
                    // Set up inputs based on the current game
                    setupInputs(animationName);
                    
                    // Update UI
                    updateUI();
                }
            });
            
            riveInstance = r;
        } catch (error) {
            console.error('Error loading Rive animation:', error);
            
            // Fallback to placeholder
            createPlaceholderAnimation(animationName);
        }
    }

    // Create a placeholder animation if Rive fails to load
    function createPlaceholderAnimation(game) {
        // Clear the canvas area completely first
        riveCanvas.innerHTML = '';
        
        // Create a canvas element for our fallback animation
        const canvas = document.createElement('canvas');
        canvas.width = riveCanvas.clientWidth || 600; // Fallback width if clientWidth is 0
        canvas.height = riveCanvas.clientHeight || 400; // Fallback height if clientHeight is 0
        canvas.style.position = 'absolute';
        canvas.style.top = '0';
        canvas.style.left = '0';
        canvas.style.zIndex = '1';
        riveCanvas.appendChild(canvas);
        
        const ctx = canvas.getContext('2d');
        
        // Draw game-specific placeholder
        if (game === 'slot') {
            drawSlotMachinePlaceholder(ctx, canvas.width, canvas.height);
        } else if (game === 'roulette') {
            drawRoulettePlaceholder(ctx, canvas.width, canvas.height);
        } else if (game === 'card') {
            drawCardGamePlaceholder(ctx, canvas.width, canvas.height);
        }
    }

    // Placeholder drawing functions
    function drawSlotMachinePlaceholder(ctx, width, height) {
        // Clear any previous elements
        slotReels = [];
        
        ctx.fillStyle = '#2d2b42';
        ctx.fillRect(0, 0, width, height);
        
        // Draw slot machine reels
        const reelWidth = width * 0.2;
        const reelHeight = height * 0.5;
        const startX = width * 0.2;
        const startY = height * 0.25;
        
        // Create container div for slot machine - this stays still
        const slotMachineContainer = document.createElement('div');
        slotMachineContainer.className = 'slot-machine-container';
        slotMachineContainer.style.position = 'absolute';
        slotMachineContainer.style.top = '0';
        slotMachineContainer.style.left = '0';
        slotMachineContainer.style.width = '100%';
        slotMachineContainer.style.height = '100%';
        slotMachineContainer.style.zIndex = '2';
        slotMachineContainer.style.pointerEvents = 'none'; // Ensure clicks pass through
        riveCanvas.appendChild(slotMachineContainer);
        
        // Draw the frame and background on the canvas
        // Draw slot machine frame
        ctx.strokeStyle = '#f5c542';
        ctx.lineWidth = 5;
        ctx.strokeRect(startX - 20, startY - 20, 3 * reelWidth + 80, reelHeight + 40);
        
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('SLOT MACHINE', width/2, height * 0.1);
        
        // Create individual reel elements that can be animated
        for (let i = 0; i < 3; i++) {
            // Draw the reel background
            ctx.fillStyle = '#1f1f2e';
            ctx.fillRect(startX + i * (reelWidth + 20), startY, reelWidth, reelHeight);
            
            // Create a reel div that will be animated
            const reel = document.createElement('div');
            reel.className = 'slot-reel';
            reel.style.position = 'absolute';
            reel.style.left = `${startX + i * (reelWidth + 20)}px`;
            reel.style.top = `${startY}px`;
            reel.style.width = `${reelWidth}px`;
            reel.style.height = `${reelHeight}px`;
            reel.style.display = 'flex';
            reel.style.alignItems = 'center';
            reel.style.justifyContent = 'center';
            reel.style.fontSize = '24px';
            reel.style.color = '#f5c542';
            reel.style.fontWeight = 'bold';
            reel.style.zIndex = '3';
            reel.style.backgroundColor = 'transparent'; // Make background transparent
            
            // Add symbol
            const symbols = ['7', '♦', '♥'];
            reel.textContent = symbols[i];
            
            // Add to DOM and store reference
            slotMachineContainer.appendChild(reel);
            slotReels.push(reel);
        }
    }

    function drawRoulettePlaceholder(ctx, width, height) {
        // Reset the wheel reference
        rouletteWheel = null;
        
        ctx.fillStyle = '#2d2b42';
        ctx.fillRect(0, 0, width, height);
        
        // Draw roulette wheel base on canvas
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        
        // Create container for the roulette wheel
        const rouletteContainer = document.createElement('div');
        rouletteContainer.className = 'roulette-container';
        rouletteContainer.style.position = 'absolute';
        rouletteContainer.style.top = '0';
        rouletteContainer.style.left = '0';
        rouletteContainer.style.width = '100%';
        rouletteContainer.style.height = '100%';
        rouletteContainer.style.zIndex = '2';
        rouletteContainer.style.pointerEvents = 'none'; // Ensure clicks pass through
        riveCanvas.appendChild(rouletteContainer);
        
        // Draw base elements on canvas
        // Outer circle (for positioning reference)
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius + 5, 0, Math.PI * 2);
        ctx.fillStyle = '#1f1f2e';
        ctx.fill();
        
        // Draw title
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('ROULETTE', centerX, height * 0.1);
        
        // Create wheel element - this is what will spin
        const wheel = document.createElement('div');
        wheel.className = 'roulette-wheel';
        wheel.style.position = 'absolute';
        wheel.style.left = `${centerX - radius}px`;
        wheel.style.top = `${centerY - radius}px`;
        wheel.style.width = `${radius * 2}px`;
        wheel.style.height = `${radius * 2}px`;
        wheel.style.borderRadius = '50%';
        wheel.style.background = 'conic-gradient(#e63823, #e6a323, #e63823, #e6a323, #e63823, #e6a323, #e63823, #e6a323, #e63823, #e6a323)';
        wheel.style.border = '4px solid #f5c542';
        wheel.style.zIndex = '3';
        
        // Create center dot (doesn't spin)
        const centerDot = document.createElement('div');
        centerDot.className = 'roulette-center';
        centerDot.style.position = 'absolute';
        centerDot.style.left = `${centerX - radius * 0.1}px`;
        centerDot.style.top = `${centerY - radius * 0.1}px`;
        centerDot.style.width = `${radius * 0.2}px`;
        centerDot.style.height = `${radius * 0.2}px`;
        centerDot.style.borderRadius = '50%';
        centerDot.style.backgroundColor = '#f5c542';
        centerDot.style.zIndex = '4';
        
        rouletteContainer.appendChild(wheel);
        rouletteContainer.appendChild(centerDot);
        
        // Store reference to wheel for animation
        rouletteWheel = wheel;
    }

    function drawCardGamePlaceholder(ctx, width, height) {
        // Reset card elements
        cardElements = [];
        
        ctx.fillStyle = '#2d2b42';
        ctx.fillRect(0, 0, width, height);
        
        // Draw poker table surface
        ctx.beginPath();
        ctx.ellipse(width/2, height/2, width * 0.4, height * 0.3, 0, 0, Math.PI * 2);
        ctx.fillStyle = '#1b6e36';
        ctx.fill();
        ctx.strokeStyle = '#f5c542';
        ctx.lineWidth = 4;
        ctx.stroke();
        
        // Create container for cards
        const cardContainer = document.createElement('div');
        cardContainer.className = 'card-container';
        cardContainer.style.position = 'absolute';
        cardContainer.style.top = '0';
        cardContainer.style.left = '0';
        cardContainer.style.width = '100%';
        cardContainer.style.height = '100%';
        cardContainer.style.zIndex = '2';
        cardContainer.style.pointerEvents = 'none'; // Ensure clicks pass through
        riveCanvas.appendChild(cardContainer);
        
        // Draw title on canvas
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('CARD GAME', width/2, height * 0.1);
        
        // Create card elements
        const cardWidth = width * 0.1;
        const cardHeight = cardWidth * 1.4;
        const startX = (width - (3 * cardWidth + 40)) / 2;
        const startY = height * 0.4;
        
        const suits = ['♠', '♥', '♦'];
        const values = ['A', 'K', 'Q'];
        
        for (let i = 0; i < 3; i++) {
            // Create card wrapper element (this will flip)
            const card = document.createElement('div');
            card.className = 'card';
            card.style.position = 'absolute';
            card.style.left = `${startX + i * (cardWidth + 20)}px`;
            card.style.top = `${startY}px`;
            card.style.width = `${cardWidth}px`;
            card.style.height = `${cardHeight}px`;
            card.style.zIndex = '3';
            card.style.transformStyle = 'preserve-3d';
            
            // Create front of card (initially visible)
            const cardFront = document.createElement('div');
            cardFront.className = 'card-front';
            cardFront.style.backgroundColor = '#fff';
            cardFront.style.borderRadius = '5px';
            cardFront.style.border = '2px solid #000';
            cardFront.style.position = 'absolute';
            cardFront.style.width = '100%';
            cardFront.style.height = '100%';
            cardFront.style.display = 'flex';
            cardFront.style.flexDirection = 'column';
            cardFront.style.justifyContent = 'space-between';
            cardFront.style.padding = '5px';
            
            // Create back of card (initially hidden)
            const cardBack = document.createElement('div');
            cardBack.className = 'card-back';
            cardBack.style.backgroundColor = '#e74c3c';
            cardBack.style.backgroundImage = 'repeating-linear-gradient(45deg, #e74c3c, #e74c3c 10px, #c0392b 10px, #c0392b 20px)';
            cardBack.style.borderRadius = '5px';
            cardBack.style.border = '2px solid #000';
            cardBack.style.position = 'absolute';
            cardBack.style.width = '100%';
            cardBack.style.height = '100%';
            
            // Add pattern to card back
            const backLogo = document.createElement('div');
            backLogo.style.position = 'absolute';
            backLogo.style.top = '50%';
            backLogo.style.left = '50%';
            backLogo.style.transform = 'translate(-50%, -50%)';
            backLogo.style.color = '#fff';
            backLogo.style.fontSize = '18px';
            backLogo.style.fontWeight = 'bold';
            backLogo.textContent = '♣ ♠';
            cardBack.appendChild(backLogo);
            
            // Add card content to front
            const isRed = i === 1;
            const cardColor = isRed ? '#f00' : '#000';
            
            // Top corner
            const topCorner = document.createElement('div');
            topCorner.style.color = cardColor;
            topCorner.style.fontSize = '14px';
            topCorner.style.lineHeight = '1';
            topCorner.style.textAlign = 'left';
            topCorner.innerHTML = `${values[i]}<br>${suits[i]}`;
            
            // Center symbol
            const centerSymbol = document.createElement('div');
            centerSymbol.style.color = cardColor;
            centerSymbol.style.fontSize = '32px';
            centerSymbol.style.textAlign = 'center';
            centerSymbol.style.flex = '1';
            centerSymbol.style.display = 'flex';
            centerSymbol.style.alignItems = 'center';
            centerSymbol.style.justifyContent = 'center';
            centerSymbol.textContent = suits[i];
            
            // Bottom corner
            const bottomCorner = document.createElement('div');
            bottomCorner.style.color = cardColor;
            bottomCorner.style.fontSize = '14px';
            bottomCorner.style.lineHeight = '1';
            bottomCorner.style.textAlign = 'right';
            bottomCorner.style.transform = 'rotate(180deg)';
            bottomCorner.innerHTML = `${values[i]}<br>${suits[i]}`;
            
            cardFront.appendChild(topCorner);
            cardFront.appendChild(centerSymbol);
            cardFront.appendChild(bottomCorner);
            
            // Add front and back to card
            card.appendChild(cardFront);
            card.appendChild(cardBack);
            
            // Add to DOM and store reference
            cardContainer.appendChild(card);
            cardElements.push(card);
        }
    }

    // Simulate interaction with Rive animations
    function setupInputs(game) {
        inputs = {
            trigger: false,
            reset: false
        };
    }

    // Event handlers for game actions
    async function handleSpin() {
        if (isAnimating) return;
        
        // Get bet amount
        betAmount = parseInt(betInput.value) || 10;
        
        // Check if player has enough balance
        if (balance < betAmount) {
            alert("Not enough balance!");
            return;
        }
        
        // Deduct bet from balance
        balance -= betAmount;
        
        // Start animation
        isAnimating = true;
        inputs.trigger = true;
        
        // Update UI
        updateUI();
        
        // Animate only the specific game elements
        if (currentGame === 'slot' && slotReels.length > 0) {
            // Add spin animation to each reel with a slight delay
            slotReels.forEach((reel, index) => {
                setTimeout(() => {
                    reel.classList.add('spin-animation');
                }, index * 200);
            });
        } else if (currentGame === 'roulette' && rouletteWheel) {
            // Animate just the wheel
            rouletteWheel.classList.add('spin-animation');
        }
        // No fallback case needed anymore
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Stop animation
        if (currentGame === 'slot' && slotReels.length > 0) {
            slotReels.forEach(reel => {
                reel.classList.remove('spin-animation');
                
                // Show random symbol after spinning
                const symbols = ['7', '♦', '♥', '♣', '♠', 'BAR'];
                reel.textContent = symbols[Math.floor(Math.random() * symbols.length)];
            });
        } else if (currentGame === 'roulette' && rouletteWheel) {
            rouletteWheel.classList.remove('spin-animation');
        }
        
        isAnimating = false;
        inputs.trigger = false;
        
        // Determine outcome (simulated)
        const outcome = Math.random();
        if (outcome < 0.4) { // 40% chance to win
            const winMultiplier = Math.random() * 3 + 1; // Win 1-4x bet
            lastWin = Math.floor(betAmount * winMultiplier);
            balance += lastWin;
        } else {
            lastWin = 0;
        }
        
        // Update UI
        updateUI();
    }
    
    async function handleDeal() {
        if (isAnimating) return;
        
        // Get bet amount
        betAmount = parseInt(betInput.value) || 10;
        
        // Check if player has enough balance
        if (balance < betAmount) {
            alert("Not enough balance!");
            return;
        }
        
        // Deduct bet from balance
        balance -= betAmount;
        
        // Start animation
        isAnimating = true;
        inputs.trigger = true;
        
        // Update UI
        updateUI();
        
        // Simulate deal animation (card flip)
        if (cardElements.length > 0) {
            // Flip each card with a delay
            cardElements.forEach((card, index) => {
                setTimeout(() => {
                    card.classList.add('card-flip');
                    
                    // Change card value after flip animation midpoint
                    setTimeout(() => {
                        // Get front face of card
                        const cardFront = card.querySelector('.card-front');
                        if (cardFront) {
                            const corners = cardFront.querySelectorAll('div');
                            if (corners.length >= 3) {
                                const suits = ['♠', '♥', '♦', '♣'];
                                const values = ['A', 'K', 'Q', 'J', '10', '9'];
                                const randomSuit = suits[Math.floor(Math.random() * suits.length)];
                                const randomValue = values[Math.floor(Math.random() * values.length)];
                                const isRed = randomSuit === '♥' || randomSuit === '♦';
                                const cardColor = isRed ? '#f00' : '#000';
                                
                                // Update card color and values
                                corners.forEach((el, i) => {
                                    el.style.color = cardColor;
                                    if (i === 0 || i === 2) { // Top or bottom corner
                                        el.innerHTML = `${randomValue}<br>${randomSuit}`;
                                    } else if (i === 1) { // Center symbol
                                        el.textContent = randomSuit;
                                    }
                                });
                            }
                        }
                    }, 300); // Change values when card is half-flipped
                    
                    // Remove animation class after it completes
                    setTimeout(() => {
                        card.classList.remove('card-flip');
                    }, 1200); // Match animation duration
                }, index * 400); // Stagger the card animations
            });
        } else {
            // Redraw if no card elements found
            const canvas = riveCanvas.querySelector('canvas');
            if (canvas) {
                const ctx = canvas.getContext('2d');
                drawCardGamePlaceholder(ctx, canvas.width, canvas.height);
            }
        }
        
        // Wait for animation to complete
        await new Promise(resolve => setTimeout(resolve, 2500));
        
        isAnimating = false;
        inputs.trigger = false;
        
        // Determine outcome (simulated)
        const outcome = Math.random();
        if (outcome < 0.5) { // 50% chance to win
            const winMultiplier = Math.random() * 3 + 1; // Win 1-4x bet
            lastWin = Math.floor(betAmount * winMultiplier);
            balance += lastWin;
        } else {
            lastWin = 0;
        }
        
        // Update UI
        updateUI();
    }
    
    function handleReset() {
        // Reset balance and wins
        balance = 1000;
        lastWin = 0;
        betAmount = 10;
        
        // Reset animation
        inputs.reset = true;
        
        // Update UI
        updateUI();
        
        // Reset animation flag
        setTimeout(() => {
            inputs.reset = false;
        }, 100);
    }
    
    function switchGame(game) {
        if (game === currentGame) return;
        
        currentGame = game;
        loadRiveAnimation(game);
    }

    // Event listeners
    slotButton.addEventListener('click', () => switchGame('slot'));
    rouletteButton.addEventListener('click', () => switchGame('roulette'));
    cardButton.addEventListener('click', () => switchGame('card'));
    
    spinButton.addEventListener('click', handleSpin);
    dealButton.addEventListener('click', handleDeal);
    resetButton.addEventListener('click', handleReset);
    
    betInput.addEventListener('change', () => {
        betAmount = parseInt(betInput.value) || 10;
        
        // Ensure bet is within limits
        if (betAmount < 1) betAmount = 1;
        if (betAmount > 100) betAmount = 100;
        
        betInput.value = betAmount;
    });

    // Initialize default game
    loadRiveAnimation('slot');
}); 