const musicController = () => {
  const music = document.getElementById('bgm');
  const musicBtn = document.getElementById('musicBtn');
  const musicIcon = `<img id="musicIcon" src="/icons/volume-up.svg" alt="music-on" width="32" height="32"/>`;
  const muteIcon = `<img id="muteIcon" src="/icons/volume-mute.svg" alt="music-off" width="32" height="32"/>`;

  musicBtn.addEventListener('click', () => {
    if (music.paused) {
      music.play();
      musicBtn.innerHTML = musicIcon;
    } else {
      music.pause();
      musicBtn.innerHTML = muteIcon;
    }
  });
};

export default musicController;
