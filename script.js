document.addEventListener("DOMContentLoaded", () => {
    const gameBoard = document.getElementById("game-board");
    const movesCounter = document.getElementById("moves-counter");
    const timerDisplay = document.getElementById("timer");
    const restartBtn = document.getElementById("restart-btn");
    const difficultySelector = document.getElementById("difficulty-selector");
    const flipSound = document.getElementById("flip-sound");
    const winSound = document.getElementById("win-sound");
    const instructionsBtn = document.getElementById("instructions-btn");
    const modal = document.getElementById("instructions-modal");
    const closeBtn = document.querySelector(".close-btn");

    let flippedCards = [];
    let matchedPairs = 0;
    let moves = 0;
    let timer;
    let seconds = -1;
    let totalPairs;
    
    // Temas para os níveis de dificuldade
    const themes = {
        emojis: ["😀", "😂", "😍", "😎", "😜", "😇", "😱", "🤖"],
        animals: ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼"],
        sports: ["⚽", "🏀", "🏈", "⚾", "🎾", "🏐", "🏓", "🎳"]
    };

    // Função para iniciar o jogo
    function startGame(level = 1) {
        gameBoard.innerHTML = "";
        flippedCards = [];
        matchedPairs = 0;
        moves = 0;
        seconds = -1;
        clearInterval(timer);
        timer = setInterval(() => {
            seconds++;
            timerDisplay.innerHTML = `<strong>⏳ Tempo:</strong> ${seconds}s`;
        }, 1000);

        movesCounter.innerHTML = `<strong>🔄 Movimentos:</strong> ${moves}`;

        let selectedIcons = [...themes.emojis];
        if (level > 1) selectedIcons.push(...themes.animals);
        if (level > 2) selectedIcons.push(...themes.sports);

        selectedIcons = [...selectedIcons, ...selectedIcons];
        selectedIcons.sort(() => 0.5 - Math.random());
        totalPairs = selectedIcons.length / 2;

        selectedIcons.forEach((icon) => {
            const card = document.createElement("div");
            card.classList.add("card");
            card.dataset.icon = icon;

            const frontFace = document.createElement("div");
            frontFace.classList.add("front");
            frontFace.textContent = icon;

            const backFace = document.createElement("div");
            backFace.classList.add("back");
            backFace.textContent = "❓";

            card.appendChild(frontFace);
            card.appendChild(backFace);
            card.addEventListener("click", () => flipCard(card));
            gameBoard.appendChild(card);
        });
    }

    // Função para virar uma carta
    function flipCard(card) {
        if (flippedCards.length < 2 && !card.classList.contains("flipped") && !card.classList.contains("matched")) {
            card.classList.add("flipped");
            flippedCards.push(card);
            flipSound.play();

            if (flippedCards.length === 2) {
                setTimeout(checkMatch, 500);
            }
        }
    }

    // Função para verificar se as cartas combinam
    function checkMatch() {
        let [card1, card2] = flippedCards;
        
        if (card1.dataset.icon === card2.dataset.icon) {
            card1.classList.add("matched");
            card2.classList.add("matched");
            matchedPairs++;

            if (matchedPairs === totalPairs) {
                clearInterval(timer);
                setTimeout(() => alert(`🎉 Parabéns! Você completou o jogo com ${moves} movimentos e em ${seconds} segundos.🎊`), 500);
                winSound.play();
            }
        } else {
            setTimeout(() => {
                card1.classList.remove("flipped");
                card2.classList.remove("flipped");
            }, 700);
        }
        moves++;
        movesCounter.innerHTML = `<strong>🔄 Movimentos:</strong> ${moves}`;
        flippedCards = [];
    }

    // Evento para reiniciar o jogo
    restartBtn.addEventListener("click", () => startGame(parseInt(difficultySelector.value)));

    // Eventos para interação do usuário
    difficultySelector.addEventListener("change", () => startGame(parseInt(difficultySelector.value)));
    instructionsBtn.addEventListener("click", () => modal.style.display = "flex");
    closeBtn.addEventListener("click", () => modal.style.display = "none");

    startGame(); // Iniciar o jogo ao carregar a página
});
