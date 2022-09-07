import "./style.css";
import "./animation.css";

const arena = document.getElementById("arena")!;

class TouchIndicator {
  readonly element: HTMLElement;

  constructor() {
    this.element = document.createElement("div");
    this.element.classList.add("finger", "finger--spin");
    this.element.style.setProperty("--color", `blue`);
  }

  updatePosition(touch: Touch) {
    this.element.style.setProperty(
      "--size",
      `${Math.max(touch.radiusX, touch.radiusY)}px`
    );
    this.element.style.setProperty(
      "transform",
      `${touch.clientX}px ${touch.clientY}px`
    );
  }
}

let touchList: ArrayLike<Touch> = [];
{
  const indicators = new Map<Touch["identifier"], TouchIndicator>();
  function renderTouches() {
    const notSeen = new Set(indicators.keys());
    for (let i = 0; i < touchList.length; i++) {
      const touch = touchList[i];

      let indicator = indicators.get(touch.identifier);
      if (!indicator) {
        indicator = new TouchIndicator();
        indicators.set(touch.identifier, indicator);
        arena.append(indicator.element);
      }

      indicator.updatePosition(touch);
      notSeen.delete(touch.identifier);
    }

    for (const identifier of notSeen) {
      const indicator = indicators.get(identifier);
      if (indicator) {
        indicators.delete(identifier);
        indicator.element.remove();
      }
    }

    requestAnimationFrame(renderTouches);
  }
  renderTouches();
}

arena.addEventListener("touchstart", (event) => {
  touchList = event.targetTouches;
});
arena.addEventListener("touchmove", (event) => {
  touchList = event.targetTouches;
});
arena.addEventListener("touchend", (event) => {
  touchList = event.targetTouches;
});
