// Toggles an LED box on/off and returns the new state (true = on).
export function toggleLed(box) {
  const isOn = box.classList.toggle("on");
  box.setAttribute("aria-pressed", String(isOn));
  return isOn;
}

// Sets an LED box to a specific state.
export function setLed(box, isOn) {
  box.classList.toggle("on", isOn);
  box.setAttribute("aria-pressed", String(isOn));
}
