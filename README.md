# react-beautifull-dnd-scrollzone

Forked from https://github.com/azuqua/react-dnd-scrollzone with support for react-dnd@16.

Cross browser compatible scrolling containers for drag and drop interactions.

### [Basic Example](./examples/basic)

```js
import React from 'react'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { DndProvider } from 'react-dnd'
import withScrolling, {createVerticalStrength, createHorizontalStrength} from '@nosferatu500/react-dnd-scrollzone'
import {DragItem} from './DragItem'
import './App.css'

const ScrollingComponent = withScrolling(
  React.forwardRef((props, ref) => {
    const {dragDropManager, ...otherProps} = props;
    return <div ref={ref} {...otherProps} />
  }))

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

const verticalStrength = createVerticalStrength(150);
const horizontalStrength = createHorizontalStrength(150);

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <ScrollingComponent className="App" verticalStrength={verticalStrength} horizontalStrength={horizontalStrength}>
      {ITEMS.map((n) => (
        <DragItem key={n} label={`Item ${n}`} />
      ))}
    </ScrollingComponent>
  </DndProvider>
```

Note: You should replace the original `div` you would like to make scrollable with the `ScrollingComponent`.

##### Example

```js
import withScrolling, { createVerticalStrength, createHorizontalStrength } from '@nosferatu500/react-dnd-scrollzone';

const Scrollzone = withScrolling('ul');
const vStrength = createVerticalStrength(500);
const hStrength = createHorizontalStrength(300);

// zone will scroll when the cursor drags within
// 500px of the top/bottom and 300px of the left/right
const zone = (
  <Scrollzone verticalStrength={vStrength} horizontalStrength={hStrength}>

  </Scrollzone>
);
```

### API

#### `withScrolling`

A React higher order component with the following properties:

```js
const ScrollZone = withScrolling(String|Component);

<ScrollZone
  strengthMultiplier={Number}
  horizontalStrength={Function}
  verticalStrength={Function}
  onScrollChange={Function} >

  {children}
</Scrollzone>
```
Apply the withScrolling function to any html-identifier ("div", "ul" etc) or react component to add drag and drop scrolling behaviour.

 * `horizontalStrength` a function that returns the strength of the horizontal scroll direction
 * `verticalStrength` - a function that returns the strength of the vertical scroll direction
 * `strengthMultiplier` - strength multiplier, play around with this (default 30)
 * `onScrollChange` - a function that is called when `scrollLeft` or `scrollTop` of the component are changed. Called with those two arguments in that order.

The strength functions are both called with two arguments. An object representing the rectangle occupied by the Scrollzone, and an object representing the coordinates of mouse.

They should return a value between -1 and 1.
 * Negative values scroll up or left.
 * Positive values scroll down or right.
 * 0 stops all scrolling.

#### `createVerticalStrength(buffer)` and `createHorizontalStrength(buffer)`

These allow you to create linearly scaling strength functions with a sensitivity different than the default value of 150px.

