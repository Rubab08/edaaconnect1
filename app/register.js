import { useState } from 'react';
import { router } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
	Alert,
	FlatList,
	KeyboardAvoidingView,
	Modal,
	Platform,
	Pressable,
	ScrollView,
	StatusBar,
	Text,
	TextInput,
	View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const copy = {
	en: {
		title: 'Sign Up',
		language: 'العربية',
		email: 'Email',
		mobile: 'Mobile Number',
		identity: 'National ID / IQAMA',
		gregorian: 'Gregorian',
		hijri: 'Hijri',
		birthDate: 'Date of Birth',
		year: 'Year',
		month: 'Month',
		day: 'Day',
		terms: 'Agree to the',
		termsLink: 'Terms & Conditions',
		continue: 'Continue',
	},
	ar: {
		title: 'إنشاء حساب',
		language: 'English',
		email: 'البريد الإلكتروني',
		mobile: 'رقم الجوال',
		identity: 'رقم الهوية / الإقامة',
		gregorian: 'ميلادي',
		hijri: 'هجري',
		birthDate: 'تاريخ الميلاد',
		year: 'السنة',
		month: 'الشهر',
		day: 'اليوم',
		terms: 'أوافق على',
		termsLink: 'الشروط والأحكام',
		continue: 'متابعة',
	},
};

const fieldErrorMessages = {
	email: 'Please Enter Valid Email',
	mobile: 'Please Enter Valid Phone Numbers',
	identity: 'National ID/ IQAMA Required',
};

const currentYear = new Date().getFullYear();
const yearOptions = Array.from({ length: currentYear - 1899 }, (_, index) => String(currentYear - index));
const hijriYearOptions = Array.from({ length: 1448 - 1358 + 1 }, (_, index) => String(1358 + index));
const monthOptions = Array.from({ length: 12 }, (_, index) => String(index + 1).padStart(2, '0'));
const hijriMonthOptions = [
	{ value: '01', label: 'Muharram' },
	{ value: '02', label: 'Safar' },
	{ value: '03', label: 'Rabi I' },
	{ value: '04', label: 'Rabi II' },
	{ value: '05', label: 'Jumada I' },
	{ value: '06', label: 'Jumada II' },
	{ value: '07', label: 'Rajab' },
	{ value: '08', label: "Sha'ban" },
	{ value: '09', label: 'Ramadan' },
	{ value: '10', label: 'Shawwal' },
	{ value: '11', label: "Dhu al-Qi'dah" },
	{ value: '12', label: 'Dhu al-Hijjah' },
];
const formFields = [
	{ key: 'email', placeholder: 'email@domain.com', keyboardType: 'email-address' },
	{ key: 'mobile', placeholder: '9665xxxxxx', keyboardType: 'phone-pad' },
	{ key: 'identity', placeholder: 'National ID / IQAMA', keyboardType: 'alphanumeric' },
];
const dateFields = [
	{ key: 'year', flex: 1 },
	{ key: 'month', flex: 1.5, requires: 'year' },
	{ key: 'day', flex: 1, requires: 'month' },
];
const glowColumns = [
	{ left: '5%', height: '18%', width: 25 },
	{ left: '15%', height: '12%', width: 20 },
	{ left: '30%', height: '15%', width: 30 },
	{ left: '50%', height: '20%', width: 15 },
	{ left: '70%', height: '16%', width: 35 },
	{ left: '85%', height: '19%', width: 20 },
	{ left: '95%', height: '23%', width: 15 },
];

function BackgroundPattern() {
	return (
		<View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
			
			<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%', backgroundColor: 'rgba(57, 34, 150, 0.4)' }} />
			{glowColumns.map((column, index) => (
				<View
					key={index}
					style={[{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(92, 114, 255, 0.25)' }, column]}
				/>
			))}
		</View>
	);

    {/* Bottom glowing columns */}
          <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '25%', backgroundColor: 'rgba(57, 34, 150, 0.4)' }} />
          {[
            { left: '5%', height: '18%', width: 25 },
            { left: '15%', height: '12%', width: 20 },
            { left: '30%', height: '15%', width: 30 },
            { left: '50%', height: '20%', width: 15 },
            { left: '70%', height: '16%', width: 35 },
            { left: '85%', height: '19%', width: 20 },
            { left: '95%', height: '23%', width: 15 },
          ].map((col, index) => (
            <View
              key={index}
              style={[{ position: 'absolute', bottom: 0, backgroundColor: 'rgba(92, 114, 255, 0.25)' }, col]}
            />
          ))}

		} ;    

export default function RegisterScreen() {
	const [language, setLanguage] = useState('en');
	const [calendar, setCalendar] = useState('gregorian');
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [form, setForm] = useState({ email: '', mobile: '', identity: '', year: '', month: '', day: '' });
	const [errors, setErrors] = useState({});
	const [pickerStage, setPickerStage] = useState(null);
	const [pickerValue, setPickerValue] = useState('');
	const text = copy[language];
	const stageLabels = { year: text.year, month: text.month, day: text.day };

	function updateForm(field, value) {
		if (field !== 'email' && !/^\d*$/.test(value)) return;
		setForm((current) => ({ ...current, [field]: value }));
		setErrors((current) => ({ ...current, [field]: field === 'mobile' ? value.length < 11 : false }));
	}
    function changeCalendar(nextCalendar) {
		setCalendar(nextCalendar);
		setForm((current) => ({ ...current, year: '', month: '', day: '' }));
		setErrors((current) => ({ ...current, year: false, month: false, day: false }));
	}

	function submitRegistration() {
		const nextErrors = {
			email: !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
			mobile: !/^\d{11,}$/.test(form.mobile),
			identity: !/^\d{10,}$/.test(form.identity),
			year: !form.year,
			month: !form.month,
			day: !form.day,
			terms: !acceptedTerms,
		};
		setErrors(nextErrors);
		const invalidFields = Object.keys(nextErrors).filter((field) => nextErrors[field]);
		if (invalidFields.length > 0) {
			return;
		}
		Alert.alert(text.title, language === 'en' ? 'Your registration details are ready.' : 'بيانات التسجيل جاهزة.');
	}

	function openDatePicker(stage) {
		const dateField = dateFields.find((field) => field.key === stage);
		if (!dateField || (dateField.requires && !form[dateField.requires])) return;

		const fallbackValue = stage === 'year'
			? calendar === 'hijri' ? '1358' : String(currentYear - 25)
			: '01';
		setPickerValue(form[stage] || fallbackValue);
		setPickerStage(stage);
	}

	function confirmDateSelection() {
		if (!pickerStage || !pickerValue) return;

		const completedStage = pickerStage;
		setForm((current) => ({
			...current,
			[completedStage]: pickerValue,
			...(completedStage === 'year' ? { month: '', day: '' } : {}),
			...(completedStage === 'month' ? { day: '' } : {}),
		}));
		setErrors((current) => ({ ...current, year: false, month: false, day: false }));

		if (completedStage === 'year') {
			setPickerStage('month');
			setPickerValue('01');
		} else if (completedStage === 'month') {
			setPickerStage('day');
			setPickerValue('01');
		} else {
			setPickerStage(null);
		}
	}

	function getPickerOptions() {
		if (pickerStage === 'year') {
			const years = calendar === 'hijri' ? hijriYearOptions : yearOptions;
			return years.map((value) => ({ value, label: value }));
		}
		if (pickerStage === 'month') {
			if (calendar === 'hijri') return hijriMonthOptions;
			return monthOptions.map((value) => ({ value, label: value }));
		}

		const daysInMonth = calendar === 'hijri'
			? 30
			: form.month ? new Date(Number(form.year), Number(form.month), 0).getDate() : 31;
		return Array.from({ length: daysInMonth }, (_, index) => {
			const value = String(index + 1).padStart(2, '0');
			return { value, label: value };
		});
	}

	function renderField(label, field, placeholder, keyboardType = 'default') {
		return (
			<View style={{ marginBottom: 10 }}>
				<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
				<TextInput
					accessibilityLabel={label}
					value={form[field]}
					onChangeText={(value) => updateForm(field, value)}
					placeholder={placeholder}
					placeholderTextColor="#a3afbc"
					keyboardType={keyboardType}
					autoCapitalize="none"
					autoCorrect={false}
					style={[{ height: 35, borderRadius: 8, backgroundColor: '#001d31', paddingHorizontal: 12, color: '#fff', fontSize: 11 }, language === 'ar' && { textAlign: 'right' }]}
				/>
				{errors[field] && <Text style={{ color: '#ff6676', fontSize: 12, marginTop: 4 }}>{fieldErrorMessages[field]}</Text>}
			</View>
		);
	}

	return (
		<SafeAreaView style={{ flex: 1, backgroundColor: '#111d50' }} edges={['top', 'bottom']}>
			<StatusBar barStyle="light-content" backgroundColor="#20205f" />
			<BackgroundPattern />
			<KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
				<ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 20, paddingTop: 4, paddingBottom: 12}} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
					<View style={{ height: 32, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
						<Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 16, fontWeight: '700' }}>{text.title}</Text>
						<Pressable accessibilityRole="button" accessibilityLabel={language === 'en' ? 'Change language' : 'تغيير اللغة'} onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 }}>
							<Ionicons name="sunny-outline" size={18} color="#fff" />
							<Text style={{ color: '#fff', fontSize: 11 }}>{text.language}</Text>
						</Pressable>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
						<Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={{ width: 28, height: 28, justifyContent: 'center' }}>
							<Ionicons name="arrow-back" size={18} color="#fff" />
						</Pressable>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							{[0, 1, 2, 3].map((step) => (
									<View key={step} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
										<View style={{ width: 18, height: 18, borderWidth: step === 0 ? 2 : 1.5, borderColor: '#fff', borderRadius: 9, alignItems: 'center', justifyContent: 'center' }}>
											{step === 0 && <View style={{ width: 11, height: 11, borderWidth: 1, borderColor: '#fff', borderRadius: 6 }} />}
									</View>
									{step < 3 && <View style={{ flex: 1, height: 2, backgroundColor: '#fff', marginHorizontal: 4 }} />}
								</View>
							))}
						</View>
					</View>

					<View style={{ marginTop: 60 }}>
						{formFields.map((field) => renderField(text[field.key], field.key, field.placeholder, field.keyboardType))}

						<View style={{ height: 30, borderWidth: 1, borderColor: '#c4d0dc', borderRadius: 9, backgroundColor: '#001d31', flexDirection: 'row', alignItems: 'center', padding: 2, marginBottom: 12 }}>
							<Pressable accessibilityRole="button" accessibilityState={{ selected: calendar === 'gregorian' }} onPress={() => changeCalendar('gregorian')} style={{ flex: 1, height: 24, borderRadius: 6, backgroundColor: calendar === 'gregorian' ? '#8124ee' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 10 }}>{text.gregorian}</Text>
							</Pressable>
							<Pressable accessibilityRole="button" accessibilityState={{ selected: calendar === 'hijri' }} onPress={() => changeCalendar('hijri')} style={{ flex: 1, height: 24, borderRadius: 6, backgroundColor: calendar === 'hijri' ? '#8124ee' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 10 }}>{text.hijri}</Text>
							</Pressable>
						</View>

						<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{text.birthDate}</Text>
						<View style={{ flexDirection: 'row', gap: 6 }}>
							{dateFields.map((dateField) => {
								const disabled = Boolean(dateField.requires && !form[dateField.requires]);
								const hijriMonth = dateField.key === 'month' && calendar === 'hijri'
									? hijriMonthOptions.find((month) => month.value === form.month)?.label
									: null;
								const value = hijriMonth || form[dateField.key] || '—';
								return (
								<View key={dateField.key} style={{ flex: dateField.flex }}>
									<Text style={{ color: '#d5d8e7', fontSize: 10, fontWeight: '600', textAlign: 'center', marginBottom: 4 }}>{text[dateField.key]}</Text>
									<Pressable
										accessibilityRole="button"
										accessibilityState={{ disabled }}
										disabled={disabled}
										onPress={() => openDatePicker(dateField.key)}
										style={{ height: 34, borderWidth: 1, borderColor: '#8393a8', borderRadius: 7, backgroundColor: '#001d31', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 8, opacity: disabled ? 0.45 : 1 }}
									>
										<Text style={{ flex: 1, color: form[dateField.key] ? '#fff' : '#9eafbd', fontSize: 11, textAlign: 'center' }}>{value}</Text>
										<Ionicons name="chevron-down" size={12} color="#a3afbc" />
									</Pressable>
								</View>
								);
							})}
						</View>
						{(errors.year || errors.month || errors.day) && <Text style={{ color: '#ff6676', fontSize: 12, marginTop: 4 }}>Please Enter Date Of Birth</Text>}

						<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 14, marginBottom: 14 }}>
							<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} onPress={() => setAcceptedTerms(!acceptedTerms)} style={{ flexDirection: 'row', alignItems: 'center' }}>
								<Ionicons name={acceptedTerms ? 'checkbox' : 'square-outline'} size={18} color="#fff" />
								<Text style={{ color: '#fff', fontSize: 10, marginLeft: 5 }}>{text.terms}</Text>
							</Pressable>
							<Pressable accessibilityRole="link" onPress={() => Alert.alert(text.termsLink)} style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 3 }}>
								<Text style={{ color: '#d98aff', fontSize: 10, textDecorationLine: 'underline' }}>{text.termsLink}</Text>
								<Ionicons name="open-outline" size={12} color="#d98aff" style={{ marginLeft: 3 }} />
							</Pressable>
						</View>
						{errors.terms && <Text style={{ color: '#ff6676', fontSize: 12, marginTop: -16, marginBottom: 10 }}>{language === 'en' ? 'Please accept the terms.' : 'يرجى الموافقة على الشروط.'}</Text>}

						<Pressable accessibilityRole="button" onPress={submitRegistration} style={{ height: 36, borderRadius: 7, backgroundColor: '#8124ee', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
							<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{text.continue}</Text>
						</Pressable>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			<Modal visible={Boolean(pickerStage)} transparent animationType="slide" onRequestClose={() => setPickerStage(null)}>
				<View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.58)' }}>
					<Pressable onPress={() => setPickerStage(null)} style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }} />
					<View style={{ height: '62%', backgroundColor: '#1d1d1f', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 12 }}>
						<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#3a3a3c' }}>
							<Text style={{ color: '#fff', fontSize: 20, fontWeight: '600' }}>{stageLabels[pickerStage] || ''}</Text>
							<Pressable accessibilityRole="button" onPress={confirmDateSelection}>
								<Text style={{ color: '#35a2ff', fontSize: 18, fontWeight: '600' }}>{language === 'en' ? 'Done' : 'تم'}</Text>
							</Pressable>
						</View>
						<FlatList
							key={pickerStage || 'date-picker'}
							data={getPickerOptions()}
							initialScrollIndex={Math.max(0, getPickerOptions().findIndex((option) => option.value === pickerValue))}
							getItemLayout={(_, index) => ({ length: 64, offset: 64 * index, index })}
							keyExtractor={(option) => option.value}
							renderItem={({ item }) => (
								<Pressable onPress={() => setPickerValue(item.value)} style={{ height: 64, borderBottomWidth: 1, borderBottomColor: '#333336', alignItems: 'center', justifyContent: 'center', backgroundColor: item.value === pickerValue ? '#1e303a' : 'transparent' }}>
									<Text style={{ color: item.value === pickerValue ? '#35a2ff' : '#fff', fontSize: 21, fontWeight: item.value === pickerValue ? '600' : '400' }}>{item.label}</Text>
								</Pressable>
							)}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
};