import { useEffect, useState } from "react";

interface Props {
  stream: MediaStream | null;
}

// How loud the microphone is right now, from 0 to 1, for a meter that shows it is listening
export const useAudioLevel = ({ stream }: Props) => {
  const [level, setLevel] = useState(0);

  useEffect(() => {
    if (!stream) return;

    const context = new AudioContext();
    const analyser = context.createAnalyser();

    analyser.fftSize = 512;

    const samples = new Uint8Array(analyser.fftSize);
    let frame = 0;

    context.createMediaStreamSource(stream).connect(analyser);

    const read = () => {
      analyser.getByteTimeDomainData(samples);

      const peak = samples.reduce(
        (loudest, sample) => Math.max(loudest, Math.abs(sample - 128)),
        0,
      );

      setLevel(Math.min(peak / 64, 1));
      frame = requestAnimationFrame(read);
    };

    read();

    return () => {
      cancelAnimationFrame(frame);
      setLevel(0);
      void context.close();
    };
  }, [stream]);

  return level;
};
