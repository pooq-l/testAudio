document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('.js-audio');
    const playBtn = player.querySelector('.js-play-btn');
    const playIcon = playBtn.querySelector('i');
    const timeDisplay = player.querySelector('.js-time');
    const progressBar = player.querySelector('.js-progress-bar');
    const progressContainer = player.querySelector('.js-progress-container');

    let isDragging = false;

    // 再生・一時停止
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            stopAllOtherAudio(audio);
            audio.play();
            playIcon.classList.replace('bi-play-fill', 'bi-pause-fill');
        } else {
            audio.pause();
            playIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });

    // 再生中の更新
    audio.addEventListener('timeupdate', () => {
        if (!isDragging) {
            updateUI();
        }
    });

    // ★ 再生終了時のリセット処理 ★
    audio.addEventListener('ended', () => {
        audio.currentTime = 0; // 時間を最初に戻す
        playIcon.classList.replace('bi-pause-fill', 'bi-play-fill'); // アイコンを再生に戻す
        updateUI(); // バーと時間を0に戻す
    });

    function updateUI() {
        const current = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration || 0);
        timeDisplay.innerText = `${current} / ${duration}`;
        const percent = (audio.currentTime / (audio.duration || 1)) * 100;
        progressBar.style.width = `${percent}%`;
    }

    // ★ スライド（ドラッグ）操作の実装 ★
    const startDrag = (e) => {
        isDragging = true;
        progressBar.style.transition = 'none'; // 操作中はアニメーションをオフにして追従性アップ
        dragUpdate(e);
    };

    const dragUpdate = (e) => {
        if (!isDragging) return;
        const rect = progressContainer.querySelector('.progress-inner').getBoundingClientRect();
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let x = clientX - rect.left;
        x = Math.max(0, Math.min(x, rect.width)); // 範囲外に行かないよう固定
        const ratio = x / rect.width;
        
        progressBar.style.width = `${ratio * 100}%`;
        if (audio.duration) {
            audio.currentTime = ratio * audio.duration;
        }
    };

    const stopDrag = () => {
        if (isDragging) {
            isDragging = false;
            progressBar.style.transition = 'width 0.1s linear';
        }
    };

    // マウス操作
    progressContainer.addEventListener('mousedown', startDrag);
    window.addEventListener('mousemove', dragUpdate);
    window.addEventListener('mouseup', stopDrag);

    // タッチ操作（モバイル）
    progressContainer.addEventListener('touchstart', (e) => {
        startDrag(e);
        // スクロールを防止したい場合は e.preventDefault();
    }, { passive: false });
    window.addEventListener('touchmove', dragUpdate, { passive: false });
    window.addEventListener('touchend', stopDrag);

    audio.addEventListener('loadedmetadata', updateUI);
});

function stopAllOtherAudio(currentAudio) {
    document.querySelectorAll('.js-audio').forEach(otherAudio => {
        if (otherAudio !== currentAudio) {
            otherAudio.pause();
            const icon = otherAudio.closest('.audio-player').querySelector('.js-play-btn i');
            icon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
