import { useEffect, useRef, useState } from "react";

import { tryCatch } from "@/shared/utils/try-catch";

import { MEDIA_VISIBLE_RATIO } from "@/features/media/constants/media-visible-ratio";

// The state of a video or audio element, driven by its own events so the controls always show
// what it is really doing. A clip pauses once it is scrolled, or slid, out of sight.
export const useMediaPlayback = <Element extends HTMLMediaElement>() => {
  const mediaRef = useRef<Element>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const media = mediaRef.current;

    if (!media) return;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    const onTime = () => setCurrentTime(media.currentTime);
    // A recording without a duration in its header reports Infinity until it has played through
    const onDuration = () => setDuration(Number.isFinite(media.duration) ? media.duration : 0);
    const onVolume = () => setIsMuted(media.muted);

    media.addEventListener("play", onPlay);
    media.addEventListener("pause", onPause);
    media.addEventListener("ended", onPause);
    media.addEventListener("timeupdate", onTime);
    media.addEventListener("loadedmetadata", onDuration);
    media.addEventListener("durationchange", onDuration);
    media.addEventListener("volumechange", onVolume);

    // The metadata can arrive while the page hydrates, before anything listens for it
    onDuration();
    onTime();
    onVolume();

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry && !entry.isIntersecting) media.pause();
      },
      { threshold: MEDIA_VISIBLE_RATIO },
    );

    observer.observe(media);

    return () => {
      media.removeEventListener("play", onPlay);
      media.removeEventListener("pause", onPause);
      media.removeEventListener("ended", onPause);
      media.removeEventListener("timeupdate", onTime);
      media.removeEventListener("loadedmetadata", onDuration);
      media.removeEventListener("durationchange", onDuration);
      media.removeEventListener("volumechange", onVolume);
      observer.disconnect();
    };
  }, []);

  const togglePlay = async () => {
    const media = mediaRef.current;

    if (!media) return;

    if (!media.paused) {
      media.pause();
      return;
    }

    // play() rejects when the browser refuses, which would leave the controls saying it plays
    const { error } = await tryCatch(media.play());

    if (error) setIsPlaying(false);
  };

  const seek = (seconds: number) => {
    if (!mediaRef.current) return;

    mediaRef.current.currentTime = seconds;
    setCurrentTime(seconds);
  };

  const toggleMute = () => {
    if (mediaRef.current) mediaRef.current.muted = !mediaRef.current.muted;
  };

  return {
    mediaRef,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    seek,
    toggleMute,
  };
};
