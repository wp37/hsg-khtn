// Authentication Utilities for HSG KHTN Hóa Học AI
// Manages admin login and phone-based feature activation

// Safe localStorage helpers (avoid SSR crashes)
const getStorage = (): Storage | null => {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return null;
};

const safeGetItem = (key: string): string | null => {
  const storage = getStorage();
  if (!storage) return null;
  try {
    return storage.getItem(key);
  } catch {
    return null;
  }
};

const safeSetItem = (key: string, value: string): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.setItem(key, value);
  } catch {
    // Ignore storage errors (quota exceeded, etc.)
  }
};

const safeRemoveItem = (key: string): void => {
  const storage = getStorage();
  if (!storage) return;
  try {
    storage.removeItem(key);
  } catch {
    // Ignore storage errors
  }
};

// Bank Info for Payment
export const BANK_INFO = {
  bankName: 'Agribank',
  accountNumber: '7110215003073',
  accountHolder: 'VO NGOC TUNG',
  amount: '100.000đ',
  // VietQR URL for QR code display
  qrUrl: 'https://img.vietqr.io/image/agribank-7110215003073-compact2.png?amount=100000&addInfo=HSG%20KHTN&accountName=VO%20NGOC%20TUNG',
};

// User Registration interface (aligned with types.ts)
export interface UserRegistration {
  phone: string;
  fullName: string;
  registeredAt: string;
  timestamp?: number;
  status?: 'pending' | 'activated' | 'rejected';
}

const STORAGE_KEYS = {
  ADMIN_LOGGED_IN: 'skkn_admin_logged_in',
  USER_PHONE: 'skkn_user_phone',
  USER_FULL_NAME: 'skkn_user_full_name',
  PENDING_REGISTRATIONS: 'skkn_pending_registrations',
  ACTIVATED_REGISTRATIONS: 'skkn_activated_registrations',
};

// Admin credentials (hardcoded for simplicity)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'skkn123',
};

/**
 * Validate admin credentials
 */
export const validateAdminCredentials = (username: string, password: string): boolean => {
  return username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password;
};

/**
 * Check if admin is currently logged in
 */
export const isAdmin = (): boolean => {
  return safeGetItem(STORAGE_KEYS.ADMIN_LOGGED_IN) === 'true';
};

/**
 * Log in as admin
 */
export const loginAdmin = (): void => {
  safeSetItem(STORAGE_KEYS.ADMIN_LOGGED_IN, 'true');
};

/**
 * Log out admin
 */
export const logoutAdmin = (): void => {
  safeRemoveItem(STORAGE_KEYS.ADMIN_LOGGED_IN);
};

/**
 * Get current user's phone number
 */
export const getCurrentUserPhone = (): string | null => {
  return safeGetItem(STORAGE_KEYS.USER_PHONE);
};

/**
 * Get current user's full name
 */
export const getCurrentUserName = (): string | null => {
  return safeGetItem(STORAGE_KEYS.USER_FULL_NAME);
};

/**
 * Set current user's info
 */
export const setCurrentUser = (phone: string, fullName: string): void => {
  safeSetItem(STORAGE_KEYS.USER_PHONE, phone);
  safeSetItem(STORAGE_KEYS.USER_FULL_NAME, fullName);
};

/**
 * Get list of pending registrations
 */
export const getPendingRegistrations = (): UserRegistration[] => {
  try {
    return JSON.parse(safeGetItem(STORAGE_KEYS.PENDING_REGISTRATIONS) || '[]');
  } catch {
    return [];
  }
};

/**
 * Get list of activated registrations
 */
export const getActivatedRegistrations = (): UserRegistration[] => {
  try {
    return JSON.parse(safeGetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS) || '[]');
  } catch {
    return [];
  }
};

/**
 * Check if current user's phone is activated
 */
export const isUserActivated = (): boolean => {
  const userPhone = getCurrentUserPhone();
  if (!userPhone) return false;

  const activatedRegs = getActivatedRegistrations();
  return activatedRegs.some(reg => reg.phone === userPhone);
};

/**
 * Check if user can access features
 * Requires admin login OR activated registration
 */
export const canAccessFeature = (): boolean => {
  return isAdmin() || isUserActivated();
};

/**
 * Check if user can access premium/advanced features
 * Premium features require registration and admin approval
 */
export const canAccessPremiumFeature = (): boolean => {
  return isAdmin() || isUserActivated();
};

/**
 * Register a user with phone and full name
 */
export const registerUser = (phone: string, fullName: string): { success: boolean; error?: string } => {
  // Validate phone format (Vietnamese: 10-11 digits starting with 0)
  const phoneRegex = /^0\d{9,10}$/;
  if (!phoneRegex.test(phone)) {
    return { success: false, error: 'Số điện thoại không hợp lệ (10-11 số, bắt đầu bằng 0)' };
  }

  // Validate full name
  if (!fullName || fullName.trim().length < 2) {
    return { success: false, error: 'Vui lòng nhập họ và tên đầy đủ' };
  }

  // Check for duplicates
  const pendingRegs = getPendingRegistrations();
  const activatedRegs = getActivatedRegistrations();

  if (pendingRegs.some(reg => reg.phone === phone)) {
    return { success: false, error: 'Số điện thoại này đang chờ duyệt' };
  }

  if (activatedRegs.some(reg => reg.phone === phone)) {
    return { success: false, error: 'Số điện thoại này đã được kích hoạt' };
  }

  // Create registration
  const newReg: UserRegistration = {
    phone,
    fullName: fullName.trim(),
    registeredAt: new Date().toISOString(),
  };

  // Add to pending list
  pendingRegs.push(newReg);
  safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pendingRegs));

  // Set as current user
  setCurrentUser(phone, fullName.trim());

  return { success: true };
};

/**
 * Activate a user registration (move from pending to activated)
 */
export const activateUser = (phone: string): void => {
  const pendingRegs = getPendingRegistrations();
  const regToActivate = pendingRegs.find(reg => reg.phone === phone);

  if (!regToActivate) return;

  // Remove from pending
  const newPendingRegs = pendingRegs.filter(reg => reg.phone !== phone);
  safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(newPendingRegs));

  // Add to activated
  const activatedRegs = getActivatedRegistrations();
  if (!activatedRegs.some(reg => reg.phone === phone)) {
    activatedRegs.push(regToActivate);
    safeSetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS, JSON.stringify(activatedRegs));
  }
};

/**
 * Reject/Remove a pending registration
 */
export const rejectUser = (phone: string): void => {
  const pendingRegs = getPendingRegistrations().filter(reg => reg.phone !== phone);
  safeSetItem(STORAGE_KEYS.PENDING_REGISTRATIONS, JSON.stringify(pendingRegs));
};

/**
 * Deactivate a user (remove from activated list)
 */
export const deactivateUser = (phone: string): void => {
  const activatedRegs = getActivatedRegistrations().filter(reg => reg.phone !== phone);
  safeSetItem(STORAGE_KEYS.ACTIVATED_REGISTRATIONS, JSON.stringify(activatedRegs));
};

/**
 * Check if a phone number is in pending list
 */
export const isPhonePending = (phone: string): boolean => {
  return getPendingRegistrations().some(reg => reg.phone === phone);
};

/**
 * Check if a phone number is activated
 */
export const isPhoneActivated = (phone: string): boolean => {
  return getActivatedRegistrations().some(reg => reg.phone === phone);
};

// Legacy exports for backward compatibility
export const getPendingPhones = (): string[] => {
  return getPendingRegistrations().map(reg => reg.phone);
};

export const getActivatedPhones = (): string[] => {
  return getActivatedRegistrations().map(reg => reg.phone);
};

export const activatePhone = (phone: string): void => {
  activateUser(phone);
};

export const deactivatePhone = (phone: string): void => {
  deactivateUser(phone);
};

export const registerPhone = (phone: string): { success: boolean; error?: string } => {
  return registerUser(phone, 'Unknown');
};

export const setCurrentUserPhone = (phone: string): void => {
  safeSetItem(STORAGE_KEYS.USER_PHONE, phone);
};
