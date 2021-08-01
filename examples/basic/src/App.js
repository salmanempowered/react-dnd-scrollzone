import React from 'react';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { DndProvider } from 'react-dnd';
import withScrolling from '@nosferatu500/react-dnd-scrollzone';
import DragItem from './DragItem';
import './App.css';

const ScrollingComponent = withScrolling('div');

const ITEMS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const App = () => (
  <DndProvider backend={HTML5Backend}>
    <ScrollingComponent className="App">
      {ITEMS.map((n) => (
        <DragItem key={n} label={`Item ${n}`} />
      ))}
    </ScrollingComponent>
  </DndProvider>
);

export default App;
