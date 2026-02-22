import React, { useRef } from 'react';
import { BookOpen, School, AlertCircle, Lightbulb, Sparkles, Book, Layers, Feather, Wand2, FileText, Upload, X, Paperclip } from 'lucide-react';
import { FormData, UploadedFile } from '../types';
import { SUBJECT_LIST, BOOK_SETS, SKKN_SUGGESTIONS } from '../constants';

interface GeneratorFormProps {
  formData: FormData;
  onChange: (data: FormData) => void;
  onSubmit: () => void;
  isGenerating: boolean;
  onFilesSelected: (files: FileList) => void;
  attachedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
}

const GeneratorForm: React.FC<GeneratorFormProps> = ({
  formData,
  onChange,
  onSubmit,
  isGenerating,
  onFilesSelected,
  attachedFiles,
  onRemoveFile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    onChange({ ...formData, [name]: value });
  };

  const handleSuggestionClick = (suggestion: string) => {
    onChange({ ...formData, title: suggestion });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const isHomeroom = formData.subject === 'Công tác Chủ nhiệm lớp';

  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6 md:p-8 mb-8 relative overflow-hidden">
      {/* Decorative Top Line - Amber/Gold */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-600"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Feather className="w-5 h-5 text-amber-400" />
          Thông tin đề tài
        </h3>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          {/* Tên sáng kiến - 3 cột */}
          <div className="col-span-1 md:col-span-3">
            <div className="relative group/input">
              <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                Tên sáng kiến kinh nghiệm
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-amber-500 pointer-events-none">
                  <Lightbulb size={20} />
                </div>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder={isHomeroom ? "VD: Biện pháp giáo dục đạo đức cho học sinh cá biệt..." : "VD: Một số biện pháp giúp học sinh lớp 8..."}
                  className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-gray-500 font-medium text-white"
                />
              </div>

              {/* Suggestions Chips */}
              <div className="mt-3 flex flex-wrap gap-2 items-center">
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1 mr-1">
                  <Wand2 size={12} className="text-amber-400" />
                  Gợi ý nhanh:
                </span>
                {SKKN_SUGGESTIONS.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-3 py-1.5 text-xs font-medium text-gray-400 bg-gray-800/50 hover:bg-amber-500/20 hover:text-amber-400 hover:border-amber-500/30 border border-gray-700 rounded-full transition-all duration-200 active:scale-95"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Môn học */}
          <div className="relative group/input">
            <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
              Môn học / Lĩnh vực
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 pointer-events-none">
                <BookOpen size={20} />
              </div>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full pl-12 pr-10 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all appearance-none font-medium text-white cursor-pointer"
              >
                {SUBJECT_LIST.map((subj) => (
                  <option key={subj} value={subj}>{subj}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Bộ sách */}
          <div className="relative group/input">
            <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
              {isHomeroom ? "Cơ sở / Tài liệu áp dụng" : "Bộ sách giáo khoa"}
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 pointer-events-none">
                <Book size={20} />
              </div>
              <select
                name="bookSet"
                value={formData.bookSet}
                onChange={handleChange}
                className="w-full pl-12 pr-10 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all appearance-none font-medium text-white cursor-pointer"
              >
                {BOOK_SETS.map((book) => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>

          {/* Lớp / Khối */}
          <div className="relative group/input">
            <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
              Lớp / Khối
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-green-400 pointer-events-none">
                <School size={20} />
              </div>
              <input
                type="text"
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                placeholder="VD: 8A"
                className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all placeholder:text-gray-500 font-medium text-white"
              />
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="relative group/input">
              <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                Thực trạng & Khó khăn
              </label>
              <div className="relative">
                <div className="absolute left-4 top-5 text-red-400 pointer-events-none">
                  <AlertCircle size={20} />
                </div>
                <textarea
                  name="situation"
                  value={formData.situation}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Mô tả những khó khăn, tồn tại của giáo viên và học sinh trước khi áp dụng sáng kiến..."
                  className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all resize-none font-medium text-white placeholder:text-gray-500"
                />
              </div>
            </div>

            <div className="relative group/input">
              <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                Giải pháp chính (Từ khóa)
              </label>
              <div className="relative">
                <div className="absolute left-4 top-5 text-purple-400 pointer-events-none">
                  <Layers size={20} />
                </div>
                <textarea
                  name="solution"
                  value={formData.solution}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Liệt kê ngắn gọn các biện pháp/giải pháp bạn dự định thực hiện..."
                  className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all resize-none font-medium text-white placeholder:text-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Tư liệu thực tế */}
          <div className="pt-6 border-t border-gray-700">
            <h3 className="text-sm font-bold text-white mb-4 flex items-center gap-2 uppercase tracking-wide">
              <Paperclip className="w-4 h-4 text-amber-400" />
              Tư liệu thực tế & Minh chứng
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="relative group/input">
                <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                  {isHomeroom ? "Chủ đề sinh hoạt / Tình huống cụ thể" : "Tên bài học / Ví dụ cụ thể"}
                </label>
                <div className="relative">
                  <div className="absolute left-4 top-5 text-blue-400 pointer-events-none">
                    <FileText size={20} />
                  </div>
                  <textarea
                    name="specificLessons"
                    value={formData.specificLessons}
                    onChange={handleChange}
                    rows={3}
                    placeholder={isHomeroom
                      ? "Nhập tên chủ đề (VD: Chủ đề Tháng 11: Tôn sư trọng đạo)..."
                      : "Nhập tên bài học (VD: Bài 3: Cấu tạo nguyên tử - Hóa 10)..."}
                    className="w-full pl-12 pr-4 py-4 bg-[#0d0d1a] border border-gray-700 rounded-xl focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 outline-none transition-all resize-none font-medium text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* File Upload Area */}
              <div>
                <label className="block text-xs font-bold text-amber-400 mb-2 uppercase tracking-wider">
                  Đính kèm Giáo án / Tài liệu (PDF, Word)
                </label>
                <div
                  onClick={triggerFileUpload}
                  className="w-full h-[116px] border-2 border-dashed border-gray-600 hover:border-amber-500/50 bg-[#0d0d1a] hover:bg-amber-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/upload relative overflow-hidden"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    multiple
                  />
                  <div className="text-center p-4">
                    <div className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-2 group-hover/upload:scale-110 transition-transform">
                      <Upload size={18} className="text-amber-400" />
                    </div>
                    <p className="text-xs font-bold text-gray-400 group-hover/upload:text-amber-400 transition-colors">
                      Tải lên tài liệu
                    </p>
                    <p className="text-[10px] text-gray-500 mt-1">PDF, DOCX, TXT (Max 5MB)</p>
                  </div>
                </div>

                {/* File List */}
                {attachedFiles.length > 0 && (
                  <div className="mt-3 space-y-2">
                    {attachedFiles.map((file, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-amber-500/10 border border-amber-500/20 rounded-xl text-xs">
                        <div className="flex items-center gap-2 overflow-hidden">
                          <div className="w-6 h-6 bg-amber-500/20 rounded flex items-center justify-center shrink-0">
                            <FileText size={14} className="text-amber-400" />
                          </div>
                          <span className="truncate font-medium text-gray-300 max-w-[150px]">{file.name}</span>
                        </div>
                        <button
                          onClick={() => onRemoveFile(idx)}
                          className="p-1 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={onSubmit}
            disabled={isGenerating || !formData.title}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 transform relative overflow-hidden group/btn
              ${isGenerating || !formData.title
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
          >
            {!(isGenerating || !formData.title) && (
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            )}

            {isGenerating ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>AI đang phân tích & soạn thảo...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span>Bắt đầu tạo SKKN</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeneratorForm;