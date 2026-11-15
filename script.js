const playToggle = document.getElementById("playToggle");
const playIcon = document.getElementById("playIcon");
const songButtons = document.querySelectorAll(".song-play");
const audioPlayer = document.getElementById("audioPlayer");
const audioSource = document.getElementById("audioSource");
const range = document.getElementById("range");
const currentTime = document.getElementById("currentTime");
const duration = document.getElementById("duration");
const previousButton = document.getElementById("previousButton");
const nextButton = document.getElementById("nextButton");
const songs = [
    { title: "Alive", file: "songs/song.mp3" },
    { title: "Next", file: "songs/DevotionalHind.mp3" }
    
];
let currentSongIndex = 0;

function formatTime(seconds) {
    if (!Number.isFinite(seconds)) {
        return "0:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function setPlayingState(isPlaying) {
    playIcon.src = isPlaying
        ? "images/pause.png"
        : "images/play-button-arrowhead.png";
    playIcon.alt = isPlaying ? "Pause button" : "Play button";
    playToggle.setAttribute("aria-label", isPlaying ? "Pause song" : "Play song");
    playToggle.setAttribute("aria-pressed", String(isPlaying));
    songButtons.forEach((button, index) => {
        button.textContent = index === currentSongIndex && isPlaying
            ? "Pause song"
            : "Play song";
    });
}

async function loadSong(index, shouldPlay = false) {
    currentSongIndex = (index + songs.length) % songs.length;
    audioSource.src = songs[currentSongIndex].file;
    audioPlayer.load();
    range.value = "0";
    currentTime.textContent = "0:00";
    duration.textContent = "0:00";

    if (shouldPlay) {
        try {
            await audioPlayer.play();
        } catch {
            setPlayingState(false);
            alert(`Add an MP3 file at ${songs[currentSongIndex].file} to play music.`);
        }
    } else {
        setPlayingState(false);
    }
}

async function togglePlayback() {
    if (audioPlayer.paused) {
        await loadSong(currentSongIndex, true);
    } else {
        audioPlayer.pause();
        setPlayingState(false);
    }
}

playToggle.addEventListener("click", togglePlayback);
songButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedIndex = Number(button.dataset.songIndex);
        if (selectedIndex === currentSongIndex) {
            togglePlayback();
        } else {
            loadSong(selectedIndex, true);
        }
    });
});
audioPlayer.addEventListener("play", () => setPlayingState(true));
audioPlayer.addEventListener("pause", () => setPlayingState(false));
audioPlayer.addEventListener("ended", () => {
    loadSong(currentSongIndex + 1, true);
});
audioPlayer.addEventListener("loadedmetadata", () => {
    duration.textContent = formatTime(audioPlayer.duration);
});
audioPlayer.addEventListener("timeupdate", () => {
    currentTime.textContent = formatTime(audioPlayer.currentTime);
    if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        range.value = String((audioPlayer.currentTime / audioPlayer.duration) * 100);
    }
});
range.addEventListener("input", () => {
    if (Number.isFinite(audioPlayer.duration) && audioPlayer.duration > 0) {
        audioPlayer.currentTime = (Number(range.value) / 100) * audioPlayer.duration;
        currentTime.textContent = formatTime(audioPlayer.currentTime);
    }
});

previousButton.addEventListener("click", () => {
    if (audioPlayer.currentTime > 3) {
        audioPlayer.currentTime = 0;
    } else {
        loadSong(currentSongIndex - 1, !audioPlayer.paused);
    }
});

nextButton.addEventListener("click", () => {
    loadSong(currentSongIndex + 1, true);
});
