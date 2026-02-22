import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import { Download, Copy, Check, FileText, ArrowLeft, Beaker, GraduationCap, ClipboardCheck } from 'lucide-react';
import { parse } from 'marked';
import { AppMode, GenerationStep } from '../types';

interface ResultViewProps {
  result: string;
  onBack: () => void;
  appMode: AppMode;
  step: GenerationStep;
  progressMsg: string;
}

const ResultView: React.FC<ResultViewProps> = ({ result, onBack, appMode, step, progressMsg }) => {
  const [copied, setCopied] = React.useState(false);

  // Preprocess chemistry content to wrap raw LaTeX commands in $ delimiters
  const preprocessChemistry = (text: string): string => {
    let processed = text;

    // Wrap standalone \xrightarrow{...} (not already inside $...$) in $ delimiters
    processed = processed.replace(/(?<![\$])\\xrightarrow\{([^}]*)\}(?![\$])/g, ' $$\\xrightarrow{$1}$$ ');

    // Wrap standalone \rightarrow not already in $ delimiters
    processed = processed.replace(/(?<![\$])\\rightarrow(?![\$])/g, ' $$\\rightarrow$$ ');

    // Wrap standalone \leftarrow not already in $ delimiters
    processed = processed.replace(/(?<![\$])\\leftarrow(?![\$])/g, ' $$\\leftarrow$$ ');

    // Wrap \Delta, \degree etc. not already in $ delimiters
    processed = processed.replace(/(?<![\$])\\(Delta|degree|alpha|beta|gamma|uparrow|downarrow)(?![\$])/g, ' $$\\$1$$ ');

    // Convert common arrow notations: → to proper arrow
    processed = processed.replace(/→/g, '$$\\rightarrow$$');

    return processed;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = async () => {
    const bodyContent = await parse(result);

    const cssStyle = `
      <style>
        @page Section1 { size: 21cm 29.7cm; margin: 2.0cm 2.0cm 2.0cm 3.0cm; }
        div.Section1 { page: Section1; }
        body { font-family: "Times New Roman", serif; font-size: 14pt; line-height: 1.5; color: #000; }
        p { margin-top: 6pt; margin-bottom: 6pt; text-align: justify; }
        h1, h2, h3, h4 { font-family: "Times New Roman", serif; font-weight: bold; margin-top: 12pt; margin-bottom: 6pt; }
        h1 { font-size: 16pt; text-align: center; text-transform: uppercase; }
        h2 { font-size: 14pt; text-transform: uppercase; }
        h3 { font-size: 14pt; font-weight: bold; }
        table { border-collapse: collapse; width: 100%; margin: 12pt 0; border: 1px solid windowtext; }
        td, th { border: 1px solid windowtext; padding: 5pt; vertical-align: top; }
        th { font-weight: bold; background-color: #E6E6E6; text-align: center; }
        ul, ol { margin: 0; } li { margin-bottom: 3pt; }
        strong, b { font-weight: bold; } em, i { font-style: italic; }
      </style>
    `;

    const fileContent = `
      <html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset='utf-8'><title>HSG Hóa Học</title>${cssStyle}</head>
      <body><div class="Section1">${bodyContent}</div></body></html>
    `;

    const blob = new Blob(['\ufeff', fileContent], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    const prefix = appMode === 'solver' ? 'GiaiBai' : appMode === 'exam_creator' ? 'DeThi_HSG' : 'ChamBai';
    downloadLink.download = `${prefix}_HoaHoc_${new Date().toISOString().slice(0, 10)}.docx`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  const getModeInfo = () => {
    switch (appMode) {
      case 'solver': return { icon: <Beaker className="w-5 h-5" />, title: 'Lời giải bài tập', color: 'teal' };
      case 'exam_creator': return { icon: <GraduationCap className="w-5 h-5" />, title: 'Đề thi HSG Hóa Học', color: 'violet' };
      case 'grader': return { icon: <ClipboardCheck className="w-5 h-5" />, title: 'Kết quả chấm bài', color: 'amber' };
      default: return { icon: <FileText className="w-5 h-5" />, title: 'Kết quả', color: 'teal' };
    }
  };

  const modeInfo = getModeInfo();

  return (
    <div className="relative">
      <div className="bg-[#111827] rounded-2xl border border-gray-700 overflow-hidden">

        {/* Toolbar */}
        <div className="bg-[#111827] border-b border-gray-700 p-4 flex flex-wrap items-center justify-between gap-4 sticky top-16 z-20">
          <div className="flex items-center gap-3">
            <button onClick={onBack}
              className="p-2 bg-gray-800 hover:bg-gray-700 rounded-xl text-gray-400 hover:text-white transition-colors">
              <ArrowLeft size={18} />
            </button>
            <div className={`p-2.5 bg-${modeInfo.color}-500/20 text-${modeInfo.color}-400 rounded-xl`}>
              {modeInfo.icon}
            </div>
            <div>
              <h3 className="font-bold text-white text-sm">{modeInfo.title}</h3>
              <p className="text-xs text-gray-500">HSG KHTN Hóa Học AI</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={handleCopy}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-gray-300 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 hover:text-teal-400 transition-all active:scale-95">
              {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Đã copy' : 'Sao chép'}
            </button>
            <button onClick={handleExportWord}
              className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-white bg-gradient-to-r from-teal-500 to-emerald-500 hover:from-teal-400 hover:to-emerald-400 rounded-xl transition-all shadow-lg shadow-teal-500/20 active:scale-95">
              <Download className="w-4 h-4" />
              Tải Word
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white p-8 md:p-12 min-h-[600px]">
          <ReactMarkdown
            remarkPlugins={[remarkMath]}
            rehypePlugins={[rehypeKatex]}
            components={{
              h1: ({ node, ...props }) => <h1 className="text-2xl md:text-3xl font-bold text-teal-700 uppercase text-center mb-6 mt-4 leading-relaxed" {...props} />,
              h2: ({ node, ...props }) => <h2 className="text-xl font-bold text-slate-800 uppercase mt-8 mb-4 border-b-2 border-teal-200 pb-2" {...props} />,
              h3: ({ node, ...props }) => <h3 className="text-lg font-bold text-slate-700 mt-6 mb-3" {...props} />,
              h4: ({ node, ...props }) => <h4 className="text-base font-bold text-slate-600 mt-4 mb-2" {...props} />,
              p: ({ node, ...props }) => <p className="text-slate-700 leading-7 text-justify mb-4 text-[15px]" {...props} />,
              table: ({ node, ...props }) => (
                <div className="my-6 overflow-x-auto rounded-lg border border-slate-200 shadow-sm">
                  <table className="w-full text-sm text-left text-slate-600 border-collapse" {...props} />
                </div>
              ),
              thead: ({ node, ...props }) => <thead className="bg-teal-50 text-slate-700 uppercase font-bold text-xs" {...props} />,
              th: ({ node, ...props }) => <th className="px-6 py-4 border-b border-slate-200 border-r last:border-r-0 whitespace-nowrap bg-teal-50 text-teal-800" {...props} />,
              td: ({ node, ...props }) => <td className="px-6 py-4 border-b border-slate-100 border-r last:border-r-0 align-top leading-6" {...props} />,
              ul: ({ node, ...props }) => <ul className="list-disc pl-6 space-y-2 mb-4 text-slate-700 marker:text-teal-500" {...props} />,
              ol: ({ node, ...props }) => <ol className="list-decimal pl-6 space-y-2 mb-4 text-slate-700 marker:font-bold marker:text-slate-900" {...props} />,
              blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-teal-500 pl-4 py-2 italic bg-teal-50 text-slate-700 rounded-r-lg my-4" {...props} />,
              code: ({ node, className, children, ...props }) => {
                const isInline = !className;
                return isInline ? (
                  <code className="bg-teal-50 text-teal-700 px-1.5 py-0.5 rounded text-sm font-mono" {...props}>{children}</code>
                ) : (
                  <code className="block bg-gray-50 text-gray-800 p-4 rounded-lg text-sm font-mono overflow-x-auto my-4" {...props}>{children}</code>
                );
              },
              strong: ({ node, ...props }) => <strong className="font-bold text-slate-900" {...props} />,
            }}
          >
            {preprocessChemistry(result)}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  );
};

export default ResultView;