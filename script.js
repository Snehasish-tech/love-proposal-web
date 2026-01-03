  // State
        let currentSlide = 0;
        let memoryCards = [];
        let flippedCards = [];
        let matchedPairs = 0;
        let moves = 0;
        let gameTimer;
        let seconds = 0;
        let puzzleTiles = [1, 2, 3, 4, 5, 6, 7, 8, 0];
        let letterOpened = false;

        // Initialize
        document.addEventListener('DOMContentLoaded', () => {
            createFloatingHearts();
            setupNoButton();
        });

        // Create Floating Hearts for Home Page
        function createFloatingHearts() {
            const container = document.getElementById('animatedHearts');
            const emojis = ['💕', '💖', '💗', '💝', '💘', '❤️', '💓', '💞', '🥰', '😍'];
            
            setInterval(() => {
                const emoji = document.createElement('div');
                emoji.className = 'floating-emoji';
                emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                emoji.style.left = Math.random() * 100 + '%';
                emoji.style.animationDuration = (3 + Math.random() * 2) + 's';
                emoji.style.animationDelay = '0s';
                container.appendChild(emoji);
                
                setTimeout(() => emoji.remove(), 5000);
            }, 600);
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
                } else {
                    letterText.style.removeProperty('--after');
                }
            }
            
            type();
        }

        // Page Navigation
        function changePage(pageId) {
            document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');
            window.scrollTo(0, 0);
            
            if (pageId === 'memory-game') {
                initMemoryGame();
            } else if (pageId === 'puzzle') {
                initPuzzle();
            } else if (pageId === 'celebration') {
                createConfetti();
            } else if (pageId === 'love-letter') {
                letterOpened = false;
            }
        }

        // Carousel
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
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
        }

        // Carousel
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
            slides.forEach((slide, i) => {
                slide.classList.toggle('active', i === currentSlide);
            });
        }

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
                        
                        if (matchedPairs === 8) {
                            clearInterval(gameTimer);
                            setTimeout(() => {
                                alert(`🎉 Congratulations! You completed it in ${moves} moves and ${Math.floor(seconds / 60)}:${(seconds % 60).toString().padStart(2, '0')}!`);
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

        function resetMemoryGame() {
            clearInterval(gameTimer);
            initMemoryGame();
        }

        // Love Calculator
        function calculateLove() {
            const name1 = document.getElementById('name1').value.trim();
            const name2 = document.getElementById('name2').value.trim();
            
            if (!name1 || !name2) {
                alert('Please enter both names! 💕');
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
            
            // Create celebration sparkles
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    createSparkle();
                }, i * 100);
            }
        }

        function createSparkle() {
            const sparkle = document.createElement('div');
            sparkle.textContent = ['✨', '💫', '⭐', '🌟'][Math.floor(Math.random() * 4)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * 100 + '%';
            sparkle.style.top = Math.random() * 100 + '%';
            sparkle.style.fontSize = '2rem';
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
            
            // Fisher-Yates shuffle
            for (let i = puzzleTiles.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [puzzleTiles[i], puzzleTiles[j]] = [puzzleTiles[j], puzzleTiles[i]];
            }
            renderPuzzle();
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
            const solved = puzzleTiles.every((num, i) => num === i + 1 || (i === 8 && num === 0));
            if (solved) {
                puzzleSolved = true;
                setTimeout(() => {
                    alert('🎉 Puzzle Solved! Great job!');
                }, 300);
            }
        }

         // Proposal
      
        let noCount = 0;

    const buttonTexts = [
        "NO ❌",
        "Wait 😳",
        "Heyyy 😨",
        "Stop it 😭",
        "Why tho 😢",
        "Plzzz 🥺",
        "Okay I’m scared 😵",
        "You won’t catch me 😎",
        "I give up 😵‍💫"
    ];

    const extraMessages = [
        "Bro still trying? 😭",
        "This is getting awkward 😬",
        "NO button is tired 😮‍💨",
        "Last warning ⚠️",
        "Fine… I’m done 😤"
    ];

    function moveNoButton() {
        const btn = document.getElementById("noBtn");
        const msg = document.getElementById("noMessage");

        noCount++;

        // random move
        const x = Math.random() * 350 - 175;
        const y = Math.random() * 350 - 175;

        btn.style.position = "relative";
        btn.style.transform = `translate(${x}px, ${y}px) rotate(${Math.random() * 20 - 10}deg)`;

        // First 9 tries
        if (noCount <= buttonTexts.length) {
            btn.innerText = buttonTexts[noCount - 1];
            msg.innerText = "Trying to say NO? 😏";

        }
        // Next 5 tries
        else if (noCount <= buttonTexts.length + extraMessages.length) {
            btn.innerText = "😵‍💫";
            msg.innerText = extraMessages[noCount - buttonTexts.length - 1];

        }
        // Final state
        else {
            msg.innerText = "NO option has resigned 😌💼";
            btn.style.display = "none";

            // optional: tease YES button
            const yesBtn = document.querySelector(".btn-yes");
            yesBtn.style.transform = "scale(1.15)";
            yesBtn.innerText = "💚 OKAY YES 💚";
        }

        // drama effects
        if (noCount > 6) btn.style.transform += " scale(0.8)";
        if (noCount > 10) btn.style.opacity = "0.6";
    }

    function answerYes() {
        changePage("celebration");
    }

        // Celebration
        function createConfetti() {
            for (let i = 0; i < 50; i++) {
                setTimeout(() => {
                    const confetti = document.createElement('div');
                    confetti.className = 'confetti';
                    confetti.textContent = ['🎉', '✨', '💖', '🎊', '🎈', '💕', '⭐', '💝'][Math.floor(Math.random() * 8)];
                    confetti.style.left = Math.random() * 100 + '%';
                    confetti.style.top = '-50px';
                    confetti.style.fontSize = (Math.random() * 20 + 20) + 'px';
                    document.body.appendChild(confetti);
                    
                    setTimeout(() => confetti.remove(), 3000);
                }, i * 100);
            }
        }

        // Auto-start carousel
        setInterval(() => {
            if (document.getElementById('gallery').classList.contains('active')) {
                nextSlide();
            }
        }, 4000);