import React, { useState } from 'react';
import { X, Wand2, User, Building2, BookOpen, Target, FileText, Loader2, Download, Copy, CheckCircle, FileType } from 'lucide-react';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, Table, TableRow, TableCell, WidthType, BorderStyle } from 'docx';
import { saveAs } from 'file-saver';

interface SKKNWriterInput {
  // Author Info
  authorName: string;
  authorTitle: string;
  schoolName: string;
  schoolAddress: string;

  // Research Context
  skknTitle: string;
  subject: string;
  gradeLevel: string;
  awardGoal: string;

  // Problem & Solution
  currentProblem: string;
  proposedSolution: string;
  expectedOutcome: string;

  // Methodology
  sampleSize: string;
  duration: string;
  toolsUsed: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  initialTitle: string;
  initialSubject: string;
  initialGradeLevel: string;
  initialAwardGoal: string;
  onGenerate: (input: SKKNWriterInput) => Promise<string>;
}

const SKKNWriterModal: React.FC<Props> = ({
  isOpen,
  onClose,
  initialTitle,
  initialSubject,
  initialGradeLevel,
  initialAwardGoal,
  onGenerate
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'input' | 'result'>('input');

  const [input, setInput] = useState<SKKNWriterInput>({
    authorName: '',
    authorTitle: 'Giáo viên',
    schoolName: '',
    schoolAddress: '',
    skknTitle: initialTitle,
    subject: initialSubject || '',
    gradeLevel: initialGradeLevel || 'Tiểu học',
    awardGoal: initialAwardGoal || 'Cấp Huyện',
    currentProblem: '',
    proposedSolution: '',
    expectedOutcome: '',
    sampleSize: '60',
    duration: '1 học kỳ (16 tuần)',
    toolsUsed: ''
  });

  const handleChange = (field: keyof SKKNWriterInput, value: string) => {
    setInput(prev => ({ ...prev, [field]: value }));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const content = await onGenerate(input);
      setGeneratedContent(content);
      setActiveTab('result');
    } catch (error) {
      console.error('Generation failed:', error);
      alert('Có lỗi xảy ra khi tạo SKKN. Vui lòng thử lại.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `SKKN_${input.skknTitle.slice(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadWord = async () => {
    // Parse content and create Word document
    const lines = generatedContent.split('\n');
    const children: Paragraph[] = [];

    // Add title
    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: "SÁNG KIẾN KINH NGHIỆM",
            bold: true,
            size: 32,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 200 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({
            text: input.skknTitle.toUpperCase(),
            bold: true,
            size: 28,
          }),
        ],
        alignment: AlignmentType.CENTER,
        spacing: { after: 400 },
      })
    );

    // Add author info
    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Tác giả: ", bold: true }),
          new TextRun({ text: input.authorName }),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Chức vụ: ", bold: true }),
          new TextRun({ text: input.authorTitle }),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Đơn vị: ", bold: true }),
          new TextRun({ text: input.schoolName }),
        ],
        spacing: { after: 100 },
      })
    );

    children.push(
      new Paragraph({
        children: [
          new TextRun({ text: "Địa chỉ: ", bold: true }),
          new TextRun({ text: input.schoolAddress }),
        ],
        spacing: { after: 400 },
      })
    );

    // Process content lines
    for (const line of lines) {
      const trimmedLine = line.trim();

      // Skip decorative lines
      if (trimmedLine.startsWith('═') || trimmedLine.startsWith('─') || trimmedLine.startsWith('┌') || trimmedLine.startsWith('│') || trimmedLine.startsWith('├') || trimmedLine.startsWith('└')) {
        continue;
      }

      // Empty lines
      if (!trimmedLine) {
        children.push(new Paragraph({ text: "", spacing: { after: 100 } }));
        continue;
      }

      // Main headings (all caps or PHẦN/CHƯƠNG)
      if (trimmedLine.match(/^(PHẦN|CHƯƠNG|I\.|II\.|III\.|IV\.|V\.|TÀI LIỆU|PHỤ LỤC)/)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 26,
              }),
            ],
            heading: HeadingLevel.HEADING_1,
            spacing: { before: 300, after: 200 },
          })
        );
        continue;
      }

      // Sub-headings (numbered like 1.1, 2.1, etc.)
      if (trimmedLine.match(/^\d+\.\d+\.?\s/)) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({
                text: trimmedLine,
                bold: true,
                size: 24,
              }),
            ],
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 200, after: 100 },
          })
        );
        continue;
      }

      // Bullet points
      if (trimmedLine.startsWith('-') || trimmedLine.startsWith('•') || trimmedLine.startsWith('*')) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: trimmedLine }),
            ],
            bullet: { level: 0 },
            spacing: { after: 50 },
          })
        );
        continue;
      }

      // Regular paragraph
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: trimmedLine }),
          ],
          spacing: { after: 100 },
        })
      );
    }

    // Create document
    const doc = new Document({
      sections: [
        {
          properties: {
            page: {
              margin: {
                top: 1440, // 1 inch = 1440 twips
                right: 1440,
                bottom: 1440,
                left: 1440,
              },
            },
          },
          children: children,
        },
      ],
    });

    // Generate and save with correct MIME type
    const blob = await Packer.toBlob(doc);
    const docxBlob = new Blob([blob], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    });
    saveAs(docxBlob, `SKKN_${input.skknTitle.slice(0, 30).replace(/[^a-zA-Z0-9\u00C0-\u1EF9]/g, '_')}.docx`);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto animate-fade-in">
      <div className="bg-neutral-900 w-full max-w-5xl rounded-3xl shadow-2xl shadow-amber-500/10 flex flex-col max-h-[95vh] overflow-hidden border border-amber-500/20">

        {/* HEADER */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 p-5 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="bg-neutral-900/20 p-2 rounded-xl">
              <Wand2 className="h-6 w-6 text-neutral-900" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">Viết SKKN Hộ</h2>
              <p className="text-neutral-800/80 text-sm">AI Assistant - Tạo SKKN chuyên nghiệp theo Thông tư 27/2020</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-neutral-900/20 rounded-full transition-colors text-neutral-900">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* TABS */}
        <div className="flex border-b border-amber-500/20 bg-neutral-800">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${activeTab === 'input'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-200'
              }`}
          >
            <FileText className="inline h-4 w-4 mr-2" />
            Nhập thông tin
          </button>
          <button
            onClick={() => setActiveTab('result')}
            disabled={!generatedContent}
            className={`flex-1 py-3 px-4 font-medium text-sm transition-colors ${activeTab === 'result'
              ? 'text-amber-400 border-b-2 border-amber-400 bg-neutral-900'
              : 'text-neutral-400 hover:text-neutral-200 disabled:opacity-50'
              }`}
          >
            <BookOpen className="inline h-4 w-4 mr-2" />
            Kết quả SKKN
          </button>
        </div>

        {/* BODY */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'input' ? (
            <div className="p-6 space-y-6">

              {/* Section 1: Thông tin tác giả */}
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
                <h3 className="flex items-center gap-2 font-bold text-amber-300 mb-4">
                  <User className="h-5 w-5 text-amber-400" />
                  Thông tin tác giả
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Họ và tên *</label>
                    <input
                      type="text"
                      value={input.authorName}
                      onChange={(e) => handleChange('authorName', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Chức vụ</label>
                    <input
                      type="text"
                      value={input.authorTitle}
                      onChange={(e) => handleChange('authorTitle', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Giáo viên, Tổ trưởng..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 2: Đơn vị công tác */}
              <div className="bg-neutral-800/50 p-5 rounded-2xl border border-neutral-700">
                <h3 className="flex items-center gap-2 font-bold text-amber-300 mb-4">
                  <Building2 className="h-5 w-5 text-amber-400" />
                  Đơn vị công tác
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Tên trường *</label>
                    <input
                      type="text"
                      value={input.schoolName}
                      onChange={(e) => handleChange('schoolName', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Trường TH/THCS/THPT..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Địa chỉ</label>
                    <input
                      type="text"
                      value={input.schoolAddress}
                      onChange={(e) => handleChange('schoolAddress', e.target.value)}
                      className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Xã/Phường, Huyện/Quận, Tỉnh/TP"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Thông tin đề tài */}
              <div className="bg-amber-900/30 p-5 rounded-2xl border border-amber-500/30">
                <h3 className="flex items-center gap-2 font-bold text-amber-400 mb-4">
                  <BookOpen className="h-5 w-5" />
                  Thông tin đề tài SKKN
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Tên đề tài *</label>
                    <textarea
                      value={input.skknTitle}
                      onChange={(e) => handleChange('skknTitle', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-amber-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="Nhập tên đề tài SKKN đã được gợi ý..."
                    />
                  </div>
                  <div className="grid md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Môn học / Lĩnh vực *</label>
                      <input
                        type="text"
                        value={input.subject}
                        onChange={(e) => handleChange('subject', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white placeholder:text-neutral-500"
                        placeholder="VD: Toán, Văn, KHTN..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Cấp học</label>
                      <select
                        value={input.gradeLevel}
                        onChange={(e) => handleChange('gradeLevel', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                      >
                        <option value="Mầm non">Mầm non</option>
                        <option value="Tiểu học">Tiểu học</option>
                        <option value="THCS">THCS</option>
                        <option value="THPT">THPT</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-300 mb-1">Mục tiêu cấp giải</label>
                      <select
                        value={input.awardGoal}
                        onChange={(e) => handleChange('awardGoal', e.target.value)}
                        className="w-full px-4 py-2.5 border border-neutral-600 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent text-white"
                      >
                        <option value="Cấp Trường">Cấp Trường</option>
                        <option value="Cấp Huyện">Cấp Huyện / Quận</option>
                        <option value="Cấp Tỉnh">Cấp Tỉnh / Thành phố</option>
                        <option value="Cấp Quốc gia">Cấp Quốc gia</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 4: Bối cảnh nghiên cứu */}
              <div className="bg-orange-900/20 p-5 rounded-2xl border border-orange-500/30">
                <h3 className="flex items-center gap-2 font-bold text-orange-400 mb-4">
                  <Target className="h-5 w-5" />
                  Bối cảnh & Giải pháp (Tùy chọn - AI sẽ tự tạo nếu để trống)
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Vấn đề thực tiễn cần giải quyết
                    </label>
                    <textarea
                      value={input.currentProblem}
                      onChange={(e) => handleChange('currentProblem', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-orange-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Học sinh thiếu hứng thú học tập, kết quả chưa cao, phương pháp cũ không hiệu quả..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Giải pháp đề xuất (ý tưởng chính)
                    </label>
                    <textarea
                      value={input.proposedSolution}
                      onChange={(e) => handleChange('proposedSolution', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-2.5 border border-orange-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Ứng dụng công nghệ AI, game hóa, lớp học đảo ngược..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">
                      Kết quả mong đợi
                    </label>
                    <textarea
                      value={input.expectedOutcome}
                      onChange={(e) => handleChange('expectedOutcome', e.target.value)}
                      rows={2}
                      className="w-full px-4 py-2.5 border border-orange-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: Tăng điểm TB 15%, tăng hứng thú 80%, giảm thời gian soạn bài 50%..."
                    />
                  </div>
                </div>
              </div>

              {/* Section 5: Phương pháp */}
              <div className="bg-emerald-900/20 p-5 rounded-2xl border border-emerald-500/30">
                <h3 className="flex items-center gap-2 font-bold text-emerald-400 mb-4">
                  <FileText className="h-5 w-5" />
                  Thông tin thực nghiệm (Tùy chọn)
                </h3>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Số lượng mẫu (HS)</label>
                    <input
                      type="text"
                      value={input.sampleSize}
                      onChange={(e) => handleChange('sampleSize', e.target.value)}
                      className="w-full px-4 py-2.5 border border-emerald-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: 60, 100, 150..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Thời gian thực nghiệm</label>
                    <input
                      type="text"
                      value={input.duration}
                      onChange={(e) => handleChange('duration', e.target.value)}
                      className="w-full px-4 py-2.5 border border-emerald-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: 1 học kỳ, 1 năm học..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1">Công cụ sử dụng</label>
                    <input
                      type="text"
                      value={input.toolsUsed}
                      onChange={(e) => handleChange('toolsUsed', e.target.value)}
                      className="w-full px-4 py-2.5 border border-emerald-500/30 bg-neutral-800 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-white placeholder:text-neutral-500"
                      placeholder="VD: ChatGPT, Kahoot, Canva..."
                    />
                  </div>
                </div>
              </div>

            </div>
          ) : (
            /* Result Tab */
            <div className="p-6">
              <div className="flex justify-end gap-2 mb-4">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-800 hover:bg-neutral-700 border border-neutral-600 rounded-xl transition-colors text-sm font-medium text-neutral-200"
                >
                  {copied ? <CheckCircle className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                  {copied ? 'Đã copy!' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-xl transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4" />
                  Tải .txt
                </button>
                <button
                  onClick={handleDownloadWord}
                  className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-neutral-900 rounded-xl transition-colors text-sm font-medium"
                >
                  <FileType className="h-4 w-4" />
                  Tải Word (.docx)
                </button>
              </div>
              <div className="bg-neutral-800 border border-neutral-700 rounded-2xl p-6 max-h-[60vh] overflow-y-auto">
                <pre className="whitespace-pre-wrap font-mono text-sm text-neutral-200 leading-relaxed">
                  {generatedContent}
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* FOOTER */}
        {activeTab === 'input' && (
          <div className="p-5 border-t border-amber-500/20 bg-neutral-800/50">
            <button
              onClick={handleGenerate}
              disabled={isGenerating || !input.skknTitle || !input.subject || !input.authorName}
              className="w-full py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-900 font-bold rounded-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 text-lg shadow-lg shadow-amber-500/30 hover:shadow-xl"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-6 w-6 animate-spin" />
                  Đang tạo SKKN... (có thể mất 30-60 giây)
                </>
              ) : (
                <>
                  <Wand2 className="h-6 w-6" />
                  TẠO SKKN HOÀN CHỈNH
                </>
              )}
            </button>
            <p className="text-center text-xs text-neutral-500 mt-3">
              AI sẽ tạo SKKN đầy đủ theo chuẩn Thông tư 27/2020/TT-BGDĐT
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SKKNWriterModal;
