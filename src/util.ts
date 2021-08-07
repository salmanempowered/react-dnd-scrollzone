export const noop = () => { };

export const intBetween = (min: number, max: number, val: number) => Math.floor(
  Math.min(max, Math.max(min, val)),
);

export const getCoords = (evt: any) => {
  if (evt.type === 'touchmove') {
    return { x: evt.changedTouches[0].clientX, y: evt.changedTouches[0].clientY };
  }

  return { x: evt.clientX, y: evt.clientY };
};
