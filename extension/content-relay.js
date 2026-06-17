// ISOLATED world. Bridges page <-> extension (the MAIN world has no chrome.*).
window.addEventListener('message', (e) => {
  if (e.source !== window || !e.data)
    return
  if (e.data.__cpPick)
    chrome.runtime.sendMessage({ type: 'pick', json: e.data.json })
})
// Service worker asks us to toggle -> tell the MAIN world.
chrome.runtime.onMessage.addListener((msg) => {
  if (!msg)
    return
  if (msg.type === 'toggle')
    window.postMessage({ __cpToggle: true }, '*')
  else if (msg.type === 'toast')
    window.postMessage({ __cpToast: true, text: msg.text }, '*')
})
