// MAIN world. The overlay (appended below by build:ext) calls
// window.EMIT_BROWSE_LITE_ELEMENT_PICKED(json); forward it to the isolated world.
window.EMIT_BROWSE_LITE_ELEMENT_PICKED = function (json) {
  window.postMessage({ __cpPick: true, json }, '*')
}
// Allow the service worker (via the relay) to toggle the picker.
window.addEventListener('message', function (e) {
  if (e.source !== window || !e.data)
    return
  if (e.data.__cpToggle)
    window.__noticedPickerSetActive && window.__noticedPickerSetActive()
  else if (e.data.__cpToast)
    window.__noticedPickerShowToast && window.__noticedPickerShowToast(e.data.text)
})
// --- PICKER_SOURCE appended below by build ---
