import React from 'react';
import { X, AlertTriangle, CheckCircle, Lightbulb, Copy, ArrowRight, TrendingUp, BookOpen } from 'lucide-react';
import { TitleAnalysisResult } from '../types';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  result: TitleAnalysisResult | null;
  onUseTitle: (newTitle: string) => void;
}

const TitleAnalysisModal: React.FC<Props> = ({ isOpen, onClose, result, onUseTitle }) => {
  if (!isOpen || !result) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-neutral-900 w-full max-w-4xl rounded-3xl shadow-2xl shadow-amber-500/10 flex flex-col max-h-[95vh] overflow-hidden font-sans border border-amber-500/20">
        
        {/* HEADER */}
        <div className="bg-neutral-900 border-b border-amber-500/20 p-5 flex justify-between items-center sticky top-0 z-10">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <span className="bg-amber-500 text-neutral-900 p-1.5 rounded-lg"><Lightbulb className="h-5 w-5" /></span>
              Phân Tích Chi Tiết Đề Tài
            </h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-800 rounded-full transition-colors text-neutral-400"><X className="h-6 w-6" /></button>
        </div>

        {/* BODY - SCROLLABLE */}
        <div className="p-6 overflow-y-auto space-y-8 bg-neutral-950/50 scrollbar-hide">
          
          {/* 1. ĐỘ RÕ RÀNG (Progress Bar) */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
            <div className="flex justify-between items-end mb-2">
              <span className="font-bold text-amber-300">Độ rõ ràng</span>
              <span className="font-black text-xl text-white">{result.clarity_score}/20</span>
            </div>
            <div className="w-full bg-neutral-700 rounded-full h-3 overflow-hidden">
              <div 
                className={`h-full rounded-full ${result.clarity_score > 15 ? 'bg-emerald-500' : result.clarity_score > 10 ? 'bg-amber-500' : 'bg-red-500'}`} 
                style={{ width: `${(result.clarity_score / 20) * 100}%` }}
              ></div>
            </div>
            <p className="text-xs text-neutral-400 mt-2">Đánh giá dựa trên cấu trúc ngữ pháp và tính chuyên môn.</p>
          </div>

          {/* 2. CẤU TRÚC (5 Boxes) */}
          <div className="bg-neutral-800 p-6 rounded-2xl border border-neutral-700 shadow-sm">
            <h3 className="flex items-center gap-2 font-bold text-amber-400 mb-4 text-sm uppercase tracking-wide">
              <BookOpen className="h-4 w-4" /> Cấu trúc tên đề tài
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {[
                { l: 'Hành động', v: result.structure.action },
                { l: 'Công cụ', v: result.structure.tool },
                { l: 'Môn học', v: result.structure.subject },
                { l: 'Phạm vi', v: result.structure.scope },
                { l: 'Mục đích', v: result.structure.goal }
              ].map((item, i) => (
                <div key={i} className="bg-neutral-900 border border-neutral-700 rounded-xl p-4 text-center hover:border-amber-500/50 transition-colors">
                  <span className="block text-[10px] uppercase font-bold text-neutral-500 mb-2">{item.l}</span>
                  <span className="block text-sm font-bold text-neutral-200 line-clamp-2">{item.v || "---"}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 3. VẤN ĐỀ CẦN KHẮC PHỤC (Red Block) */}
          <div className="bg-red-950/40 p-6 rounded-2xl border border-red-500/30">
            <h3 className="flex items-center gap-2 font-bold text-red-400 mb-4 text-sm uppercase">
              <AlertTriangle className="h-4 w-4" /> Vấn đề cần khắc phục ({result.issues.length})
            </h3>
            <ul className="space-y-3">
              {result.issues.map((issue, i) => (
                <li key={i} className="flex gap-3 text-sm text-red-300 leading-relaxed">
                  <span className="block min-w-[6px] h-1.5 w-1.5 rounded-full bg-red-400 mt-2"></span>
                  {issue}
                </li>
              ))}
            </ul>
          </div>

          {/* 4. ĐỀ XUẤT THAY THẾ (Blue Cards) */}
          <div className="bg-amber-900/20 p-6 rounded-2xl border border-amber-500/30">
            <h3 className="flex items-center gap-2 font-bold text-amber-400 mb-4 text-sm uppercase">
              <Lightbulb className="h-4 w-4" /> Đề xuất tên thay thế
            </h3>
            <div className="space-y-4">
              {result.alternatives.map((alt, i) => (
                <div key={i} className="bg-neutral-800 p-5 rounded-xl border border-neutral-700 shadow-sm hover:border-amber-500/50 transition-all group">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h4 className="font-bold text-white text-base mb-2 group-hover:text-amber-400 transition-colors">
                        {alt.title}
                      </h4>
                      <p className="text-xs text-neutral-400 leading-relaxed bg-neutral-900 p-2 rounded inline-block">
                        {alt.reason}
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                       {/* Score Badge */}
                      <span className="inline-flex items-center justify-center min-w-[40px] px-2 py-1 rounded bg-emerald-900/50 text-emerald-400 font-black text-xs border border-emerald-500/30">
                        {alt.score}đ
                      </span>
                      {/* Use Button */}
                      <button 
                        onClick={() => { onUseTitle(alt.title); onClose(); }}
                        className="bg-amber-500 hover:bg-amber-400 text-neutral-900 text-xs font-bold py-2 px-4 rounded-lg transition-colors whitespace-nowrap shadow-amber-500/30 shadow-lg flex items-center gap-1"
                      >
                        Sử dụng <ArrowRight className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 5. LIÊN QUAN & KẾT LUẬN */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {/* Related Topics (Green) */}
            <div className="md:col-span-1 bg-emerald-900/30 p-5 rounded-2xl border border-emerald-500/30">
              <h3 className="font-bold text-emerald-400 mb-3 text-xs uppercase flex items-center gap-2">
                <TrendingUp className="h-4 w-4" /> Chủ đề liên quan
              </h3>
              <div className="flex flex-wrap gap-2">
                {result.related_topics.map((tag, i) => (
                  <span key={i} className="bg-neutral-800 text-emerald-400 px-3 py-1.5 rounded-lg text-xs font-bold border border-emerald-500/30 shadow-sm">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Conclusion (Purple) */}
            <div className="md:col-span-2 bg-amber-900/20 p-5 rounded-2xl border border-amber-500/30">
              <h3 className="font-bold text-amber-400 mb-2 text-xs uppercase flex items-center gap-2">
                <CheckCircle className="h-4 w-4" /> Kết luận chuyên gia
              </h3>
              <p className="text-sm text-amber-200/80 leading-relaxed italic text-justify">
                "{result.conclusion}"
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default TitleAnalysisModal;