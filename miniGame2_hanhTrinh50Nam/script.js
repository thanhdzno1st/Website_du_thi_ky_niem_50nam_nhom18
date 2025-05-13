// Game data
const gameData = {
    score: 0,
    completedChallenges: [],
    currentYear: null,
    badges: {
        "0-100": "Người mới tìm hiểu",
        "101-200": "Người yêu lịch sử",
        "201-300": "Nhà sử học trẻ",
        "301-400": "Chuyên gia lịch sử",
        "401-500": "Anh hùng lịch sử"
    }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function() {
    // Button Elements
    const startGameBtn = document.getElementById('start-game');
    const submitAnswerBtn = document.getElementById('submit-answer');
    const backToMapBtn = document.getElementById('back-to-map');
    const restartGameBtn = document.getElementById('restart-game');
    const modalBtn = document.getElementById('modal-button');
    const closeModalBtn = document.querySelector('.close-modal');
    
    // Section Elements
    const introSection = document.getElementById('intro-section');
    const mapSection = document.getElementById('map-section');
    const challengeSection = document.getElementById('challenge-section');
    const resultSection = document.getElementById('result-section');
    
    // Content Elements
    const challengeTitle = document.getElementById('challenge-title');
    const challengeContent = document.getElementById('challenge-content');
    const userScore = document.getElementById('user-score');
    const userBadge = document.getElementById('user-badge');
    const finalScore = document.getElementById('final-score');
    const finalBadge = document.getElementById('final-badge');
    const badgeImage = document.getElementById('badge-image');
    
    // Modal Elements
    const modal = document.getElementById('modal');
    const modalTitle = document.getElementById('modal-title');
    const modalContent = document.getElementById('modal-content');
    
    // Timeline Elements
    const timelinePoints = document.querySelectorAll('.timeline-point');
    
    // Event Listeners
    startGameBtn.addEventListener('click', startGame);
    submitAnswerBtn.addEventListener('click', submitAnswer);
    backToMapBtn.addEventListener('click', goBackToMap);
    restartGameBtn.addEventListener('click', restartGame);
    modalBtn.addEventListener('click', closeModal);
    closeModalBtn.addEventListener('click', closeModal);
    
    timelinePoints.forEach(point => {
        point.addEventListener('click', () => {
            const year = point.getAttribute('data-year');
            showChallengeForYear(year);
        });
    });
    
    // Game Functions
    function startGame() {
        introSection.classList.remove('active-section');
        introSection.classList.add('hidden-section');
        mapSection.classList.add('active-section');
        mapSection.classList.remove('hidden-section');
        
        // Reset game data if restarting
        if (gameData.score > 0) {
            gameData.score = 0;
            gameData.completedChallenges = [];
            updateScoreDisplay();
            
            // Reset timeline points
            timelinePoints.forEach(point => {
                point.classList.remove('completed');
            });
        }
    }
    
    function showChallengeForYear(year) {
        // Check if challenges for this year exist
        if (!challenges[year] || challenges[year].length === 0) {
            showModal('Thông báo', 'Không có thử thách cho năm này.');
            return;
        }
        
        // Check if all challenges for this year are completed
        const yearChallenges = challenges[year];
        const allCompleted = yearChallenges.every(challenge => 
            gameData.completedChallenges.includes(`${year}-${yearChallenges.indexOf(challenge)}`)
        );
        
        if (allCompleted) {
            showModal('Thông báo', 'Bạn đã hoàn thành tất cả thử thách cho năm này!');
            return;
        }
        
        // Find the first incomplete challenge
        let challengeIndex = 0;
        for (let i = 0; i < yearChallenges.length; i++) {
            if (!gameData.completedChallenges.includes(`${year}-${i}`)) {
                challengeIndex = i;
                break;
            }
        }
        
        gameData.currentYear = year;
        loadChallenge(year, challengeIndex);
        
        mapSection.classList.remove('active-section');
        mapSection.classList.add('hidden-section');
        challengeSection.classList.add('active-section');
        challengeSection.classList.remove('hidden-section');
    }
    
    function loadChallenge(year, index) {
        const challenge = challenges[year][index];
        challengeTitle.textContent = challenge.title;
        
        let html = '';
        
        switch (challenge.type) {
            case 'quiz':
                html = createQuizHTML(challenge, year, index);
                break;
            case 'puzzle':
                html = createPuzzleHTML(challenge, year, index);
                break;
            case 'video':
                html = createVideoHTML(challenge, year, index);
                break;
        }
        
        challengeContent.innerHTML = html;
        
        // Add event listeners for puzzle if necessary
        if (challenge.type === 'puzzle') {
            const puzzlePieces = document.querySelectorAll('.puzzle-piece');
            puzzlePieces.forEach(piece => {
                piece.addEventListener('click', () => {
                    piece.classList.toggle('selected');
                });
            });
        }
    }
    
    function createQuizHTML(challenge, year, index) {
        let html = `
            <div class="quiz-question" data-year="${year}" data-index="${index}">
                <p>${challenge.question}</p>
                <div class="quiz-options">
        `;
        
        challenge.options.forEach((option, i) => {
            html += `
                <div>
                    <input type="radio" id="option-${i}" name="quiz-option" value="${i}">
                    <label for="option-${i}">${option}</label>
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    function createPuzzleHTML(challenge, year, index) {
        let html = `
            <div class="puzzle-game" data-year="${year}" data-index="${index}">
                <p>${challenge.description}</p>
                <div class="puzzle-container">
        `;
        
        // Shuffle the image parts
        const shuffledImages = [...challenge.imageParts].sort(() => Math.random() - 0.5);
        
        shuffledImages.forEach((image, i) => {
            html += `
                <div class="puzzle-piece" data-piece="${i}">
                    <img src="${image}" alt="Puzzle piece ${i+1}">
                </div>
            `;
        });
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    function createVideoHTML(challenge, year, index) {
        let html = `
            <div class="video-challenge" data-year="${year}" data-index="${index}">
                <div class="video-frame">
                    <img src="${challenge.videoPlaceholder}" alt="Video placeholder">
                </div>
                <div class="video-question">
                    <p>${challenge.question}</p>
                    <div class="quiz-options">
        `;
        
        challenge.options.forEach((option, i) => {
            html += `
                <div>
                    <input type="radio" id="option-${i}" name="video-option" value="${i}">
                    <label for="option-${i}">${option}</label>
                </div>
            `;
        });
        
        html += `
                    </div>
                </div>
            </div>
        `;
        
        return html;
    }
    
    function submitAnswer() {
        const year = gameData.currentYear;
        
        if (!year) return;
        
        // Find the challenge type
        const challengeContainer = challengeContent.firstElementChild;
        const challengeIndex = parseInt(challengeContainer.getAttribute('data-index'));
        const challenge = challenges[year][challengeIndex];
        
        let isCorrect = false;
        let selectedOption = -1;
        
        switch (challenge.type) {
            case 'quiz':
                const quizOptions = document.querySelectorAll('input[name="quiz-option"]');
                quizOptions.forEach((option, index) => {
                    if (option.checked) {
                        selectedOption = parseInt(option.value);
                    }
                });
                
                if (selectedOption === -1) {
                    showModal('Thông báo', 'Vui lòng chọn một đáp án!');
                    return;
                }
                
                isCorrect = (selectedOption === challenge.correctAnswer);
                break;
                
            case 'puzzle':
                // For puzzle, we'll consider it correct if they attempted it
                const puzzlePieces = document.querySelectorAll('.puzzle-piece.selected');
                if (puzzlePieces.length < 3) {
                    showModal('Thông báo', 'Vui lòng chọn ít nhất 3 mảnh ghép!');
                    return;
                }
                isCorrect = true;
                break;
                
            case 'video':
                const videoOptions = document.querySelectorAll('input[name="video-option"]');
                videoOptions.forEach((option, index) => {
                    if (option.checked) {
                        selectedOption = parseInt(option.value);
                    }
                });
                
                if (selectedOption === -1) {
                    showModal('Thông báo', 'Vui lòng chọn một đáp án!');
                    return;
                }
                
                isCorrect = (selectedOption === challenge.correctAnswer);
                break;
        }
        
        // Award points and mark challenge as completed
        if (isCorrect) {
            gameData.score += challenge.points;
            gameData.completedChallenges.push(`${year}-${challengeIndex}`);
            updateScoreDisplay();
            
            // Check if all challenges for this year are completed
            const yearChallenges = challenges[year];
            const allCompleted = yearChallenges.every((challenge, idx) => 
                gameData.completedChallenges.includes(`${year}-${idx}`)
            );
            
            if (allCompleted) {
                // Mark the year as completed on the timeline
                document.querySelector(`.timeline-point[data-year="${year}"]`).classList.add('completed');
            }
            
            // Show feedback
            showModal('Chính xác!', `${challenge.feedback}<br><br>Bạn nhận được ${challenge.points} điểm!`);
        } else {
            showModal('Chưa chính xác', 'Hãy thử lại! Bạn có thể xem lại nội dung để tìm đáp án đúng.');
        }
        
        // Check if all challenges are completed
        const allChallengesCompleted = Object.keys(challenges).every(yr => {
            return challenges[yr].every((challenge, idx) => 
                gameData.completedChallenges.includes(`${yr}-${idx}`)
            );
        });
        
        if (allChallengesCompleted) {
            setTimeout(() => {
                showGameResults();
            }, 1500);
        }
    }
    
    function goBackToMap() {
        challengeSection.classList.remove('active-section');
        challengeSection.classList.add('hidden-section');
        mapSection.classList.add('active-section');
        mapSection.classList.remove('hidden-section');
    }
    
    function restartGame() {
        resultSection.classList.remove('active-section');
        resultSection.classList.add('hidden-section');
        introSection.classList.add('active-section');
        introSection.classList.remove('hidden-section');
        
        // Reset game data
        gameData.score = 0;
        gameData.completedChallenges = [];
        updateScoreDisplay();
        
        // Reset timeline points
        timelinePoints.forEach(point => {
            point.classList.remove('completed');
        });
    }
    
    function showGameResults() {
        // Hide challenge section
        challengeSection.classList.remove('active-section');
        challengeSection.classList.add('hidden-section');
        
        // Update final score and badge
        finalScore.textContent = gameData.score;
        const badge = getBadgeForScore(gameData.score);
        finalBadge.textContent = badge;
        
        // Show badge image
        badgeImage.classList.remove('hidden');
        
        // Show result section
        resultSection.classList.add('active-section');
        resultSection.classList.remove('hidden-section');
    }
    
    function updateScoreDisplay() {
        userScore.textContent = `Điểm: ${gameData.score}`;
        const badge = getBadgeForScore(gameData.score);
        userBadge.textContent = `Huy hiệu: ${badge}`;
    }
    
    function getBadgeForScore(score) {
        let badge = "";
        Object.keys(gameData.badges).forEach(range => {
            const [min, max] = range.split('-').map(Number);
            if (score >= min && score <= max) {
                badge = gameData.badges[range];
            }
        });
        
        return badge || "Chưa có";
    }
    
    function showModal(title, content) {
        modalTitle.textContent = title;
        modalContent.innerHTML = content;
        modal.style.display = 'flex';
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }
    
    // Initialize share buttons
    const facebookShareBtn = document.querySelector('.share-btn.facebook');
    const zaloShareBtn = document.querySelector('.share-btn.zalo');
    
    facebookShareBtn.addEventListener('click', () => {
        const text = `Tôi vừa đạt ${gameData.score} điểm trong minigame "Hành trình 50 năm - Dấu ấn Tự hào". Hãy thử sức bạn nhé!`;
        const url = window.location.href;
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}&quote=${encodeURIComponent(text)}`, '_blank');
    });
    
    zaloShareBtn.addEventListener('click', () => {
        const text = `Tôi vừa đạt ${gameData.score} điểm trong minigame "Hành trình 50 năm - Dấu ấn Tự hào". Hãy thử sức bạn nhé!`;
        alert("Chia sẻ qua Zalo: " + text);
    });
    
    // Initialize the game
    updateScoreDisplay();
});

// Challenge data
const challenges = {
    "1975": [
        {
            type: "quiz",
            title: "Giải phóng miền Nam",
            question: "Ngày nào được ghi nhận là Ngày Giải phóng miền Nam, thống nhất đất nước?",
            options: [
                "30/4/1975",
                "1/5/1975", 
                "2/9/1975", 
                "19/8/1975"
            ],
            correctAnswer: 0,
            points: 20,
            feedback: "Ngày 30/4/1975 là ngày Giải phóng miền Nam, thống nhất đất nước. Đây là ngày lịch sử quan trọng đánh dấu thắng lợi hoàn toàn của cuộc kháng chiến chống Mỹ cứu nước."
        },
        {
            type: "puzzle",
            title: "Hình ảnh lịch sử",
            imageParts: [
                "/api/placeholder/200/200?text=1",
                "/api/placeholder/200/200?text=2",
                "/api/placeholder/200/200?text=3",
                "/api/placeholder/200/200?text=4",
                "/api/placeholder/200/200?text=5",
                "/api/placeholder/200/200?text=6",
                "/api/placeholder/200/200?text=7",
                "/api/placeholder/200/200?text=8",
                "/api/placeholder/200/200?text=9"
            ],
            description: "Ghép hình xe tăng tiến vào Dinh Độc Lập ngày 30/4/1975",
            points: 30,
            feedback: "Đây là hình ảnh xe tăng số hiệu 843 húc đổ cổng Dinh Độc Lập, đánh dấu thời khắc lịch sử khi Sài Gòn được giải phóng hoàn toàn."
        }
    ],
    "1985": [
        {
            type: "quiz",
            title: "Đổi mới đất nước",
            question: "Đại hội nào của Đảng đã đưa ra đường lối đổi mới toàn diện đất nước?",
            options: [
                "Đại hội V (1982)",
                "Đại hội VI (1986)",
                "Đại hội VII (1991)",
                "Đại hội VIII (1996)"
            ],
            correctAnswer: 1,
            points: 20,
            feedback: "Đại hội VI của Đảng (tháng 12/1986) đã đưa ra đường lối đổi mới toàn diện đất nước, đánh dấu bước ngoặt quan trọng trong sự phát triển của Việt Nam."
        },
        {
            type: "video",
            title: "Chặng đường phục hồi",
            videoPlaceholder: "/api/placeholder/600/400?text=Video+về+thời+kỳ+đổi+mới",
            question: "Theo video, chính sách nào đã giúp kinh tế Việt Nam phát triển nhanh chóng sau đổi mới?",
            options: [
                "Quốc hữu hóa toàn bộ doanh nghiệp",
                "Tập trung vào công nghiệp nặng",
                "Mở cửa thị trường và thu hút đầu tư nước ngoài",
                "Tăng cường xuất khẩu nguyên liệu thô"
            ],
            correctAnswer: 2,
            points: 25,
            feedback: "Chính sách mở cửa thị trường và thu hút đầu tư nước ngoài là một trong những yếu tố quan trọng giúp kinh tế Việt Nam phát triển nhanh chóng sau đổi mới."
        }
    ],
    "1995": [
        {
            type: "quiz",
            title: "Quan hệ quốc tế",
            question: "Năm nào Việt Nam gia nhập Hiệp hội các quốc gia Đông Nam Á (ASEAN)?",
            options: [
                "1990",
                "1993",
                "1995",
                "1997"
            ],
            correctAnswer: 2,
            points: 20,
            feedback: "Việt Nam chính thức gia nhập ASEAN vào ngày 28/7/1995, đánh dấu bước tiến quan trọng trong quá trình hội nhập quốc tế."
        },
        {
            type: "puzzle",
            title: "Hình ảnh hội nhập",
            imageParts: [
                "/api/placeholder/200/200?text=1",
                "/api/placeholder/200/200?text=2",
                "/api/placeholder/200/200?text=3",
                "/api/placeholder/200/200?text=4",
                "/api/placeholder/200/200?text=5",
                "/api/placeholder/200/200?text=6",
                "/api/placeholder/200/200?text=7",
                "/api/placeholder/200/200?text=8",
                "/api/placeholder/200/200?text=9"
            ],
            description: "Ghép hình lễ kết nạp Việt Nam vào ASEAN năm 1995",
            points: 30,
            feedback: "Đây là hình ảnh Lễ kết nạp Việt Nam trở thành thành viên chính thức của ASEAN ngày 28/7/1995."
        }
    ],
    "2005": [
        {
            type: "video",
            title: "Phát triển kinh tế",
            videoPlaceholder: "/api/placeholder/600/400?text=Video+về+phát+triển+kinh+tế",
            question: "GDP của Việt Nam đã tăng bao nhiêu lần so với thời điểm năm 1995?",
            options: [
                "2 lần",
                "3 lần",
                "4 lần",
                "5 lần"
            ],
            correctAnswer: 2,
            points: 25,
            feedback: "Đến năm 2005, GDP của Việt Nam đã tăng khoảng 4 lần so với năm 1995, thể hiện sự phát triển mạnh mẽ của nền kinh tế."
        },
        {
            type: "quiz",
            title: "Thành tựu khoa học",
            question: "Năm 2005, Việt Nam đã đạt được thành tựu nào trong lĩnh vực công nghệ thông tin?",
            options: [
                "Sản xuất chip điện tử đầu tiên",
                "Phóng vệ tinh viễn thông đầu tiên",
                "Sản xuất thành công điện thoại thông minh",
                "Xây dựng mạng lưới Internet cáp quang toàn quốc"
            ],
            correctAnswer: 3,
            points: 20,
            feedback: "Năm 2005, Việt Nam đã hoàn thành việc xây dựng mạng lưới Internet cáp quang phủ khắp các tỉnh thành, đánh dấu bước tiến quan trọng trong lĩnh vực công nghệ thông tin."
        }
    ],
    "2015": [
        {
            type: "quiz",
            title: "Kỷ niệm 40 năm giải phóng",
            question: "Khẩu hiệu chính trong lễ kỷ niệm 40 năm giải phóng miền Nam là gì?",
            options: [
                "Đoàn kết, đoàn kết, đại đoàn kết",
                "Vì tương lai tươi sáng của dân tộc Việt Nam",
                "Việt Nam - 40 năm đổi mới và phát triển",
                "Cả nước chung sức xây dựng nông thôn mới"
            ],
            correctAnswer: 2,
            points: 20,
            feedback: "Khẩu hiệu chính trong lễ kỷ niệm 40 năm giải phóng miền Nam là 'Việt Nam - 40 năm đổi mới và phát triển', thể hiện chặng đường phát triển đất nước sau giải phóng."
        },
        {
            type: "puzzle",
            title: "Hình ảnh đất nước",
            imageParts: [
                "/api/placeholder/200/200?text=1",
                "/api/placeholder/200/200?text=2",
                "/api/placeholder/200/200?text=3",
                "/api/placeholder/200/200?text=4",
                "/api/placeholder/200/200?text=5",
                "/api/placeholder/200/200?text=6",
                "/api/placeholder/200/200?text=7",
                "/api/placeholder/200/200?text=8",
                "/api/placeholder/200/200?text=9"
            ],
            description: "Ghép hình Thành phố Hồ Chí Minh hiện đại năm 2015",
            points: 30,
            feedback: "Đây là hình ảnh Thành phố Hồ Chí Minh năm 2015 với sự phát triển mạnh mẽ về cơ sở hạ tầng và kiến trúc hiện đại."
        }
    ],
    "2025": [
        {
            type: "video",
            title: "50 năm giải phóng",
            videoPlaceholder: "/api/placeholder/600/400?text=Video+kỷ+niệm+50+năm",
            question: "Theo video, thành tựu nổi bật nhất của Việt Nam sau 50 năm giải phóng là gì?",
            options: [
                "Trở thành nước có thu nhập cao trên thế giới",
                "Hoàn thành công nghiệp hóa, hiện đại hóa đất nước",
                "Trở thành trung tâm công nghệ của Đông Nam Á",
                "Đưa người Việt Nam đầu tiên lên vũ trụ"
            ],
            correctAnswer: 1,
            points: 25,
            feedback: "Sau 50 năm giải phóng, thành tựu nổi bật nhất của Việt Nam là đã cơ bản hoàn thành công nghiệp hóa, hiện đại hóa đất nước, đưa đất nước bước vào kỷ nguyên phát triển mới."
        },
        {
            type: "quiz",
            title: "Bác Hồ kính yêu",
            question: "Bác Hồ sinh ngày tháng năm nào?",
            options: [
                "17/5/1890",
                "19/5/1890",
                "19/5/1889",
                "17/5/1889"
            ],
            correctAnswer: 1,
            points: 20,
            feedback: "Chủ tịch Hồ Chí Minh sinh ngày 19/5/1890 tại làng Kim Liên, huyện Nam Đàn, tỉnh Nghệ An."
        }
    ]
};