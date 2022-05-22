import React from 'react'
import { useDrag } from 'react-dnd'
import './DragItem.css'

export const DragItem = ({label}) => {
  const [, drag] = useDrag({
    item: { label },
    type: "drag_item",
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  });

  return <div ref={drag} className="DragItem">{label}</div>;
};