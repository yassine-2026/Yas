import React from 'react';
import { useVideoStore } from '../store/useVideoStore';
import { motion, AnimatePresence } from 'motion/react';
import { CheckCircle2, CircleDashed, Download, Loader2, Play } from 'lucide-react';
import { cn } from '../lib/utils';
import { surahs } from '../lib/quran';

const statusMap: Record<string, { label: string, color: string }> = {
  idle: { label: 'في الانتظار', color: 'text-neutral-500' },
  preparing: { label: 'تجهيز النص...', color: 'text-blue-500' },
  generating_tts: { label: 'توليد الصوت (TTS)...', color: 'text-indigo-400' },
  generating_scenes: { label: 'رسم المشاهد (SDXL)...', color: 'text-fuchsia-500' },
  enhancing_video: { label: 'تحسين الجودة (ESRGAN)...', color: 'text-purple-400' },
  assembling: { label: 'دمج الفيديو (FFmpeg)...', color: 'text-amber-500' },
  completed: { label: 'مكتمل', color: 'text-emerald-500' },
  failed: { label: 'فشل', color: 'text-red-500' },
};

export default function RenderDashboard() {
  const currentTask = useVideoStore((s) => s.currentTask);

  if (!currentTask) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-950 text-neutral-400">
        <div className="w-24 h-24 rounded-full bg-neutral-900 flex items-center justify-center mb-6">
          <Play className="w-8 h-8 text-neutral-700" />
        </div>
        <p className="text-lg">استوديو نور السينمائي</p>
        <p className="text-sm text-neutral-600 mt-2">اختر الإعدادات من القائمة الجانبية لبدء الإنتاج</p>
      </div>
    );
  }

  const surahName = surahs.find(s => s.id === currentTask.surah)?.name;
  const isCompleted = currentTask.status === 'completed';

  return (
    <div className="flex-1 flex flex-col bg-neutral-950 text-neutral-100 p-8 overflow-y-auto" dir="rtl">
      <div className="max-w-4xl w-full mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">معالجة الفيديو</h1>
            <p className="text-neutral-400">
              سورة {surahName} - الآية {currentTask.ayah}
            </p>
          </div>
          <div className="text-left">
            <div className={cn("text-sm font-medium px-3 py-1 rounded-full bg-neutral-900 border", 
              isCompleted ? "border-emerald-500/30 text-emerald-400" : "border-amber-500/30 text-amber-500"
            )}>
              {statusMap[currentTask.status]?.label}
            </div>
          </div>
        </div>

        {/* Video Preview */}
        <div className="w-full aspect-video bg-neutral-900 rounded-2xl border border-neutral-800 overflow-hidden relative shadow-2xl">
          {isCompleted && currentTask.videoUrl ? (
            <video 
              src={currentTask.videoUrl} 
              autoPlay 
              controls 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
              <Loader2 className="w-12 h-12 text-amber-500 animate-spin mb-6" />
              <div className="w-full max-w-md bg-neutral-800 h-2 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${currentTask.progress}%` }}
                  className="h-full bg-gradient-to-r from-amber-500 to-amber-300"
                />
              </div>
              <p className="mt-4 text-neutral-400 font-mono">{currentTask.progress}%</p>
            </div>
          )}
        </div>

        {/* Pipeline Stages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Object.entries(statusMap).slice(1, 6).map(([key, value], i) => {
            const keys = Object.keys(statusMap);
            const taskIndex = keys.indexOf(currentTask.status);
            const thisIndex = keys.indexOf(key);
            
            const isDone = taskIndex > thisIndex || isCompleted;
            const isCurrent = taskIndex === thisIndex;

            return (
              <div 
                key={key} 
                className={cn(
                  "p-4 rounded-xl border transition-colors relative overflow-hidden",
                  isCurrent ? "bg-neutral-800/80 border-amber-500/50" : 
                  isDone ? "bg-neutral-900 border-neutral-800" : "bg-neutral-900/50 border-transparent opacity-50"
                )}
              >
                {isCurrent && (
                  <motion.div 
                    layoutId="activeStage"
                    className="absolute inset-0 bg-gradient-to-br from-amber-500/10 to-transparent"
                  />
                )}
                <div className="flex flex-col gap-3 relative z-10">
                  {isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  ) : isCurrent ? (
                    <Loader2 className="w-5 h-5 text-amber-500 animate-spin" />
                  ) : (
                    <CircleDashed className="w-5 h-5 text-neutral-600" />
                  )}
                  <span className="text-sm font-medium">{value.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Meta / Download */}
        <AnimatePresence>
          {isCompleted && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex justify-between items-center p-6 bg-amber-900/10 rounded-2xl border border-amber-900/30"
            >
              <div>
                <h3 className="text-amber-500 font-medium mb-1">تم الإنتاج بنجاح</h3>
                <p className="text-sm text-neutral-400">الفيديو جاهز للتحميل بجودة عالية</p>
              </div>
              <button className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold rounded-xl transition-colors">
                <Download className="w-5 h-5" />
                تحميل الفيديو
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </div>
    </div>
  );
}
