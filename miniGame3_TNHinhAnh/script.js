// Restart the game
function restartGame() {
    resultContainer.classList.add('hidden');
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.display = 'block';
    currentQuestionIndex = 0;
    score = 0;
    scoreElement.textContent = score;
    shuffleQuestions();
    loadQuestion();
}

// Utility function to shuffle an array
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

// Initialize the game when the page loads
window.addEventListener('load', init);
// Quiz questions and options
const quizData = [
    {
        question: "Đâu là hình ảnh diễn ra trong Lễ kỷ niệm 30/4 tại TP.HCM năm 2020?",
        options: [
            {
                image: "https://8486fef5bc.vws.vegacdn.vn/uploadimages/news/2025/thcsleloiq3/2025_5/1/sinh-hoat-30-4-1_1520251253.jpg?w=600",
                isCorrect: true,
                description: "Lễ kỷ niệm 30/4 tại TP.HCM năm 2020"
            },
            {
                image: "https://th.bing.com/th/id/OIP.ugdI9EMhUokqFYXWll8fXwHaE8?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Lễ kỷ niệm 30/4 tại TP.HCM năm 2019"
            },
            {
                image: "https://bvhttdl.mediacdn.vn/291773308735864832/2023/3/1/le-ky-niem-va-chuong-trinh-nghe-thuat-dac-biet-ky-niem-80-nam-ra-doi-de-cuong-van-hoa-viet-nam18-16775999306321644112344-1677639162708-1677639162771346715747.jpg",
                isCorrect: false,
                description: "Một sự kiện khác không liên quan"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh chụp tại lễ Quốc khánh 2/9 năm 2023 tại Hà Nội?",
        options: [
            {
                image: "https://cdn.thuviennhadat.vn/upload/hinh-anh-bai-viet/TTTP/Thang-5-2025/lawnet/duyet-binh-2-9.jpg",
                isCorrect: false,
                description: "Lễ Quốc khánh 2/9 năm 2022"
            },
            {
                image: "https://suckhoedoisong.qltns.mediacdn.vn/324455921873985536/2022/9/2/a13-1662086763245686779291.jpg",
                isCorrect: true,
                description: "Lễ Quốc khánh 2/9 năm 2023"
            },
            {
                image: "https://th.bing.com/th?id=OIF.nLA7SvBq1WfpCp3%2fr3FRFA&cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Một buổi lễ khác"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh về Tượng đài Chiến thắng Điện Biên Phủ?",
        options: [
            {
                image: "https://tripzone.vn/uploads/202107/28/14/134545-nguyennamanh-2016-05-11t06-38-55z.jpeg",
                isCorrect: false,
                description: "Đây là một tượng đài khác"
            },
            {
                image: "https://mytourcdn.com/upload_images/Image/Minh%20Hoang/Dien%20bien/tuong%20dai/23840820.jpg",
                isCorrect: true,
                description: "Tượng đài Chiến thắng Điện Biên Phủ"
            },
            {
                image: "https://th.bing.com/th/id/OIP._w9Uk-gMXMkWHMjtE8ah6gHaE8?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Tượng đài có kiến trúc tương tự nhưng không phải Điện Biên Phủ"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh của Lăng Chủ tịch Hồ Chí Minh tại Hà Nội?",
        options: [
            {
                image: "https://ik.imagekit.io/tvlk/blog/2023/02/lang-chu-tich%E2%80%93ho-chi-minh-2.png?tr=dpr-2,w-675",
                isCorrect: true,
                description: "Lăng Chủ tịch Hồ Chí Minh tại Hà Nội"
            },
            {
                image: "https://th.bing.com/th/id/OIP.71rM4Hf1wdQNlfqmgAfncgHaHD?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Một công trình kiến trúc khác có hình dáng tương tự"
            },
            {
                image: "https://th.bing.com/th/id/OIP.SNatPf63Pqpb4jdXJ2md_wHaE6?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Bảo tàng Hồ Chí Minh"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh của lá cờ Mặt trận Dân tộc Giải phóng miền Nam Việt Nam?",
        options: [
            {
                image: "https://th.bing.com/th/id/OIP.xR2PPH82Qv-10Bip-ayHhwAAAA?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Một hội nghị quốc tế khác"
            },
            {
                image: "https://th.bing.com/th/id/OIP.NxfDe0gd78AyEdHvXnGp4gHaEH?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Một cuộc họp tương tự nhưng không phải Hội nghị Genève"
            },
            {
                image: "https://vn-live-01.slatic.net/p/fe142a1f861d71356cbf28cb9f93ca7c.jpg",
                isCorrect: true,
                description: "Hội nghị Genève năm 1954"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh của lễ ký kết Hiệp định Paris năm 1973?",
        options: [
            {
                image: "https://image.phunuonline.com.vn/fckeditor/upload/2023/20230129/images/bao-chi-quoc-te-hiep-dinh-_261675008324.jpg",
                isCorrect: true,
                description: "Lễ ký kết Hiệp định Paris năm 1973"
            },
            {
                image: "https://th.bing.com/th/id/OIP.comXVVLfIRDBpvZNmo0w8wHaFD?w=264&h=180&c=7&r=0&o=7&cb=iwp2&dpr=1.4&pid=1.7&rm=3",
                isCorrect: false,
                description: "Một lễ ký kết khác không phải Hiệp định Paris"
            },
            {
                image: "https://hnm.1cdn.vn/2023/07/25/vn-israel.jpg",
                isCorrect: false,
                description: "Một sự kiện ngoại giao khác"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh của xe tăng tiến vào Dinh Độc Lập ngày 30/4/1975?",
        options: [
            {
                image: "https://media.vov.vn/sites/default/files/styles/large_watermark/public/2022-12/dsc_2213.jpg",
                isCorrect: false,
                description: "Xe tăng trong một chiến dịch khác"
            },
            {
                image: "https://cualo.vn/wp-content/uploads/2023/04/270419ha63-1651113218376844527386.jpg",
                isCorrect: true,
                description: "Xe tăng tiến vào Dinh Độc Lập ngày 30/4/1975"
            },
            {
                image: "https://th.bing.com/th/id/R.3249a56985a9593bae9a11204a33f4fb?rik=FKdXXmL0DRl%2fCg&pid=ImgRaw&r=0",
                isCorrect: false,
                description: "Xe tăng tương tự nhưng không phải ngày 30/4/1975"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh của buổi lễ Bác Hồ đọc Tuyên ngôn độc lập ngày 2/9/1945?",
        options: [
            {
                image: "https://kenh14cdn.com/A3YmnWqkHeph7OwGyu6TwbX57tgTw/Image/2012/09/120901kpBacHo08-b6036.jpg",
                isCorrect: false,
                description: "Một bài phát biểu khác của Bác Hồ"
            },
            {
                image: "https://th.bing.com/th/id/R.515058836d2b3d52914bf89356945d4d?rik=hywp7akiZsMQMQ&riu=http%3a%2f%2fbaoapbac.vn%2fdataimages%2f202208%2foriginal%2fimages1755885_10.jpg&ehk=tR3SrNSa9G37y69aPwkALFxd%2bXpkgx64Kt5MT5GuBmE%3d&risl=&pid=ImgRaw&r=0",
                isCorrect: true,
                description: "Bác Hồ đọc Tuyên ngôn độc lập ngày 2/9/1945"
            },
            {
                image: "https://kenh14cdn.com/A3YmnWqkHeph7OwGyu6TwbX57tgTw/Image/2012/09/120901kpBacHo16-b6036.jpg",
                isCorrect: false,
                description: "Một sự kiện tương tự nhưng không phải 2/9/1945"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh về chiến dịch Điện Biên Phủ năm 1954?",
        options: [
            {
                image: "https://th.bing.com/th/id/OIP.3weWPGQiMmT3CTmAeeKoKgHaE8?o=7&cb=iwp2rm=3&rs=1&pid=ImgDetMain",
                isCorrect: true,
                description: "Chiến dịch Điện Biên Phủ năm 1954"
            },
            {
                image: "https://tulieuvankien.dangcongsan.vn/Uploads/2018/8/5/3/3_57192.jpg",
                isCorrect: false,
                description: "Một trận chiến khác"
            },
            {
                image: "https://th.bing.com/th/id/OIP.BSyY4fCRZWfxHHb6hfMtAAHaE9?cb=iwp2&rs=1&pid=ImgDetMain",
                isCorrect: false,
                description: "Một chiến dịch tương tự nhưng không phải Điện Biên Phủ"
            }
        ]
    },
    {
        question: "Đâu là hình ảnh về Hội nghị Thống nhất Việt Nam năm 1976?",
        options: [
            {
                image: "https://th.bing.com/th/id/R.ffd988aab8e0282a6c1ce0dc1f0c8d76?rik=8YmfGpwm3I%2bNlg&pid=ImgRaw&r=0&sres=1&sresct=1",
                isCorrect: false,
                description: "Một hội nghị khác"
            },
            {
                image: "https://ubmt.quangbinh.gov.vn/3cms/upload/ubmttqvt/Image/nam%202017/thang%201/doan%20ket%20dang%201.jpg",
                isCorrect: false,
                description: "Một cuộc họp tương tự nhưng không phải Hội nghị Thống nhất"
            },
            {
                image: "https://vnanet.vn/Data/Articles/2021/04/22/5400512/vna_potal_45_nam_ngay_tong_tuyen_cu_bau_quoc_hoi_cua_nuoc_viet_nam_thong_nhat_25041976_%E2%80%93_25042021_dau_son_lich_su_cua_dan_toc_stand.jpg",
                isCorrect: true,
                description: "Hội nghị Thống nhất Việt Nam năm 1976"
            }
        ]
    }
];

// Game variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 30;
let hasAnswered = false;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const startBtn = document.getElementById('start-btn');
const questionElement = document.getElementById('question');
const imagesGridElement = document.getElementById('images-grid');
const feedbackElement = document.getElementById('feedback');
const nextBtn = document.getElementById('next-btn');
const resultContainer = document.getElementById('result-container');
const correctAnswersElement = document.getElementById('correct-answers');
const totalAnsweredElement = document.getElementById('total-answered');
const finalScoreElement = document.getElementById('final-score');
const resultMessageElement = document.getElementById('result-message');
const restartBtn = document.getElementById('restart-btn');
const progressBar = document.getElementById('progress-bar');
const currentQuestionElement = document.getElementById('current-question');
const totalQuestionsElement = document.getElementById('total-questions');
const scoreElement = document.getElementById('score');
const timerElement = document.getElementById('timer');

// Start the game when the start button is clicked
startBtn.addEventListener('click', startGame);
nextBtn.addEventListener('click', nextQuestion);
restartBtn.addEventListener('click', restartGame);

// Initialize the game
function init() {
    currentQuestionIndex = 0;
    score = 0;
    shuffleQuestions();
    
    // Update total questions display
    totalQuestionsElement.textContent = quizData.length;
    
    // Show start screen
    startScreen.style.display = 'flex';
}

// Shuffle questions
function shuffleQuestions() {
    for (let i = quizData.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [quizData[i], quizData[j]] = [quizData[j], quizData[i]];
    }
}

// Start the game
function startGame() {
    startScreen.style.display = 'none';
    scoreElement.textContent = score;
    loadQuestion();
}

// Load the current question
function loadQuestion() {
    // Reset state
    hasAnswered = false;
    timeLeft = 30;
    feedbackElement.className = 'feedback';
    feedbackElement.textContent = '';
    nextBtn.classList.add('hidden');
    
    // Update progress
    currentQuestionElement.textContent = currentQuestionIndex + 1;
    progressBar.style.width = `${((currentQuestionIndex + 1) / quizData.length) * 100}%`;
    
    // Get current question
    const currentQuestion = quizData[currentQuestionIndex];
    questionElement.textContent = currentQuestion.question;
    
    // Clear previous images
    imagesGridElement.innerHTML = '';
    
    // Shuffle options to randomize the correct answer position
    const shuffledOptions = [...currentQuestion.options];
    shuffleArray(shuffledOptions);
    
    // Add image options
    shuffledOptions.forEach((option, index) => {
        const imageOption = document.createElement('div');
        imageOption.className = 'image-option';
        imageOption.dataset.index = index;
        
        const img = document.createElement('img');
        img.src = option.image;
        img.alt = option.description;
        
        imageOption.appendChild(img);
        imagesGridElement.appendChild(imageOption);
        
        // Add click event
        imageOption.addEventListener('click', () => selectAnswer(index, shuffledOptions));
    });
    
    // Start timer
    startTimer();
}

// Start the timer
function startTimer() {
    clearInterval(timer);
    timerElement.textContent = timeLeft;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = timeLeft;
        
        if (timeLeft <= 10) {
            timerElement.style.color = '#dc3545';
        } else if (percentage >= 40) {
        resultMessageElement.textContent = 'Khá! Bạn đã có những kiến thức cơ bản về lịch sử.';
    } else {
        resultMessageElement.textContent = 'Hãy tiếp tục học hỏi về lịch sử Việt Nam nhé!';
    } {
            timerElement.style.color = 'var(--text-color)';
        }
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            timeUp();
        }
    }, 1000);
}

// Time's up
function timeUp() {
    if (!hasAnswered) {
        hasAnswered = true;
        showCorrectAnswer();
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.textContent = 'Hết giờ! Bạn không chọn đáp án.';
        nextBtn.classList.remove('hidden');
    }
}

// Select an answer
function selectAnswer(selectedIndex, options) {
    if (hasAnswered) return;
    
    hasAnswered = true;
    clearInterval(timer);
    
    const selectedOption = options[selectedIndex];
    const imageOptions = document.querySelectorAll('.image-option');
    
    // Mark selected option
    imageOptions[selectedIndex].classList.add('selected');
    
    // Check if answer is correct
    if (selectedOption.isCorrect) {
        score += 10;
        scoreElement.textContent = score;
        imageOptions[selectedIndex].classList.add('correct');
        feedbackElement.className = 'feedback correct';
        feedbackElement.textContent = 'Chính xác! +10 điểm';
    } else {
        imageOptions[selectedIndex].classList.add('incorrect');
        feedbackElement.className = 'feedback incorrect';
        feedbackElement.textContent = 'Sai rồi! Đáp án đúng được đánh dấu màu xanh.';
        showCorrectAnswer();
    }
    
    // Show next button
    nextBtn.classList.remove('hidden');
}

// Show the correct answer
function showCorrectAnswer() {
    const currentQuestion = quizData[currentQuestionIndex];
    const imageOptions = document.querySelectorAll('.image-option');
    const shuffledOptions = imagesGridElement.querySelectorAll('.image-option img');
    
    // Find and mark the correct answer
    shuffledOptions.forEach((img, index) => {
        if (img.alt === currentQuestion.options.find(opt => opt.isCorrect).description) {
            imageOptions[index].classList.add('correct');
        }
    });
}

// Move to the next question
function nextQuestion() {
    currentQuestionIndex++;
    
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
}

// Show the final results
function showResults() {
    const gameContainer = document.querySelector('.game-container');
    gameContainer.style.display = 'none';
    resultContainer.classList.remove('hidden');
    
    correctAnswersElement.textContent = Math.floor(score / 10);
    totalAnsweredElement.textContent = quizData.length;
    finalScoreElement.textContent = score;
    
    const percentage = (score / (quizData.length * 10)) * 100;
    
    if (percentage >= 80) {
        resultMessageElement.textContent = 'Xuất sắc! Bạn có kiến thức lịch sử tuyệt vời!';
    } else if (percentage >= 60) {
        resultMessageElement.textContent = 'Tốt! Bạn có hiểu biết khá tốt về lịch sử Việt Nam.';
    } else if (percentage >= 40) {
        resultMessageElement.textContent = 'Khá! Bạn đã có những kiến thức cơ bản về lịch sử.';
    } else {
        resultMessageElement.textContent = 'Hãy tiếp tục học hỏi về lịch sử Việt Nam nhé!';
    }
}
const returnButtons = document.getElementsByClassName("return-home-btn");

for (let i = 0; i < returnButtons.length; i++) {
    returnButtons[i].addEventListener("click", function () {
        window.location.href = "../index.html";
    });
}