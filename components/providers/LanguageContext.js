import React, { createContext, useContext, useState } from 'react';

const translations = {
  en: {
    languageToggle: 'العربية',
    copyright: 'Copy right – Edaa (From Saudi Tadawul Group) 2026',

    // Onboarding Screen
    welcomeTitle: 'Welcome',
    loginBtn: 'Login',
    createInvestmentAccount: 'Create Investment Account',

    // Login Screen
    loginTitle: 'Login',
    identity: 'National ID / IQAMA',
    password: 'Password',
    identityPlaceholder: 'Enter National ID / IQAMA',
    passwordPlaceholder: 'Enter Password',
    keepSignedIn: 'Keep me signed in',
    forgotPassword: 'Forgot Password',
    or: 'OR',
    biometric: 'Biometric',
    createAccountPrompt: 'Create new account?',
    register: 'Register',
    errMissing: 'Enter your ID and password to continue.',
    successMsg: 'Your sign-in request is ready.',

    // Register Screen
    signUpTitle: 'Sign Up',
    email: 'Email',
    mobile: 'Mobile Number',
    cancel: 'Cancel',
    clearForm: 'Clear Form',
    deleteAll: 'Delete All',
    cancelTitle: 'Cancel registration?',
    gender: 'Gender',
    selectGender: 'Select gender',
    female: 'Female',
    male: 'Male',
    other: 'Other',
    birthDate: 'Date of Birth',
    terms: 'Agree to the',
    termsLink: 'Terms & Conditions',
    continue: 'Continue',
    done: 'Done',
    regSuccessMsg: 'Your registration details are ready.',
    errEmail: 'Please Enter Valid Email',
    errMobile: 'Please Enter Valid Phone Numbers',
    errIdentity: 'National ID/ IQAMA Required',
    errBirthDate: 'Please Enter Date Of Birth',
    errTerms: 'Please accept the terms.',

    // Profile Screen
    flowersTitle: 'FLOWERS',
    ninLabel: 'NIN',
    notLoggedIn: 'Not Logged In',
  },
  ar: {
    languageToggle: 'English',
    copyright: 'إيداع – مجموعة تداول السعودية 2026',

    // Onboarding Screen
    welcomeTitle: 'مرحبًا',
    loginBtn: 'دخول',
    createInvestmentAccount: 'إنشاء حساب استثماري',

    // Login Screen
    loginTitle: 'تسجيل الدخول',
    identity: 'رقم الهوية / الإقامة',
    password: 'كلمة المرور',
    identityPlaceholder: 'أدخل رقم الهوية / الإقامة',
    passwordPlaceholder: 'أدخل كلمة المرور',
    keepSignedIn: 'تذكرني',
    forgotPassword: 'نسيت كلمة المرور',
    or: 'أو',
    biometric: 'دخول بالبصمة',
    createAccountPrompt: 'ليس لديك حساب؟',
    register: 'سجل الآن',
    errMissing: 'أدخل رقم الهوية وكلمة المرور للمتابعة.',
    successMsg: 'طلب تسجيل الدخول جاهز.',

    // Register Screen
    signUpTitle: 'إنشاء حساب',
    email: 'البريد الإلكتروني',
    mobile: 'رقم الجوال',
    cancel: 'إلغاء',
    clearForm: 'مسح النموذج',
    deleteAll: 'حذف الكل',
    cancelTitle: 'إلغاء التسجيل؟',
    gender: 'الجنس',
    selectGender: 'اختر الجنس',
    female: 'أنثى',
    male: 'ذكر',
    other: 'أخرى',
    birthDate: 'تاريخ الميلاد',
    terms: 'أوافق على',
    termsLink: 'الشروط والأحكام',
    continue: 'متابعة',
    done: 'تم',
    regSuccessMsg: 'بيانات التسجيل جاهزة.',
    errEmail: 'الرجاء إدخال بريد إلكتروني صحيح',
    errMobile: 'الرجاء إدخال رقم جوال صحيح',
    errIdentity: 'رقم الهوية / الإقامة مطلوب',
    errBirthDate: 'الرجاء إدخال تاريخ الميلاد',
    errTerms: 'يرجى الموافقة على الشروط.',

    // Profile Screen
    flowersTitle: 'الزهور',
    ninLabel: 'رقم الهوية',
    notLoggedIn: 'غير مسجل الدخول',
  },
};

const LanguageContext = createContext(undefined);

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState('en');

  const toggleLanguage = () => {
    setLanguage((prev) => (prev === 'en' ? 'ar' : 'en'));
  };

  const isRtl = language === 'ar';

  const t = (key) => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, isRtl, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}