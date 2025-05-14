// Game data
const gameData = {
    score: 0,
    completedChallenges: [],
    currentYear: null,
    currentChallengeIndex: 0,
    badges: {
        "0-100": "Người mới tìm hiểu",
        "101-200": "Người yêu lịch sử",
        "201-300": "Nhà sử học trẻ",
        "301-400": "Chuyên gia lịch sử",
        "401-500": "Anh hùng lịch sử"
    }
};

// DOM Elements
document.addEventListener('DOMContentLoaded', function () {
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
            showModal('Thông báo', 'Bạn đã hoàn thành tất cả thử thách cho năm này! Bấm nút Quay lại bản đồ để làm các thử thách khác.');
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
        gameData.currentChallengeIndex = challengeIndex;
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

        challenge.imageParts.forEach((image, i) => {
            html += `
            <div class="puzzle-piece" data-piece="${i}" data-original="${i}">
                <img src="${image}" alt="Puzzle piece ${i + 1}">
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
                     <video width="640" height="360" controls>
                    <source src="${challenge.videoPlaceholder}" type="video/mp4">
                    Trình duyệt của bạn không hỗ trợ video.
                </video>
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
                // Get selected puzzle pieces
                const selectedPieces = document.querySelectorAll('.puzzle-piece.selected');

                // Check if exactly 3 pieces are selected
                if (selectedPieces.length !== 3) {
                    showModal('Thông báo', 'Vui lòng chọn đúng 3 hình ảnh!');
                    return;
                }

                // Check if the selected pieces match the correct answers
                const selectedIndices = Array.from(selectedPieces).map(piece =>
                    parseInt(piece.getAttribute('data-piece'))
                );

                // Sửa chỗ này: dùng challenge.correctAnswer thay vì challenge.correctPieces
                const correctPieces = challenge.correctAnswer;
                isCorrect = selectedIndices.length === correctPieces.length &&
                    correctPieces.every(index => selectedIndices.includes(index));

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

            // Check if this was the last challenge in the year
            const isLastChallengeInYear = challengeIndex === yearChallenges.length - 1;

            // Show feedback
            if (isLastChallengeInYear && allCompleted) {
                // This was the last challenge for this year
                showModal('Chính xác!', `${challenge.feedback}<br><br>Bạn nhận được ${challenge.points} điểm!<br><br>Đã hoàn thành tất cả thử thách cho năm ${year}!`);

                // Set modal button behavior to go back to map
                modalBtn.onclick = function () {
                    closeModal();
                    goBackToMap();
                };

                closeModalBtn.onclick = function () {
                    closeModal();
                    goBackToMap();
                };
            } else {
                showModal('Chính xác!', `${challenge.feedback}<br><br>Bạn nhận được ${challenge.points} điểm!`);

                // Check if there are more challenges in this year
                const nextChallengeIndex = challengeIndex + 1;
                if (nextChallengeIndex < challenges[year].length) {
                    // Add an event to load next challenge when modal is closed
                    modalBtn.onclick = function () {
                        closeModal();
                        gameData.currentChallengeIndex = nextChallengeIndex;
                        loadChallenge(year, nextChallengeIndex);
                    };

                    closeModalBtn.onclick = function () {
                        closeModal();
                        gameData.currentChallengeIndex = nextChallengeIndex;
                        loadChallenge(year, nextChallengeIndex);
                    };
                } else {
                    // All challenges for this year completed
                    modalBtn.onclick = closeModal;
                    closeModalBtn.onclick = closeModal;
                }
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
        } else {
            showModal('Chưa chính xác', 'Hãy thử lại! Bạn có thể xem lại nội dung để tìm đáp án đúng.');
            // Keep default close behavior for incorrect answers
            modalBtn.onclick = closeModal;
            closeModalBtn.onclick = closeModal;
        }
    }

    // Helper function to compare arrays
    function areArraysEqual(array1, array2) {
        if (array1.length !== array2.length) return false;

        for (let i = 0; i < array1.length; i++) {
            if (array1[i] !== array2[i]) return false;
        }

        return true;
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
                "https://image.plo.vn/Uploaded/2025/ycivolcg/2018_04_30/giai-phong-mien-nam-1975_NUVJ.jpg",
                "https://danviet.mediacdn.vn/2020/4/21/158382354434462-thumbnail.jpg",
                "https://cdn.baogialai.com.vn/images/822863faa89937513fac62d7aa33eaf644827a825ca3e591ad3190f34bef90f4596813f2bc468117983696f6223859001d7c78f9f1a175f24df4693865be1827/images2530110_x_3.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSp20fizXP8-mdmRvCVqyo6YDA0AXtzgkZY-w&s",
                "https://lichsuvn.net/trang-chu/wp-content/uploads/2024/01/tran-Cua-Viet-av.jpg",
                "https://i.vietgiaitri.com/2014/12/22/viet-nam-thuan-phuc-xe-thiet-giap-m113-the-nao-55c428.jpg",
                "https://cdn-i.vtcnews.vn/resize/th/files/f1/2013/04/30/xe_tang_6jpg.jpg",
                "https://sohanews.sohacdn.com/zoom/480_300/2019/4/3/photo-1-1554283698967724801643-crop-1554283710616929202242.jpg",
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSenBMULZ6hDjxBldix0D_UOTiuOrxxBFhEzg&s"
            ],
            correctAnswer: [0, 2, 6], // Chỉ số của 3 tấm hình xe tăng
            description: "Chọn 3 hình ảnh xe tăng vào ngày giải phóng Sài Gòn",
            points: 30,
            feedback: "Đây là những hình ảnh xe tăng tiến vào Sài Gòn ngày 30/04/1975, đánh dấu thời khắc lịch sử khi Sài Gòn được giải phóng hoàn toàn."
        },
        {
            type: "quiz",
            title: "Chiếc xe tăng lịch sử",
            question: "Chiếc xe tăng mang số hiệu nào được ghi nhận đầu tiên tiến vào Dinh Độc Lập?",
            options: [
                "390",
                "843",
                "777",
                "102"
            ],
            correctAnswer: 1,
            points: 20,
            feedback: "Xe tăng mang số hiệu 843 là chiếc đầu tiên húc đổ cổng chính Dinh Độc Lập vào trưa 30/4/1975, đánh dấu sự sụp đổ của chính quyền Sài Gòn."
        },
        {
            type: "quiz",
            title: "Tổng thống cuối cùng",
            question: "Ai là Tổng thống cuối cùng của chính quyền Sài Gòn tuyên bố đầu hàng vô điều kiện?",
            options: [
                "Nguyễn Văn Thiệu",
                "Trần Văn Hương",
                "Dương Văn Minh",
                "Nguyễn Cao Kỳ"
            ],
            correctAnswer: 2,
            points: 20,
            feedback: "Dương Văn Minh là Tổng thống cuối cùng của chính quyền Sài Gòn. Ông tuyên bố đầu hàng vô điều kiện trưa 30/4/1975."
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
            videoPlaceholder: "./videos/video1.mp4",
            question: "Theo video, sự kiện năm 1985 được nhắc tới là gì",
            options: [
                "Diễu binh mừng 10 năm thống nhất đất nước",
                "Duyệt binh mừng 10 năm thống nhất đất nước",
                "Diễu binh mừng chiến thắng biên giới Tây Nam",
                "Duyệt binh kỷ niệm CMT8 và Quốc khánh 2/9"
            ],
            correctAnswer: 3,
            points: 25,
            feedback: "1985 Việt Nam tổ chức Duyệt binh lớn kỷ niệm 40 năm Cách mạng tháng 8 và Quốc khánh 2/9"
        }
    ],
    "1995": [
          {
        type: "quiz",
        title: "Gia nhập ASEAN",
        question: "Năm 1995, Việt Nam chính thức gia nhập tổ chức khu vực nào?",
        options: [
            "Liên Hợp Quốc",
            "ASEAN",
            "APEC",
            "WTO"
        ],
        correctAnswer: 1,
        points: 20,
        feedback: "Ngày 28/7/1995, Việt Nam chính thức trở thành thành viên thứ 7 của Hiệp hội các quốc gia Đông Nam Á (ASEAN)."
    },
    {
        type: "quiz",
        title: "Sự kiện đối ngoại",
        question: "Năm 1995, Việt Nam và quốc gia nào chính thức bình thường hóa quan hệ ngoại giao?",
        options: [
            "Trung Quốc",
            "Liên Xô",
            "Hoa Kỳ",
            "Nhật Bản"
        ],
        correctAnswer: 2,
        points: 20,
        feedback: "Ngày 11/7/1995, Việt Nam và Hoa Kỳ chính thức tuyên bố bình thường hóa quan hệ ngoại giao sau gần 20 năm gián đoạn."
    },
    {
        type: "quiz",
        title: "Đổi mới kinh tế",
        question: "Sự kiện kinh tế nổi bật của Việt Nam năm 1995 là chi?",
        options: [
            "Lạm phát tăng cao",
            "Thành lập ngân hàng tư nhân đầu tiên",
            "Tăng trưởng GDP vượt 9%",
            "Ký kết nhiều hiệp định thương mại"
        ],
        correctAnswer: 2,
        points: 20,
        feedback: "Năm 1995, Việt Nam đạt mức tăng trưởng GDP ấn tượng, hơn 9%, đánh dấu bước phát triển quan trọng trong công cuộc Đổi mới."
    },
    {
        type: "quiz",
        title: "Viễn thông Việt Nam",
        question: "Công ty nào được thành lập năm 1995 để phát triển viễn thông tại Việt Nam?",
        options: [
            "FPT",
            "VNPT",
            "Mobifone",
            "Viettel"
        ],
        correctAnswer: 3,
        points: 20,
        feedback: "Viettel được thành lập năm 1995 với tên ban đầu là Công ty Điện tử Viễn thông Quân đội, sau này trở thành tập đoàn viễn thông hàng đầu Việt Nam."
    }
    ],
    "2005": [
        {
            type: "video",
            title: "Phát triển kinh tế",
            videoPlaceholder: "./miniGame2_hanhTrinh50Nam/videos/video2.mp4",
            question: "Đây là video quay từ năm 2005, hỏi nội dung của video nói về sự kiện gì",
            options: [
                "Diễu binh mừng Quốc khánh tại Hà Nội",
                "Duyệt binh mừng Quốc khánh tại Hà Nội",
                "Diễu binh mừng đất nước thống nhất tại TP.HCM",
                "Duyệt binh mừng đất nước thống nhất tại TP.HCM"
            ],
            correctAnswer: 0,
            points: 25,
            feedback: "Chúc mừng bạn đã trả lời đúng, đây là sự kiện Diễu binh tại Hà Nội kỷ niệm 60 năm Quốc khánh."
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