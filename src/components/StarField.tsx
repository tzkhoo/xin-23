import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  delay: number;
  isRed: boolean;
}

export const StarField = () => {
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!starsRef.current) return;

    const container = starsRef.current;
    const stars: Star[] = [];

    // Generate random stars - more towards edges, less in center
    for (let i = 0; i < 80; i++) {
      let x, y;
      // Create bias towards edges (avoid center 40% area)
      if (Math.random() > 0.3) {
        // Edge placement
        if (Math.random() > 0.5) {
          x = Math.random() > 0.5 ? Math.random() * 30 : 70 + Math.random() * 30;
          y = Math.random() * 100;
        } else {
          x = Math.random() * 100;
          y = Math.random() > 0.5 ? Math.random() * 25 : 75 + Math.random() * 25;
        }
      } else {
        // Some stars can still be in center but fewer
        x = 30 + Math.random() * 40;
        y = 25 + Math.random() * 50;
      }
      
      stars.push({
        x,
        y,
        delay: Math.random() * 3,
        isRed: Math.random() > 0.7, // 30% chance for red stars
      });
    }

    // Create star elements
    stars.forEach((star, index) => {
      const starElement = document.createElement('div');
      starElement.className = `star ${star.isRed ? 'red-star' : ''}`;
      starElement.style.left = `${star.x}%`;
      starElement.style.top = `${star.y}%`;
      starElement.style.animationDelay = `${star.delay}s`;
      container.appendChild(starElement);
    });

    return () => {
      container.innerHTML = '';
    };
  }, []);

  return <div ref={starsRef} className="floating-stars" />;
};