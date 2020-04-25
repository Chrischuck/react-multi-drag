import React, { useMemo, useState, useEffect } from 'react'
import styles from './styles.module.css'

const generateId = () =>
  Math.random().toString(36).substring(2, 15) +
  Math.random().toString(36).substring(2, 15)

const Draggable = ({ children }) => {
  const [positions, setPosition] = useState({})
  const [draggedComponent, setDraggedComponent] = useState(null)

  const onMouseUp = (event) => {
    setDraggedComponent(null)
  }

  const onMouseDown = (event, id) => {
    setDraggedComponent(id)
  }

  // only fire when children change
  const draggableChildren = useMemo(() => {
    const childrenList = Array.isArray(children) ? children : [children]

    return childrenList.reduce((reducedChildren, child) => {
      const id = child.props.id === undefined ? generateId() : child.props.id

      return {
        ...reducedChildren,
        [id]: React.cloneElement(child, {
          id,
          key: id,
          ...child.props,
          onMouseDown: (event) => onMouseDown(event, id),
          onMouseUp
        })
      }
    }, {})
  }, [children])

  useEffect(() => {
    const handler = (event) => {
      if (draggedComponent !== null) {
        const x = event.pageX
        const y = event.pageY
        const child = draggableChildren[draggedComponent]
        setPosition({ [draggedComponent]: `translate(${x}px, ${y}px)` })
        draggableChildren[draggedComponent] = React.cloneElement(child, {
          style: { transform: `translate(${x}px, ${y}px)` }
        })
      }
    }
    document.addEventListener('mousemove', handler)

    return () => {
      document.removeEventListener('mousemove', handler)
    }
  }, [positions, draggedComponent])
  console.log(draggableChildren[0].getBoundingRect())
  return <div className={styles.test}>{Object.values(draggableChildren)}</div>
}

export default Draggable
