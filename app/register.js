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

function BackgroundPattern() {
	return (
		<View pointerEvents="none" style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}>
			<View style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0, overflow: 'hidden' }}>
				{Array.from({ length: 23 }, (_, row) => (
					<View
						key={row}
						style={[{ position: 'absolute', flexDirection: 'row', gap: 9, width: '115%' }, { top: `${row * 4.5}%`, left: row % 2 ? -24 : -4 }]}
					>
						{Array.from({ length: 12 }, (_, column) => (
							<Text key={column} style={{ color: '#7224b5', opacity: 0.2, fontSize: 30, fontWeight: '800', width: 31, transform: [{ rotate: '14deg' }] }}>
								›
							</Text>
						))}
					</View>
				))}
			</View>
			<View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '24%', backgroundColor: 'rgba(70, 43, 190, 0.42)' }} />
		</View>
	);
}

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
		if (Object.values(nextErrors).some(Boolean)) {
			return;
		}
		Alert.alert(text.title, language === 'en' ? 'Your registration details are ready.' : 'بيانات التسجيل جاهزة.');
	}

	function openDatePicker(stage) {
		if ((stage === 'month' && !form.year) || (stage === 'day' && !form.month)) return;

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
		if (pickerStage === 'year') return calendar === 'hijri' ? hijriYearOptions : yearOptions;
		if (pickerStage === 'month') return monthOptions;
		if (calendar === 'hijri') return Array.from({ length: 30 }, (_, index) => String(index + 1).padStart(2, '0'));
		const daysInMonth = form.month ? new Date(Number(form.year), Number(form.month), 0).getDate() : 31;
		return Array.from({ length: daysInMonth }, (_, index) => String(index + 1).padStart(2, '0'));
	}

	function renderField(label, field, placeholder, keyboardType = 'default') {
		return (
			<View style={{ marginBottom: 14 }}>
				<Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>{label}</Text>
				<TextInput
					accessibilityLabel={label}
					value={form[field]}
					onChangeText={(value) => updateForm(field, value)}
					placeholder={placeholder}
					placeholderTextColor="#a3afbc"
					keyboardType={keyboardType}
					autoCapitalize={field === 'email' ? 'none' : 'none'}
					autoCorrect={false}
					style={[{ height: 44, borderRadius: 10, backgroundColor: '#001d31', paddingHorizontal: 16, color: '#fff', fontSize: 15 }, language === 'ar' && { textAlign: 'right' }]}
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
				<ScrollView contentContainerStyle={{ flexGrow: 1, paddingHorizontal: 24, paddingTop: 8, paddingBottom: 18 }} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
					<View style={{ height: 42, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
						<Text style={{ position: 'absolute', left: 0, right: 0, textAlign: 'center', color: '#fff', fontSize: 20, fontWeight: '700' }}>{text.title}</Text>
						<Pressable accessibilityRole="button" accessibilityLabel={language === 'en' ? 'Change language' : 'تغيير اللغة'} onPress={() => setLanguage(language === 'en' ? 'ar' : 'en')} style={{ flexDirection: 'row', alignItems: 'center', gap: 8, zIndex: 1 }}>
							<Ionicons name="sunny" size={24} color="#fff" />
							<Text style={{ color: '#fff', fontSize: 16 }}>{text.language}</Text>
						</Pressable>
					</View>

					<View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22, gap: 8 }}>
						<Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => router.back()} style={{ width: 34, height: 34, justifyContent: 'center' }}>
							<Ionicons name="arrow-back" size={26} color="#fff" />
						</Pressable>
						<View style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
							{[0, 1, 2, 3].map((step) => (
								<View key={step} style={{ flex: 1, flexDirection: 'row', alignItems: 'center' }}>
									<View style={{ width: 22, height: 22, borderWidth: step === 0 ? 3 : 2, borderColor: '#fff', borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
										{step === 0 && <View style={{ width: 14, height: 14, borderWidth: 1.5, borderColor: '#fff', borderRadius: 8 }} />}
									</View>
									{step < 3 && <View style={{ flex: 1, height: 2, backgroundColor: '#fff', marginHorizontal: 4 }} />}
								</View>
							))}
						</View>
					</View>

					<View style={{ marginTop: 24 }}>
						{renderField(text.email, 'email', 'email@domain.com', 'email-address')}
						{renderField(text.mobile, 'mobile', '9665xxxxxx')}
						{renderField(text.identity, 'identity', 'National ID / IQAMA')}

						<View style={{ height: 42, borderWidth: 1.5, borderColor: '#c4d0dc', borderRadius: 13, backgroundColor: '#001d31', flexDirection: 'row', alignItems: 'center', padding: 4, marginBottom: 16 }}>
							<Pressable accessibilityRole="button" accessibilityState={{ selected: calendar === 'gregorian' }} onPress={() => changeCalendar('gregorian')} style={{ flex: 1, height: 33, borderRadius: 9, backgroundColor: calendar === 'gregorian' ? '#8124ee' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 15 }}>{text.gregorian}</Text>
							</Pressable>
							<Pressable accessibilityRole="button" accessibilityState={{ selected: calendar === 'hijri' }} onPress={() => changeCalendar('hijri')} style={{ flex: 1, height: 33, borderRadius: 9, backgroundColor: calendar === 'hijri' ? '#8124ee' : 'transparent', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 15 }}>{text.hijri}</Text>
							</Pressable>
						</View>

						<Text style={{ color: '#fff', fontSize: 16, fontWeight: '600', marginBottom: 8 }}>{text.birthDate}</Text>
						<View style={{ flexDirection: 'row', gap: 8 }}>
							{[
								{ key: 'year', label: text.year, maxLength: 4, flex: 1 },
								{ key: 'month', label: text.month, maxLength: 2, flex: 1.5 },
								{ key: 'day', label: text.day, maxLength: 2, flex: 1 },
							].map((dateField) => (
								<View key={dateField.key} style={{ flex: dateField.flex }}>
									<Text style={{ color: '#d5d8e7', fontSize: 13, fontWeight: '600', textAlign: 'center', marginBottom: 6 }}>{dateField.label}</Text>
									<Pressable
										accessibilityRole="button"
										accessibilityState={{ disabled: (dateField.key === 'month' && !form.year) || (dateField.key === 'day' && !form.month) }}
										disabled={(dateField.key === 'month' && !form.year) || (dateField.key === 'day' && !form.month)}
										onPress={() => openDatePicker(dateField.key)}
										style={{ height: 44, borderWidth: 1, borderColor: '#8393a8', borderRadius: 9, backgroundColor: '#001d31', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, opacity: ((dateField.key === 'month' && !form.year) || (dateField.key === 'day' && !form.month)) ? 0.45 : 1 }}
									>
										<Text style={{ flex: 1, color: form[dateField.key] ? '#fff' : '#9eafbd', fontSize: 15, textAlign: 'center' }}>{form[dateField.key] || '—'}</Text>
										<Ionicons name="chevron-down" size={16} color="#a3afbc" />
									</Pressable>
								</View>
							))}
						</View>
						{(errors.year || errors.month || errors.day) && <Text style={{ color: '#ff6676', fontSize: 12, marginTop: 4 }}>Please Enter Date Of Birth</Text>}

						<Pressable accessibilityRole="checkbox" accessibilityState={{ checked: acceptedTerms }} onPress={() => setAcceptedTerms(!acceptedTerms)} style={{ flexDirection: 'row', alignItems: 'center', marginTop: 22, marginBottom: 20 }}>
							<Ionicons name={acceptedTerms ? 'checkbox' : 'square-outline'} size={24} color="#fff" />
							<Text style={{ color: '#fff', fontSize: 14, marginLeft: 8 }}>{text.terms} </Text>
							<Pressable accessibilityRole="link" onPress={() => Alert.alert(text.termsLink)}>
								<Text style={{ color: '#d98aff', fontSize: 14, textDecorationLine: 'underline' }}>{text.termsLink}</Text>
							</Pressable>
						</Pressable>
						{errors.terms && <Text style={{ color: '#ff6676', fontSize: 12, marginTop: -16, marginBottom: 10 }}>{language === 'en' ? 'Please accept the terms.' : 'يرجى الموافقة على الشروط.'}</Text>}

						<Pressable accessibilityRole="button" onPress={submitRegistration} style={{ height: 50, borderRadius: 9, backgroundColor: '#8124ee', alignItems: 'center', justifyContent: 'center', marginTop: 8 }}>
							<Text style={{ color: '#fff', fontSize: 18, fontWeight: '600' }}>{text.continue}</Text>
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
							initialScrollIndex={Math.max(0, getPickerOptions().indexOf(pickerValue))}
							getItemLayout={(_, index) => ({ length: 64, offset: 64 * index, index })}
							keyExtractor={(value) => value}
							renderItem={({ item }) => (
								<Pressable onPress={() => setPickerValue(item)} style={{ height: 64, borderBottomWidth: 1, borderBottomColor: '#333336', alignItems: 'center', justifyContent: 'center', backgroundColor: item === pickerValue ? '#1e303a' : 'transparent' }}>
									<Text style={{ color: item === pickerValue ? '#35a2ff' : '#fff', fontSize: 21, fontWeight: item === pickerValue ? '600' : '400' }}>{item}</Text>
								</Pressable>
							)}
						/>
					</View>
				</View>
			</Modal>
		</SafeAreaView>
	);
}