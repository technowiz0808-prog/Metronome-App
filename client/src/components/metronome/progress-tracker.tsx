import { useEffect, useState } from "react";
import { Clock, HeartPulse, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { metronomeStorage } from "@/lib/storage";
import type { ProgressSession } from "@shared/schema";

interface ProgressTrackerProps {
  isPlaying: boolean;
  currentBeat: number;
}

export function ProgressTracker({ isPlaying, currentBeat }: ProgressTrackerProps) {
  const [sessionTime, setSessionTime] = useState(0);
  const [totalBeats, setTotalBeats] = useState(0);
  const [currentSession, setCurrentSession] = useState<ProgressSession | null>(null);

  useEffect(() => {
    const session = metronomeStorage.getCurrentSession();
    setCurrentSession(session);
    
    if (session) {
      setTotalBeats(session.totalBeats);
      
      if (!session.endTime) {
        const startTime = new Date(session.startTime).getTime();
        setSessionTime(Math.floor((Date.now() - startTime) / 1000));
      } else {
        setSessionTime(session.duration);
      }
    }
  }, [isPlaying, currentBeat]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    
    if (isPlaying && currentSession && !currentSession.endTime) {
      interval = setInterval(() => {
        const session = metronomeStorage.getCurrentSession();
        if (session) {
          const startTime = new Date(session.startTime).getTime();
          const elapsed = Math.floor((Date.now() - startTime) / 1000);
          setSessionTime(elapsed);
          setTotalBeats(session.totalBeats);
        }
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, currentSession]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const resetSession = () => {
    if (currentSession && !currentSession.endTime) {
      metronomeStorage.updateCurrentSession({
        endTime: new Date().toISOString(),
        duration: sessionTime,
        totalBeats: totalBeats,
      });
    }
    
    setSessionTime(0);
    setTotalBeats(0);
    setCurrentSession(null);
  };

  return (
    <div className="bg-white dark:bg-primary-800 rounded-xl shadow-lg p-6 border border-primary-200 dark:border-primary-700">
      <h3 className="text-lg font-semibold mb-4" data-testid="text-progress-title">Practice Progress</h3>
      
      <div className="space-y-4">
        {/* Session Timer */}
        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <Clock className="text-accent-500" size={20} />
            <div>
              <div className="font-medium" data-testid="text-session-timer-label">Session Time</div>
              <div className="text-sm text-primary-600 dark:text-primary-300">Current practice session</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-accent-500" data-testid="text-session-time">
            {formatTime(sessionTime)}
          </div>
        </div>

        {/* Total Beats */}
        <div className="flex items-center justify-between p-4 bg-primary-50 dark:bg-primary-700 rounded-lg">
          <div className="flex items-center space-x-3">
            <HeartPulse className="text-accent-500" size={20} />
            <div>
              <div className="font-medium" data-testid="text-beats-played-label">Beats Played</div>
              <div className="text-sm text-primary-600 dark:text-primary-300">Total in this session</div>
            </div>
          </div>
          <div className="text-2xl font-bold text-accent-500" data-testid="text-total-beats">
            {totalBeats.toLocaleString()}
          </div>
        </div>

        {/* Reset Button */}
        <Button
          onClick={resetSession}
          variant="ghost"
          className="w-full py-2 px-4 bg-primary-100 dark:bg-primary-700 hover:bg-primary-200 dark:hover:bg-primary-600 rounded-lg font-medium transition-colors duration-200"
          data-testid="button-reset-session"
        >
          <RotateCcw className="mr-2" size={16} />
          Reset Session
        </Button>
      </div>
    </div>
  );
}
