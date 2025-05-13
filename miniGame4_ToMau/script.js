document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('coloringCanvas');
    const ctx = canvas.getContext('2d');
    const clearBtn = document.getElementById('clearBtn');
    const shareBtn = document.getElementById('shareBtn');
    const brushSizeSlider = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const colorPalette = document.querySelector('.colors');
    const imageOptions = document.querySelectorAll('.image-option');
    const shareModal = document.getElementById('shareModal');
    const unlockModal = document.getElementById('unlockModal');
    const closeShareModal = document.querySelector('.close');
    const continueBtn = document.getElementById('continueBtn');
    const sharePreview = document.getElementById('sharePreview');
    const shareToFacebook = document.getElementById('shareToFacebook');
    const shareToZalo = document.getElementById('shareToZalo');
    const downloadImage = document.getElementById('downloadImage');
    const unlockedImageName = document.getElementById('unlockedImageName');
    
    let currentColor = '#000000';
    let currentBrushSize = 5;
    let isDrawing = false;
    let currentImage = 'flag';
    let completedImages = [];
    let isEraser = false;
    let originalCanvasData = null;
    let userDrawnPixels = [];
    
    let canvasChanged = false;
    
    const imageNames = {
        'flag': 'Cờ đỏ sao vàng',
        'hochiminh': '30/4',
        'victory': 'Đoàn quân chiến thắng',
        'reunion': 'Lễ kỷ niệm 30/4'
    };
    
    initializeEvents();
    loadImage('flag');
    loadUnlockedImages();
    
    function initializeEvents() {
        const colorPaletteDiv = document.querySelector('.color-palette');
        const eraserButton = document.createElement('button');
        eraserButton.id = 'eraserBtn';
        eraserButton.innerText = '🧽 Cục Tẩy';
        eraserButton.className = 'tool-btn';
        colorPaletteDiv.appendChild(eraserButton);
        
        eraserButton.addEventListener('click', function() {
            toggleEraser();
        });
        
        colorPalette.addEventListener('click', function(e) {
            if (e.target.classList.contains('color')) {
                isEraser = false;
                eraserButton.classList.remove('active');
                
                colorPalette.querySelectorAll('.color').forEach(color => {
                    color.classList.remove('selected');
                });
                
                e.target.classList.add('selected');
                currentColor = e.target.getAttribute('data-color');
            }
        });
        
        brushSizeSlider.addEventListener('input', function() {
            currentBrushSize = this.value;
            brushSizeValue.textContent = this.value + 'px';
        });
        
        imageOptions.forEach(option => {
            option.addEventListener('click', function() {
                if (!this.classList.contains('locked')) {
                    if (canvasChanged) {
                        autoSaveDrawing();
                    }
                    
                    imageOptions.forEach(opt => opt.classList.remove('selected'));
                    
                    this.classList.add('selected');
                    currentImage = this.getAttribute('data-image');
                    loadImage(currentImage);
                    
                    canvasChanged = false;
                } else {
                    alert('Bạn cần hoàn thành các tranh trước để mở khóa tranh này!');
                }
            });
        });
        
        canvas.addEventListener('mousedown', startDrawing);
        canvas.addEventListener('mousemove', draw);
        canvas.addEventListener('mouseup', stopDrawing);
        canvas.addEventListener('mouseout', stopDrawing);
        
        canvas.addEventListener('touchstart', handleTouch);
        canvas.addEventListener('touchmove', handleTouch);
        canvas.addEventListener('touchend', stopDrawing);
        
        clearBtn.addEventListener('click', function() {
            if (confirm('Bạn có chắc muốn xóa tất cả màu đã tô?')) {
                clearUserDrawing();
                
                userDrawnPixels = [];
                canvasChanged = false;
                
                localStorage.removeItem('savedDrawing_' + currentImage);
            }
        });
        
        shareBtn.addEventListener('click', function() {
            if (canvasChanged) {
                autoSaveDrawing();
            }
            
            const imageData = canvas.toDataURL('image/png');
            sharePreview.src = imageData;
            shareModal.style.display = 'block';
            
            if (!completedImages.includes(currentImage)) {
                completedImages.push(currentImage);
                localStorage.setItem('completedImages', JSON.stringify(completedImages));
                checkForUnlocks();
            }
        });
        
        closeShareModal.addEventListener('click', function() {
            shareModal.style.display = 'none';
        });
        
        continueBtn.addEventListener('click', function() {
            unlockModal.style.display = 'none';
        });
        
        shareToFacebook.addEventListener('click', function() {
            const quote = document.getElementById('quoteSelect').value;
            const imageData = canvas.toDataURL('image/png');
            
            const shareURL = 'https://www.facebook.com/dialog/share?' +
                'app_id=123456789' + 
                '&display=popup' +
                '&href=' + encodeURIComponent(window.location.href) +
                '&quote=' + encodeURIComponent(quote) +
                '&hashtag=' + encodeURIComponent('#LeHoiSacMau');
                
            window.open(shareURL, '_blank', 'width=600,height=400');
        });
        
        shareToZalo.addEventListener('click', function() {
            const quote = document.getElementById('quoteSelect').value;
            const imageData = canvas.toDataURL('image/png');
            shareToSocialMedia('zalo', imageData, quote);
        });
        
        downloadImage.addEventListener('click', function() {
            const quote = document.getElementById('quoteSelect').value;
            const imageData = canvas.toDataURL('image/png');
            
            const finalCanvas = document.createElement('canvas');
            finalCanvas.width = canvas.width;
            finalCanvas.height = canvas.height + 50;
            const finalCtx = finalCanvas.getContext('2d');
            
            const image = new Image();
            image.onload = function() {
                finalCtx.fillStyle = '#ffffff';
                finalCtx.fillRect(0, 0, finalCanvas.width, finalCanvas.height);
                finalCtx.drawImage(image, 0, 0);
                
                finalCtx.fillStyle = '#000000';
                finalCtx.font = '16px Arial';
                finalCtx.textAlign = 'center';
                finalCtx.fillText(quote, finalCanvas.width / 2, canvas.height + 30);
                
                const link = document.createElement('a');
                link.download = 'le-hoi-sac-mau_' + currentImage + '.png';
                link.href = finalCanvas.toDataURL('image/png');
                link.click();
            };
            image.src = imageData;
        });
        
        window.addEventListener('click', function(e) {
            if (e.target == shareModal) {
                shareModal.style.display = 'none';
            }
            if (e.target == unlockModal) {
                unlockModal.style.display = 'none';
            }
        });
        
        setInterval(function() {
            if (canvasChanged) {
                autoSaveDrawing();
                canvasChanged = false;
            }
        }, 10000);
    }
    
    function loadUnlockedImages() {
        const savedCompletedImages = localStorage.getItem('completedImages');
        if (savedCompletedImages) {
            completedImages = JSON.parse(savedCompletedImages);
            
            imageOptions.forEach(option => {
                const imageId = option.getAttribute('data-image');
                if (completedImages.includes(imageId)) {
                    option.classList.remove('locked');
                }
            });
        } else {
            completedImages = ['flag'];
            localStorage.setItem('completedImages', JSON.stringify(completedImages));
        }
    }
    
    function autoSaveDrawing() {
        localStorage.setItem('savedDrawing_' + currentImage, canvas.toDataURL());
    }
    
    function toggleEraser() {
        isEraser = !isEraser;
        const eraserBtn = document.getElementById('eraserBtn');

        if (isEraser) {
            eraserBtn.classList.add('active');
            eraserBtn.innerText = '✏️ Bút Vẽ';

            colorPalette.querySelectorAll('.color').forEach(color => {
                color.classList.remove('selected');
            });
        } else {
            eraserBtn.classList.remove('active');
            eraserBtn.innerText = '🧽 Cục Tẩy';
        }
    }
    
    function handleTouch(e) {
        e.preventDefault();
        
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 'mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        
        canvas.dispatchEvent(mouseEvent);
    }
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        canvasChanged = true;
        
        if (isEraser) {
            const radius = currentBrushSize;
            
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fill();
            
            if (originalCanvasData) {
                const img = new Image();
                img.onload = function() {
                    const currentData = canvas.toDataURL();
                    
                    const tempCanvas = document.createElement('canvas');
                    tempCanvas.width = canvas.width;
                    tempCanvas.height = canvas.height;
                    const tempCtx = tempCanvas.getContext('2d');
                    
                    const currentImg = new Image();
                    currentImg.onload = function() {
                        tempCtx.drawImage(currentImg, 0, 0);
                        
                        ctx.drawImage(img, 0, 0);
                        
                        ctx.globalCompositeOperation = 'source-over';
                        ctx.drawImage(tempCanvas, 0, 0);
                    };
                    currentImg.src = currentData;
                };
                
                img.src = originalCanvasData;
            }
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.fillStyle = currentColor;
            ctx.beginPath();
            ctx.arc(x, y, currentBrushSize, 0, Math.PI * 2);
            ctx.fill();
            
            userDrawnPixels.push({x, y, color: currentColor, size: currentBrushSize});
        }
    }
    
    function stopDrawing() {
        if (isDrawing && canvasChanged) {
            autoSaveDrawing();
        }
        
        isDrawing = false;
        ctx.globalCompositeOperation = 'source-over';
    }
    
    function clearUserDrawing() {
        if (originalCanvasData) {
            const img = new Image();
            img.onload = function() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
                
                ctx.drawImage(img, 0, 0);
            };
            img.src = originalCanvasData;
        }
    }
    
    function loadImage(imageName) {
        const savedImage = localStorage.getItem('savedDrawing_' + imageName);
        
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        switch(imageName) {
            case 'flag':
                drawFlag();
                break;
            case 'hochiminh':
                drawHoChiMinh();
                break;
            case 'victory':
                drawVictory();
                break;
            case 'reunion':
                drawReunion();
                break;
            default:
                drawFlag();
        }
        
        originalCanvasData = canvas.toDataURL();
        
        if (savedImage) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
            };
            img.src = savedImage;
        }
    }
    
    function drawFlag() {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.rect(100, 150, 400, 300);
        ctx.stroke();
        
        drawStar(300, 300, 5, 100, 40);
    }
    
    function drawHoChiMinh() {
        ctx.clearRect(0, 0, 600, 400);

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, 600, 400);

        ctx.font = 'bold 250px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 5;
        ctx.strokeText('30/4', 300, 200);
    }
    
    function drawVictory() {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.rect(50, 100, 500, 400);
        ctx.stroke();
        
        for (let i = 0; i < 5; i++) {
            const x = 100 + i * 100;
            
            ctx.beginPath();
            ctx.arc(x, 200, 30, 0, Math.PI * 2);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, 230);
            ctx.lineTo(x, 350);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, 270);
            ctx.lineTo(x - 40, 300);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, 270);
            ctx.lineTo(x + 40, 300);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, 350);
            ctx.lineTo(x - 30, 420);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(x, 350);
            ctx.lineTo(x + 30, 420);
            ctx.stroke();
        }
        
        ctx.beginPath();
        ctx.rect(500, 150, 50, 40);
        ctx.stroke();
    }
    
    function drawReunion() {
        ctx.beginPath();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 2;
        ctx.rect(50, 100, 500, 400);
        ctx.stroke();
        
        ctx.beginPath();
        ctx.moveTo(50, 300);
        ctx.lineTo(550, 300);
        ctx.stroke();
        
        for (let i = 0; i < 7; i++) {
            const x = 100 + i * 70;
            const height = 100 + Math.random() * 100;
            
            ctx.beginPath();
            ctx.rect(x, 300 - height, 50, height);
            ctx.stroke();
            
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    ctx.beginPath();
                    ctx.rect(x + 10 + j * 15, 220 - k * 30, 10, 15);
                    ctx.stroke();
                }
            }
        }
        
        drawFirework(150, 150, 30);
        drawFirework(300, 100, 40);
        drawFirework(450, 180, 35);
        
        ctx.font = "bold 30px Arial";
        ctx.strokeText("30/4", 280, 350);
    }
    
    function drawFirework(x, y, size) {
        for (let i = 0; i < 8; i++) {
            const angle = Math.PI * 2 * i / 8;
            const endX = x + Math.cos(angle) * size;
            const endY = y + Math.sin(angle) * size;
            
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(endX, endY);
            ctx.stroke();
        }
    }
    
    function drawStar(cx, cy, spikes, outerRadius, innerRadius) {
        let rot = Math.PI / 2 * 3;
        let x = cx;
        let y = cy;
        let step = Math.PI / spikes;

        ctx.beginPath();
        ctx.moveTo(cx, cy - outerRadius);
        
        for (let i = 0; i < spikes; i++) {
            x = cx + Math.cos(rot) * outerRadius;
            y = cy + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = cx + Math.cos(rot) * innerRadius;
            y = cy + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        
        ctx.lineTo(cx, cy - outerRadius);
        ctx.closePath();
        ctx.stroke();
    }
    
    function shareToSocialMedia(platform, imageData, quote) {
        alert(`Đã chia sẻ lên ${platform} với quote: "${quote}"`);
    }
    
    function checkForUnlocks() {
        const nextImage = getNextUnlockableImage();
        
        if (nextImage) {
            imageOptions.forEach(option => {
                if (option.getAttribute('data-image') === nextImage) {
                    option.classList.remove('locked');
                    unlockedImageName.textContent = imageNames[nextImage];
                    unlockModal.style.display = 'block';
                    
                    if (!completedImages.includes(nextImage)) {
                        completedImages.push(nextImage);
                        localStorage.setItem('completedImages', JSON.stringify(completedImages));
                    }
                }
            });
        }
    }
    
    function getNextUnlockableImage() {
        if (completedImages.includes('flag') && !completedImages.includes('hochiminh')) {
            return 'hochiminh';
        } else if (completedImages.includes('hochiminh') && !completedImages.includes('victory')) {
            return 'victory';
        } else if (completedImages.includes('victory') && !completedImages.includes('reunion')) {
            return 'reunion';
        }
        return null;
    }
    
    if (document.getElementById('saveBtn')) {
        const saveBtn = document.getElementById('saveBtn');
        if (saveBtn.parentNode) {
            saveBtn.parentNode.removeChild(saveBtn);
        }
    }
});
document.getElementById("return-home-btn").addEventListener("click", function() {
        window.location.href = "../index.html";
})
