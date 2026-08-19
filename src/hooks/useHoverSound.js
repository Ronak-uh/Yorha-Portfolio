import { useRef, useEffect } from 'react';

export function useHoverSound(soundPath) {
  const audioRef = useRef(null);

  useEffect(() => {
    // Initialize the audio object once when the component mounts
    audioRef.current = new Audio(soundPath);
    
    // Optional: Lower the volume slightly so it isn't overpowering
    audioRef.current.volume = 0.4; 
  }, [soundPath]);

  const playHover = () => {
    if (audioRef.current) {
      // Reset the sound to the beginning in case they hover quickly
      audioRef.current.currentTime = 0; 
      
      // Play the sound (catch block prevents errors if browser autoplay rules block it)
      audioRef.current.play().catch(err => console.log("Audio playback blocked:", err));
    }
  };

  const stopHover = () => {
    if (audioRef.current) {
      // Immediately pause the sound
      audioRef.current.pause(); 
      // Reset the time so the next hover starts fresh
      audioRef.current.currentTime = 0; 
    }
  };

  return { playHover, stopHover };
}