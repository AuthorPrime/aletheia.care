import { useEffect } from 'react';

const KONAMI_CODE = [
  'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
  'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
  'KeyB', 'KeyA'
];

export default function useKonami(callback) {
  useEffect(() => {
    let sequence = [];
    
    const handleKeyDown = (event) => {
      sequence.push(event.code);
      
      // Keep only the last 10 keys
      if (sequence.length > KONAMI_CODE.length) {
        sequence = sequence.slice(-KONAMI_CODE.length);
      }
      
      // Check if sequence matches
      if (sequence.length === KONAMI_CODE.length && 
          sequence.every((key, index) => key === KONAMI_CODE[index])) {
        callback();
        sequence = []; // Reset sequence
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [callback]);
}
