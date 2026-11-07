// Thin wrapper around the Web Serial API (Chrome / Edge / Opera, needs https or localhost).
let port = null;
let writer = null;
const encoder = new TextEncoder();

export function isSerialSupported() {
  return "serial" in navigator;
}

export function isConnected() {
  return port !== null;
}

export async function connect(baudRate = 9600) {
  port = await navigator.serial.requestPort();
  await port.open({ baudRate });
  writer = port.writable.getWriter();
}

export async function disconnect() {
  try {
    if (writer) {
      writer.releaseLock();
      writer = null;
    }
    if (port) await port.close();
  } finally {
    port = null;
  }
}

// Sends one line of text, e.g. "LED1:1\n".
export async function send(text) {
  if (!writer) return;
  await writer.write(encoder.encode(text));
}
