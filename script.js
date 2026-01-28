// State Management
let currentSlide = 0;
let memoryCards = [];
let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let gameTimer;
let seconds = 0;
let puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
let letterOpened = false;
let musicPlaying = false;

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    createFloatingHearts();
    createParticles();
    setupCarouselDots();
    initMusicToggle();
});

// Particle Background
function createParticles() {
    const container = document.getElementById('particles');
    for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'absolute';
        particle.style.width = Math.random() * 3 + 1 + 'px';
        particle.style.height = particle.style.width;
        particle.style.background = `rgba(${Math.random() * 255}, ${Math.random() * 255}, 255, 0.5)`;
        particle.style.borderRadius = '50%';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `float-particle ${10 + Math.random() * 20}s linear infinite`;
        particle.style.animationDelay = Math.random() * 5 + 's';
        container.appendChild(particle);
    }
    
    // Add CSS animation
    if (!document.querySelector('#particle-animation')) {
        const style = document.createElement('style');
        style.id = 'particle-animation';
        style.textContent = `
            @keyframes float-particle {
                0% { transform: translate(0, 0) rotate(0deg); opacity: 0.3; }
                50% { opacity: 0.8; }
                100% { transform: translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(360deg); opacity: 0.3; }
            }
        `;
        document.head.appendChild(style);
    }
}

// Music Toggle
function initMusicToggle() {
    const toggle = document.getElementById('musicToggle');
    toggle.addEventListener('click', () => {
        musicPlaying = !musicPlaying;
        toggle.classList.toggle('playing', musicPlaying);
        document.getElementById('musicIcon').textContent = musicPlaying ? '🎵' : '🔇';
    });
}

// Floating Hearts Animation
function createFloatingHearts() {
    const container = document.getElementById('animatedHearts');
    const emojis = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '💞', '🥰', '😍'];
    
    setInterval(() => {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDuration = (3 + Math.random() * 2) + 's';
        container.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 5000);
    }, 600);
}

// Page Navigation
function changePage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    window.scrollTo(0, 0);
    
    // Page-specific initialization
    switch(pageId) {
        case 'memory-game':
            initMemoryGame();
            break;
        case 'puzzle':
            initPuzzle();
            break;
        case 'celebration':
            createConfetti();
            createFireworks();
            break;
        case 'love-letter':
            letterOpened = false;
            break;
        case 'gallery':
            updateCarousel();
            break;
    }
}

// Love Letter Functions
function openEnvelope() {
    if (letterOpened) return;
    letterOpened = true;
    
    const envelope = document.getElementById('envelope');
    const letterContent = document.getElementById('letterContent');
    const navButtons = document.getElementById('letterNavButtons');
    
    envelope.classList.add('open');
    
    setTimeout(() => {
        letterContent.classList.add('show');
        typeWriter();
    }, 800);
    
    setTimeout(() => {
        navButtons.style.display = 'flex';
    }, 8000);
}

function typeWriter() {
    const text = `My Dearest Love,

Every day with you feels like a beautiful dream that I never want to end. Your smile brightens my darkest days, and your laughter is the sweetest melody I've ever heard.

I love the way you understand me without words, how you make ordinary moments feel extraordinary, and how you've become my favorite part of every day.

You are my best friend, my confidant, my everything. I promise to cherish you, support your dreams, and love you with all my heart.

This journey with you is just beginning, and I can't wait to create a lifetime of beautiful memories together.

You mean the world to me. 💕`;

    let i = 0;
    const letterText = document.getElementById('letterText');
    letterText.textContent = '';
    
    function type() {
        if (i < text.length) {
            letterText.textContent += text.charAt(i);
            i++;
            setTimeout(type, 50);
        }
    }
    
    type();
}

// Carousel Functions
function setupCarouselDots() {
    const dotsContainer = document.getElementById('carouselDots');
    if (!dotsContainer) return;
    
    for (let i = 0; i < 6; i++) {
        const dot = document.createElement('div');
        dot.className = 'carousel-dot' + (i === 0 ? ' active' : '');
        dot.onclick = () => {
            currentSlide = i;
            updateCarousel();
        };
        dotsContainer.appendChild(dot);
    }
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % 6;
    updateCarousel();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + 6) % 6;
    updateCarousel();
}

function updateCarousel() {
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.carousel-dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlide);
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });
}

// Auto-advance carousel
setInterval(() => {
    if (document.getElementById('gallery')?.classList.contains('active')) {
        nextSlide();
    }
}, 5000);

// Memory Game
function initMemoryGame() {
    const emojis = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '💞'];
    memoryCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    const grid = document.getElementById('memoryGrid');
    grid.innerHTML = '';
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    
    document.getElementById('moves').textContent = '0';
    document.getElementById('matches').textContent = '0/8';
    document.getElementById('timer').textContent = '0:00';
    
    if (gameTimer) clearInterval(gameTimer);
    gameTimer = setInterval(() => {
        seconds++;
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        document.getElementById('timer').textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
    }, 1000);
    
    memoryCards.forEach((emoji, index) => {
        const card = document.createElement('div');
        card.className = 'memory-card';
        card.textContent = '❓';
        card.dataset.emoji = emoji;
        card.dataset.index = index;
        card.onclick = () => flipCard(card);
        grid.appendChild(card);
    });
}

function flipCard(card) {
    if (flippedCards.length >= 2 || card.classList.contains('matched') || card.classList.contains('flipped')) return;
    
    card.textContent = card.dataset.emoji;
    card.classList.add('flipped');
    flippedCards.push(card);
    
    if (flippedCards.length === 2) {
        moves++;
        document.getElementById('moves').textContent = moves;
        
        setTimeout(() => {
            if (flippedCards[0].dataset.emoji === flippedCards[1].dataset.emoji) {
                flippedCards[0].classList.add('matched');
                flippedCards[1].classList.add('matched');
                matchedPairs++;
                document.getElementById('matches').textContent = `${matchedPairs}/8`;
                
                // Create sparkle effect on match
                createMatchSparkles(flippedCards[0]);
                createMatchSparkles(flippedCards[1]);
                
                if (matchedPairs === 8) {
                    clearInterval(gameTimer);
                    setTimeout(() => {
                        showCustomAlert(`🎉 Congratulations! You completed it in ${moves} moves and ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}!`);
                    }, 500);
                }
            } else {
                flippedCards[0].textContent = '❓';
                flippedCards[1].textContent = '❓';
                flippedCards[0].classList.remove('flipped');
                flippedCards[1].classList.remove('flipped');
            }
            flippedCards = [];
        }, 800);
    }
}

function createMatchSparkles(element) {
    const rect = element.getBoundingClientRect();
    for (let i = 0; i < 5; i++) {
        const sparkle = document.createElement('div');
        sparkle.textContent = '✨';
        sparkle.style.position = 'fixed';
        sparkle.style.left = rect.left + rect.width / 2 + 'px';
        sparkle.style.top = rect.top + rect.height / 2 + 'px';
        sparkle.style.fontSize = '1.5rem';
        sparkle.style.pointerEvents = 'none';
        sparkle.style.zIndex = '1000';
        sparkle.style.animation = `sparkle-explode 1s ease-out`;
        document.body.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1000);
    }
    
    // Add animation if not exists
    if (!document.querySelector('#sparkle-animation')) {
        const style = document.createElement('style');
        style.id = 'sparkle-animation';
        style.textContent = `
            @keyframes sparkle-explode {
                0% { transform: translate(0, 0) scale(1); opacity: 1; }
                100% { transform: translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) scale(0); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function resetMemoryGame() {
    clearInterval(gameTimer);
    initMemoryGame();
}

// Love Calculator
function calculateLove() {
    const name1 = document.getElementById('name1').value.trim();
    const name2 = document.getElementById('name2').value.trim();
    
    if (!name1 || !name2) {
        showCustomAlert('Please enter both names! 💕');
        return;
    }
    
    // Always generate high compatibility
    const percentage = 95 + Math.floor(Math.random() * 6);
    
    const gifs = ['😍', '🥰', '😘', '💑', '❤️', '💕'];
    const randomGif = gifs[Math.floor(Math.random() * gifs.length)];
    
    const messages = {
        100: { title: 'Perfect Match! 💯', desc: 'You two are absolutely made for each other! The stars have aligned!' },
        99: { title: 'Almost Perfect! 💫', desc: 'An incredible match! You complete each other in every way!' },
        98: { title: 'Exceptional Love! 💖', desc: 'Your love is truly special and destined to last forever!' },
        97: { title: 'Amazing Connection! 💝', desc: 'You share an extraordinary bond that\'s rare and beautiful!' },
        96: { title: 'Wonderful Together! 💕', desc: 'Your hearts beat as one! A truly magical connection!' },
        95: { title: 'Beautiful Love! 💗', desc: 'You bring out the best in each other. Meant to be!' }
    };
    
    const result = messages[percentage] || messages[95];
    
    document.getElementById('resultGif').textContent = randomGif;
    document.getElementById('percentage').textContent = `${percentage}%`;
    document.getElementById('resultMessage').textContent = result.title;
    document.getElementById('resultDescription').textContent = result.desc;
    document.getElementById('loveResult').classList.add('show');
    
    // Create celebration effects
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            createSparkle();
        }, i * 100);
    }
}

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.textContent = ['✨', '💫', '⭐', '🌟', '💖'][Math.floor(Math.random() * 5)];
    sparkle.style.position = 'fixed';
    sparkle.style.left = Math.random() * 100 + '%';
    sparkle.style.top = Math.random() * 100 + '%';
    sparkle.style.fontSize = (Math.random() * 1.5 + 1.5) + 'rem';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.animation = 'fadeOut 2s ease-out';
    sparkle.style.zIndex = '1000';
    document.body.appendChild(sparkle);
    
    setTimeout(() => sparkle.remove(), 2000);
}

// Puzzle Game
let puzzleSolved = false;

function initPuzzle() {
    puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
    puzzleSolved = false;
    shufflePuzzle();
}

function shufflePuzzle() {
    puzzleSolved = false;
    
    // Fisher-Yates shuffle with solvability check
    do {
        for (let i = puzzleTiles.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [puzzleTiles[i], puzzleTiles[j]] = [puzzleTiles[j], puzzleTiles[i]];
        }
    } while (!isSolvable() || isSolved());
    
    renderPuzzle();
}

function isSolvable() {
    let inversions = 0;
    for (let i = 0; i < puzzleTiles.length - 1; i++) {
        for (let j = i + 1; j < puzzleTiles.length; j++) {
            if (puzzleTiles[i] && puzzleTiles[j] && puzzleTiles[i] > puzzleTiles[j]) {
                inversions++;
            }
        }
    }
    return inversions % 2 === 0;
}

function isSolved() {
    return puzzleTiles.every((num, i) => num === i + 1 || (i === 8 && num === 0));
}

function renderPuzzle() {
    const board = document.getElementById('puzzleBoard');
    board.innerHTML = '';
    
    puzzleTiles.forEach((num, index) => {
        const tile = document.createElement('div');
        tile.className = 'puzzle-tile' + (num === 0 ? ' empty' : '');
        tile.textContent = num === 0 ? '' : num;
        tile.onclick = () => moveTile(index);
        board.appendChild(tile);
    });
}

function moveTile(index) {
    if (puzzleSolved) return;
    
    const emptyIndex = puzzleTiles.indexOf(0);
    const validMoves = [
        emptyIndex - 3, emptyIndex + 3,
        emptyIndex % 3 !== 0 ? emptyIndex - 1 : -1,
        emptyIndex % 3 !== 2 ? emptyIndex + 1 : -1
    ];
    
    if (validMoves.includes(index)) {
        [puzzleTiles[index], puzzleTiles[emptyIndex]] = [puzzleTiles[emptyIndex], puzzleTiles[index]];
        renderPuzzle();
        checkPuzzleSolved();
    }
}

function checkPuzzleSolved() {
    if (isSolved()) {
        puzzleSolved = true;
        setTimeout(() => {
            showCustomAlert('🎉 Puzzle Solved! Great job!');
            createMiniConfetti();
        }, 300);
    }
}

// Proposal Functions
let noCount = 0;
let escaped = false;

const messages = [
    "Please… don't do this 😔",
    "Why are you being like this? 🥺",
    "I'm really trying here 💔",
    "Please listen to me just once 😢",
    "You're breaking my heart a little 💗",
    "I can't run forever like this 😞",
    "Please stop… I'm getting tired 😭",
    "Why won't you understand me? 😔",
    "I'm almost about to cry now 🥹",
    "Please… I'm begging you 😢",
    "This is really hurting my feelings 💔",
    "I don't want to be ignored 😞",
    "Please don't make me sad 😭",
    "I'm trying my best, please… 🥺",
    "Why does this have to be so hard? 😔",
    "I think I might actually cry now… 😢"
];

function runAway() {
    const btn = document.getElementById("noBtn");
    const msg = document.getElementById("noMessage");

    if (!escaped) {
        escaped = true;
        btn.classList.add("escape");
    }

    noCount++;

    const padding = 20;
    const maxX = window.innerWidth - btn.offsetWidth - padding;
    const maxY = window.innerHeight - btn.offsetHeight - padding;

    const x = Math.random() * maxX;
    const y = Math.random() * maxY;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    if (noCount <= messages.length) {
        msg.innerText = messages[noCount - 1];
    } else {
        msg.innerText = "NO button has left the universe 🚀😂";
        btn.style.display = "none";
    }
}

function answerYes() {
    changePage("celebration");
}

// Celebration Effects
function createConfetti() {
    for (let i = 0; i < 100; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.textContent = ['🎉', '✨', '💖', '🎊', '🎈', '💕', '⭐', '💝', '🌟', '💫'][Math.floor(Math.random() * 10)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 3000);
        }, i * 50);
    }
}

function createFireworks() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const x = Math.random() * window.innerWidth;
            const y = Math.random() * window.innerHeight * 0.6;
            createFireworkBurst(x, y);
        }, i * 300);
    }
}

function createFireworkBurst(x, y) {
    const colors = ['#00ffff', '#ff006e', '#b300ff', '#39ff14', '#0066ff', '#ff0055'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    for (let i = 0; i < 12; i++) {
        const particle = document.createElement('div');
        particle.style.position = 'fixed';
        particle.style.left = x + 'px';
        particle.style.top = y + 'px';
        particle.style.width = '4px';
        particle.style.height = '4px';
        particle.style.borderRadius = '50%';
        particle.style.background = color;
        particle.style.boxShadow = `0 0 10px ${color}`;
        particle.style.pointerEvents = 'none';
        particle.style.zIndex = '1000';
        
        const angle = (Math.PI * 2 * i) / 12;
        const velocity = 100 + Math.random() * 50;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        particle.style.animation = `firework-particle 1s ease-out`;
        particle.style.setProperty('--vx', vx + 'px');
        particle.style.setProperty('--vy', vy + 'px');
        
        document.body.appendChild(particle);
        setTimeout(() => particle.remove(), 1000);
    }
    
    // Add animation if not exists
    if (!document.querySelector('#firework-animation')) {
        const style = document.createElement('style');
        style.id = 'firework-animation';
        style.textContent = `
            @keyframes firework-particle {
                0% { transform: translate(0, 0); opacity: 1; }
                100% { transform: translate(var(--vx), var(--vy)); opacity: 0; }
            }
        `;
        document.head.appendChild(style);
    }
}

function createMiniConfetti() {
    for (let i = 0; i < 30; i++) {
        setTimeout(() => {
            const confetti = document.createElement('div');
            confetti.textContent = ['🎉', '✨', '⭐'][Math.floor(Math.random() * 3)];
            confetti.style.position = 'fixed';
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.top = '-50px';
            confetti.style.fontSize = '2rem';
            confetti.style.pointerEvents = 'none';
            confetti.style.animation = 'confetti-fall 2s ease-in forwards';
            confetti.style.zIndex = '1000';
            document.body.appendChild(confetti);
            
            setTimeout(() => confetti.remove(), 2000);
        }, i * 50);
    }
}

// Custom Alert (styled for dark theme)
function showCustomAlert(message) {
    const alertBox = document.createElement('div');
    alertBox.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: var(--bg-card, #1a1a1a);
        color: var(--text-light, #e0e0e0);
        padding: 30px 40px;
        border-radius: 20px;
        border: 2px solid var(--neon-cyan, #00ffff);
        box-shadow: 0 0 50px rgba(0, 255, 255, 0.5);
        z-index: 10000;
        text-align: center;
        font-size: 1.2rem;
        animation: fadeIn 0.3s ease;
        max-width: 90%;
    `;
    alertBox.textContent = message;
    document.body.appendChild(alertBox);
    
    setTimeout(() => {
        alertBox.style.animation = 'fadeOut 0.3s ease';
        setTimeout(() => alertBox.remove(), 300);
    }, 2500);
}

// Keyboard Navigation
document.addEventListener('keydown', (e) => {
    const activePage = document.querySelector('.page.active');
    if (!activePage) return;
    
    if (activePage.id === 'gallery') {
        if (e.key === 'ArrowLeft') prevSlide();
        if (e.key === 'ArrowRight') nextSlide();
    }
});

// Touch gestures for carousel
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const activePage = document.querySelector('.page.active');
    if (!activePage || activePage.id !== 'gallery') return;
    
    if (touchEndX < touchStartX - 50) nextSlide();
    if (touchEndX > touchStartX + 50) prevSlide();
}

console.log('💕 Website loaded successfully! Enjoy the journey! 💕');