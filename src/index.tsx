import React, { createRef, useEffect, useRef } from "react";
import { DndContext } from "react-dnd";

const throttle = (func: any, timeFrame: number) => {
	let lastTime = 0;
	return (...args: any[]) => {
		const now: any = new Date();
		if (now - lastTime >= timeFrame) {
			func(...args);
			lastTime = now;
		}
	};
};

const intBetween = (min: number, max: number, val: number) =>
	Math.floor(Math.min(max, Math.max(min, val)));

const getCoords = (evt: any) => {
	return { x: evt.clientX, y: evt.clientY };
};

const DEFAULT_BUFFER = 150;

export type Point = {
	x: number;
	y: number;
};

export type Size = {
	x: number;
	w: number;
	y: number;
	h: number;
};

export const createHorizontalStrength =
	(_buffer: number) =>
	({ x, w, y, h }: Size, point: Point) => {
		const buffer = Math.min(w / 2, _buffer);
		const inRange = point.x >= x && point.x <= x + w;
		const inBox = inRange && point.y >= y && point.y <= y + h;

		if (inBox) {
			if (point.x < x + buffer) {
				return (point.x - x - buffer) / buffer;
			}
			if (point.x > x + w - buffer) {
				return -(x + w - point.x - buffer) / buffer;
			}
		}

		return 0;
	};

export const createVerticalStrength =
	(_buffer: number) =>
	({ y, h, x, w }: Size, point: Point) => {
		const buffer = Math.min(h / 2, _buffer);
		const inRange = point.y >= y && point.y <= y + h;
		const inBox = inRange && point.x >= x && point.x <= x + w;

		if (inBox) {
			if (point.y < y + buffer) {
				return (point.y - y - buffer) / buffer;
			}
			if (point.y > y + h - buffer) {
				return -(y + h - point.y - buffer) / buffer;
			}
		}

		return 0;
	};

const defaultProps = {
	onScrollChange: () => {},
	verticalStrength: createVerticalStrength(DEFAULT_BUFFER),
	horizontalStrength: createHorizontalStrength(DEFAULT_BUFFER),
	strengthMultiplier: 30,
};

export const createScrollingComponent = (WrappedComponent: any) => {
	return (props: any) => {
		props = { ...defaultProps, ...props };

		let container: any;

		const wrappedInstance = createRef();

		const animationFrameID = useRef<number>(0);

		let scaleX = 0;
		let scaleY = 0;

		let attached = false;
		let dragging = false;

		// Update scaleX and scaleY every 100ms or so
		// and start scrolling if necessary
		const updateScrolling = throttle((evt: any) => {
			const { left: x, top: y, width: w, height: h } = container.getBoundingClientRect();
			const box = {
				x,
				y,
				w,
				h,
			};
			const coords = getCoords(evt);

			// calculate strength
			scaleX = props.horizontalStrength(box, coords);
			scaleY = props.verticalStrength(box, coords);

			// start scrolling if we need to
			if (!animationFrameID.current && (scaleX || scaleY)) {
				startScrolling();
			}
		}, 100);

		const handleEvent = (evt: any) => {
			if (dragging && !attached) {
				attached = true;
				window.document.body.addEventListener("dragover", updateScrolling);
				updateScrolling(evt);
			}
		};

		useEffect(() => {
			container = wrappedInstance.current;

			if (container && typeof container.addEventListener === "function") {
				container.addEventListener("dragover", handleEvent);
			}

			const clearMonitorSubscription = props.dragDropManager
				.getMonitor()
				.subscribeToStateChange(handleMonitorChange);

			return () => {
				if (container && typeof container.removeEventListener === "function") {
					container.removeEventListener("dragover", handleEvent);
				}
				clearMonitorSubscription();
				stopScrolling();
			};
		}, []);

		const handleMonitorChange = () => {
			const isDragging = props.dragDropManager.getMonitor().isDragging();

			if (!dragging && isDragging) {
				dragging = true;
			} else if (dragging && !isDragging) {
				dragging = false;
				stopScrolling();
			}
		};

		const startScrolling = () => {
			let i = 0;
			const tick = () => {
				// stop scrolling if there's nothing to do
				if (props.strengthMultiplier === 0 || scaleX + scaleY === 0) {
					stopScrolling();
					return;
				}

				// there's a bug in safari where it seems like we can't get
				// mousemove events from a container that also emits a scroll
				// event that same frame. So we double the strengthMultiplier and only adjust
				// the scroll position at 30fps
				i += 1;
				if (i % 2) {
					const {
						scrollLeft,
						scrollTop,
						scrollWidth,
						scrollHeight,
						clientWidth,
						clientHeight,
					} = container;

					const newLeft = scaleX
						? (container.scrollLeft = intBetween(
								0,
								scrollWidth - clientWidth,
								scrollLeft + scaleX * props.strengthMultiplier,
						  ))
						: scrollLeft;

					const newTop = scaleY
						? (container.scrollTop = intBetween(
								0,
								scrollHeight - clientHeight,
								scrollTop + scaleY * props.strengthMultiplier,
						  ))
						: scrollTop;

					props.onScrollChange(newLeft, newTop);
				}
				animationFrameID.current = window.requestAnimationFrame(tick);
			};

			tick();
		};

		const stopScrolling = () => {
			attached = false;
			window.document.body.removeEventListener("dragover", updateScrolling);

			scaleX = 0;
			scaleY = 0;

			if (animationFrameID.current) {
				window.cancelAnimationFrame(animationFrameID.current);
				animationFrameID.current = 0;
			}
		};

		const {
			// not passing down these props
			strengthMultiplier,
			verticalStrength,
			horizontalStrength,
			onScrollChange,

			...other
		} = props;

		return <WrappedComponent ref={wrappedInstance} {...other} />;
	};
};

const createScrollingComponentWithConsumer = (WrappedComponent: any) => {
	const ScrollingComponent = createScrollingComponent(WrappedComponent);
	return (props: any) => {
		return (
			<DndContext.Consumer>
				{({ dragDropManager }) =>
					!dragDropManager ? undefined : (
						<ScrollingComponent {...props} dragDropManager={dragDropManager} />
					)
				}
			</DndContext.Consumer>
		);
	};
};

export default createScrollingComponentWithConsumer;
