import React from "react";
import { HTML5Backend } from "react-dnd-html5-backend";
import { DndProvider } from "react-dnd";
import withScrolling, {
	createVerticalStrength,
	createHorizontalStrength,
} from "@salmanempowered/react-dnd-scrollzone";
import { DragItem } from "./DragItem";
import "./App.css";

const ScrollingComponent = withScrolling(
	React.forwardRef((props, ref) => {
		const { dragDropManager, ...otherProps } = props;
		return <div ref={ref} {...otherProps} />;
	}),
);

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const verticalStrength = createVerticalStrength(150);
const horizontalStrength = createHorizontalStrength(150);

const App = () => (
	<DndProvider backend={HTML5Backend}>
		<ScrollingComponent
			className="App"
			verticalStrength={verticalStrength}
			horizontalStrength={horizontalStrength}
		>
			{ITEMS.map((n) => (
				<DragItem key={n} label={`Item ${n}`} />
			))}
		</ScrollingComponent>
	</DndProvider>
);

export default App;
