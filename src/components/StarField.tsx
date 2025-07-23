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

    // Generate random stars
    for (let i = 0; i < 80; i++) {
      stars.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
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