document.querySelectorAll('.audio-player').forEach(player => {
    const audio = player.querySelector('.js-audio');
    const playBtn = player.querySelector('.js-play-btn');
    const playIcon = playBtn.querySelector('i');
    const timeDisplay = player.querySelector('.js-time');
    const progressBar = player.querySelector('.js-progress-bar');
    const progressContainer = player.querySelector('.js-progress-container');

    // 再生・一時停止の切り替え
    playBtn.addEventListener('click', () => {
        // 他の全ての音声を停止したい場合はここ（任意）
        // document.querySelectorAll('audio').forEach(a => { if(a !== audio) a.pause(); });

        if (audio.paused) {
            audio.play();
            playIcon.classList.replace('bi-play-fill', 'bi-pause-fill');
        } else {
            audio.pause();
            playIcon.classList.replace('bi-pause-fill', 'bi-play-fill');
        }
    });

    // 時間の更新（再生中ずっと動く）
    audio.addEventListener('timeupdate', () => {
        const current = formatTime(audio.currentTime);
        const duration = formatTime(audio.duration || 0);
        timeDisplay.innerText = `${current} / ${duration}`;
        
        // プログレスバーの更新
        const percent = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${percent}%`;
    });

    // シークバーをクリックして再生位置を変える
    progressContainer.addEventListener('click', (e) => {
        const width = progressContainer.clientWidth;
        const clickX = e.offsetX;
        const duration = audio.duration;
        audio.currentTime = (clickX / width) * duration;
    });

    // 読み込み完了時に時間を表示
    audio.addEventListener('loadedmetadata', () => {
        timeDisplay.innerText = `0:00 / ${formatTime(audio.duration)}`;
    });
});

// 秒を「0:00」形式に変換する関数
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}