// Pure CSS-rect -> device-pixel crop-box math for captureVisibleTab output.
// Field names (x/y/width/height) match the overlay's viewRect payload.
export interface ViewportRect { x: number, y: number, width: number, height: number }
export interface ImageSize { w: number, h: number }
export interface Box { x: number, y: number, w: number, h: number }

export function cropBox(rect: ViewportRect, dpr: number, img: ImageSize): Box {
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
