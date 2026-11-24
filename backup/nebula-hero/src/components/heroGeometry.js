// Where the nebula is on screen. The hero image is 16:9, centred in its box with object-fit: cover.
const IMAGE_RATIO = 16 / 9;

export function nebulaGeometry(imageEl, originRect) {
  const box = imageEl.getBoundingClientRect();
  const imgW = Math.max(box.width, box.height * IMAGE_RATIO);
  return {
    cx: box.left - originRect.left + box.width / 2,
    cy: box.top - originRect.top + box.height / 2,
    imgW,
    imgH: imgW / IMAGE_RATIO,
  };
}
