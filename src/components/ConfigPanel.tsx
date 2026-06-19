import React, { useState } from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { surahs, reciters, videoStyles } from '../lib/quran';
import { Play, PlaySquare, Settings, Video } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion } from 'motion/react';

export default function ConfigPanel() {
  const addTask = useVideoStore((s) => s.addTask);
  
  const [surah, setSurah] = useState(surahs[0].id);
  const [ayah, setAyah] = useState(1);
  const [style, setStyle] = useState(videoStyles[0].id);
  const [voice, setVoice] = useState(reciters[0].id);

  const selectedSurah = surahs.find((s) => s.id === surah);

  const handleGenerate = () => {
    addTask({
      surah,
      ayah,
      style: style as any,
      voice,
    });
    
    // Simulate generation pipeline via Express backend (stubbed in UI for now)
    simulateRender();
  };

  const simulateRender = () => {
    const store = useVideoStore.getState();
    const task = store.tasks[0];
    if (!task) return;

    const stages = [
      { status: 'preparing', progress: 5, delay: 1000 },
      { status: 'generating_tts', progress: 20, delay: 3000 },
      { status: 'generating_scenes', progress: 50, delay: 6000 },
      { status: 'enhancing_video', progress: 75, delay: 10000 },
      { status: 'assembling', progress: 90, delay: 13000 },
      { status: 'completed', progress: 100, delay: 15000 },
    ];

    stages.forEach((stage) => {
      setTimeout(() => {
        if (stage.status === 'completed') {
          store.completeTask(task.id, 'https://joy.videvo.net/videvo_files/video/free/2012-09/large_watermarked/hd0992_preview.mp4');
        } else {
          store.updateTaskProgress(task.id, stage.status as any, stage.progress);
        }
      }, stage.delay);
    });
  };

  return (
    <div className="flex flex-col h-full bg-neutral-900 border-l border-neutral-800 p-6 text-right" dir="rtl">
      <h2 className="text-xl font-bold text-neutral-100 mb-8 flex items-center gap-2">
        <Settings className="w-5 h-5 text-amber-500" />
        إعدادات الفيديو
      </h2>

      <div className="space-y-6 flex-1 overflow-y-auto pr-2">
        {/* Quran Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-400">النص القرآني</label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">السورة</label>
              <select 
                value={surah}
                onChange={(e) => {
                  setSurah(Number(e.target.value));
                  setAyah(1);
                }}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 outline-none focus:border-amber-500 transition-colors"
              >
                {surahs.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs text-neutral-500 mb-1 block">الآية</label>
              <select
                value={ayah}
                onChange={(e) => setAyah(Number(e.target.value))}
                className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 outline-none focus:border-amber-500 transition-colors"
              >
                {Array.from({ length: selectedSurah?.ayahs || 1 }).map((_, i) => (
                  <option key={i + 1} value={i + 1}>الآية {i + 1}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Video Style */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-400">النمط البصري (SDXL)</label>
          <div className="space-y-2">
            {videoStyles.map((vs) => (
              <button
                key={vs.id}
                onClick={() => setStyle(vs.id)}
                className={cn(
                  "w-full text-right p-3 rounded-xl border transition-all duration-200 flex flex-col gap-1",
                  style === vs.id 
                    ? "bg-amber-900/20 border-amber-500/50" 
                    : "bg-neutral-800 border-neutral-800 hover:border-neutral-700"
                )}
              >
                <div className="flex items-center gap-2">
                  <Video className={cn("w-4 h-4", style === vs.id ? "text-amber-500" : "text-neutral-500")} />
                  <span className={cn("font-medium text-sm", style === vs.id ? "text-amber-500" : "text-neutral-300")}>{vs.name}</span>
                </div>
                <span className="text-xs text-neutral-500 pr-6">{vs.desc}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Voice Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-neutral-400">الصوت (Coqui TTS)</label>
          <select 
            value={voice}
            onChange={(e) => setVoice(e.target.value)}
            className="w-full bg-neutral-800 border border-neutral-700 rounded-lg p-2.5 text-neutral-200 outline-none focus:border-amber-500 transition-colors"
          >
            {reciters.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="pt-6 mt-4 border-t border-neutral-800">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleGenerate}
          className="w-full py-3.5 bg-gradient-to-l from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-neutral-950 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-amber-900/20"
        >
          <PlaySquare className="w-5 h-5" />
          توليد المشهد
        </motion.button>
        <p className="text-center text-[10px] text-neutral-500 mt-3">
          يتم المعالجة محلياً عبر Python Pipeline
        </p>
      </div>
    </div>
  );
}
