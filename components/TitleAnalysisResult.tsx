import React from 'react';
import { X, CheckCircle2, AlertTriangle, XCircle, Lightbulb, Target, Copy, Sparkles, TrendingUp, AlertCircle, ThumbsUp } from 'lucide-react';
import { TitleAnalysisResult as TitleAnalysisResultType, AlternativeTitle } from '../types';

interface TitleAnalysisResultProps {
    result: TitleAnalysisResultType;
    onClose: () => void;
    onUseTitle: (title: string) => void;
}

const TitleAnalysisResult: React.FC<TitleAnalysisResultProps> = ({
    result,
    onClose,
    onUseTitle
}) => {
    const getGradeLabel = (grade: string): { label: string; color: string; bg: string } => {
        switch (grade) {
            case 'excellent':
                return { label: 'Xuất sắc', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
            case 'good':
                return { label: 'Tốt', color: 'text-blue-400', bg: 'bg-blue-500/20' };
            case 'average':
                return { label: 'Khá', color: 'text-amber-400', bg: 'bg-amber-500/20' };
            case 'poor':
                return { label: 'Yếu', color: 'text-red-400', bg: 'bg-red-500/20' };
            default:
                return { label: 'Chưa xác định', color: 'text-gray-400', bg: 'bg-gray-500/20' };
        }
    };

    const getScoreColor = (score: number): string => {
        if (score >= 80) return 'text-emerald-400';
        if (score >= 50) return 'text-amber-400';
        return 'text-red-400';
    };

    const getProgressColor = (score: number, max: number): string => {
        const percent = (score / max) * 100;
        if (percent >= 75) return 'bg-emerald-500';
        if (percent >= 50) return 'bg-amber-500';
        return 'bg-red-500';
    };

    const getDuplicateBadge = (level: string): { label: string; color: string; bg: string } => {
        switch (level) {
            case 'low':
                return { label: 'Thấp', color: 'text-emerald-400', bg: 'bg-emerald-500/20' };
            case 'medium':
                return { label: 'Trung bình', color: 'text-amber-400', bg: 'bg-amber-500/20' };
            case 'high':
                return { label: 'Cao', color: 'text-red-400', bg: 'bg-red-500/20' };
            default:
                return { label: level, color: 'text-gray-400', bg: 'bg-gray-500/20' };
        }
    };

    const gradeInfo = getGradeLabel(result.grade);
    const duplicateInfo = getDuplicateBadge(result.layerAnalysis?.layer1_database?.duplicateLevel || 'low');

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 p-5 rounded-t-2xl flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                            <Target className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Phân Tích Tên Đề Tài</h2>
                            <p className="text-white/70 text-sm">Kết quả đánh giá chi tiết (Quy trình 3 lớp)</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/20 rounded-full text-white/70 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    {/* Score Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Total Score */}
                        <div className="bg-[#0d0d1a] rounded-xl p-6 border border-gray-700 text-center">
                            <p className="text-gray-400 mb-2 text-sm uppercase tracking-wide">Tổng điểm</p>
                            <div className={`text-6xl font-bold ${getScoreColor(result.score)}`}>
                                {result.score}<span className="text-2xl text-gray-500">/100</span>
                            </div>
                            <div className={`inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full ${gradeInfo.bg}`}>
                                {result.grade === 'excellent' || result.grade === 'good' ? (
                                    <ThumbsUp size={18} className={gradeInfo.color} />
                                ) : (
                                    <AlertCircle size={18} className={gradeInfo.color} />
                                )}
                                <span className={`font-bold ${gradeInfo.color}`}>{gradeInfo.label}</span>
                            </div>
                        </div>

                        {/* Duplicate Level */}
                        <div className="bg-[#0d0d1a] rounded-xl p-6 border border-gray-700">
                            <p className="text-gray-400 mb-3 text-sm uppercase tracking-wide">Mức độ trùng lặp</p>
                            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${duplicateInfo.bg} mb-4`}>
                                {result.layerAnalysis?.layer1_database?.duplicateLevel === 'high' ? (
                                    <XCircle size={18} className={duplicateInfo.color} />
                                ) : result.layerAnalysis?.layer1_database?.duplicateLevel === 'medium' ? (
                                    <AlertTriangle size={18} className={duplicateInfo.color} />
                                ) : (
                                    <CheckCircle2 size={18} className={duplicateInfo.color} />
                                )}
                                <span className={`font-bold ${duplicateInfo.color}`}>{duplicateInfo.label}</span>
                            </div>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {result.layerAnalysis?.layer3_expert?.expertVerdict || result.conclusion}
                            </p>
                        </div>
                    </div>

                    {/* Criteria Detail */}
                    <div className="bg-[#0d0d1a] rounded-xl p-6 border border-gray-700">
                        <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                            <TrendingUp size={18} className="text-purple-400" />
                            Chi tiết điểm số
                        </h3>
                        <div className="space-y-4">
                            {/* Độ cụ thể */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-300 text-sm font-medium">Độ cụ thể</span>
                                    <span className="text-gray-400 text-sm">{result.criteria.specificity.score}/{result.criteria.specificity.max}</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(result.criteria.specificity.score, result.criteria.specificity.max)} transition-all duration-500`}
                                        style={{ width: `${(result.criteria.specificity.score / result.criteria.specificity.max) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{result.criteria.specificity.comment}</p>
                            </div>

                            {/* Tính mới */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-300 text-sm font-medium">Tính mới</span>
                                    <span className="text-gray-400 text-sm">{result.criteria.novelty.score}/{result.criteria.novelty.max}</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(result.criteria.novelty.score, result.criteria.novelty.max)} transition-all duration-500`}
                                        style={{ width: `${(result.criteria.novelty.score / result.criteria.novelty.max) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{result.criteria.novelty.comment}</p>
                            </div>

                            {/* Tính khả thi */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-300 text-sm font-medium">Tính khả thi</span>
                                    <span className="text-gray-400 text-sm">{result.criteria.feasibility.score}/{result.criteria.feasibility.max}</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(result.criteria.feasibility.score, result.criteria.feasibility.max)} transition-all duration-500`}
                                        style={{ width: `${(result.criteria.feasibility.score / result.criteria.feasibility.max) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{result.criteria.feasibility.comment}</p>
                            </div>

                            {/* Độ rõ ràng */}
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-gray-300 text-sm font-medium">Độ rõ ràng</span>
                                    <span className="text-gray-400 text-sm">{result.criteria.clarity.score}/{result.criteria.clarity.max}</span>
                                </div>
                                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${getProgressColor(result.criteria.clarity.score, result.criteria.clarity.max)} transition-all duration-500`}
                                        style={{ width: `${(result.criteria.clarity.score / result.criteria.clarity.max) * 100}%` }}
                                    ></div>
                                </div>
                                <p className="text-gray-500 text-xs mt-1">{result.criteria.clarity.comment}</p>
                            </div>
                        </div>
                    </div>

                    {/* Issues */}
                    {result.issues && result.issues.length > 0 && (
                        <div className="bg-red-500/10 rounded-xl p-5 border border-red-500/30">
                            <h3 className="text-red-400 font-bold mb-3 flex items-center gap-2">
                                <AlertTriangle size={18} />
                                Các lỗi phát hiện
                            </h3>
                            <ul className="space-y-2">
                                {result.issues.map((issue, idx) => (
                                    <li key={idx} className="flex items-start gap-2 text-sm">
                                        <XCircle size={16} className="text-red-400 shrink-0 mt-0.5" />
                                        <span className="text-gray-300">{issue}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Alternative Titles */}
                    {result.alternatives && result.alternatives.length > 0 && (
                        <div className="bg-emerald-500/10 rounded-xl p-5 border border-emerald-500/30">
                            <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-2">
                                <Lightbulb size={18} />
                                5 Gợi ý tên đề tài VIP
                            </h3>
                            <div className="space-y-3">
                                {result.alternatives.map((alt: AlternativeTitle, idx: number) => (
                                    <div key={idx} className="bg-[#0d0d1a] rounded-lg p-4 border border-gray-700 hover:border-emerald-500/50 transition-colors">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className="text-emerald-400 font-bold text-sm">#{idx + 1}</span>
                                                    <span className="text-amber-400 text-xs bg-amber-500/20 px-2 py-0.5 rounded">{alt.score}đ</span>
                                                    {alt.tags?.map((tag: string, tidx: number) => (
                                                        <span key={tidx} className="text-purple-400 text-xs bg-purple-500/20 px-2 py-0.5 rounded">{tag}</span>
                                                    ))}
                                                </div>
                                                <p className="text-white font-medium text-sm mb-1">{alt.title}</p>
                                                <p className="text-gray-500 text-xs">{alt.reason}</p>
                                            </div>
                                            <button
                                                onClick={() => onUseTitle(alt.title)}
                                                className="shrink-0 px-3 py-2 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-400 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors"
                                            >
                                                <Sparkles size={12} />
                                                Sử dụng
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Conclusion */}
                    <div className="bg-purple-500/10 rounded-xl p-5 border border-purple-500/30">
                        <h3 className="text-purple-400 font-bold mb-2 flex items-center gap-2">
                            <CheckCircle2 size={18} />
                            Kết luận
                        </h3>
                        <p className="text-gray-300 text-sm leading-relaxed">{result.conclusion}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TitleAnalysisResult;
