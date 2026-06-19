import { create } from 'zustand';

export type VideoStyle = 'cinematic_nature' | 'mosque_ambiance' | 'abstract_light';
export type RenderStatus = 'idle' | 'preparing' | 'generating_tts' | 'generating_scenes' | 'enhancing_video' | 'assembling' | 'completed' | 'failed';

export interface VideoTask {
  id: string;
  surah: number;
  ayah: number;
  style: VideoStyle;
  voice: string;
  status: RenderStatus;
  progress: number;
  videoUrl?: string;
  createdAt: number;
}

interface VideoStore {
  tasks: VideoTask[];
  currentTask: VideoTask | null;
  addTask: (task: Omit<VideoTask, 'id' | 'status' | 'progress' | 'createdAt'>) => void;
  updateTaskProgress: (id: string, status: RenderStatus, progress: number) => void;
  completeTask: (id: string, videoUrl: string) => void;
  setCurrentTask: (task: VideoTask | null) => void;
}

export const useVideoStore = create<VideoStore>((set) => ({
  tasks: [],
  currentTask: null,
  addTask: (task) => {
    const newTask: VideoTask = {
      ...task,
      id: Math.random().toString(36).substring(7),
      status: 'idle',
      progress: 0,
      createdAt: Date.now(),
    };
    set((state) => ({ 
      tasks: [newTask, ...state.tasks],
      currentTask: newTask
    }));
  },
  updateTaskProgress: (id, status, progress) => {
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === id ? { ...t, status, progress } : t
      ),
      currentTask: state.currentTask?.id === id 
        ? { ...state.currentTask, status, progress }
        : state.currentTask
    }));
  },
  completeTask: (id, videoUrl) => {
    set((state) => ({
      tasks: state.tasks.map((t) => 
        t.id === id ? { ...t, status: 'completed', progress: 100, videoUrl } : t
      ),
      currentTask: state.currentTask?.id === id 
        ? { ...state.currentTask, status: 'completed', progress: 100, videoUrl }
        : state.currentTask
    }));
  },
  setCurrentTask: (task) => set({ currentTask: task }),
}));
