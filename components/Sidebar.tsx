import React from 'react';
import { Phone, Facebook, Youtube, X, User, Heart, MessageCircle, Settings, Key, ArrowRight } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, onOpenSettings, className = '' }) => {
  return (
    <>
      {/* Overlay cho Mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-40 md:hidden backdrop-blur-sm transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside 
        className={`fixed md:sticky top-0 left-0 z-50 h-full w-80 bg-white/90 backdrop-blur-xl border-r border-slate-100 shadow-2xl md:shadow-none transform transition-transform duration-300 cubic-bezier(0.4, 0, 0.2, 1) flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${className}`}
      >
        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-slate-50 to-white">
          <div>
            <h2 className="font-bold text-xl text-slate-800 flex items-center gap-2">
              <span className="w-1.5 h-6 bg-blue-600 rounded-full"></span>
              Thông tin hỗ trợ
            </h2>
          </div>
          <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
          <div className="mb-8">
            <h3 className="font-bold text-slate-400 mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <User size={14} />
              Phát triển bởi
            </h3>
            <div className="relative group overflow-hidden p-5 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl shadow-lg shadow-blue-500/20 text-white">
               <div className="absolute top-0 right-0 -mt-4 -mr-4 w-24 h-24 bg-white/10 rounded-full blur-2xl group-hover:bg-white/20 transition-all"></div>
               <div className="relative z-10">
                 <p className="font-bold text-lg flex items-center gap-2">
                   Admin SGTV
                   <span className="px-2 py-0.5 rounded text-[10px] bg-white/20 font-medium backdrop-blur-sm border border-white/10">PRO</span>
                 </p>
                 <p className="text-blue-100 text-sm mt-1 opacity-90">Chuyên gia hỗ trợ công nghệ giáo dục 4.0</p>
                 <div className="mt-4 pt-4 border-t border-white/20 flex items-center gap-2 text-xs font-medium text-blue-100">
                    <Heart size={12} className="text-pink-400 fill-pink-400 animate-pulse" />
                    <span>Hết lòng vì giáo viên Việt Nam</span>
                 </div>
               </div>
            </div>
          </div>

          <div className="mb-8">
            <h3 className="font-bold text-slate-400 mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <MessageCircle size={14} />
              Liên hệ & Hỗ trợ
            </h3>
            <div className="space-y-3">
              <a href="https://zalo.me/0355936256" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-4 p-3 bg-white hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors shadow-inner">
                  <Phone size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-blue-700 text-sm">Zalo / Hotline</p>
                  <p className="text-xs text-slate-500 font-medium">0355.936.256</p>
                </div>
              </a>

              <a href="https://www.facebook.com/vanhuong1982" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-4 p-3 bg-white hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center group-hover:bg-[#1877F2] group-hover:text-white transition-colors shadow-inner">
                  <Facebook size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-[#1877F2] text-sm">Facebook Admin</p>
                  <p className="text-xs text-slate-500 font-medium">Văn Hưởng</p>
                </div>
              </a>

              <a href="https://www.youtube.com/@SO%E1%BA%A0NGI%E1%BA%A2NGTV" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-4 p-3 bg-white hover:bg-red-50/50 border border-slate-100 hover:border-red-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white transition-colors shadow-inner">
                  <Youtube size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-[#FF0000] text-sm">Soạn Giảng TV</p>
                  <p className="text-xs text-slate-500 font-medium">Kênh Chính Thức</p>
                </div>
              </a>

               <a href="https://www.youtube.com/@soangiangofficial" target="_blank" rel="noopener noreferrer" 
                 className="flex items-center gap-4 p-3 bg-white hover:bg-red-50/50 border border-slate-100 hover:border-red-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5">
                <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center group-hover:bg-[#FF0000] group-hover:text-white transition-colors shadow-inner">
                  <Youtube size={18} />
                </div>
                <div>
                  <p className="font-bold text-slate-700 group-hover:text-[#FF0000] text-sm">Soạn Giảng Official</p>
                  <p className="text-xs text-slate-500 font-medium">Kênh Phụ</p>
                </div>
              </a>
            </div>
          </div>

          {/* SECTION CẤU HÌNH API KEY - NẰM DƯỚI THÔNG TIN HỖ TRỢ */}
          <div className="pt-6 border-t border-slate-100">
            <h3 className="font-bold text-slate-400 mb-4 uppercase text-xs tracking-widest flex items-center gap-2">
              <Settings size={14} />
              Cấu hình
            </h3>
            <button 
              onClick={() => {
                onOpenSettings();
                // Tự động đóng sidebar trên mobile khi click
                if (window.innerWidth < 768) onClose();
              }}
              className="w-full flex items-center gap-4 p-3 bg-gradient-to-r from-amber-50 to-orange-50 hover:from-amber-100 hover:to-orange-100 border border-amber-100 hover:border-amber-200 rounded-2xl transition-all group shadow-sm hover:shadow-md hover:-translate-y-0.5 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-16 h-16 bg-white/20 rounded-full -mr-8 -mt-8 blur-xl"></div>
              
              <div className="w-10 h-10 rounded-full bg-white text-amber-600 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
                <Key size={18} className="drop-shadow-sm" />
              </div>
              <div className="text-left flex-1 relative z-10">
                <p className="font-bold text-slate-800 group-hover:text-amber-800 text-sm flex items-center justify-between">
                  API Key & Model
                  <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0" />
                </p>
                <p className="text-xs text-slate-600 font-medium">Thiết lập kết nối AI</p>
              </div>
            </button>
          </div>
        </div>
        
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 backdrop-blur text-center">
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">© 2026 SOẠN GIẢNG AI-SKKN PRO</p>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;