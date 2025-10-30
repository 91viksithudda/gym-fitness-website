// Utility function to play alarm sound
export const playAlarmSound = () => {
  try {
    // Create audio context for alarm sound
    const context = new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = context.createOscillator();
    const gainNode = context.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(context.destination);
    
    oscillator.type = 'sine';
    oscillator.frequency.value = 880; // A5 note
    gainNode.gain.value = 0.3;
    
    oscillator.start();
    
    // Play for 1 second
    setTimeout(() => {
      oscillator.stop();
    }, 1000);
    
    return true;
  } catch (error) {
    console.log('Audio not supported in this environment');
    return false;
  }
};

export default playAlarmSound;