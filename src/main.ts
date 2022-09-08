import "./style.css";
import "./animation.css";
import { colors } from "./colors";

/**
 * Returns a random integer between 0 (included) and length (excluded).
 * Good for picking an index in an array.
 */
function randomIndex(length: number) {
  return Math.floor(Math.random() * length);
}

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

  animateIn() {
    return this.element.animate([{ scale: 0 }, { scale: 1 }], {
      duration: 300,
    });
  }

  animateOut() {
    return this.element.animate([{ scale: 1 }, { scale: 0 }], {
      duration: 300,
    });
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
  pickedId: number | undefined;
  pickedIndicator: TouchIndicator | undefined;

  getOrCreateIndicator(identifier: number) {
    return this.indicators.get(identifier) ?? this.addIndicator(identifier);
  }

  addIndicator(identifier: number) {
    const indicator = new TouchIndicator(colors[randomIndex(colors.length)]);

    this.indicators.set(identifier, indicator);
    arena.append(indicator.element);
    indicator.animateIn();
    return indicator;
  }

  removeIndicator(identifier: number) {
    const indicator = this.indicators.get(identifier);
    if (indicator) {
      const animation = indicator.animateOut();
      animation.onfinish = () => indicator.element.remove();
    }
    return this.indicators.delete(identifier);
  }
}

class TouchPicker {
  touchList: ArrayLike<Touch> = [];
  picked: Touch | undefined;

  private pickTimeoutId: number | undefined;
  private resetTimeoutId: number | undefined;

  /**
   * Update the list of fingers to display.
   */
  updateList(touchList: ArrayLike<Touch>) {
    this.touchList = touchList;
  }

  /**
   * Returns an interator over the touch list.
   * Alters the displayed list of fingers to highlight the picked one.
   */
  *touchesToDisplay() {
    if (this.picked) {
      yield this.picked;
    } else {
      for (let i = 0; i < this.touchList.length; i++) {
        yield this.touchList[i];
      }
    }
  }

  pick = () => {
    this.picked = this.touchList[randomIndex(this.touchList.length)];
    navigator.vibrate(100);
    console.log("Picked", this.picked.identifier);
  };

  reset = () => {
    this.picked = undefined;
    console.log("Reset");
  };

  resetTimers() {
    clearTimeout(this.pickTimeoutId);
    clearTimeout(this.resetTimeoutId);

    if (this.touchList.length > 1) {
      // Automatically pick a finger after 2 seconds
      this.pickTimeoutId = setTimeout(this.pick, 2000);
    } else if (this.picked && this.touchList.length === 0) {
      // If all the fingers have been removed, reset the picked finger after 2 seconds
      this.resetTimeoutId = setTimeout(this.reset, 2000);
    }
  }
}

const picker = new TouchPicker();
{
  const manager = new IndicatorManager();

  function renderTouches() {
    const notSeen = new Set(manager.indicators.keys());
    for (const touch of picker.touchesToDisplay()) {
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
  picker.updateList(event.targetTouches);
}
function addOrRemoveTouch(event: TouchEvent) {
  updateAllTouches(event);
  picker.resetTimers();
}

arena.addEventListener("touchmove", updateAllTouches);
arena.addEventListener("touchstart", addOrRemoveTouch);
arena.addEventListener("touchend", addOrRemoveTouch);
