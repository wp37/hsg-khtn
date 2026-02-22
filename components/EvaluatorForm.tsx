import React, { useRef } from 'react';
import { Upload, FileText, X, ShieldCheck, Award, ScanSearch, AlertTriangle } from 'lucide-react';
import { UploadedFile } from '../types';

interface EvaluatorFormProps {
  onFilesSelected: (files: FileList) => void;
  attachedFiles: UploadedFile[];
  onRemoveFile: (index: number) => void;
  onSubmit: () => void;
  onCheckPlagiarism?: () => void;
  isEvaluating: boolean;
}

const EvaluatorForm: React.FC<EvaluatorFormProps> = ({
  onFilesSelected,
  attachedFiles,
  onRemoveFile,
  onSubmit,
  onCheckPlagiarism,
  isEvaluating
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(e.target.files);
    }
    e.target.value = '';
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="bg-[#1a1a2e] rounded-2xl border border-gray-700 p-6 md:p-8 mb-8 relative overflow-hidden">
      {/* Decorative Top Line - Green for Evaluation */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-green-500 to-teal-500"></div>

      <div className="relative z-10">
        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-emerald-400" />
          Hội đồng Chấm & Thẩm định SKKN (AI)
        </h3>

        <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
          <p className="font-bold flex items-center gap-2 mb-2 text-emerald-400">
            <Award size={16} /> Tiêu chí chấm (Thang 100 điểm):
          </p>
          <ul className="list-disc pl-5 space-y-1 text-gray-400 text-sm">
            <li><strong className="text-white">Nội dung (90đ):</strong> Tính mới (20), Khoa học (25), Thực tiễn (20), Hiệu quả (25).</li>
            <li><strong className="text-white">Hình thức (10đ):</strong> Bố cục, ngôn ngữ, thể thức trình bày.</li>
          </ul>
        </div>

        <div className="space-y-4">
          <label className="block text-sm font-bold text-amber-400 uppercase tracking-wide">
            Tải lên File SKKN cần chấm (Word/PDF)
          </label>

          <div
            onClick={triggerFileUpload}
            className="w-full h-[180px] border-2 border-dashed border-gray-600 hover:border-emerald-500/50 bg-[#0d0d1a] hover:bg-emerald-500/5 rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all duration-300 group/upload relative overflow-hidden"
          >
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="hidden"
            />
            <div className="text-center p-6">
              <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4 group-hover/upload:scale-110 transition-transform">
                <Upload size={28} className="text-emerald-400" />
              </div>
              <p className="text-sm font-bold text-gray-400 group-hover/upload:text-emerald-400 transition-colors">
                Chọn file từ máy tính
              </p>
              <p className="text-xs text-gray-500 mt-2">Hỗ trợ .DOCX, .PDF, .TXT (Tối đa 10MB)</p>
            </div>
          </div>

          {/* File List */}
          {attachedFiles.length > 0 && (
            <div className="mt-4 space-y-2">
              {attachedFiles.map((file, idx) => (
                <div key={idx} className="flex items-center justify-between p-3 bg-emerald-500/10 border border-emerald-500/20 rounded-xl">
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center shrink-0">
                      <FileText size={20} className="text-emerald-400" />
                    </div>
                    <div>
                      <p className="truncate font-bold text-white text-sm max-w-[200px] md:max-w-md">{file.name}</p>
                      <p className="text-xs text-gray-500 uppercase">{file.type}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => onRemoveFile(idx)}
                    className="p-2 hover:bg-red-500/20 rounded-full text-gray-400 hover:text-red-400 transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Nút Chấm Điểm */}
          <button
            onClick={onSubmit}
            disabled={isEvaluating || attachedFiles.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 transform relative overflow-hidden group/btn
              ${isEvaluating || attachedFiles.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-emerald-500 via-green-500 to-teal-500 text-white hover:shadow-emerald-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
          >
            {!(isEvaluating || attachedFiles.length === 0) && (
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            )}

            {isEvaluating ? (
              <span className="text-sm">Đang xử lý...</span>
            ) : (
              <>
                <ShieldCheck className="w-6 h-6" />
                <span>Chấm điểm</span>
              </>
            )}
          </button>

          {/* Nút Kiểm Tra Đạo Văn */}
          <button
            onClick={onCheckPlagiarism}
            disabled={isEvaluating || attachedFiles.length === 0}
            className={`w-full py-4 rounded-xl font-bold text-lg shadow-xl flex items-center justify-center gap-3 transition-all duration-300 transform relative overflow-hidden group/btn-warning
              ${isEvaluating || attachedFiles.length === 0
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed shadow-none'
                : 'bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black hover:shadow-amber-500/30 hover:-translate-y-0.5 active:scale-[0.98]'
              }`}
          >
            {!(isEvaluating || attachedFiles.length === 0) && (
              <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover/btn-warning:translate-x-[100%] transition-transform duration-700 ease-in-out skew-x-12"></div>
            )}

            {isEvaluating ? (
              <span className="text-sm">Đang xử lý...</span>
            ) : (
              <>
                <ScanSearch className="w-6 h-6" />
                <span>Kiểm tra Đạo văn</span>
              </>
            )}
          </button>
        </div>

        {/* Lưu ý chi tiết về Đạo văn */}
        <div className="mt-6 bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 md:p-5">
          <h4 className="text-amber-400 font-bold flex items-center gap-2 mb-3 text-sm md:text-base">
            <AlertTriangle size={18} />
            Lưu ý quan trọng: AI có kiểm tra được đạo văn không?
          </h4>
          <div className="text-sm text-gray-400 space-y-3 text-justify">
            <p>
              <span className="font-bold text-amber-400">Có và Không:</span> Gemini AI không phải là công cụ quét trùng lặp truyền thống (như Turnitin) vì nó không lưu trữ bản sao của mọi văn bản trên internet.
            </p>
            <p>
              <span className="font-bold text-amber-400">Thế mạnh của AI:</span> Nó cực kỳ giỏi phát hiện <strong className="text-white">"Văn mẫu"</strong> và <strong className="text-white">Sự thiếu logic</strong>. AI sẽ nhận diện ngay lập tức các đoạn văn sáo rỗng, cấu trúc rập khuôn.
            </p>
            <div className="bg-[#0d0d1a] p-3 rounded-lg border border-gray-700">
              <span className="font-bold text-amber-400">Hiệu quả thực tế:</span> Đạt khoảng <strong className="text-white">70-80%</strong> trong việc phát hiện các bài "xào nấu", cắt ghép sơ sài.
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default EvaluatorForm;