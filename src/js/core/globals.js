export const Browser = {
  iOS,
  touch: false,
}

export function setBrowserTouch(touch) {
  Object.assign(Browser, { touch })
}

if (typeof window !== 'undefined') {
  Object.assign(Browser, {
    dynamicInputDetection: true,
    SUPPORTED: ('requestAnimationFrame' in window),
    SUPPORTS_TOUCH: ('ontouchstart' in window)
  })
}

/**
* The global storage array which holds all data reference objects
* from every instance
* This allows us to hide tooltips from all instances, finding the ref when
* clicking on the body, and for followCursor
*/
export const Store = []

function iOS() {
  try {
    // Chrome device/touch emulation can make this dynamic
    return (/iPhone|iPad|iPod/.test(navigator.userAgent) && !window.MSStream)
  } catch { return false }
}
