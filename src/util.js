export const noop = () => { };

export const intBetween = (min, max, val) => Math.floor(
  Math.min(max, Math.max(min, val)),
);

export const getCoords = (evt) => {
  if (evt.type === 'touchmove') {
    return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
  }

  return { x: evt.clientX, y: evt.clientY };
};
