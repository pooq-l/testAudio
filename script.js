document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('.js-audio');
    const playBtn = player.querySelector('.js-play-btn');
    const playIcon = playBtn.querySelector('i');
    const timeDisplay = player.querySelector('.js-time');
    const progressBar = player.querySelector('.js-progress-bar');
    const progressContainer = player.querySelector('.js-progress-container');

    // 再生・一時停止
    playBtn.addEventListener('click', () => {
        if (audio.paused) {
            // 他のすべての曲を止める
            stopAllOtherAudio(audio);
            audio.play();
            playIcon.classList.replace('bi-play-fill', 'bi-pause-fill');
        } else {
            audio.pause();
            playIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });

    // 時間とシークバーの更新
    audio.addEventListener('timeupdate', () => {
        const current = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration || 0);
        timeDisplay.innerText = `${current} / ${duration}`;
        
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
    });

    // シークバーのクリック操作
    progressContainer.addEventListener('click', (e) => {
        const rect = progressContainer.getBoundingClientRect();
        const clickX = e.clientX - rect.left; // コンテナ内でのクリック位置
        const width = rect.width;
        const duration = audio.duration;
        
        if (duration) {
            audio.currentTime = (clickX / width) * duration;
        }
    });

    // メタデータ読み込み完了時
    audio.addEventListener('loadedmetadata', () => {
        timeDisplay.innerText = `0:00 / ${formatTime(audio.duration)}`;
    });

    // 曲が最後まで再生されたらアイコンを戻す
    audio.addEventListener('ended', () => {
        playIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        progressBar.style.width = '0%';
    });
});

// 自分以外の音声をすべて停止し、アイコンを再生マークに戻す関数
function stopAllOtherAudio(currentAudio) {
    document.querySelectorAll('.audio-player').forEach(otherPlayer => {
        const otherAudio = otherPlayer.querySelector('.js-audio');
        const otherIcon = otherPlayer.querySelector('.js-play-btn i');
        
        if (otherAudio !== currentAudio) {
            otherAudio.pause();
            otherIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });
}

function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
