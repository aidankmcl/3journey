
const audioCtx = new window.AudioContext();
const gainNode = audioCtx.createGain();

// Start muted
gainNode.gain.value = 0;
gainNode.connect(audioCtx.destination);


// 2. Function to load and decode the MP3
export async function loadViolinAudio(url: string) {
  try {
    // Fetch the file
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    
    // Decode the audio data
    const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
    
    // Set up the source node
    const violinAudioSource = audioCtx.createBufferSource();
    violinAudioSource.buffer = audioBuffer;
    
    // Make it loop continuously
    violinAudioSource.loop = true; 
    
    // Connect to our volume valve
    violinAudioSource.connect(gainNode);
    
    // Start playing immediately (but silently, since gain is 0)
    violinAudioSource.start();

    console.log("Violin audio loaded and ready!");
    return violinAudioSource;
  } catch (error) {
    console.error("Error loading audio:", error);
    return null;
  }
}

type AudioUpdateData = {
  violinAudioSource: AudioBufferSourceNode;
  smoothedDistance: number;
  smoothedSpeed: number;
  distanceCutoff: number;
  minSpeed: number;
  maxSpeed: number;
}

const fadeTime = 0.05;

// Call this on every frame of your render loop (same as before)
export function updateAudio(props: AudioUpdateData) {
  const {
    violinAudioSource,
    smoothedDistance,
    smoothedSpeed,
    distanceCutoff,
    minSpeed,
    maxSpeed
  } = props;

  // If the audio hasn't finished loading yet, do nothing
  if (!violinAudioSource) return; 

  const now = audioCtx.currentTime;
  const isValidDistance = smoothedDistance < distanceCutoff;
  const isValidSpeed = smoothedSpeed > minSpeed && smoothedSpeed < maxSpeed;

  if (isValidDistance && isValidSpeed) {
    // Fade volume IN smoothly over 0.1 seconds
    gainNode.gain.setTargetAtTime(1.0, now, fadeTime); 
    
    const mappedRate = mapRange(smoothedDistance, 0.2, 1, 0.9, 1.1);
    
    // // Clamp the rate just in case so it doesn't get too extreme
    const clampedRate = Math.max(0.5, Math.min(mappedRate, 2.0)); 
    
    violinAudioSource.playbackRate.setTargetAtTime(clampedRate, now, fadeTime);
  } else {
    // Fade volume OUT smoothly
    gainNode.gain.setTargetAtTime(0, now, fadeTime);
  }
}

// Helper for mapping numbers (from previous example)
function mapRange(val: number, inMin: number, inMax: number, outMin: number, outMax: number) {
  return (val - inMin) * (outMax - outMin) / (inMax - inMin) + outMin;
}