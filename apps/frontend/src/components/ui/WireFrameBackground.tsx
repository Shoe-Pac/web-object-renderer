import { css } from '@emotion/react'
import React, { useEffect, useState } from 'react'

type Line = {
  x1: number
  y1: number
  x2: number
  y2: number
}

const WireframeBackground: React.FC = () => {
  const [lines, setLines] = useState<Line[]>([])

  useEffect(() => {
    //Generate 40 lines
    const lineCount = 40
    const newLines: Line[] = []

    for (let i = 0; i < lineCount; i++) {
      newLines.push({
        x1: Math.random() * window.innerWidth,
        y1: Math.random() * window.innerHeight,
        x2: Math.random() * window.innerWidth,
        y2: Math.random() * window.innerHeight
      })
    }
    setLines(newLines)
  }, [])

  return (
    <svg css={svgStyle} width="100%" height="100%">
      {lines.map((line, idx) => (
        <line
          key={idx}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke="#888" //line color
          strokeWidth="1"
          strokeOpacity="0.4"
          strokeLinecap="round"
        />
      ))}
    </svg>
  )
}

const svgStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  pointer-events: none;
`

export default WireframeBackground
