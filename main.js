import { toggleLed } from "./utils/led.js";
import * as serial from "./utils/serial.js";

const ledBoxes = document.querySelectorAll(".led-box");
const connectBtns = document.querySelectorAll(".connect-btn");
const statusEl = document.getElementById("status");

function setStatus(text, ok = false) {
  statusEl.textContent = text;
  statusEl.classList.toggle("ok", ok);
}

function updateConnectButtons() {
  const connected = serial.isConnected();
  connectBtns.forEach((btn) => {
    btn.textContent = connected ? "Disconnect MCU" : "Connect MCU";
    btn.classList.toggle("connected", connected);
  });
}

// LED click: flip on/off, then tell the MCU (protocol: "LED<n>:<0|1>\n")
ledBoxes.forEach((box) => {
  box.addEventListener("click", async () => {
    const isOn = toggleLed(box);
    if (serial.isConnected()) {
      try {
        await serial.send(`LED${box.dataset.led}:${isOn ? 1 : 0}\n`);
      } catch (err) {
        setStatus("Send failed: " + err.message);
      }
    }
  });
});

// Connect / disconnect (both the navbar and main buttons)
connectBtns.forEach((btn) => {
  btn.addEventListener("click", async () => {
    if (!serial.isSerialSupported()) {
      setStatus("Web Serial isn't supported in this browser. Use Chrome or Edge.");
      return;
    }
    try {
      if (serial.isConnected()) {
        await serial.disconnect();
        setStatus("Not connected");
      } else {
        await serial.connect(9600);
        setStatus("Connected", true);
      }
    } catch (err) {
      setStatus("Connection failed: " + err.message);
    }
    updateConnectButtons();
  });
});
