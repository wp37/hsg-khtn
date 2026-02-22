export interface ApiConfig {
  apiKey?: string;
  model?: string;
}

// Chemistry Topics for HSG KHTN
export type ChemistryTopic =
  | 'nguyen_tu_phan_tu'      // Nguyên tử, phân tử
  | 'bang_tuan_hoan'         // Bảng tuần hoàn
  | 'lien_ket_hoa_hoc'      // Liên kết hóa học
  | 'phan_ung_hoa_hoc'      // Phản ứng hóa học
  | 'oxit_axit_bazo_muoi'   // Oxit, Axit, Bazơ, Muối
  | 'kim_loai'              // Kim loại
  | 'phi_kim'               // Phi kim
  | 'hoa_huu_co'            // Hóa hữu cơ
  | 'dung_dich'             // Dung dịch
  | 'toc_do_can_bang'       // Tốc độ phản ứng & Cân bằng hóa học
  | 'dien_hoa'              // Điện hóa học
  | 'tong_hop';             // Tổng hợp

export type DifficultyLevel = 'co_ban' | 'nang_cao' | 'hsg_huyen' | 'hsg_tinh' | 'hsg_quoc_gia';

export type ExamGrade = '8' | '9' | '10' | '11' | '12';

export interface ExamConfig {
  topic: ChemistryTopic;
  grade: ExamGrade;
  difficulty: DifficultyLevel;
  questionCount: number;
  includeAnswer: boolean;
  timeLimit: number; // minutes
}

// Form data for Solver mode
export interface SolverFormData {
  problem: string;     // Nội dung bài tập
  topic: ChemistryTopic;
  grade: ExamGrade;
}

// Form data for Exam Creator mode
export interface ExamFormData {
  topic: ChemistryTopic;
  grade: ExamGrade;
  difficulty: DifficultyLevel;
  questionCount: number;
  includeAnswer: boolean;
  timeLimit: number;
  customRequirements: string;
}

// Form data for Grader mode (kept similar)
export interface FormData {
  title: string;
  subject: string;
  bookSet: string;
  grade: string;
  situation: string;
  solution: string;
  specificLessons: string;
}

export interface Settings {
  model: string;
  apiKey: string;
  customModel: string;
}

export enum GenerationStep {
  IDLE = 'IDLE',
  SOLVING = 'SOLVING',
  SOLVING_STEP2 = 'SOLVING_STEP2',
  GENERATING_EXAM = 'GENERATING_EXAM',
  GENERATING_ANSWERS = 'GENERATING_ANSWERS',
  GRADING = 'GRADING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface UploadedFile {
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  content: string;
  mimeType: string;
}

export type AppMode = 'solver' | 'exam_creator' | 'grader';

export interface Criterion {
  id?: string;
  name: string;
  label?: string;
  score: number;
  max: number;
  strengths?: string;
  weaknesses?: string;
  comment?: string;
  color?: string;
}

export interface DetectedIssue {
  type: string;
  message: string;
}

// Chat Assistant Types
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  isStreaming?: boolean;
}

// Authentication Types
export interface AuthState {
  isAdmin: boolean;
  userPhone: string | null;
  isActivated: boolean;
}

export interface PhoneRegistration {
  phone: string;
  timestamp: number;
  status: 'pending' | 'activated' | 'rejected';
}

// Title Analysis (reused from template)
export interface TitleStructure {
  action: string;
  tool: string;
  subject: string;
  scope: string;
  goal: string;
}

export interface AlternativeTitle {
  title: string;
  reason: string;
  score: number;
  tags?: string[];
}

export interface TitleAnalysisResult {
  score: number;
  criteria: {
    specificity: { score: number; max: 25; comment: string };
    novelty: { score: number; max: 30; comment: string };
    feasibility: { score: number; max: 25; comment: string };
    clarity: { score: number; max: 20; comment: string };
  };
  structure: TitleStructure;
  issues: string[];
  alternatives: AlternativeTitle[];
  related_topics: string[];
  layerAnalysis: {
    layer1_database: { duplicateLevel: 'low' | 'medium' | 'high'; similarTitles: string[] };
    layer2_online: { estimatedResults: number; popularityLevel: string };
    layer3_expert: { expertVerdict: string; recommendations: string[] };
  };
  conclusion: string;
  grade: 'excellent' | 'good' | 'average' | 'poor';
}

export interface AnalysisResult {
  totalScore: number;
  criteria: Criterion[];
  warnings: {
    duplicate: { level: string; text: string };
    plagiarism: { level: string; text: string };
  };
  spellingErrors: Array<{ original: string; suggest: string; context: string }>;
  reviewParagraphs: Array<{ text: string; match: string }>;
  upgradePlan: {
    short: string[];
    medium: string[];
    long: string[];
  };
}

// User Registration
export interface UserRegistration {
  phone: string;
  fullName: string;
  timestamp: number;
  status: 'pending' | 'activated' | 'rejected';
}

export interface MissionData {
  subject: string;
  gradeLevel: string;
  awardGoal: string;
  painPoint?: string;
  target?: string;
}

export interface SKKNContext {
  hasTitle: boolean;
  hasContent: boolean;
  titlePreview?: string;
  contentLength?: number;
}