// Song data (using free sample audio files)
const songs = [
  {
    name: "Summer Vibes",
    artist: "The Weeknd",
    img: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  },
  {
    name: "Midnight Drive",
    artist: "Drake",
    img: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
  },
  {
    name: "Electric Dreams",
    artist: "Ed Sheeran",
    img: "https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
  },
  {
    name: "Rock Anthem",
    artist: "Arctic Monkeys",
    img: "https://images.unsplash.com/photo-1487180144351-b8472da7d491?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
  },
  {
    name: "Chill Beats",
    artist: "Billie Eilish",
    img: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
  },
  {
    name: "Latin Rhythm",
    artist: "Bad Bunny",
    img: "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=300&h=300&fit=crop",
    audio: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3",
  },
];

// Get DOM elements
const audioPlayer = document.getElementById("audio-player");
const playPauseBtn = document.getElementById("play-pause-btn");
const progressBar = document.getElementById("progress");
const progressHandle = document.getElementById("progress-handle");
const currentTimeEl = document.getElementById("current-time");
const totalTimeEl = document.getElementById("total-time");
const songNameEl = document.getElementById("song-name");
const artistNameEl = document.getElementById("artist-name");
const playerImg = document.getElementById("player-img");
const volumeProgress = document.getElementById("volume-progress");
const likeBtn = document.querySelector(".like-btn");

// State
let currentSongIndex = 0;
let isPlaying = false;

// Initialize
function init() {
  loadSong(currentSongIndex);
  attachEventListeners();
}

// Load song
function loadSong(index) {
  const song = songs[index];
  audioPlayer.src = song.audio;
  songNameEl.textContent = song.name;
  artistNameEl.textContent = song.artist;
  playerImg.src = song.img;
}

// Play/Pause toggle
function togglePlayPause() {
  if (isPlaying) {
    pauseSong();
  } else {
    playSong();
  }
}

// Play song
function playSong() {
  audioPlayer.play();
  isPlaying = true;
  playPauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
}

// Pause song
function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
}

// Update progress bar
function updateProgress() {
  const { duration, currentTime } = audioPlayer;

  if (duration) {
    const progressPercent = (currentTime / duration) * 100;
    progressBar.style.width = `${progressPercent}%`;
    progressHandle.style.left = `${progressPercent}%`;
  }

  // Update time displays
  currentTimeEl.textContent = formatTime(currentTime);
  totalTimeEl.textContent = formatTime(duration);
}

// Format time (seconds to mm:ss)
function formatTime(seconds) {
  if (isNaN(seconds)) return "0:00";

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

// Set progress
function setProgress(e) {
  const bar = e.currentTarget;
  const clickX = e.offsetX;
  const width = bar.clientWidth;
  const duration = audioPlayer.duration;

  audioPlayer.currentTime = (clickX / width) * duration;
}

// Set volume
function setVolume(e) {
  const bar = e.currentTarget;
  const clickX = e.offsetX;
  const width = bar.clientWidth;

  const volume = clickX / width;
  audioPlayer.volume = volume;
  volumeProgress.style.width = `${volume * 100}%`;
}

// Previous song
function prevSong() {
  currentSongIndex--;
  if (currentSongIndex < 0) {
    currentSongIndex = songs.length - 1;
  }
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// Next song
function nextSong() {
  currentSongIndex++;
  if (currentSongIndex >= songs.length) {
    currentSongIndex = 0;
  }
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// Toggle like
function toggleLike() {
  likeBtn.classList.toggle("liked");
  const icon = likeBtn.querySelector("i");
  if (likeBtn.classList.contains("liked")) {
    icon.classList.remove("far");
    icon.classList.add("fas");
  } else {
    icon.classList.remove("fas");
    icon.classList.add("far");
  }
}

// Attach event listeners
function attachEventListeners() {
  // Play/Pause button
  playPauseBtn.addEventListener("click", togglePlayPause);

  // Audio events
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", nextSong);

  // Progress bar
  document.querySelector(".bar").addEventListener("click", setProgress);

  // Volume bar
  document.querySelector(".volume-bar").addEventListener("click", setVolume);

  // Previous/Next buttons
  const controlBtns = document.querySelectorAll(".control-btn");
  controlBtns.forEach((btn) => {
    const icon = btn.querySelector("i");
    if (icon && icon.classList.contains("fa-step-backward")) {
      btn.addEventListener("click", prevSong);
    }
    if (icon && icon.classList.contains("fa-step-forward")) {
      btn.addEventListener("click", nextSong);
    }
  });

  // Like button
  likeBtn.addEventListener("click", toggleLike);

  // Play buttons on featured items
  const featuredItems = document.querySelectorAll(".featured-item");
  featuredItems.forEach((item) => {
    const playBtn = item.querySelector(".play-btn");
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIndex = parseInt(item.dataset.song);
      currentSongIndex = songIndex;
      loadSong(currentSongIndex);
      playSong();
    });
  });

  // Play buttons on cards
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const playBtn = card.querySelector(".card-play-btn");
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIndex = parseInt(card.dataset.song);
      currentSongIndex = songIndex;
      loadSong(currentSongIndex);
      playSong();
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    if (e.code === "Space" && e.target === document.body) {
      e.preventDefault();
      togglePlayPause();
    }
  });
}

// Initialize the app
init();
