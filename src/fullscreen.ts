const fullscreenButton = document.querySelector(".fullscreen-button")!;

fullscreenButton.addEventListener("click", () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
});

document.addEventListener("fullscreenchange", () => {
  fullscreenButton.textContent = document.fullscreenElement
    ? "Exit fullscreen"
    : "Fullscreen";
  fullscreenButton.setAttribute(
    "aria-pressed",
    document.fullscreenElement ? "true" : "false"
  );
});

export {};
