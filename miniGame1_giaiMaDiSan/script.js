/**
 * Giải Mã Di Sản - Phòng Thoát Hiểm Lịch Sử
 * Game logic và interactive elements
 */

// Game Configuration - Cấu hình trò chơi
const gameRooms = [
    {
        title: "1",
        intro: "Căn phòng tri ân Bác Hồ với những dấu ấn vĩ đại. Bạn có biết ai là người sáng lập nước Việt Nam Dân chủ Cộng hòa?",
        document: "https://th.bing.com/th/id/OIP.C2ijSJKK0JsMpGYst9Nw8gHaEK?w=312&h=200&c=10&o=6&dpr=1.4&pid=genserp&rm=2",
        videoClip: "https://www.youtube.com/watch?v=Hd_r8W19WWI",
        correctAnswer: "Hồ Chí Minh",
        hint: "Tên Người được đặt cho nhiều con đường lớn trên cả nước",
        puzzleDescription: "Tên vị lãnh tụ vĩ đại đọc Tuyên ngôn Độc lập tại Quảng trường Ba Đình?",
        backgroundAudio: null,
    },
    {
        title: "2",
        intro: "Hào khí 1954 vẫn còn vang vọng. Chiến thắng này đã làm chấn động địa cầu!",
        document: "https://th.bing.com/th/id/OIP.VRlJmKxb3z9xROehBz2f4gHaFA?cb=iwp2&rs=1&pid=ImgDetMain",
        videoClip: "https://www.youtube.com/watch?v=lp8vODuwq_k",
        correctAnswer: "Điện Biên Phủ",
        hint: "Chiến dịch lịch sử kết thúc ngày 7/5/1954",
        puzzleDescription: "Tên chiến dịch đánh dấu mốc chấm dứt thực dân Pháp tại Việt Nam?",
        backgroundAudio: null,
    },
    {
        title: "3",
        intro: "Bạn đang bước vào cột mốc lịch sử 30/4/1975 – miền Nam hoàn toàn giải phóng!",
        document: "https://th.bing.com/th/id/OIP.hdrLhGrI88wX7TzXIEWeQgHaFC?cb=iwp2&rs=1&pid=ImgDetMain",
        videoClip: "https://www.youtube.com/watch?v=ZxwNjkIOzLk",
        correctAnswer: "30/4/1975",
        hint: "Ngày kết thúc chiến tranh Việt Nam",
        puzzleDescription: "Ngày nào xe tăng tiến vào Dinh Độc Lập, kết thúc 21 năm chia cắt?",
        backgroundAudio: null,
    },
    {
        title: "4",
        intro: "Giai đoạn bứt phá, đưa đất nước vượt qua khủng hoảng kinh tế!",
        document: "https://th.bing.com/th/id/OIP.vX8wMo4ifohBh54XLzuIrwHaEy?cb=iwp2&rs=1&pid=ImgDetMain",
        videoClip: "https://www.youtube.com/watch?v=MvUDWNv5NG8",
        correctAnswer: "Đổi mới",
        hint: "Chủ trương lớn tại Đại hội Đảng VI",
        puzzleDescription: "Từ khóa mô tả chính sách đưa Việt Nam hội nhập quốc tế từ năm 1986?",
        backgroundAudio: null,
    },
    {
        title: "5",
        intro: "Việt Nam sau 50 năm giải phóng: phát triển, hiện đại, hội nhập sâu rộng.",
        document: "https://i.ytimg.com/vi/86P8Y_4U7AM/maxresdefault.jpg",
        videoClip: "https://www.youtube.com/watch?v=G_zdLNnpNHs", // placeholder
        correctAnswer: "Phát triển bền vững",
        hint: "Chiến lược gắn với SDGs và tương lai xanh",
        puzzleDescription: "Mục tiêu phát triển của Việt Nam trong thời kỳ hiện đại là gì?",
        backgroundAudio: null,
    }
];



class HistoricalEscapeRoom {
    constructor() {
        this.currentRoomIndex = 0;
        this.timeRemaining = 3600; // 60 phút = 3600 giây
        this.cluesLeft = 3;
        this.timer = null;
        this.isGameOver = false;

        // Media Elements
        this.audioPlayer = new Audio();
        this.initDOMElements();
        this.bindEvents();
        
        // Hiển thị màn hình bắt đầu thay vì bắt đầu trò chơi ngay lập tức
        this.showStartScreen();
    }

    initDOMElements() {
        // DOM Elements
        this.startScreen = document.getElementById('start-screen');
        this.mainGameContainer = document.getElementById('main-game-container');
        this.startGameBtn = document.getElementById('start-game-btn');
        
        this.timerDisplay = document.getElementById('timer');
        this.cluesDisplay = document.getElementById('clues-left');
        this.roomTitle = document.getElementById('room-title');
        this.roomIntro = document.getElementById('room-intro');
        this.documentImage = document.getElementById('document-image');
        this.answerInput = document.getElementById('answer-input');
        this.submitButton = document.getElementById('submit-answer');
        this.useClueButton = document.getElementById('use-clue');
        this.feedbackText = document.getElementById('feedback-text');
        this.videoPlayerContainer = document.getElementById('video-player-container');

        // Modals
        this.clueModal = document.getElementById('clue-modal');
        this.successModal = document.getElementById('success-modal');
        this.gameOverModal = document.getElementById('game-over-modal');
        this.gameCompleteModal = document.getElementById('game-complete-modal');
        this.clueText = document.getElementById('clue-text');

        // Media Controls
        this.createMediaControls();
    }

    createMediaControls() {
        // Removed media controls as per your request
        // Video functionality will now be integrated into the game flow
    }

    bindEvents() {
        // Start Game Button
        this.startGameBtn.addEventListener('click', () => {
            this.hideStartScreen();
            this.startGame();
        });
        
        // Button events
        this.submitButton.addEventListener('click', () => this.checkAnswer());
        this.useClueButton.addEventListener('click', () => this.showClue());
        
        // Enter key in input field
        this.answerInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.checkAnswer();
            }
        });
        
        // Modal buttons
        document.getElementById('next-room').addEventListener('click', () => this.nextRoom());
        document.getElementById('restart-game').addEventListener('click', () => this.restartGame());
        document.getElementById('play-again').addEventListener('click', () => {
            this.closeModal(this.gameCompleteModal);
            this.showStartScreen();
        });
        
        // Close modal events
        const closeButtons = document.querySelectorAll('.close-modal');
        closeButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                this.closeModal(modal);
            });
        });
    }

    showStartScreen() {
        
        // Dừng bộ đếm thời gian nếu đang chạy
        if (this.timer) {
            clearInterval(this.timer);
            this.timer = null;
        }
    }

    hideStartScreen() {
        this.startScreen.style.display = 'none';
        this.mainGameContainer.style.display = 'block';
    }

    startGame() {
        this.isGameOver = false;
        this.currentRoomIndex = 0;
        this.timeRemaining = 3600;
        this.cluesLeft = 3;
        this.updateTimerDisplay();
        this.setupRoom();
        
        // Start timer
        this.startTimer();
    }

    restartGame() {
        this.closeModal(this.gameOverModal);
        this.startGame();
    }

    startTimer() {
        // Clear any existing timer
        if (this.timer) {
            clearInterval(this.timer);
        }
        
        // Set up new timer that updates every second
        this.timer = setInterval(() => {
            if (this.timeRemaining > 0 && !this.isGameOver) {
                this.timeRemaining--;
                this.updateTimerDisplay();
            } else if (!this.isGameOver) {
                this.gameOver();
            }
        }, 1000);
    }

    updateTimerDisplay() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        this.timerDisplay.textContent = `Thời Gian: ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        
        // Add visual warning when time is running low
        if (this.timeRemaining <= 300) { // 5 minutes or less
            this.timerDisplay.classList.add('time-warning');
        } else {
            this.timerDisplay.classList.remove('time-warning');
        }
    }

    setupRoom() {
        const currentRoom = gameRooms[this.currentRoomIndex];
        
        // Animate room transition
        const gameScreen = document.getElementById('game-screen');
        gameScreen.classList.add('room-transition');
        
        setTimeout(() => {
            // Update room information
            this.roomTitle.textContent = `Phòng ${currentRoom.title}`;
            this.roomIntro.textContent = currentRoom.intro;
            this.documentImage.src = currentRoom.document;
            
            // Reset input and feedback
            this.answerInput.value = '';
            this.feedbackText.textContent = currentRoom.puzzleDescription;
            this.feedbackText.classList.remove('correct-answer', 'wrong-answer');
            
            // Update clues display
            this.cluesDisplay.textContent = `Gợi Ý: ${this.cluesLeft}`;
            
            // Hide video container
            this.videoPlayerContainer.style.display = 'none';
            this.videoPlayerContainer.innerHTML = '';

            // Remove transition class after animation
            gameScreen.classList.remove('room-transition');
        }, 500); // Match this with CSS transition time
    }

    checkAnswer() {
        if (this.isGameOver) return;
        
        const currentRoom = gameRooms[this.currentRoomIndex];
        const userAnswer = this.answerInput.value.trim().toLowerCase();
        const correctAnswer = currentRoom.correctAnswer.toLowerCase();
        
        if (userAnswer === correctAnswer) {
            // Correct answer
            this.feedbackText.textContent = "Chính xác! Bạn đã giải mã thành công.";
            this.feedbackText.classList.add('correct-answer');
            this.feedbackText.classList.remove('wrong-answer');
            
            // Play documentary clip right after correct answer
            if (currentRoom.videoClip) {
                this.playDocumentaryClip();
            }
            
            // Show success modal after a short delay
            setTimeout(() => {
                if (this.currentRoomIndex < gameRooms.length - 1) {
                    // Not the last room
                    this.openModal(this.successModal);
                } else {
                    // Last room - game completed with celebration effects
                    this.showCelebrationEffects();
                    this.openModal(this.gameCompleteModal);
                }
            }, 1000);
        } else {
            // Wrong answer
            this.feedbackText.textContent = "Sai rồi, hãy thử lại!";
            this.feedbackText.classList.add('wrong-answer');
            this.feedbackText.classList.remove('correct-answer');
            // Add shake animation to input
            this.answerInput.classList.add('shake');
            setTimeout(() => {
                this.answerInput.classList.remove('shake');
            }, 500);
        }
    }

    showClue() {
        if (this.cluesLeft <= 0) {
            this.feedbackText.textContent = "Bạn đã hết gợi ý!";
            return;
        }
        
        const currentRoom = gameRooms[this.currentRoomIndex];
        this.clueText.textContent = currentRoom.hint;
        this.openModal(this.clueModal);
        
        // Decrease clue count
        this.cluesLeft--;
        this.cluesDisplay.textContent = `Gợi Ý: ${this.cluesLeft}`;
    }

    nextRoom() {
        this.closeModal(this.successModal);
        
        if (this.currentRoomIndex < gameRooms.length - 1) {
            // Move to next room
            this.currentRoomIndex++;
            this.setupRoom();
        } else {
            // Game completed - show celebration effects
            this.showCelebrationEffects();
            this.openModal(this.gameCompleteModal);
        }
    }
    
    showCelebrationEffects() {
        // Tạo hiệu ứng confetti
        const confettiContainer = document.querySelector('.confetti-container');
        confettiContainer.innerHTML = ''; // Xóa confetti cũ nếu có
        
        // Tạo nhiều mảnh confetti với màu sắc khác nhau
        const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'];
        
        for (let i = 0; i < 100; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.left = Math.random() * 100 + '%';
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's'; // 2-5s
            confetti.style.animationDelay = Math.random() * 5 + 's';
            confettiContainer.appendChild(confetti);
        }
        
        // Kích hoạt hiệu ứng pháo hoa
        const fireworks = document.querySelectorAll('.firework');
        fireworks.forEach(firework => {
            firework.classList.remove('active');
            setTimeout(() => {
                firework.classList.add('active');
            }, 100);
        });
        
        // Thêm thông báo chúc mừng hoạt ảnh
        const celebrationMessage = document.querySelector('#game-complete-modal h3');
        celebrationMessage.innerHTML = '<i class="fas fa-medal"></i> CHIẾN THẮNG RỰC RỠ!';
        
        const celebrationDescription = document.querySelector('#game-complete-modal p');
        celebrationDescription.innerHTML = 
            'Bạn đã giải mã thành công tất cả các phòng và hoàn thành cuộc phiêu lưu lịch sử! ' +
            'Chúc mừng bạn đã hoàn thành hành trình khám phá di sản văn hóa Việt Nam!';
    }

    gameOver() {
        this.isGameOver = true;
        clearInterval(this.timer);
        this.openModal(this.gameOverModal);
    }

    playDocumentaryClip() {
        const currentRoom = gameRooms[this.currentRoomIndex];

        if (currentRoom.videoClip) {
            this.videoPlayerContainer.innerHTML = ''; // Clear previous content

            if (currentRoom.videoClip.includes('youtube.com') || currentRoom.videoClip.includes('youtu.be')) {
                const videoId = this.extractYouTubeId(currentRoom.videoClip);
                
                const iframe = document.createElement('iframe');
                iframe.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1`;
                iframe.width = '100%';
                iframe.height = '315';
                iframe.frameBorder = '0';
                iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                iframe.allowFullscreen = true;
                
                this.videoPlayerContainer.appendChild(iframe);
            } else {
                // Local video file
                const video = document.createElement('video');
                video.src = currentRoom.videoClip;
                video.controls = true;
                video.autoplay = true;
                video.width = '100%';
                
                this.videoPlayerContainer.appendChild(video);
            }
            
            this.videoPlayerContainer.style.display = 'block';
            
            // Scroll to video
            setTimeout(() => {
                this.videoPlayerContainer.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    }

    extractYouTubeId(url) {
        const patterns = [
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})\S*/
        ];

        for (const pattern of patterns) {
            const match = url.match(pattern);
            if (match) {
                return match[1];
            }
        }

        console.error('Invalid YouTube URL:', url);
        return null;
    }

    openModal(modal) {
        if (!modal) return;
        modal.style.display = 'block';
    }

    closeModal(modal) {
        if (!modal) return;
        modal.style.display = 'none';
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new HistoricalEscapeRoom();
});
const returnButtons = document.getElementsByClassName("return-home-btn");

for (let i = 0; i < returnButtons.length; i++) {
    returnButtons[i].addEventListener("click", function () {
        window.location.href = "../index.html";
    });
}
