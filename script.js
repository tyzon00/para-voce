let currentSlide = 0;
let isPlaying = true;
let slideInterval;
const slides = document.querySelectorAll('.slide');
const totalSlides = slides.length;

// Iniciar experiência
function startExperience() {
    const startScreen = document.getElementById('startScreen');
    const mainContent = document.getElementById('mainContent');
    const audio = document.getElementById('backgroundMusic');
    
    // Transição suave
    startScreen.style.opacity = '0';
    
    setTimeout(() => {
        startScreen.style.display = 'none';
        mainContent.style.display = 'block';
        
        // Iniciar música
        audio.volume = 0.4;
        audio.play().catch(e => {
            console.log('Clique no botão de música para ativar');
        });
        
        // Iniciar slideshow automático
        startSlideshow();
        createIndicators();
        createHearts();
        
        // Adicionar event listeners para swipe
        addSwipeListeners();
        
    }, 1500);
}

// Adicionar listeners de swipe e clique
function addSwipeListeners() {
    // Swipe para mobile
    document.addEventListener('touchstart', handleTouchStart, false);
    document.addEventListener('touchend', handleTouchEnd, false);
    
    // Clique para desktop (áreas laterais)
    document.addEventListener('click', handleClick, false);
    document.addEventListener('touchstart', handleClick, false);
}


// Controles de música
function toggleMusic() {
    const audio = document.getElementById('backgroundMusic');
    const button = document.getElementById('musicToggle');
    
    if (audio.paused) {
        audio.play();
        button.innerHTML = '<i class="fas fa-volume-up"></i>';
    } else {
        audio.pause();
        button.innerHTML = '<i class="fas fa-volume-mute"></i>';
    }
}

// Controles de play/pause
function togglePlay() {
    const button = document.getElementById('playToggle');
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        button.innerHTML = '<i class="fas fa-pause"></i>';
        startSlideshow();
    } else {
        button.innerHTML = '<i class="fas fa-play"></i>';
        clearInterval(slideInterval);
    }
}

// Navegação entre slides
function nextSlide() {
    goToSlide(currentSlide + 1);
    if (!isPlaying) {
        clearInterval(slideInterval);
    }
}

function previousSlide() {
    goToSlide(currentSlide - 1);
    if (!isPlaying) {
        clearInterval(slideInterval);
    }
}

function goToSlide(slideIndex) {
    // Ajusta índice se passar dos limites
    if (slideIndex >= totalSlides) slideIndex = 0;
    if (slideIndex < 0) slideIndex = totalSlides - 1;
    
    // Remove classes ativas
    slides[currentSlide].classList.remove('active');
    slides[currentSlide].classList.add('previous');
    
    // Atualiza slide atual
    currentSlide = slideIndex;
    
    // Adiciona classes ao novo slide
    setTimeout(() => {
        slides[currentSlide].classList.add('active');
        slides[currentSlide].classList.remove('previous');
    }, 50);
    
    updateIndicators();
}

// Slideshow automático
function startSlideshow() {
    clearInterval(slideInterval);
    if (isPlaying) {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 6000); // Muda a cada 6 segundos
    }
}

// Indicadores de slide
function createIndicators() {
    const container = document.getElementById('slideIndicators');
    container.innerHTML = '';
    
    for (let i = 0; i < totalSlides; i++) {
        const indicator = document.createElement('div');
        indicator.className = `slide-indicator ${i === 0 ? 'active' : ''}`;
        indicator.onclick = () => {
            goToSlide(i);
            if (!isPlaying) {
                clearInterval(slideInterval);
            }
        };
        container.appendChild(indicator);
    }
}

function updateIndicators() {
    const indicators = document.querySelectorAll('.slide-indicator');
    indicators.forEach((indicator, index) => {
        indicator.classList.toggle('active', index === currentSlide);
    });
}

// Efeitos de corações
function createHearts() {
    setInterval(() => {
        createHeart();
    }, 800);
}

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    
    // Posição aleatória
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.opacity = '0.7';
    heart.style.animationDuration = (Math.random() * 3 + 4) + 's';
    heart.style.animationDelay = Math.random() * 2 + 's';
    
    // Cor aleatória
    const colors = ['#ff6b95', '#ffa5c5', '#d4a5f3', '#ffcee4'];
    heart.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    document.body.appendChild(heart);
    
    // Remove após animação
    setTimeout(() => {
        heart.remove();
    }, 7000);
}

// Navegação por teclado
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') nextSlide();
    if (e.key === 'ArrowLeft') previousSlide();
    if (e.key === ' ') togglePlay();
});

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    // Criar alguns corações iniciais na tela de início
    for (let i = 0; i < 15; i++) {
        setTimeout(createHeart, i * 300);
    }
});

// Detecção de Swipe (toque na tela)
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(event) {
    touchStartX = event.changedTouches[0].screenX;
}

function handleTouchEnd(event) {
    touchEndX = event.changedTouches[0].screenX;
    handleSwipe();
}

function handleSwipe() {
    const swipeThreshold = 50; // sensibilidade do swipe
    
    if (touchEndX < touchStartX - swipeThreshold) {
        // Swipe para esquerda = próximo slide
        nextSlide();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
        // Swipe para direita = slide anterior
        previousSlide();
    }
}

// Detecção de clique/touch para desktop e mobile
function handleClick(event) {
    const screenWidth = window.innerWidth;
    const clickX = event.clientX || event.touches[0].clientX;
    
    // Clique na direita = próximo slide
    if (clickX > screenWidth * 0.7) {
        nextSlide();
    }
    // Clique na esquerda = slide anterior
    else if (clickX < screenWidth * 0.3) {
        previousSlide();
    }
}

