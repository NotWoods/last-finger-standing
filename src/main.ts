import "./style.css";
import "./animation.css";
import { colors } from "./colors";

const arena = document.getElementById("arena")!;

interface Indicator {
  readonly clientX: number;
  readonly clientY: number;
}

class TouchIndicator {
  readonly element: HTMLElement;

  constructor(color: string) {
    this.element = document.createElement("div");
    this.element.classList.add("finger", "finger--spin");
    this.element.style.setProperty("color", color);
  }

  updatePosition(touch: Indicator) {
    this.element.style.setProperty(
      "translate",
      `${touch.clientX}px ${touch.clientY}px`
    );
  }
}

class IndicatorManager {
  indicators = new Map<number, TouchIndicator>();
  i = 0;

  getOrCreateIndicator(identifier: number) {
    return this.indicators.get(identifier) ?? this.addIndicator(identifier);
  }

  addIndicator(identifier: number) {
    const indicator = new TouchIndicator(colors[this.i % colors.length]);
    this.i++;

    this.indicators.set(identifier, indicator);
    arena.append(indicator.element);
    return indicator;
  }

  removeIndicator(identifier: number) {
    const indicator = this.indicators.get(identifier);
    indicator?.element.remove();
    return this.indicators.delete(identifier);
  }
}

let touchList: ArrayLike<Touch> = [];
{
  const manager = new IndicatorManager();
  function renderTouches() {
    const notSeen = new Set(manager.indicators.keys());
    for (let i = 0; i < touchList.length; i++) {
      const touch = touchList[i];

      manager.getOrCreateIndicator(touch.identifier).updatePosition(touch);
      notSeen.delete(touch.identifier);
    }

    for (const identifier of notSeen) {
      manager.removeIndicator(identifier);
    }

    requestAnimationFrame(renderTouches);
  }
  renderTouches();
}

function updateAllTouches(event: TouchEvent) {
  event.preventDefault();
  touchList = event.targetTouches;
}

arena.addEventListener("touchstart", updateAllTouches);
arena.addEventListener("touchmove", updateAllTouches);
arena.addEventListener("touchend", updateAllTouches);
