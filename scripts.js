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
const barTooltip = document.getElementById("bar-tooltip");
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
let isShuffleOn = false;
let repeatMode = 0; // 0: off, 1: repeat all, 2: repeat one
let isMuted = false;
let previousVolume = 1;
let likedSongs = [];
let playlists = [];
let currentView = "home";

// Initialize
function init() {
  loadSong(currentSongIndex);
  attachEventListeners();
  audioPlayer.volume = 1;
  volumeProgress.style.width = "100%";
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
  progressBar.classList.add("playing");
}

// Pause song
function pauseSong() {
  audioPlayer.pause();
  isPlaying = false;
  playPauseBtn.innerHTML = '<i class="fas fa-play"></i>';
  progressBar.classList.remove("playing");
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
  const rect = bar.getBoundingClientRect();
  let clientX;

  if (e.type.includes("touch")) {
    clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
  } else {
    clientX = e.clientX;
  }

  const clickX = clientX - rect.left;
  const width = rect.width;

  const volume = Math.max(0, Math.min(1, clickX / width));
  audioPlayer.volume = volume;
  volumeProgress.style.width = `${volume * 100}%`;
  isMuted = volume === 0;
  updateVolumeIcon();
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
  if (isShuffleOn) {
    let randomIndex;
    do {
      randomIndex = Math.floor(Math.random() * songs.length);
    } while (randomIndex === currentSongIndex && songs.length > 1);
    currentSongIndex = randomIndex;
  } else {
    currentSongIndex++;
    if (currentSongIndex >= songs.length) {
      currentSongIndex = 0;
    }
  }
  loadSong(currentSongIndex);
  if (isPlaying) {
    playSong();
  }
}

// Toggle shuffle
function toggleShuffle() {
  isShuffleOn = !isShuffleOn;
  const shuffleBtn = document.getElementById("shuffle-btn");
  shuffleBtn.classList.toggle("active", isShuffleOn);
}

// Toggle repeat
function toggleRepeat() {
  repeatMode = (repeatMode + 1) % 3;
  const repeatBtn = document.getElementById("repeat-btn");
  const icon = repeatBtn.querySelector("i");

  switch (repeatMode) {
    case 0: // Off
      repeatBtn.classList.remove("active");
      icon.classList.remove("fa-redo-alt");
      icon.classList.add("fa-redo");
      break;
    case 1: // Repeat all
      repeatBtn.classList.add("active");
      icon.classList.remove("fa-redo-alt");
      icon.classList.add("fa-redo");
      break;
    case 2: // Repeat one
      repeatBtn.classList.add("active");
      icon.classList.remove("fa-redo");
      icon.classList.add("fa-redo-alt");
      break;
  }
}

// Handle song end
function handleSongEnd() {
  if (repeatMode === 2) {
    // Repeat one
    audioPlayer.currentTime = 0;
    playSong();
  } else if (repeatMode === 1 || currentSongIndex < songs.length - 1) {
    // Repeat all or not last song
    nextSong();
  } else {
    // Stop at last song
    pauseSong();
    audioPlayer.currentTime = 0;
  }
}

// Toggle mute
function toggleMute() {
  isMuted = !isMuted;
  const muteBtn = document.getElementById("mute-btn");
  const icon = muteBtn.querySelector("i");

  if (isMuted) {
    previousVolume = audioPlayer.volume;
    audioPlayer.volume = 0;
    volumeProgress.style.width = "0%";
    icon.classList.remove("fa-volume-up", "fa-volume-down");
    icon.classList.add("fa-volume-mute");
  } else {
    audioPlayer.volume = previousVolume;
    volumeProgress.style.width = `${previousVolume * 100}%`;
    updateVolumeIcon();
  }
}

// Update volume icon based on level
function updateVolumeIcon() {
  const muteBtn = document.getElementById("mute-btn");
  const icon = muteBtn.querySelector("i");
  const volume = audioPlayer.volume;

  icon.classList.remove("fa-volume-mute", "fa-volume-down", "fa-volume-up");

  if (volume === 0) {
    icon.classList.add("fa-volume-mute");
  } else if (volume < 0.5) {
    icon.classList.add("fa-volume-down");
  } else {
    icon.classList.add("fa-volume-up");
  }
}

// Search functionality
function handleSearch(e) {
  const searchTerm = e.target.value.toLowerCase();
  const cards = document.querySelectorAll(".card");
  const featuredItems = document.querySelectorAll(".featured-item");

  [...cards, ...featuredItems].forEach((item) => {
    const text = item.textContent.toLowerCase();
    if (text.includes(searchTerm)) {
      item.style.display = "";
    } else {
      item.style.display = "none";
    }
  });
}

// Mobile menu toggle
function toggleMobileMenu() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("active");
}

// Switch views
function switchView(viewName) {
  currentView = viewName;

  // Hide all views
  document.querySelectorAll(".content > section").forEach((section) => {
    section.style.display = "none";
  });

  // Show selected view
  let viewId = `${viewName}-view`;
  let viewElement = document.getElementById(viewId);

  if (viewElement) {
    viewElement.style.display = "block";
  }

  // Update nav items
  document.querySelectorAll(".nav-item").forEach((item) => {
    item.classList.remove("active");
  });
  const navItem = document.getElementById(`nav-${viewName}`);
  if (navItem) {
    navItem.classList.add("active");
  }

  // Close mobile menu
  const sidebar = document.getElementById("sidebar");
  if (sidebar) {
    sidebar.classList.remove("active");
  }
}

// Search functionality in search view
function performSearch(searchTerm) {
  const resultsContainer = document.getElementById("search-results");
  if (!resultsContainer) return;
  resultsContainer.innerHTML = "";

  if (!searchTerm.trim()) {
    resultsContainer.innerHTML =
      '<p class="empty-state">Start typing to search songs by name or artist...</p>';
    return;
  }

  const filtered = songs.filter(
    (song) =>
      song.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (filtered.length === 0) {
    resultsContainer.innerHTML = `<p class=\"empty-state\">No results found for "${searchTerm}"</p>`;
    return;
  }

  filtered.forEach((song) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <img src="${song.img}" alt="${song.name}">
      <h3>${song.name}</h3>
      <p>${song.artist}</p>
      <button class="card-play-btn"><i class="fas fa-play"></i></button>
    `;
    card.querySelector(".card-play-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      currentSongIndex = songs.indexOf(song);
      loadSong(currentSongIndex);
      playSong();
    });

    // Right-click context menu for adding to playlist
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      showAddToPlaylistMenu(song, e);
    });

    resultsContainer.appendChild(card);
  });
}

// Update liked songs view
function updateLikedSongsView() {
  const likedContainer = document.getElementById("liked-songs-list");
  if (!likedContainer) return;
  likedContainer.innerHTML = "";

  if (likedSongs.length === 0) {
    likedContainer.innerHTML =
      '<p class="empty-state">No liked songs yet. Like songs while playing to add them here!</p>';
  } else {
    likedSongs.forEach((song, idx) => {
      const item = document.createElement("div");
      item.className = "liked-song-item";
      item.innerHTML = `
        <div class="liked-song-info">
          <img src="${song.img}" alt="${song.name}">
          <div class="liked-song-text">
            <h4>${song.name}</h4>
            <p>${song.artist}</p>
          </div>
        </div>
        <div class="liked-song-actions">
          <button class="play-liked-btn" title="Play"><i class="fas fa-play"></i></button>
          <button class="unlike-btn" title="Unlike"><i class="fas fa-trash"></i></button>
        </div>
      `;
      item.querySelector(".play-liked-btn").addEventListener("click", () => {
        currentSongIndex = songs.indexOf(song);
        loadSong(currentSongIndex);
        playSong();
      });
      item.querySelector(".unlike-btn").addEventListener("click", () => {
        likedSongs.splice(idx, 1);
        updateLikedSongsView();
      });

      // Add right-click context menu for playlists on liked songs
      item.addEventListener("contextmenu", (e) => {
        e.preventDefault();
        showAddToPlaylistMenu(song, e);
      });

      likedContainer.appendChild(item);
    });
  }
}

// Drag progress bar
let isDragging = false;

function startDrag(e) {
  isDragging = true;
  updateProgressFromEvent(e);
}

function drag(e) {
  if (isDragging) {
    updateProgressFromEvent(e);
  }
}

function stopDrag() {
  isDragging = false;
}

function updateProgressFromEvent(e) {
  const bar = document.querySelector(".bar");
  const rect = bar.getBoundingClientRect();
  let clientX;

  if (e.type.includes("touch")) {
    clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
  } else {
    clientX = e.clientX;
  }

  const clickX = clientX - rect.left;
  const width = rect.width;
  const duration = audioPlayer.duration;

  if (duration && clickX >= 0 && clickX <= width) {
    audioPlayer.currentTime = (clickX / width) * duration;
  }
}

// Show tooltip on progress bar hover
function showProgressTooltip(e) {
  const bar = document.querySelector(".bar");
  const rect = bar.getBoundingClientRect();
  let clientX;

  if (e.type.includes("touch")) {
    clientX = e.touches[0]?.clientX || e.changedTouches[0]?.clientX;
  } else {
    clientX = e.clientX;
  }

  const clickX = clientX - rect.left;
  const width = rect.width;
  const duration = audioPlayer.duration;

  if (duration && clickX >= 0 && clickX <= width) {
    const percentage = (clickX / width) * 100;
    const time = (clickX / width) * duration;

    barTooltip.style.left = `${percentage}%`;
    barTooltip.textContent = formatTime(time);
  }
}

// Attach event listeners
function attachEventListeners() {
  // Play/Pause button
  playPauseBtn.addEventListener("click", togglePlayPause);

  // Audio events
  audioPlayer.addEventListener("timeupdate", updateProgress);
  audioPlayer.addEventListener("ended", handleSongEnd);

  // Progress bar - desktop and mobile
  const progressBarElement = document.querySelector(".bar");
  progressBarElement.addEventListener("click", setProgress);
  progressBarElement.addEventListener("mousedown", startDrag);
  progressBarElement.addEventListener("touchstart", startDrag);
  progressBarElement.addEventListener("mousemove", showProgressTooltip);
  progressBarElement.addEventListener("mouseleave", () => {
    barTooltip.style.opacity = "0";
  });
  progressBarElement.addEventListener("mouseenter", () => {
    barTooltip.style.opacity = "1";
  });
  document.addEventListener("mousemove", drag);
  document.addEventListener("touchmove", drag);
  document.addEventListener("mouseup", stopDrag);
  document.addEventListener("touchend", stopDrag);

  // Volume bar
  const volumeBar = document.querySelector(".volume-bar");
  volumeBar.addEventListener("click", setVolume);
  volumeBar.addEventListener("touchstart", setVolume);

  // Previous/Next buttons
  document.getElementById("prev-btn").addEventListener("click", prevSong);
  document.getElementById("next-btn").addEventListener("click", nextSong);

  // Shuffle and Repeat buttons
  document
    .getElementById("shuffle-btn")
    .addEventListener("click", toggleShuffle);
  document.getElementById("repeat-btn").addEventListener("click", toggleRepeat);

  // Mute button
  document.getElementById("mute-btn").addEventListener("click", toggleMute);

  // Like button
  likeBtn.addEventListener("click", toggleLike);

  // Toggle like functionality
  function toggleLike() {
    likeBtn.classList.toggle("liked");
    const icon = likeBtn.querySelector("i");
    const song = songs[currentSongIndex];

    if (likeBtn.classList.contains("liked")) {
      icon.classList.remove("far");
      icon.classList.add("fas");
      // Add to liked songs if not already there
      if (
        !likedSongs.find(
          (s) => s.name === song.name && s.artist === song.artist
        )
      ) {
        likedSongs.push(song);
      }
    } else {
      icon.classList.remove("fas");
      icon.classList.add("far");
      // Remove from liked songs
      likedSongs = likedSongs.filter(
        (s) => !(s.name === song.name && s.artist === song.artist)
      );
    }
    updateLikedSongsView();
  }

  // Mobile menu
  const mobileMenuBtn = document.getElementById("mobile-menu-btn");
  const mobileMenuClose = document.getElementById("mobile-menu-close");
  const sidebar = document.getElementById("sidebar");

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener("click", toggleMobileMenu);
  }

  if (mobileMenuClose) {
    mobileMenuClose.addEventListener("click", toggleMobileMenu);
  }

  // Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (
      sidebar.classList.contains("active") &&
      !sidebar.contains(e.target) &&
      !mobileMenuBtn.contains(e.target)
    ) {
      sidebar.classList.remove("active");
    }
  });

  // Search functionality
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", handleSearch);
  }

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

    // Add right-click context menu for playlists
    item.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const songIndex = parseInt(item.dataset.song);
      showAddToPlaylistMenu(songs[songIndex], e);
    });
  });

  // Play buttons on cards
  const cards = document.querySelectorAll(".card");
  cards.forEach((card) => {
    const playBtn = card.querySelector(".card-play-btn");
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIndex = parseInt(card.dataset.song);
      if (songIndex !== undefined) {
        currentSongIndex = songIndex;
        loadSong(currentSongIndex);
        playSong();
      } else {
        // For dynamically created cards
        const song = songs.find(
          (s) => s.name === card.querySelector("h3").textContent
        );
        if (song) {
          currentSongIndex = songs.indexOf(song);
          loadSong(currentSongIndex);
          playSong();
        }
      }
    });

    // Add right-click context menu for playlists on cards
    card.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      const songIndex = parseInt(card.dataset.song);
      if (songIndex !== undefined && songs[songIndex]) {
        showAddToPlaylistMenu(songs[songIndex], e);
      }
    });
  });

  // Keyboard shortcuts
  document.addEventListener("keydown", (e) => {
    // Allow Escape to close modals/menus even in input fields
    if (e.code === "Escape") {
      const modal = document.getElementById("playlistModal");
      if (modal) modal.remove();
      const menu = document.getElementById("addToPlaylistMenu");
      if (menu) menu.remove();
      return;
    }

    if (e.target.tagName === "INPUT") return;

    switch (e.code) {
      case "Space":
        e.preventDefault();
        togglePlayPause();
        break;
      case "ArrowRight":
        audioPlayer.currentTime = Math.min(
          audioPlayer.currentTime + 5,
          audioPlayer.duration
        );
        break;
      case "ArrowLeft":
        audioPlayer.currentTime = Math.max(audioPlayer.currentTime - 5, 0);
        break;
      case "ArrowUp":
        e.preventDefault();
        audioPlayer.volume = Math.min(audioPlayer.volume + 0.1, 1);
        volumeProgress.style.width = `${audioPlayer.volume * 100}%`;
        updateVolumeIcon();
        break;
      case "ArrowDown":
        e.preventDefault();
        audioPlayer.volume = Math.max(audioPlayer.volume - 0.1, 0);
        volumeProgress.style.width = `${audioPlayer.volume * 100}%`;
        updateVolumeIcon();
        break;
      case "KeyM":
        toggleMute();
        break;
      case "KeyS":
        toggleShuffle();
        break;
      case "KeyR":
        toggleRepeat();
        break;
    }
  });

  // Queue button
  const queueBtn = document.getElementById("queue-btn");
  if (queueBtn) {
    queueBtn.addEventListener("click", showQueueModal);
  }

  // Fullscreen button
  const fullscreenBtn = document.getElementById("fullscreen-btn");
  if (fullscreenBtn) {
    fullscreenBtn.addEventListener("click", toggleFullscreen);
  }
  // Profile dropdown toggle
  const profileBtn = document.getElementById("profile-btn");
  const profileDropdown = document.getElementById("profile-dropdown");

  if (profileBtn && profileDropdown) {
    profileBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      profileDropdown.classList.toggle("active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !profileBtn.contains(e.target) &&
        !profileDropdown.contains(e.target)
      ) {
        profileDropdown.classList.remove("active");
      }
    });

    // Close dropdown when clicking a menu item
    profileDropdown.querySelectorAll(".profile-item").forEach((item) => {
      item.addEventListener("click", (e) => {
        e.preventDefault();
        profileDropdown.classList.remove("active");
        // Handle menu item click (you can add specific actions here)
        console.log("Menu item clicked:", item.textContent.trim());
      });
    });
  }

  // Prevent control button clicks from being blocked
  document.querySelectorAll(".control-btn, .play-pause").forEach((btn) => {
    // Prevent touch delay on mobile
    btn.addEventListener("touchend", (e) => {
      e.preventDefault();
      btn.click();
    });
  });

  // Artist follow buttons
  const artistFollowBtns = document.querySelectorAll(".artist-follow-btn");
  artistFollowBtns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      // Show a visual feedback
      btn.style.transform = "scale(0.95)";
      setTimeout(() => {
        btn.style.transform = "";
      }, 150);
      // Play random song from that artist (first available)
      const randomSongIndex = Math.floor(Math.random() * songs.length);
      currentSongIndex = randomSongIndex;
      loadSong(currentSongIndex);
      playSong();
    });
  });

  // Artists slider functionality
  const artistsPrevBtn = document.getElementById("artists-prev");
  const artistsNextBtn = document.getElementById("artists-next");
  const artistsSlider = document.getElementById("artists-slider");
  const artistsContainer = artistsSlider
    ? artistsSlider.querySelector(".artists-container")
    : null;

  if (artistsContainer) {
    const cardWidth = 180; // Width of artist card
    const cardGap = 20; // Gap between cards
    const scrollAmount = cardWidth + cardGap;

    function updateSliderButtons() {
      const scrollLeft = artistsSlider.scrollLeft;
      const maxScroll =
        artistsContainer.offsetWidth - artistsSlider.offsetWidth;

      artistsPrevBtn.disabled = scrollLeft <= 0;
      artistsNextBtn.disabled = scrollLeft >= maxScroll;
    }

    artistsPrevBtn.addEventListener("click", () => {
      artistsSlider.scrollBy({
        left: -scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateSliderButtons, 400);
    });

    artistsNextBtn.addEventListener("click", () => {
      artistsSlider.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
      setTimeout(updateSliderButtons, 400);
    });

    // Update button states on scroll
    artistsSlider.addEventListener("scroll", updateSliderButtons);

    // Update initial button states
    updateSliderButtons();
  }
}

// Initialize the app
init();

// Add navigation view switching
document.querySelectorAll(".nav-item").forEach((item) => {
  item.addEventListener("click", (e) => {
    e.preventDefault();
    const viewName = item.getAttribute("data-view");
    if (viewName) {
      switchView(viewName);
    }
  });
});

// Initialize search in search view
const searchContentInput = document.getElementById("search-content-input");
if (searchContentInput) {
  searchContentInput.addEventListener("input", (e) => {
    performSearch(e.target.value);
  });

  // Clear search when entering the view
  searchContentInput.addEventListener("focus", (e) => {
    e.target.value = "";
    performSearch("");
  });
}

// Initialize create playlist form
const createPlaylistBtn = document.querySelector(".btn-create-playlist");
if (createPlaylistBtn) {
  createPlaylistBtn.addEventListener("click", () => {
    const nameInput = document.getElementById("playlist-name");
    const descInput = document.getElementById("playlist-desc");
    const msgDiv = document.getElementById("playlist-created-msg");

    if (nameInput.value.trim()) {
      playlists.push({
        name: nameInput.value,
        description: descInput.value,
        songs: [],
      });
      nameInput.value = "";
      descInput.value = "";
      msgDiv.style.display = "block";
      setTimeout(() => {
        msgDiv.style.display = "none";
      }, 3000);
      updateLibraryView();
    }
  });
}

// Initialize library view
function updateLibraryView() {
  const playlistsContainer = document.getElementById("library-playlists");
  if (!playlistsContainer) return;
  playlistsContainer.innerHTML = "";

  if (playlists.length === 0) {
    playlistsContainer.innerHTML =
      '<p class="empty-state">No playlists yet. Create one from the sidebar!</p>';
  } else {
    playlists.forEach((playlist, idx) => {
      const card = document.createElement("div");
      card.className = "playlist-card-wrapper";
      
      card.innerHTML = `
        <div class="playlist-card-header" onclick="viewPlaylist(${idx})">
          <h4>${playlist.name}</h4>
          <p>${playlist.description || "No description"}</p>
          <p style="margin-top: 8px; font-size: 11px; color: #1db954; font-weight: 600;">${
            playlist.songs.length
          } song${playlist.songs.length !== 1 ? "s" : ""}</p>
        </div>
        ${playlist.songs.length > 0 ? `
          <div class="playlist-songs-preview">
            ${playlist.songs.slice(0, 4).map((song, songIdx) => `
              <div class="song-preview-card">
                <img src="${song.img}" alt="${song.name}">
                <div class="song-preview-info">
                  <p class="song-preview-name">${song.name}</p>
                  <p class="song-preview-artist">${song.artist}</p>
                </div>
              </div>
            `).join("")}
          </div>
        ` : `<div class="empty-playlist-preview"><p>No songs yet</p></div>`}
      `;
      
      playlistsContainer.appendChild(card);
    });
  }
}

// View playlist contents
function viewPlaylist(playlistIndex) {
  const playlist = playlists[playlistIndex];

  // Create modal
  const modal = document.createElement("div");
  modal.className = "playlist-modal active";
  modal.id = "playlistModal";
  modal.innerHTML = `
    <div class="playlist-modal-content">
      <div class="playlist-modal-header">
        <h2>${playlist.name}</h2>
        <button class="modal-close-btn">&times;</button>
      </div>
      <p class="playlist-modal-description">${
        playlist.description || "No description"
      }</p>
      <button class="btn-add-songs" id="btn-add-songs-to-playlist">+ Add Songs</button>
      <div class="playlist-songs-list">
        ${
          playlist.songs.length === 0
            ? `<p class="empty-state">No songs in this playlist. Add songs from the home or search view!</p>`
            : playlist.songs
                .map(
                  (song, idx) => `
            <div class="playlist-song-item">
              <img src="${song.img}" alt="${song.name}" class="playlist-song-img">
              <div class="playlist-song-info">
                <p class="playlist-song-name">${song.name}</p>
                <p class="playlist-song-artist">${song.artist}</p>
              </div>
              <div class="playlist-song-actions">
                <button class="playlist-song-btn play-btn-small" data-song-idx="${idx}" title="Play"><i class="fas fa-play"></i></button>
                <button class="playlist-song-btn remove-btn-small" data-song-idx="${idx}" title="Remove"><i class="fas fa-trash"></i></button>
              </div>
            </div>
          `
                )
                .join("")
        }
      </div>
    </div>
  `;

  document.body.appendChild(modal);

  // Close modal handlers
  const closeBtn = modal.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", () => {
    modal.remove();
  });

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      modal.remove();
    }
  });

  // Add songs button
  const addSongsBtn = modal.querySelector("#btn-add-songs-to-playlist");
  if (addSongsBtn) {
    addSongsBtn.addEventListener("click", () => {
      showAvailableSongsToAdd(playlistIndex, modal);
    });
  }

  // Play song from playlist
  modal.querySelectorAll(".play-btn-small").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIdx = parseInt(btn.dataset.songIdx);
      currentSongIndex = songs.indexOf(playlist.songs[songIdx]);
      loadSong(currentSongIndex);
      playSong();
    });
  });

  // Remove song from playlist
  modal.querySelectorAll(".remove-btn-small").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIdx = parseInt(btn.dataset.songIdx);
      playlist.songs.splice(songIdx, 1);
      modal.remove();
      viewPlaylist(playlistIndex);
    });
  });
}

// Show available songs to add to playlist
function showAvailableSongsToAdd(playlistIndex, parentModal) {
  const playlist = playlists[playlistIndex];
  
  // Create overlay modal for song selection
  const overlay = document.createElement("div");
  overlay.className = "playlist-modal active";
  overlay.id = "addSongsModal";
  overlay.innerHTML = `
    <div class="playlist-modal-content" style="max-height: 80vh; overflow-y: auto;">
      <div class="playlist-modal-header">
        <h2>Add Songs to ${playlist.name}</h2>
        <button class="modal-close-btn">&times;</button>
      </div>
      <div class="available-songs-list">
        ${songs.map((song, idx) => {
          const isAlreadyAdded = playlist.songs.some(s => s.name === song.name && s.artist === song.artist);
          return `
            <div class="available-song-item">
              <img src="${song.img}" alt="${song.name}" class="playlist-song-img">
              <div class="playlist-song-info">
                <p class="playlist-song-name">${song.name}</p>
                <p class="playlist-song-artist">${song.artist}</p>
              </div>
              <button class="add-song-to-playlist-btn ${isAlreadyAdded ? 'added' : ''}" 
                      data-song-idx="${idx}" 
                      ${isAlreadyAdded ? 'disabled' : ''}>
                <i class="fas fa-${isAlreadyAdded ? 'check' : 'plus'}"></i> 
                ${isAlreadyAdded ? 'Added' : 'Add'}
              </button>
            </div>
          `;
        }).join("")}
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  // Close handler
  const closeBtn = overlay.querySelector(".modal-close-btn");
  closeBtn.addEventListener("click", () => {
    overlay.remove();
  });

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) {
      overlay.remove();
    }
  });

  // Add song handlers
  overlay.querySelectorAll(".add-song-to-playlist-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const songIdx = parseInt(btn.dataset.songIdx);
      const song = songs[songIdx];
      
      // Check if song is already in playlist
      const isAlreadyAdded = playlist.songs.some(s => s.name === song.name && s.artist === song.artist);
      
      if (!isAlreadyAdded) {
        playlist.songs.push(song);
        btn.classList.add("added");
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-check"></i> Added';
        
        // Update library view and parent modal
        updateLibraryView();
        if (parentModal) {
          parentModal.remove();
          viewPlaylist(playlistIndex);
        }
      }
    });
  });
}

// Add song to playlist
function showAddToPlaylistMenu(song, event) {
  if (playlists.length === 0) {
    alert("No playlists created yet. Create one first!");
    return;
  }

  event.stopPropagation();

  // Remove existing menu if present
  const existingMenu = document.getElementById("addToPlaylistMenu");
  if (existingMenu) {
    existingMenu.remove();
  }

  // Create dropdown menu
  const menu = document.createElement("div");
  menu.className = "add-to-playlist-menu active";
  menu.id = "addToPlaylistMenu";
  menu.innerHTML = `
    <div class="menu-header">Add to Playlist</div>
    <div class="menu-items">
      ${playlists
        .map(
          (playlist, idx) => `
        <div class="menu-item" data-playlist-idx="${idx}">
          <span>${playlist.name}</span>
          <span class="song-count">${playlist.songs.length}</span>
        </div>
      `
        )
        .join("")}
    </div>
  `;

  document.body.appendChild(menu);

  // Position menu near cursor
  if (event.clientX && event.clientY) {
    const x = event.clientX;
    const y = event.clientY;
    menu.style.left = x + "px";
    menu.style.top = y + "px";
  }

  // Handle playlist selection
  menu.querySelectorAll(".menu-item").forEach((item) => {
    item.addEventListener("click", () => {
      const playlistIdx = parseInt(item.dataset.playlistIdx);
      const playlist = playlists[playlistIdx];

      // Check if song already exists in playlist
      if (
        playlist.songs.find(
          (s) => s.name === song.name && s.artist === song.artist
        )
      ) {
        alert("Song already in this playlist!");
      } else {
        playlist.songs.push(song);
        alert(`Added "${song.name}" to "${playlist.name}"!`);
      }

      menu.remove();
    });
  });

  // Close menu when clicking outside
  setTimeout(() => {
    document.addEventListener(
      "click",
      (e) => {
        if (!menu.contains(e.target)) {
          menu.remove();
        }
      },
      { once: true }
    );
  }, 10);
}

// Show Queue Modal
function showQueueModal() {
  const existingQueue = document.getElementById("queueModal");
  if (existingQueue) {
    existingQueue.remove();
    return;
  }

  const queueModal = document.createElement("div");
  queueModal.className = "queue-modal active";
  queueModal.id = "queueModal";

  // Get upcoming songs
  let upcomingSongs = [];
  for (let i = currentSongIndex + 1; i < songs.length; i++) {
    upcomingSongs.push(songs[i]);
  }

  queueModal.innerHTML = `
    <div class="queue-header">
      <h3>Queue</h3>
      <button class="queue-close-btn">&times;</button>
    </div>
    <div class="queue-list">
      <div style="padding: 12px; font-size: 12px; color: #b3b3b3; font-weight: 600;">NOW PLAYING</div>
      <div class="queue-song-item current">
        <img src="${songs[currentSongIndex].img}" alt="${
    songs[currentSongIndex].name
  }" class="queue-song-img">
        <div class="queue-song-info">
          <p class="queue-song-name">${songs[currentSongIndex].name}</p>
          <p class="queue-song-artist">${songs[currentSongIndex].artist}</p>
        </div>
      </div>
      
      <div style="padding: 12px; margin-top: 8px; font-size: 12px; color: #b3b3b3; font-weight: 600;">NEXT UP</div>
      ${
        upcomingSongs.length === 0
          ? `<div class="queue-empty">No more songs in the queue</div>`
          : upcomingSongs
              .map(
                (song, idx) => `
          <div class="queue-song-item" data-song-idx="${
            currentSongIndex + idx + 1
          }">
            <img src="${song.img}" alt="${song.name}" class="queue-song-img">
            <div class="queue-song-info">
              <p class="queue-song-name">${song.name}</p>
              <p class="queue-song-artist">${song.artist}</p>
            </div>
          </div>
        `
              )
              .join("")
      }
    </div>
  `;

  document.body.appendChild(queueModal);

  // Close queue modal
  queueModal.querySelector(".queue-close-btn").addEventListener("click", () => {
    queueModal.remove();
  });

  // Click on song to play it
  queueModal.querySelectorAll(".queue-song-item").forEach((item) => {
    item.addEventListener("click", () => {
      const songIdx = parseInt(item.dataset.songIdx);
      if (!isNaN(songIdx)) {
        currentSongIndex = songIdx;
        loadSong(currentSongIndex);
        playSong();
        queueModal.remove();
      }
    });
  });

  // Close when clicking outside
  document.addEventListener(
    "click",
    (e) => {
      if (!queueModal.contains(e.target) && e.target.id !== "queue-btn") {
        queueModal.remove();
      }
    },
    { once: true }
  );
}

// Toggle Fullscreen Player
function toggleFullscreen() {
  const player = document.querySelector(".music-player");
  player.classList.toggle("fullscreen");

  const fullscreenBtn = document.getElementById("fullscreen-btn");
  const icon = fullscreenBtn.querySelector("i");

  if (player.classList.contains("fullscreen")) {
    icon.classList.remove("fa-expand");
    icon.classList.add("fa-compress");
    // Prevent scrolling when in fullscreen
    document.body.style.overflow = "hidden";
    // Close queue if open
    const queue = document.getElementById("queueModal");
    if (queue) queue.remove();
  } else {
    icon.classList.remove("fa-compress");
    icon.classList.add("fa-expand");
    document.body.style.overflow = "";
  }
}

// Exit fullscreen on Escape key
document.addEventListener("keydown", (e) => {
  if (e.code === "Escape") {
    const player = document.querySelector(".music-player");
    if (player.classList.contains("fullscreen")) {
      toggleFullscreen();
    }
  }
});
