import React, { useState } from 'react';
import { Search, Lightbulb, Target, Award, GraduationCap, BookOpen, Sparkles, Loader2 } from 'lucide-react';
import { SUBJECT_LIST, GRADE_LEVELS, AWARD_GOALS } from '../constants';

interface TitleAnalyzerFormProps {
    onAnalyze: (title: string, subject: string, gradeLevel: string, awardGoal: string) => void;
    isAnalyzing: boolean;
    onUseTitle?: (title: string) => void;
}

const TitleAnalyzerForm: React.FC<TitleAnalyzerFormProps> = ({
    onAnalyze,
    isAnalyzing,
    onUseTitle
}) => {
    const [title, setTitle] = useState('');
    const [subject, setSubject] = useState(SUBJECT_LIST[0]);
    const [gradeLevel, setGradeLevel] = useState(GRADE_LEVELS[1]); // THCS
    const [awardGoal, setAwardGoal] = useState(AWARD_GOALS[2]); // Cấp Tỉnh

    const handleSubmit = () => {
        if (title.trim()) {
            onAnalyze(title.trim(), subject, gradeLevel, awardGoal);
        }
    };

    return (
        <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6 md:p-8 mb-8 relative overflow-hidden">
            {/* Decorative Top Line - Blue/Purple for Analyzer */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"></div>

            <div className="relative z-10">
                <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                    <Search className="w-6 h-6 text-blue-400" />
                    Phân Tích Tên Đề Tài SKKN
                </h3>
                <p className="text-gray-400 text-sm mb-6">
                    "Khám bệnh" & chấm điểm tên đề tài NGAY TỪ ĐẦU theo quy trình 3 lớp AI thông minh
                </p>

                {/* Info Box - Quy trình 3 lớp */}
                <div className="mb-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                    <p className="font-bold flex items-center gap-2 mb-3 text-blue-400">
                        <Lightbulb size={16} /> Quy trình phân tích 3 lớp:
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div className="bg-[#0d0d1a] p-3 rounded-lg border border-gray-700">
                            <span className="text-purple-400 font-bold">Lớp 1:</span>
                            <span className="text-gray-300 ml-1">Database nội bộ</span>
                            <p className="text-gray-500 text-xs mt-1">Kiểm tra patterns phổ biến</p>
                        </div>
                        <div className="bg-[#0d0d1a] p-3 rounded-lg border border-gray-700">
                            <span className="text-blue-400 font-bold">Lớp 2:</span>
                            <span className="text-gray-300 ml-1">Mô phỏng online</span>
                            <p className="text-gray-500 text-xs mt-1">Ước tính kết quả Google</p>
                        </div>
                        <div className="bg-[#0d0d1a] p-3 rounded-lg border border-gray-700">
                            <span className="text-emerald-400 font-bold">Lớp 3:</span>
                            <span className="text-gray-300 ml-1">Nguồn chuyên ngành</span>
                            <p className="text-gray-500 text-xs mt-1">Đối chiếu tiêu chuẩn</p>
                        </div>
                    </div>
                </div>

                <div className="space-y-5">
                    {/* Tên đề tài Input */}
                    <div>
                        <label className="block text-sm font-bold text-blue-400 mb-2 uppercase tracking-wide">
                            Nhập tên đề tài cần phân tích
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-500 pointer-events-none">
                                <Target size={20} />
                            </div>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="VD: Sử dụng AI trong dạy học môn Toán..."
                                className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all placeholder:text-gray-500 font-medium text-white text-lg"
                                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                            />
                        </div>
                    </div>

                    {/* Grid: Môn học, Cấp học, Mục tiêu */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Môn học */}
                        <div>
                            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                                Môn học / Lĩnh vực
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
                                    <BookOpen size={18} />
                                </div>
                                <select
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none font-medium text-white cursor-pointer text-sm"
                                >
                                    {SUBJECT_LIST.map((subj) => (
                                        <option key={subj} value={subj}>{subj}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Cấp học */}
                        <div>
                            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                                Cấp học
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none">
                                    <GraduationCap size={18} />
                                </div>
                                <select
                                    value={gradeLevel}
                                    onChange={(e) => setGradeLevel(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none font-medium text-white cursor-pointer text-sm"
                                >
                                    {GRADE_LEVELS.map((level) => (
                                        <option key={level} value={level}>{level}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>

                        {/* Mục tiêu giải */}
                        <div>
                            <label className="block text-xs font-bold text-blue-400 mb-2 uppercase tracking-wider">
                                Mục tiêu giải
                            </label>
                            <div className="relative">
                                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-400 pointer-events-none">
                                    <Award size={18} />
                                </div>
                                <select
                                    value={awardGoal}
                                    onChange={(e) => setAwardGoal(e.target.value)}
                                    className="w-full pl-10 pr-8 py-3 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all appearance-none font-medium text-white cursor-pointer text-sm"
                                >
                                    {AWARD_GOALS.map((goal) => (
                                        <option key={goal} value={goal}>{goal}</option>
                                    ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Submit Button */}
                <div className="mt-8">
                    <button
                        onClick={handleSubmit}
                        disabled={isAnalyzing || !title.trim()}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 transform relative overflow-hidden group/btn
              ${isAnalyzing || !title.trim()
                                ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                                : 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white hover:shadow-purple-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
                            }`}
                    >
                        {!(isAnalyzing || !title.trim()) && (
                            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
                        )}

                        {isAnalyzing ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>AI đang phân tích quy trình 3 lớp...</span>
                            </>
                        ) : (
                            <>
                                <Sparkles className="w-6 h-6 animate-pulse" />
                                <span>Phân Tích Ngay ✨</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Scoring Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl">
                    <p className="text-sm text-gray-300 text-center">
                        <span className="font-bold text-purple-400">Hệ thống chấm điểm 100:</span>
                        <span className="mx-2">|</span>
                        <span className="text-blue-300">Độ cụ thể (25đ)</span>
                        <span className="mx-1">•</span>
                        <span className="text-pink-300">Tính mới (30đ)</span>
                        <span className="mx-1">•</span>
                        <span className="text-green-300">Khả thi (25đ)</span>
                        <span className="mx-1">•</span>
                        <span className="text-amber-300">Rõ ràng (20đ)</span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TitleAnalyzerForm;
