import React, { useState } from 'react';
import { Settings as SettingsIcon, X, Key, Eye, EyeOff, ExternalLink, Save, Activity, CheckCircle, AlertTriangle, ShieldCheck, RefreshCw, Youtube, ChevronDown, ChevronUp, PlayCircle } from 'lucide-react';
import { Settings } from '../types';
import { SKKN_MODELS, SYSTEM_API_KEY } from '../constants';
import { testConnection, getSelectedModelId } from '../services/geminiService';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: Settings;
  onSave: (settings: Settings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onSave }) => {
  const [localSettings, setLocalSettings] = React.useState<Settings>(settings);
  const [showKey, setShowKey] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showTutorial, setShowTutorial] = useState(false); // State cho video hướng dẫn

  React.useEffect(() => {
    // Khi mở modal, nếu key hiện tại trùng với System Key thì hiển thị trạng thái "đang dùng system key"
    setLocalSettings(settings);
    setTestResult(null);
    setShowTutorial(false); // Reset trạng thái video khi mở lại modal
  }, [settings, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    let keyToSave = localSettings.apiKey.trim();
    
    // Nếu người dùng chọn dùng System Key (keyToSave rỗng hoặc trùng SystemKey)
    if (!keyToSave && SYSTEM_API_KEY) {
      keyToSave = SYSTEM_API_KEY;
    }

    const finalSettings = {
      ...localSettings,
      apiKey: keyToSave
    };
    onSave(finalSettings);
    onClose();
  };

  const handleTestConnection = async () => {
    const keyToTest = localSettings.apiKey || SYSTEM_API_KEY;
    
    if (!keyToTest) {
      setTestResult({ success: false, message: "Vui lòng nhập API Key trước." });
      return;
    }
    
    setIsTesting(true);
    setTestResult(null);
    
    try {
      const modelId = getSelectedModelId(localSettings);
      await testConnection(keyToTest, modelId);
      setTestResult({ success: true, message: "Kết nối thành công! Key hoạt động tốt." });
    } catch (err: any) {
      setTestResult({ success: false, message: err.message });
    } finally {
      setIsTesting(false);
    }
  };

  const isUsingSystemKey = SYSTEM_API_KEY && (localSettings.apiKey === SYSTEM_API_KEY || !localSettings.apiKey);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col max-h-[95vh]">
        <div className="flex items-center justify-between p-5 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-white">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-blue-600" />
            Cấu hình Hệ thống
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar">
          
          {/* SECTION: VIDEO TUTORIAL BUTTON */}
          <div className="bg-gradient-to-r from-red-50 via-pink-50 to-red-50 rounded-xl border border-red-100 shadow-sm overflow-hidden">
             <button 
               onClick={() => setShowTutorial(!showTutorial)}
               className="w-full flex items-center justify-between p-4 hover:bg-red-100/50 transition-colors text-left"
             >
                <div className="flex items-center gap-3">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm text-red-600 animate-pulse">
                      <Youtube size={20} />
                   </div>
                   <div>
                      <p className="font-bold text-red-700 text-sm">Video Hướng Dẫn (HD)</p>
                      <p className="text-xs text-red-600/80">Cách lấy API Key & Sử dụng Web</p>
                   </div>
                </div>
                {showTutorial ? <ChevronUp className="text-red-400" /> : <ChevronDown className="text-red-400" />}
             </button>
             
             {showTutorial && (
               <div className="p-4 pt-0 animate-in slide-in-from-top-2 duration-300">
                  <div className="aspect-video w-full rounded-lg overflow-hidden shadow-md border border-gray-200 bg-black">
                    <iframe 
                      width="100%" 
                      height="100%" 
                      src="https://www.youtube.com/embed/JLBOWVy9DLc" 
                      title="Hướng dẫn sử dụng AI SKKN" 
                      frameBorder="0" 
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
                      allowFullScreen
                    ></iframe>
                  </div>
                  <p className="text-[10px] text-center text-gray-500 mt-2 italic">
                    *Video hướng dẫn chi tiết cách tạo Key miễn phí và không giới hạn.
                  </p>
               </div>
             )}
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* API Key Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Key className="w-4 h-4 text-amber-500" />
              Google Gemini API Key <span className="text-red-500">*</span>
            </label>
            
            {isUsingSystemKey ? (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3 shadow-sm">
                <div className="p-2 bg-white rounded-full border border-green-100 shadow-sm shrink-0">
                  <ShieldCheck className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-grow">
                  <p className="font-bold text-green-800 text-sm">Đang dùng Key Mặc Định</p>
                  <p className="text-xs text-green-700 mt-0.5">Sử dụng API Key được cấu hình sẵn trên Server.</p>
                </div>
                <button 
                  onClick={() => setLocalSettings({ ...localSettings, apiKey: '' })}
                  className="mt-2 sm:mt-0 px-3 py-1.5 text-xs font-medium bg-white border border-green-200 text-green-700 rounded-lg hover:bg-green-100 transition-colors shadow-sm whitespace-nowrap"
                >
                  Nhập Key riêng
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={localSettings.apiKey === SYSTEM_API_KEY ? '' : localSettings.apiKey}
                    onChange={(e) => {
                       setLocalSettings({ ...localSettings, apiKey: e.target.value });
                       setTestResult(null);
                    }}
                    placeholder="Nhập API Key cá nhân của bạn..."
                    className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm shadow-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    {showKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                
                {SYSTEM_API_KEY && (
                  <button 
                    onClick={() => setLocalSettings({ ...localSettings, apiKey: SYSTEM_API_KEY })}
                    className="text-xs flex items-center gap-1 text-blue-600 hover:text-blue-800 font-medium ml-1"
                  >
                    <RefreshCw size={12} />
                    Khôi phục về Key mặc định của hệ thống
                  </button>
                )}
              </div>
            )}

            {!isUsingSystemKey && (
              <div className="bg-amber-50 border border-amber-100 rounded-lg p-3 text-sm text-amber-800 flex gap-2 items-start">
                <div className="mt-0.5"><ExternalLink size={14} /></div>
                <div>
                  <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="font-semibold underline hover:text-amber-900">Lấy API Key tại đây</a>.
                  <p className="mt-1 text-xs opacity-80 font-medium">Dùng Key cá nhân giúp bạn không bị giới hạn bởi lưu lượng chung của hệ thống.</p>
                </div>
              </div>
            )}
          </div>

          <div className="h-px bg-gray-100"></div>

          {/* Model Section */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Chọn Mô hình AI</label>
            <select
              value={localSettings.model}
              onChange={(e) => {
                setLocalSettings({ ...localSettings, model: e.target.value });
                setTestResult(null);
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            >
              {SKKN_MODELS.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name}
                </option>
              ))}
            </select>
            
            {localSettings.model === 'custom' && (
              <div className="mt-3 animate-in fade-in slide-in-from-top-2">
                <input
                  type="text"
                  value={localSettings.customModel || ''}
                  onChange={(e) => setLocalSettings({ ...localSettings, customModel: e.target.value })}
                  placeholder="Nhập tên model (VD: gemini-3.0-flash-exp)"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                />
              </div>
            )}
          </div>

          {/* Test Result Display */}
          {testResult && (
            <div className={`p-3 rounded-lg text-sm flex items-start gap-2 ${testResult.success ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
               {testResult.success ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertTriangle className="w-5 h-5 shrink-0" />}
               <span>{testResult.message}</span>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100 bg-gray-50 flex justify-between gap-3">
          <button
             onClick={handleTestConnection}
             disabled={isTesting || (!localSettings.apiKey && !SYSTEM_API_KEY)}
             className="px-4 py-2.5 text-blue-700 font-medium bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-xl transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isTesting ? <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"></div> : <Activity size={18} />}
            <span className="hidden sm:inline">Kiểm tra kết nối</span>
            <span className="sm:hidden">Test</span>
          </button>
          
          <div className="flex gap-2">
            <button
               onClick={onClose}
               className="px-5 py-2.5 text-gray-600 font-medium hover:bg-gray-200 rounded-xl transition-colors"
            >
              Đóng
            </button>
            <button
              onClick={handleSave}
              disabled={isTesting}
              className={`px-5 py-2.5 text-white font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all transform active:scale-95
                ${'bg-blue-600 hover:bg-blue-700 hover:shadow-md'}`}
            >
              <Save size={18} />
              Lưu
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;