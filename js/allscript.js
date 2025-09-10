document.addEventListener("DOMContentLoaded", () => {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");
  const closeBtn = document.getElementById("closeBtn");

  // klik item galeri
  document.querySelectorAll(".gallery-item img").forEach(el => {
    el.addEventListener("click", () => openLightbox(el));
  });
});

// === Open lightbox ===
function openLightbox(el) {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");

  // reset
  content.innerHTML = "";

  // cek video
  const videoSrc = el.getAttribute("data-video");
  if (videoSrc) {
    const video = document.createElement("video");
    video.src = videoSrc;
    video.controls = true;
    video.autoplay = true;
    video.muted = true;
    video.preload = "auto";
    video.poster = el.src;
    content.appendChild(video);
  } else {
    const img = document.createElement("img");
    img.src = el.src;
    content.appendChild(img);
  }

  lightbox.style.display = "flex";
}

// === Close lightbox ===
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  const content = document.getElementById("lightbox-content");

  // stop & reset
  content.innerHTML = "";
  lightbox.style.display = "none";
}

function goBack() {
  window.history.back();
}

// close kalau klik background
document.getElementById("lightbox").addEventListener("click", closeLightbox);