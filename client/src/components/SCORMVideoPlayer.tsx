import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { PlayCircle, PauseCircle, Volume2, Maximize2, RotateCcw } from 'lucide-react';
import { useSCORM } from './SCORMTracker';

interface VideoModule {
  id: string;
  title: string;
  videoUrl: string;
  duration: number;
  transcript?: string;
  objectives: string[];
}

interface SCORMVideoPlayerProps {
  module: VideoModule;
  onProgress?: (progress: number) => void;
  onComplete?: () => void;
}

export default function SCORMVideoPlayer({ module, onProgress, onComplete }: SCORMVideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [watchProgress, setWatchProgress] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  
  const { updateProgress, recordInteraction, setLessonStatus, setScore } = useSCORM();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      const current = video.currentTime;
      const total = video.duration;
      setCurrentTime(current);
      
      if (total > 0) {
        const progress = (current / total) * 100;
        setWatchProgress(progress);
        
        // Update SCORM progress
        updateProgress(module.id, progress);
        onProgress?.(progress);
        
        // Record viewing interaction
        recordInteraction({
          id: `video_${module.id}_${Date.now()}`,
          type: 'performance',
          learner_response: `watched_${Math.floor(progress)}%`,
          result: 'neutral',
          weighting: 1,
          correct_responses: ['100%'],
          latency: '00:00:01'
        });

        // Mark as completed when 90% watched
        if (progress >= 90 && !hasStarted) {
          setLessonStatus('completed');
          setScore(100);
          onComplete?.();
          setHasStarted(true);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handlePlay = () => {
      setIsPlaying(true);
      if (!hasStarted) {
        setLessonStatus('incomplete');
        setHasStarted(true);
      }
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
    };
  }, [module.id, updateProgress, recordInteraction, setLessonStatus, setScore, onProgress, onComplete, hasStarted]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const seekTime = (parseFloat(e.target.value) / 100) * duration;
    video.currentTime = seekTime;
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value) / 100;
    setVolume(newVolume);
    if (videoRef.current) {
      videoRef.current.volume = newVolume;
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;
    
    video.currentTime = 0;
    setCurrentTime(0);
    setWatchProgress(0);
    updateProgress(module.id, 0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{module.title}</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              Progreso: {Math.round(watchProgress)}%
            </span>
            <Button variant="outline" size="sm" onClick={restartVideo}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reiniciar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative bg-black rounded-lg overflow-hidden mb-4">
          <video
            ref={videoRef}
            className="w-full h-auto"
            poster="/api/placeholder/800/450"
          >
            <source src={module.videoUrl} type="video/mp4" />
            Tu navegador no soporta el elemento video.
          </video>
          
          {/* Video Controls Overlay */}
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
            <div className="flex items-center gap-3 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={togglePlayPause}
                className="text-white hover:bg-white/20"
              >
                {isPlaying ? (
                  <PauseCircle className="w-6 h-6" />
                ) : (
                  <PlayCircle className="w-6 h-6" />
                )}
              </Button>
              
              <div className="text-white text-sm">
                {formatTime(currentTime)} / {formatTime(duration)}
              </div>
              
              <div className="flex items-center gap-2 ml-auto">
                <Volume2 className="w-4 h-4 text-white" />
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={volume * 100}
                  onChange={handleVolumeChange}
                  className="w-20 h-1 bg-white/30 rounded-lg appearance-none slider"
                />
              </div>
            </div>
            
            {/* Progress Bar */}
            <input
              type="range"
              min="0"
              max="100"
              value={duration > 0 ? (currentTime / duration) * 100 : 0}
              onChange={handleSeek}
              className="w-full h-2 bg-white/30 rounded-lg appearance-none slider cursor-pointer"
            />
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Progreso de visualización</span>
            <span className="text-sm text-gray-500">{Math.round(watchProgress)}%</span>
          </div>
          <Progress value={watchProgress} className="h-2" />
        </div>

        {/* Learning Objectives */}
        {module.objectives && module.objectives.length > 0 && (
          <div className="mb-4">
            <h4 className="font-semibold mb-2">Objetivos de Aprendizaje:</h4>
            <ul className="list-disc list-inside space-y-1">
              {module.objectives.map((objective, index) => (
                <li key={index} className="text-sm text-gray-600">
                  {objective}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* SCORM Status */}
        <div className="flex items-center justify-between text-sm text-gray-500 border-t pt-3">
          <span>Estado SCORM: {hasStarted ? 'En progreso' : 'No iniciado'}</span>
          <span>Tiempo: {formatTime(currentTime)}</span>
        </div>
      </CardContent>
    </Card>
  );
}