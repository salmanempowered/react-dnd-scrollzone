import { createHorizontalStrength, createVerticalStrength } from '../src';

describe('strength functions', () => {
  let hFn = createHorizontalStrength(150);
  let vFn = createVerticalStrength(150);
  let box = { x: 0, y: 0, w: 600, h: 600 };
  let lilBox = { x: 0, y: 0, w: 100, h: 100 };

  describe('horizontalStrength', () => {
    it('should return -1 when all the way at the left', () => {
      expect(hFn(box, { x: 0, y: 0 })).to.equal(-1);
    });

    it('should return 1 when all the way at the right', () => {
      expect(hFn(box, { x: 600, y: 0 })).to.equal(1);
    });

    it('should return 0 when in the center', () => {
      expect(hFn(box, { x: 300, y: 0 })).to.equal(0);
    });

    it('should return 0 when at either buffer boundary', () => {
      expect(hFn(box, { x: 150, y: 0 })).to.equal(0);
      expect(hFn(box, { x: 450, y: 0 })).to.equal(0);
    });

    it('should return 0 when outside the box', () => {
      expect(hFn(box, { x: 0, y: -100 })).to.equal(0);
      expect(hFn(box, { x: 0, y: 900 })).to.equal(0);
    });

    it('should scale linearly from the boundary to respective buffer', () => {
      expect(hFn(box, { x: 75, y: 0 })).to.equal(-.5);
      expect(hFn(box, { x: 525, y: 0 })).to.equal(.5);
    });

    it('should handle buffers larger than the box gracefully', () => {
      expect(hFn(lilBox, { x: 50, y: 0 })).to.equal(0);
    });
  });

  describe('verticalStrength', () => {
    it('should return -1 when all the way at the top', () => {
      expect(vFn(box, { x: 0, y: 0 })).to.equal(-1);
    });

    it('should return 1 when all the way at the bottom', () => {
      expect(vFn(box, { x: 0, y: 600 })).to.equal(1);
    });

    it('should return 0 when in the center', () => {
      expect(vFn(box, { x: 0, y: 300 })).to.equal(0);
    });

    it('should return 0 when at the buffer boundary', () => {
      expect(vFn(box, { x: 0, y: 150 })).to.equal(0);
      expect(vFn(box, { x: 0, y: 450 })).to.equal(0);
    });

    it('should return 0 when outside the box', () => {
      expect(vFn(box, { x: -100, y: 0 })).to.equal(0);
      expect(vFn(box, { x: 900, y: 0 })).to.equal(0);
    });

    it('should scale linearly from the boundary to respective buffer', () => {
      expect(vFn(box, { x: 0, y: 75 })).to.equal(-.5);
      expect(vFn(box, { x: 0, y: 525 })).to.equal(.5);
    });

    it('should handle buffers larger than the box gracefully', () => {
      expect(vFn(lilBox, { x: 0, y: 50 })).to.equal(0);
    });
  });
});
