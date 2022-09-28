{
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
}

if ("wakeLock" in navigator) {
  let wakeLock: WakeLockSentinel | undefined;

  async function requestWakeLock() {
    try {
      wakeLock = await navigator.wakeLock.request("screen");
    } catch (err) {
      if (!(err instanceof Error)) throw err;
      console.error(`${err.name}, ${err.message}`);
    }
  }

  requestWakeLock();
  document.addEventListener("visibilitychange", () => {
    if (!wakeLock && document.visibilityState === "visible") {
      requestWakeLock();
    }
  });
}

export {};
