'use client';

import { useEffect, useRef, useState } from 'react';
import { WheelItem } from '@/lib/types';

interface WheelProps {
  items: WheelItem[];
}

export default function Wheel({ items }: WheelProps) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WheelItem | null>(null);
  const wheelRef = useRef<SVGSVGElement>(null);
  const rotationRef = useRef(0);

  const size = 400;
  const centerX = size / 2;
  const centerY = size / 2;
  const radius = size / 2 - 20;

  const getAngleForItem = (index: number, total: number) => {
    return (360 / total) * index;
  };

  const getPathForSegment = (index: number, total: number) => {
    if (total === 0) return '';
    
    const anglePerSegment = 360 / total;
    const startAngle = (anglePerSegment * index - 90) * (Math.PI / 180);
    const endAngle = (anglePerSegment * (index + 1) - 90) * (Math.PI / 180);
    
    const x1 = centerX + radius * Math.cos(startAngle);
    const y1 = centerY + radius * Math.sin(startAngle);
    const x2 = centerX + radius * Math.cos(endAngle);
    const y2 = centerY + radius * Math.sin(endAngle);
    
    const largeArc = anglePerSegment > 180 ? 1 : 0;
    
    return `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2} Z`;
  };

  const getTextPosition = (index: number, total: number) => {
    if (total === 0) return { x: centerX, y: centerY };
    
    const anglePerSegment = 360 / total;
    const angle = (anglePerSegment * index + anglePerSegment / 2 - 90) * (Math.PI / 180);
    const textRadius = radius * 0.7;
    const x = centerX + textRadius * Math.cos(angle);
    const y = centerY + textRadius * Math.sin(angle);
    return { x, y, angle: (anglePerSegment * index + anglePerSegment / 2) % 360 };
  };

  const spinWheel = () => {
    if (items.length === 0 || isSpinning) return;

    setIsSpinning(true);
    setSelectedItem(null);

    // Random rotation (multiple full rotations + random angle)
    const randomItemIndex = Math.floor(Math.random() * items.length);
    const anglePerSegment = 360 / items.length;
    // Calculate rotation to align selected segment's center with the top arrow
    // Segments start at -90°, so we use 90° (not 360°) to align with top (0°)
    const targetAngle = 360 * 5 + (90 - (randomItemIndex * anglePerSegment + anglePerSegment / 2));
    
    rotationRef.current += targetAngle;
    
    if (wheelRef.current) {
      wheelRef.current.style.transition = 'transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheelRef.current.style.transform = `rotate(${rotationRef.current}deg)`;
    }
    
    setTimeout(() => {
      setIsSpinning(false);
      setSelectedItem(items[randomItemIndex]);
    }, 4000);
  };

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center">
        <div 
          className="rounded-full border-4 border-gray-300 flex items-center justify-center bg-gray-50"
          style={{ width: size, height: size }}
        >
          <div className="text-center text-gray-500 p-8">
            <p className="text-lg font-semibold mb-2">No recipes yet</p>
            <p className="text-sm">Add recipes to start spinning!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          ref={wheelRef}
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          className="transition-transform duration-1000"
          style={{ transform: `rotate(${rotationRef.current}deg)` }}
        >
          {items.map((item, index) => (
            <g key={item.id}>
              <path
                d={getPathForSegment(index, items.length)}
                fill={item.color}
                stroke="#fff"
                strokeWidth="2"
                className={selectedItem?.id === item.id ? 'opacity-100' : 'opacity-90'}
              />
              <text
                x={getTextPosition(index, items.length).x}
                y={getTextPosition(index, items.length).y}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="#fff"
                fontSize="14"
                fontWeight="bold"
                className="pointer-events-none select-none"
                transform={`rotate(${getTextPosition(index, items.length).angle}, ${getTextPosition(index, items.length).x}, ${getTextPosition(index, items.length).y})`}
              >
                {item.recipe_name.length > 12 
                  ? item.recipe_name.substring(0, 10) + '...' 
                  : item.recipe_name}
              </text>
            </g>
          ))}
        </svg>
        
        {/* Center button */}
        <button
          onClick={spinWheel}
          disabled={isSpinning || items.length === 0}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white border-4 border-gray-800 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center z-10"
        >
          <span className="text-lg font-bold text-gray-800">
            {isSpinning ? '...' : 'SPIN'}
          </span>
        </button>
        
        {/* Pointer */}
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-2 z-20"
          style={{
            width: 0,
            height: 0,
            borderLeft: '15px solid transparent',
            borderRight: '15px solid transparent',
            borderTop: '30px solid #333',
          }}
        />
      </div>
      
      {/* Result display */}
      {selectedItem && !isSpinning && (
        <div className="mt-8 p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg shadow-lg animate-pulse">
          <p className="text-sm font-semibold mb-1">Selected Recipe:</p>
          <p className="text-2xl font-bold">{selectedItem.recipe_name}</p>
        </div>
      )}
    </div>
  );
}

