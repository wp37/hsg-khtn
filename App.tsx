import React, { useState, useCallback, useRef, useEffect } from 'react';
import { Sparkles, Upload, FileText, X, Zap, PenTool, Phone, Award, BookOpen, Target, Lightbulb, History, Settings, Users, LogOut, Shield, Check, Trash2, Lock, ShieldCheck, AlertTriangle, Wrench, FlaskConical, GraduationCap, ClipboardCheck, Beaker, Atom, TestTubes, ImageIcon } from 'lucide-react';
import { generateContent, getSelectedModelId } from './services/geminiService';
import {
  SYSTEM_API_KEY,
  SYSTEM_INSTRUCTION,
  EVALUATOR_SYSTEM_INSTRUCTION,
  SOLVE_PROMPT,
  SOLVE_FROM_FILE_PROMPT,
  EXAM_GENERATE_PROMPT,
  GRADING_PROMPT,
  CHEMISTRY_TOPICS,
  DIFFICULTY_LEVELS,
  EXAM_GRADES,
  SOLVER_SUGGESTIONS,
} from './constants';
import {
  validateAdminCredentials,
  isAdmin,
  loginAdmin,
  logoutAdmin,
  getPendingRegistrations,
  getActivatedRegistrations,
  activateUser,
  deactivateUser,
  registerUser,
  canAccessFeature,
  getCurrentUserPhone,
  getCurrentUserName,
  isUserActivated,
  isPhonePending,
  BANK_INFO,
  UserRegistration
} from './utils/authUtils';
import { Settings as SettingsType, GenerationStep, UploadedFile, AppMode, ChemistryTopic, DifficultyLevel, ExamGrade, ExamFormData } from './types';
import * as mammoth from 'mammoth';
import ResultView from './components/ResultView';

const APP_VERSION = 'v1.0';

const App: React.FC = () => {
  // === MODE STATE ===
  const [appMode, setAppMode] = useState<AppMode>('solver');

  // === SOLVER STATES ===
  const [problemInput, setProblemInput] = useState('');
  const [solverTopic, setSolverTopic] = useState<ChemistryTopic>('tong_hop');
  const [solverGrade, setSolverGrade] = useState<ExamGrade>('9');
  const [solverFile, setSolverFile] = useState<UploadedFile | null>(null);
  const [pastedImages, setPastedImages] = useState<{ data: string; mimeType: string; id: string }[]>([]);

  // === EXAM CREATOR STATES ===
  const [examTopic, setExamTopic] = useState<ChemistryTopic>('tong_hop');
  const [examGrade, setExamGrade] = useState<ExamGrade>('9');
  const [examDifficulty, setExamDifficulty] = useState<DifficultyLevel>('hsg_huyen');
  const [examQuestionCount, setExamQuestionCount] = useState(5);
  const [examTimeLimit, setExamTimeLimit] = useState(120);
  const [examIncludeAnswer, setExamIncludeAnswer] = useState(true);
  const [examCustomReq, setExamCustomReq] = useState('');

  // === GRADER STATES ===
  const [graderFile, setGraderFile] = useState<UploadedFile | null>(null);

  // === SHARED STATES ===
  const [step, setStep] = useState<GenerationStep>(GenerationStep.IDLE);
  const [progressMsg, setProgressMsg] = useState<string>('');
  const [result, setResult] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [showApiKeyModal, setShowApiKeyModal] = useState(false);
  const [showAdminLoginModal, setShowAdminLoginModal] = useState(false);
  const [showAdminPanel, setShowAdminPanel] = useState(false);
  const [customApiKey, setCustomApiKey] = useState('');

  // Admin states
  const [adminLoggedIn, setAdminLoggedIn] = useState(isAdmin());
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminLoginError, setAdminLoginError] = useState('');
  const [pendingRegistrations, setPendingRegistrations] = useState<UserRegistration[]>([]);
  const [activatedRegistrations, setActivatedRegistrations] = useState<UserRegistration[]>([]);

  // User Registration states
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [phoneInput, setPhoneInput] = useState('');
  const [fullNameInput, setFullNameInput] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  const [userActivated, setUserActivated] = useState(canAccessFeature());

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [settings, setSettings] = useState<SettingsType>({
    model: 'gemini-2.5-flash',
    apiKey: SYSTEM_API_KEY || '',
    customModel: ''
  });

  // Load saved API key from localStorage on startup
  useEffect(() => {
    const savedKey = localStorage.getItem('gemini_api_key');
    if (savedKey && savedKey.trim()) {
      setSettings(prev => ({ ...prev, apiKey: savedKey.trim() }));
      setCustomApiKey(savedKey.trim());
    }
  }, []);

  // Load phone lists when admin panel opens
  useEffect(() => {
    if (showAdminPanel && adminLoggedIn) {
      setPendingRegistrations(getPendingRegistrations());
      setActivatedRegistrations(getActivatedRegistrations());
    }
  }, [showAdminPanel, adminLoggedIn]);

  useEffect(() => {
    setUserActivated(canAccessFeature());
  }, [adminLoggedIn]);

  // Handle admin login
  const handleAdminLogin = () => {
    if (validateAdminCredentials(adminUsername, adminPassword)) {
      loginAdmin();
      setAdminLoggedIn(true);
      setShowAdminLoginModal(false);
      setShowAdminPanel(true);
      setAdminUsername('');
      setAdminPassword('');
      setAdminLoginError('');
    } else {
      setAdminLoginError('Sai tên đăng nhập hoặc mật khẩu');
    }
  };

  const handleAdminLogout = () => { logoutAdmin(); setAdminLoggedIn(false); setShowAdminPanel(false); };
  const handleActivateUser = (phone: string) => { activateUser(phone); setPendingRegistrations(getPendingRegistrations()); setActivatedRegistrations(getActivatedRegistrations()); };
  const handleDeactivateUser = (phone: string) => { deactivateUser(phone); setActivatedRegistrations(getActivatedRegistrations()); };

  const handleRegisterUser = () => {
    const res = registerUser(phoneInput, fullNameInput);
    if (res.success) { setRegisterSuccess(true); setRegisterError(''); setPhoneInput(''); setFullNameInput(''); }
    else { setRegisterError(res.error || 'Có lỗi xảy ra'); setRegisterSuccess(false); }
  };

  // === FILE PROCESSING ===
  const readFileAsBase64 = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => { const res = reader.result as string; resolve(res.includes(',') ? res.split(',')[1] : res); };
    reader.onerror = () => reject(new Error("Lỗi đọc file"));
    reader.readAsDataURL(file);
  });

  const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as ArrayBuffer);
    reader.onerror = () => reject(new Error("Lỗi đọc file"));
    reader.readAsArrayBuffer(file);
  });

  const readFileAsText = (file: File): Promise<string> => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error("Lỗi đọc file"));
    reader.readAsText(file);
  });

  const processFile = async (file: File): Promise<UploadedFile | null> => {
    const fileName = file.name.toLowerCase();
    if (file.size > 10 * 1024 * 1024) { alert('File quá lớn (Max 10MB)'); return null; }
    try {
      if (fileName.endsWith('.pdf')) {
        const base64 = await readFileAsBase64(file);
        return { name: file.name, type: 'pdf', content: base64, mimeType: 'application/pdf' };
      } else if (fileName.endsWith('.docx')) {
        const arrayBuffer = await readFileAsArrayBuffer(file);
        const uint8Array = new Uint8Array(arrayBuffer);
        const isZipFormat = uint8Array[0] === 0x50 && uint8Array[1] === 0x4B;
        if (isZipFormat) {
          try {
            let extractRawTextFn = mammoth.extractRawText;
            // @ts-ignore
            if (!extractRawTextFn && mammoth.default?.extractRawText) { extractRawTextFn = mammoth.default.extractRawText; }
            const res = await extractRawTextFn({ arrayBuffer });
            return { name: file.name, type: 'docx', content: res.value, mimeType: 'text/plain' };
          } catch (mammothErr) { console.log('Mammoth failed:', mammothErr); }
        }
        const textContent = await readFileAsText(file);
        if (textContent && textContent.trim().length > 0) {
          const plainText = textContent
            .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
            .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
            .replace(/<[^>]+>/g, '\n')
            .replace(/&nbsp;/g, ' ').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
            .replace(/\n\s*\n/g, '\n\n').trim();
          return { name: file.name, type: 'docx', content: plainText, mimeType: 'text/plain' };
        }
        alert('⚠️ Không thể đọc nội dung file .docx này.'); return null;
      } else if (fileName.endsWith('.txt')) {
        const text = await readFileAsText(file);
        return { name: file.name, type: 'txt', content: text, mimeType: 'text/plain' };
      }
    } catch (e: any) {
      alert(`Lỗi đọc file: ${e.message}`);
    }
    return null;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, target: 'solver' | 'grader') => {
    if (e.target.files?.[0]) {
      const file = await processFile(e.target.files[0]);
      if (file) {
        if (target === 'solver') setSolverFile(file);
        else setGraderFile(file);
      }
    }
  };

  // === ERROR HANDLER ===
  const handleError = (err: any) => {
    setStep(GenerationStep.ERROR);
    const msg = err.message || "Có lỗi xảy ra.";
    const isInvalidKey = msg.includes('không hợp lệ') || msg.includes('INVALID_ARGUMENT');
    const isQuotaExhausted = msg.includes('hết quota') || msg.includes('RESOURCE_EXHAUSTED');

    if (isInvalidKey || isQuotaExhausted) {
      // Clear bad key and show modal
      localStorage.removeItem('gemini_api_key');
      setSettings(prev => ({ ...prev, apiKey: '' }));
      setCustomApiKey('');
      setShowApiKeyModal(true);
      setError(isInvalidKey
        ? '🔑 API Key không hợp lệ hoặc đã hết hạn. Vui lòng nhập key mới.\n👉 Lấy key miễn phí tại: aistudio.google.com/apikey'
        : '⚡ API Key đã hết lượt dùng (quota). Vui lòng tạo key mới hoặc chờ reset.\n👉 Lấy key miễn phí tại: aistudio.google.com/apikey'
      );
    } else {
      setError(`⚠️ ${msg}`);
    }
  };

  // === PASTE IMAGE HANDLER ===
  const handlePaste = useCallback((e: React.ClipboardEvent<HTMLTextAreaElement>) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (!file) continue;
        if (file.size > 10 * 1024 * 1024) { alert('Ảnh quá lớn (Max 10MB)'); return; }

        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64 = result.includes(',') ? result.split(',')[1] : result;
          setPastedImages(prev => [...prev, {
            data: base64,
            mimeType: item.type,
            id: `img_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
          }]);
        };
        reader.readAsDataURL(file);
      }
    }
  }, []);

  const removePastedImage = (id: string) => {
    setPastedImages(prev => prev.filter(img => img.id !== id));
  };

  // === SOLVER LOGIC ===
  const handleSolve = useCallback(async () => {
    if (!problemInput.trim() && !solverFile && pastedImages.length === 0) return;
    if (!canAccessFeature() && !settings.apiKey) { setShowRegisterModal(true); return; }
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.SOLVING);
    setError(null);
    setResult('');

    try {
      const modelId = getSelectedModelId(settings);
      const topicName = CHEMISTRY_TOPICS.find(t => t.id === solverTopic)?.name || 'Tổng hợp';

      if (solverFile) {
        // Solve from file
        setProgressMsg('🔬 Đang đọc đề bài từ file...');
        const contentParts: any[] = [];
        if (solverFile.type === 'pdf') {
          contentParts.push({ inlineData: { mimeType: solverFile.mimeType, data: solverFile.content } });
          contentParts.push({ text: SOLVE_FROM_FILE_PROMPT });
        } else {
          contentParts.push({ text: `ĐỀ BÀI TỪ FILE:\n"""\n${solverFile.content}\n"""\n\n${SOLVE_FROM_FILE_PROMPT}` });
        }
        const response = await generateContent(modelId, contentParts, activeKey, SYSTEM_INSTRUCTION);
        setResult(response);
      } else if (pastedImages.length > 0) {
        // Solve with pasted images (+ optional text)
        setProgressMsg('📸 Đang phân tích hình ảnh đề bài...');
        const contentParts: any[] = [];
        // Add all pasted images
        for (const img of pastedImages) {
          contentParts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
        }
        // Add text prompt
        const prompt = problemInput.trim()
          ? SOLVE_PROMPT(problemInput, topicName, `Lớp ${solverGrade}`)
          : `Hãy đọc đề bài Hóa Học trong ${pastedImages.length > 1 ? 'các hình ảnh' : 'hình ảnh'} trên và giải chi tiết từng câu.\n\nChủ đề: ${topicName}\nLớp: ${solverGrade}\n\nYêu cầu: Giải chi tiết, cân bằng phương trình, ghi đơn vị đầy đủ.`;
        contentParts.push({ text: prompt });
        const response = await generateContent(modelId, contentParts, activeKey, SYSTEM_INSTRUCTION);
        setResult(response);
      } else {
        // Solve from text only
        setProgressMsg('🧪 Đang phân tích và giải bài tập...');
        const prompt = SOLVE_PROMPT(problemInput, topicName, `Lớp ${solverGrade}`);
        const response = await generateContent(modelId, prompt, activeKey, SYSTEM_INSTRUCTION);
        setResult(response);
      }

      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');
    } catch (err: any) {
      handleError(err);
    }
  }, [problemInput, solverFile, pastedImages, solverTopic, solverGrade, settings]);

  // === EXAM CREATOR LOGIC ===
  const handleCreateExam = useCallback(async () => {
    if (!canAccessFeature() && !settings.apiKey) { setShowRegisterModal(true); return; }
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.GENERATING_EXAM);
    setError(null);
    setResult('');
    setProgressMsg('📝 Đang tạo đề thi HSG Hóa Học...');

    try {
      const modelId = getSelectedModelId(settings);
      const examConfig: ExamFormData = {
        topic: examTopic,
        grade: examGrade,
        difficulty: examDifficulty,
        questionCount: examQuestionCount,
        timeLimit: examTimeLimit,
        includeAnswer: examIncludeAnswer,
        customRequirements: examCustomReq,
      };

      const prompt = EXAM_GENERATE_PROMPT(examConfig);
      const response = await generateContent(modelId, prompt, activeKey, SYSTEM_INSTRUCTION);
      setResult(response);
      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');
    } catch (err: any) {
      handleError(err);
    }
  }, [examTopic, examGrade, examDifficulty, examQuestionCount, examTimeLimit, examIncludeAnswer, examCustomReq, settings]);

  // === GRADER LOGIC ===
  const handleGrade = useCallback(async () => {
    if (!graderFile) return;
    if (!canAccessFeature() && !settings.apiKey) { setShowRegisterModal(true); return; }
    const activeKey = settings.apiKey || SYSTEM_API_KEY;
    if (!activeKey) { setShowApiKeyModal(true); setError("Vui lòng nhập API Key."); return; }

    setStep(GenerationStep.GRADING);
    setError(null);
    setResult('');
    setProgressMsg('✅ Đang chấm và phân tích bài làm...');

    try {
      const modelId = getSelectedModelId(settings);
      const contentParts: any[] = [];

      if (graderFile.type === 'pdf') {
        contentParts.push({ inlineData: { mimeType: graderFile.mimeType, data: graderFile.content } });
        contentParts.push({ text: GRADING_PROMPT });
      } else {
        contentParts.push({ text: `BÀI LÀM CẦN CHẤM:\n"""\n${graderFile.content}\n"""\n\n${GRADING_PROMPT}` });
      }

      const response = await generateContent(modelId, contentParts, activeKey, EVALUATOR_SYSTEM_INSTRUCTION);
      setResult(response);
      setStep(GenerationStep.COMPLETED);
      setProgressMsg('');
    } catch (err: any) {
      handleError(err);
    }
  }, [graderFile, settings]);

  // Reset states when changing mode
  const handleModeChange = (newMode: AppMode) => {
    setAppMode(newMode);
    setResult('');
    setError(null);
    setStep(GenerationStep.IDLE);
    setProgressMsg('');
  };

  const isProcessing = step !== GenerationStep.IDLE && step !== GenerationStep.COMPLETED && step !== GenerationStep.ERROR;

  return (
    <div className="min-h-screen bg-[#0a0f1e] text-white" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      {/* Navigation Bar */}
      <nav className="bg-[#0a0f1e]/95 backdrop-blur-xl border-b border-teal-500/20 sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-teal-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-teal-500/30">
              <FlaskConical size={20} className="text-white" />
            </div>
            <div className="hidden md:block">
              <span className="text-lg font-bold bg-gradient-to-r from-teal-300 to-emerald-400 bg-clip-text text-transparent">HSG Hóa Học</span>
              <span className="text-xs text-teal-500/60 ml-2">AI Pro</span>
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <button
              onClick={() => setShowApiKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#111827] hover:bg-[#1f2937] border border-teal-500/30 rounded-lg text-gray-300 transition-colors text-sm"
            >
              <Settings size={16} />
              <span className="hidden sm:inline">API Key</span>
            </button>

            {!isUserActivated() && !adminLoggedIn && (
              <button
                onClick={() => { setShowRegisterModal(true); setRegisterSuccess(false); setRegisterError(''); setFullNameInput(''); setPhoneInput(''); }}
                className="group relative flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500 via-emerald-500 to-green-500 hover:from-teal-400 hover:via-emerald-400 hover:to-green-400 rounded-xl text-white font-bold text-sm transition-all duration-300 shadow-lg shadow-teal-500/30 hover:shadow-teal-500/50 hover:scale-105 animate-pulse hover:animate-none"
              >
                <Sparkles size={16} />
                <span className="hidden sm:inline">Đăng ký</span>
                <span className="sm:hidden">Đăng ký</span>
              </button>
            )}

            {isUserActivated() && !adminLoggedIn && (
              <span className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-lg text-emerald-400 text-sm">
                <Check size={14} />
                <span className="hidden sm:inline">Đã kích hoạt</span>
              </span>
            )}

            <span className="px-2 py-1 bg-teal-500/20 text-teal-400 text-xs font-bold rounded">
              {APP_VERSION}
            </span>

            <button
              onClick={() => adminLoggedIn ? setShowAdminPanel(true) : setShowAdminLoginModal(true)}
              className={`flex items-center gap-1.5 px-3 py-2 transition-colors text-sm ${adminLoggedIn ? 'text-teal-400 bg-teal-500/10 rounded-lg' : 'text-gray-400 hover:text-teal-400'}`}
            >
              {adminLoggedIn ? <Shield size={16} /> : <Users size={16} />}
              <span className="hidden sm:inline">{adminLoggedIn ? 'Admin' : 'Quản lý'}</span>
            </button>

            {adminLoggedIn && (
              <button onClick={handleAdminLogout} className="flex items-center gap-1.5 px-3 py-2 text-gray-400 hover:text-red-400 transition-colors text-sm">
                <LogOut size={16} />
              </button>
            )}
          </div>
        </div>
      </nav>

      {/* Header */}
      <header className="py-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="w-12 h-12 bg-gradient-to-br from-teal-400 via-emerald-400 to-green-500 rounded-2xl flex items-center justify-center shadow-xl shadow-teal-500/30 animate-pulse">
            <Atom size={28} className="text-white" />
          </div>
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-green-400 bg-clip-text text-transparent">HSG KHTN Hóa Học</span>
          <span className="text-white"> AI</span>
        </h1>
        <p className="text-gray-400 text-sm max-w-lg mx-auto">
          Trợ lý AI thông minh giải bài tập, tạo đề thi & chấm bài Hóa học cho học sinh giỏi
        </p>
      </header>

      {/* Mode Switcher */}
      <div className="max-w-2xl mx-auto px-4 mb-8">
        <div className="p-1.5 bg-[#111827] rounded-2xl flex shadow-inner border border-teal-500/10">
          <button
            onClick={() => handleModeChange('solver')}
            className={`flex-1 py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${appMode === 'solver'
              ? 'bg-gradient-to-r from-teal-600 to-emerald-600 text-white shadow-lg shadow-teal-500/30'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <Beaker size={16} />
            <span className="hidden sm:inline">Giải bài tập</span>
            <span className="sm:hidden">Giải bài</span>
          </button>
          <button
            onClick={() => handleModeChange('exam_creator')}
            className={`flex-1 py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${appMode === 'exam_creator'
              ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg shadow-violet-500/30'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <GraduationCap size={16} />
            <span className="hidden sm:inline">Tạo đề thi</span>
            <span className="sm:hidden">Tạo đề</span>
          </button>
          <button
            onClick={() => handleModeChange('grader')}
            className={`flex-1 py-3 rounded-xl text-xs md:text-sm font-bold transition-all flex items-center justify-center gap-2 ${appMode === 'grader'
              ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-lg shadow-amber-500/30'
              : 'text-gray-400 hover:text-white'
              }`}
          >
            <ClipboardCheck size={16} />
            <span className="hidden sm:inline">Chấm bài</span>
            <span className="sm:hidden">Chấm</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 pb-12">

        {/* =============== SOLVER MODE =============== */}
        {appMode === 'solver' && !result && (
          <div className="bg-[#111827] rounded-2xl border border-teal-500/20 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-teal-300 mb-6 flex items-center gap-2">
              <Beaker size={22} /> Giải bài tập Hóa Học
            </h2>

            {/* Topic & Grade Selection */}
            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Chủ đề</label>
                <select
                  value={solverTopic}
                  onChange={(e) => setSolverTopic(e.target.value as ChemistryTopic)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-teal-500 focus:outline-none text-sm"
                >
                  {CHEMISTRY_TOPICS.map(t => (
                    <option key={t.id} value={t.id}>{t.icon} {t.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lớp</label>
                <select
                  value={solverGrade}
                  onChange={(e) => setSolverGrade(e.target.value as ExamGrade)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-teal-500 focus:outline-none text-sm"
                >
                  {EXAM_GRADES.map(g => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Problem Input */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-2">
                Nhập đề bài
                <span className="text-gray-600 font-normal ml-2">• Hỗ trợ dán ảnh (Ctrl+V)</span>
              </label>
              <textarea
                value={problemInput}
                onChange={(e) => setProblemInput(e.target.value)}
                onPaste={handlePaste}
                rows={6}
                placeholder="Nhập đề bài hoặc dán ảnh chụp đề (Ctrl+V)..."
                className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none resize-none text-sm leading-relaxed"
              />

              {/* Pasted Images Preview */}
              {pastedImages.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-gray-400 mb-2 flex items-center gap-1">
                    <ImageIcon size={12} />
                    {pastedImages.length} ảnh đã dán
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {pastedImages.map((img) => (
                      <div key={img.id} className="relative group">
                        <img
                          src={`data:${img.mimeType};base64,${img.data}`}
                          alt="Ảnh đề bài"
                          className="w-28 h-28 object-cover rounded-lg border-2 border-gray-700 group-hover:border-teal-500 transition-colors"
                        />
                        <button
                          onClick={() => removePastedImage(img.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 hover:bg-red-400 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Suggestions */}
            <div className="mb-5">
              <p className="text-xs text-gray-500 mb-2">Gợi ý nhanh:</p>
              <div className="flex flex-wrap gap-2">
                {SOLVER_SUGGESTIONS.map((s, i) => (
                  <button
                    key={i}
                    onClick={() => setProblemInput(s)}
                    className="px-3 py-1.5 bg-teal-500/10 border border-teal-500/30 rounded-lg text-teal-400 text-xs hover:bg-teal-500/20 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Or Upload File */}
            <div className="mb-6">
              <div className="flex items-center gap-4 mb-3">
                <div className="h-px flex-1 bg-gray-700"></div>
                <span className="text-xs text-gray-500">hoặc tải file đề bài</span>
                <div className="h-px flex-1 bg-gray-700"></div>
              </div>
              <label className="flex items-center justify-center gap-2 px-4 py-4 bg-[#0a0f1e] border-2 border-dashed border-gray-600 hover:border-teal-500 rounded-xl cursor-pointer transition-colors group">
                <Upload size={20} className="text-gray-400 group-hover:text-teal-400" />
                <span className="text-gray-400 text-sm group-hover:text-teal-400">
                  {solverFile ? `📄 ${solverFile.name}` : 'Chọn file (.pdf, .docx, .txt)'}
                </span>
                <input
                  type="file"
                  accept=".pdf,.docx,.txt"
                  className="hidden"
                  onChange={(e) => handleFileUpload(e, 'solver')}
                />
              </label>
              {solverFile && (
                <button onClick={() => setSolverFile(null)} className="mt-2 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                  <X size={12} /> Xóa file
                </button>
              )}
            </div>

            {/* Solve Button */}
            <button
              onClick={handleSolve}
              disabled={isProcessing || (!problemInput.trim() && !solverFile && pastedImages.length === 0)}
              className="w-full py-4 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-bold text-lg shadow-xl shadow-teal-500/30 hover:shadow-teal-500/50 transition-all disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {progressMsg}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Giải bài tập
                </>
              )}
            </button>
          </div>
        )}

        {/* =============== EXAM CREATOR MODE =============== */}
        {appMode === 'exam_creator' && !result && (
          <div className="bg-[#111827] rounded-2xl border border-violet-500/20 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-violet-300 mb-6 flex items-center gap-2">
              <GraduationCap size={22} /> Tạo đề thi HSG Hóa Học
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Chủ đề</label>
                <select value={examTopic} onChange={(e) => setExamTopic(e.target.value as ChemistryTopic)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-violet-500 focus:outline-none text-sm">
                  {CHEMISTRY_TOPICS.map(t => <option key={t.id} value={t.id}>{t.icon} {t.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Lớp</label>
                <select value={examGrade} onChange={(e) => setExamGrade(e.target.value as ExamGrade)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-violet-500 focus:outline-none text-sm">
                  {EXAM_GRADES.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-5">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Cấp độ</label>
                <select value={examDifficulty} onChange={(e) => setExamDifficulty(e.target.value as DifficultyLevel)}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-violet-500 focus:outline-none text-sm">
                  {DIFFICULTY_LEVELS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Số câu</label>
                <input type="number" value={examQuestionCount} onChange={(e) => setExamQuestionCount(Math.max(1, parseInt(e.target.value) || 5))}
                  min={1} max={20}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-violet-500 focus:outline-none text-sm" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Thời gian (phút)</label>
                <input type="number" value={examTimeLimit} onChange={(e) => setExamTimeLimit(Math.max(15, parseInt(e.target.value) || 120))}
                  min={15} max={300}
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white focus:border-violet-500 focus:outline-none text-sm" />
              </div>
            </div>

            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-400 mb-2">Yêu cầu thêm (tùy chọn)</label>
              <textarea value={examCustomReq} onChange={(e) => setExamCustomReq(e.target.value)}
                rows={3} placeholder="VD: Tập trung vào bài toán hỗn hợp kim loại, có câu hỏi về điện phân..."
                className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-violet-500 focus:outline-none resize-none text-sm" />
            </div>

            <div className="mb-6 flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={examIncludeAnswer} onChange={(e) => setExamIncludeAnswer(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-600 text-violet-500 focus:ring-violet-500 bg-[#0a0f1e]" />
                <span className="text-sm text-gray-300">Kèm đáp án & hướng dẫn chấm</span>
              </label>
            </div>

            <button
              onClick={handleCreateExam}
              disabled={isProcessing}
              className="w-full py-4 bg-gradient-to-r from-violet-500 to-purple-500 hover:from-violet-400 hover:to-purple-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-bold text-lg shadow-xl shadow-violet-500/30 hover:shadow-violet-500/50 transition-all disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {progressMsg}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Tạo đề thi
                </>
              )}
            </button>
          </div>
        )}

        {/* =============== GRADER MODE =============== */}
        {appMode === 'grader' && !result && (
          <div className="bg-[#111827] rounded-2xl border border-amber-500/20 p-6 shadow-2xl">
            <h2 className="text-xl font-bold text-amber-300 mb-6 flex items-center gap-2">
              <ClipboardCheck size={22} /> Chấm bài Hóa Học
            </h2>

            <p className="text-gray-400 text-sm mb-6">
              Tải lên bài làm của học sinh (file PDF, DOCX hoặc TXT) để AI chấm điểm chi tiết.
            </p>

            <label className="flex flex-col items-center justify-center gap-3 px-6 py-10 bg-[#0a0f1e] border-2 border-dashed border-gray-600 hover:border-amber-500 rounded-xl cursor-pointer transition-colors group mb-6">
              <Upload size={32} className="text-gray-400 group-hover:text-amber-400" />
              <span className="text-gray-400 text-sm group-hover:text-amber-400">
                {graderFile ? `📄 ${graderFile.name}` : 'Chọn file bài làm (.pdf, .docx, .txt)'}
              </span>
              <span className="text-xs text-gray-600">Max 10MB</span>
              <input type="file" accept=".pdf,.docx,.txt" className="hidden" onChange={(e) => handleFileUpload(e, 'grader')} />
            </label>

            {graderFile && (
              <button onClick={() => setGraderFile(null)} className="mb-6 text-xs text-red-400 hover:text-red-300 flex items-center gap-1">
                <X size={12} /> Xóa file
              </button>
            )}

            <button
              onClick={handleGrade}
              disabled={isProcessing || !graderFile}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 disabled:from-gray-600 disabled:to-gray-700 rounded-xl text-white font-bold text-lg shadow-xl shadow-amber-500/30 hover:shadow-amber-500/50 transition-all disabled:shadow-none flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {progressMsg}
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  Chấm bài
                </>
              )}
            </button>
          </div>
        )}

        {/* =============== RESULT VIEW =============== */}
        {result && (
          <ResultView
            result={result}
            onBack={() => { setResult(''); setStep(GenerationStep.IDLE); }}
            appMode={appMode}
            step={step}
            progressMsg={progressMsg}
          />
        )}

        {/* Error Display */}
        {error && (
          <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
            <p className="text-red-400 text-sm whitespace-pre-wrap">{error}</p>
          </div>
        )}
      </main>

      {/* =============== API KEY MODAL =============== */}
      {showApiKeyModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl p-6 w-full max-w-lg border border-teal-500/30 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Settings size={24} className="text-teal-400" />
                Thiết lập Model & API Key
              </h3>
              <button onClick={() => setShowApiKeyModal(false)} className="text-gray-400 hover:text-white">
                <X size={24} />
              </button>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-3">Chọn Model AI</label>
              <div className="grid grid-cols-1 gap-3">
                <button onClick={() => setSettings(prev => ({ ...prev, model: 'gemini-2.5-flash' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.model === 'gemini-2.5-flash' ? 'border-teal-500 bg-teal-500/10' : 'border-gray-700 hover:border-gray-500 bg-[#0a0f1e]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Zap size={18} className="text-teal-400" />
                        <span className="font-bold text-white">Flash Mode</span>
                        <span className="text-xs px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded">Mặc định</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Gemini 2.5 Flash • Nhanh, chính xác</p>
                    </div>
                    {settings.model === 'gemini-2.5-flash' && <Check size={20} className="text-teal-400" />}
                  </div>
                </button>

                <button onClick={() => setSettings(prev => ({ ...prev, model: 'gemini-2.5-pro' }))}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${settings.model === 'gemini-2.5-pro' ? 'border-violet-500 bg-violet-500/10' : 'border-gray-700 hover:border-gray-500 bg-[#0a0f1e]'}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Award size={18} className="text-violet-400" />
                        <span className="font-bold text-white">Pro Mode</span>
                        <span className="text-xs px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded">Chất lượng cao</span>
                      </div>
                      <p className="text-gray-500 text-sm mt-1">Gemini 2.5 Pro • Phân tích sâu</p>
                    </div>
                    {settings.model === 'gemini-2.5-pro' && <Check size={20} className="text-violet-400" />}
                  </div>
                </button>
              </div>
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-2">API Key</label>
              <input type="password" value={customApiKey} onChange={(e) => setCustomApiKey(e.target.value)}
                placeholder="Nhập API Key của bạn..."
                className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:border-teal-500 focus:outline-none" />
              <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-1 mt-2 text-sm text-red-400 hover:text-red-300 transition-colors">
                <Sparkles size={14} />
                Lấy API key miễn phí để sử dụng app →
              </a>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowApiKeyModal(false)}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-white font-medium transition-colors">Hủy</button>
              <button onClick={() => {
                if (customApiKey.trim()) {
                  setSettings(prev => ({ ...prev, apiKey: customApiKey.trim() }));
                  localStorage.setItem('gemini_api_key', customApiKey.trim());
                }
                setShowApiKeyModal(false);
              }}
                className="flex-1 py-3 bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-xl text-white font-bold transition-all">
                Lưu
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =============== ADMIN LOGIN MODAL =============== */}
      {showAdminLoginModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl p-6 w-full max-w-md border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Shield size={24} className="text-teal-400" /> Admin Login</h3>
              <button onClick={() => setShowAdminLoginModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>
            <input type="text" value={adminUsername} onChange={(e) => setAdminUsername(e.target.value)} placeholder="Username"
              className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white mb-3 focus:border-teal-500 focus:outline-none" />
            <input type="password" value={adminPassword} onChange={(e) => setAdminPassword(e.target.value)} placeholder="Password"
              onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
              className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white mb-3 focus:border-teal-500 focus:outline-none" />
            {adminLoginError && <p className="text-red-400 text-sm mb-3">{adminLoginError}</p>}
            <button onClick={handleAdminLogin}
              className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white font-bold">Đăng nhập</button>
          </div>
        </div>
      )}

      {/* =============== ADMIN PANEL =============== */}
      {showAdminPanel && adminLoggedIn && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl p-6 w-full max-w-2xl border border-gray-700 max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2"><Shield size={24} className="text-teal-400" /> Admin Panel</h3>
              <button onClick={() => setShowAdminPanel(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>

            <div className="mb-6">
              <h4 className="text-lg font-bold text-yellow-400 mb-3">⏳ Chờ duyệt ({pendingRegistrations.length})</h4>
              {pendingRegistrations.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0f1e] rounded-lg mb-2">
                  <div>
                    <span className="text-white font-medium">{r.fullName || 'N/A'}</span>
                    <span className="text-gray-400 text-sm ml-2">{r.phone}</span>
                  </div>
                  <button onClick={() => handleActivateUser(r.phone)}
                    className="px-3 py-1 bg-green-500/20 text-green-400 rounded-lg text-sm hover:bg-green-500/30">Duyệt</button>
                </div>
              ))}
            </div>

            <div>
              <h4 className="text-lg font-bold text-green-400 mb-3">✅ Đã kích hoạt ({activatedRegistrations.length})</h4>
              {activatedRegistrations.map((r, i) => (
                <div key={i} className="flex items-center justify-between p-3 bg-[#0a0f1e] rounded-lg mb-2">
                  <div>
                    <span className="text-white font-medium">{r.fullName || 'N/A'}</span>
                    <span className="text-gray-400 text-sm ml-2">{r.phone}</span>
                  </div>
                  <button onClick={() => handleDeactivateUser(r.phone)}
                    className="px-3 py-1 bg-red-500/20 text-red-400 rounded-lg text-sm hover:bg-red-500/30">Hủy</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =============== REGISTER MODAL =============== */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-[#111827] rounded-2xl p-6 w-full max-w-md border border-teal-500/30">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Sparkles size={24} className="text-teal-400" /> Đăng ký sử dụng
              </h3>
              <button onClick={() => setShowRegisterModal(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
            </div>

            {registerSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check size={32} className="text-green-400" />
                </div>
                <h4 className="text-lg font-bold text-green-400 mb-2">Đăng ký thành công!</h4>
                <p className="text-gray-400 text-sm">Vui lòng chờ Admin duyệt tài khoản của bạn.</p>
              </div>
            ) : (
              <>
                <input type="text" value={fullNameInput} onChange={(e) => setFullNameInput(e.target.value)} placeholder="Họ và tên"
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white mb-3 focus:border-teal-500 focus:outline-none" />
                <input type="tel" value={phoneInput} onChange={(e) => setPhoneInput(e.target.value)} placeholder="Số điện thoại"
                  className="w-full px-4 py-3 bg-[#0a0f1e] border border-gray-700 rounded-xl text-white mb-3 focus:border-teal-500 focus:outline-none" />
                {registerError && <p className="text-red-400 text-sm mb-3">{registerError}</p>}

                {BANK_INFO && (
                  <div className="mb-4 p-4 bg-teal-500/5 border border-teal-500/20 rounded-xl">
                    <p className="text-sm text-gray-300 mb-2 font-medium">💳 Thông tin thanh toán:</p>
                    <p className="text-xs text-gray-400">Ngân hàng: {BANK_INFO.bankName}</p>
                    <p className="text-xs text-gray-400">STK: {BANK_INFO.accountNumber}</p>
                    <p className="text-xs text-gray-400">Chủ TK: {BANK_INFO.accountHolder}</p>
                    <p className="text-xs text-teal-400 font-bold">Số tiền: {BANK_INFO.amount}</p>
                    {BANK_INFO.qrUrl && <img src={BANK_INFO.qrUrl} alt="QR" className="mt-3 w-40 mx-auto rounded-lg" />}
                  </div>
                )}

                <button onClick={handleRegisterUser} disabled={!phoneInput.trim() || !fullNameInput.trim()}
                  className="w-full py-3 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl text-white font-bold disabled:opacity-50">
                  Đăng ký
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="text-center py-6 text-gray-600 text-xs border-t border-gray-800/50">
        <p>🧪 HSG KHTN Hóa Học AI • Powered by Google Gemini</p>
      </footer>
    </div>
  );
};

export default App;