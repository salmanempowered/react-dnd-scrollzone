import React from 'react'
import { DragSource } from 'react-dnd'
import './DragItem.css'

const DragItem = ({ label, dragSource }) =>
  dragSource(<div className="DragItem">{label}</div>)

export default DragSource(
  'foo',
  {
    beginDrag() {
      return {}
    },
  },
  (connect) => ({
    dragSource: connect.dragSource(),
  })
)(DragItem)
