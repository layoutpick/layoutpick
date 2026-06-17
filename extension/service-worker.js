// MV3 background. On a pick: screenshot the visible tab, crop to the element
// rect, and forward to the native host. The action button + Alt+S toggle the
// picker in the active tab.
const NATIVE_HOST = 'com.layoutpick.host'

function cropBox(rect, dpr, img) {
  const scale = dpr > 0 ? dpr : 1
  let x = Math.round(rect.x * scale)
  let y = Math.round(rect.y * scale)
  let w = Math.round(rect.width * scale)
  let h = Math.round(rect.height * scale)
  if (x < 0) { w += x; x = 0 }
  if (y < 0) { h += y; y = 0 }
  if (x + w > img.w) w = img.w - x
  if (y + h > img.h) h = img.h - y
  if (w < 1) w = 1
  if (h < 1) h = 1
  return { x, y, w, h }
}

async function bitmapFromDataUrl(dataUrl) {
  const blob = await (await fetch(dataUrl)).blob()
  return createImageBitmap(blob)
}

async function cropToBase64(bitmap, box) {
  const canvas = new OffscreenCanvas(box.w, box.h)
  const ctx = canvas.getContext('2d')
  ctx.drawImage(bitmap, box.x, box.y, box.w, box.h, 0, 0, box.w, box.h)
  const out = await canvas.convertToBlob({ type: 'image/png' })
  const bytes = new Uint8Array(await out.arrayBuffer())
  // Build the binary string in chunks — a single spread/apply can overflow the
  // call stack on multi-hundred-KB images.
  let binary = ''
  const CHUNK = 0x8000
  for (let i = 0; i < bytes.length; i += CHUNK)
    binary += String.fromCharCode.apply(null, bytes.subarray(i, i + CHUNK))
  return btoa(binary)
}

chrome.runtime.onMessage.addListener((msg, sender) => {
  if (msg.type !== 'pick')
    return
  ;(async () => {
    const payload = JSON.parse(msg.json)
    let pngBase64 = null
    try {
      const dataUrl = await chrome.tabs.captureVisibleTab(sender.tab.windowId, { format: 'png' })
      const bitmap = await bitmapFromDataUrl(dataUrl)
      const dpr = payload.devicePixelRatio || 1
      const r = payload.viewRect || payload.rect
      const viewRect = { x: r.x, y: r.y, width: r.width, height: r.height }
      const box = cropBox(viewRect, dpr, { w: bitmap.width, h: bitmap.height })
      pngBase64 = await cropToBase64(bitmap, box)
    }
    catch (e) { /* screenshot optional */ }
    chrome.runtime.sendNativeMessage(NATIVE_HOST, { payload, pngBase64 }, (resp) => {
      const text = resp && resp.message ? resp.message : (chrome.runtime.lastError ? chrome.runtime.lastError.message : 'sent')
      if (sender.tab && sender.tab.id != null)
        chrome.tabs.sendMessage(sender.tab.id, { type: 'toast', text })
    })
  })()
})

function toggle(tab) {
  if (tab && tab.id != null) chrome.tabs.sendMessage(tab.id, { type: 'toggle' })
}
chrome.action.onClicked.addListener(toggle)
chrome.commands.onCommand.addListener((cmd) => {
  if (cmd === 'toggle-picker')
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => toggle(tabs[0]))
})
