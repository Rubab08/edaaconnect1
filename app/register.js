import { useState } from 'react';
import Ionicons from '@expo/vector-icons/Ionicons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Dropdown } from 'react-native-element-dropdown';
import { useActionSheet } from '@expo/react-native-action-sheet';
import {
	Alert,
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
	},
	ar: {
		title: 'إنشاء حساب',
		language: 'English',
		email: 'البريد الإلكتروني',
		mobile: 'رقم الجوال',
		identity: 'رقم الهوية / الإقامة',
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
	},
};

const fieldErrorMessages = {
	email: 'Please Enter Valid Email',
	mobile: 'Please Enter Valid Phone Numbers',
	identity: 'National ID/ IQAMA Required',
};

const currentYear = new Date().getFullYear();
const formFields = [
	{ key: 'email', placeholder: 'email@domain.com', keyboardType: 'email-address' },
	{ key: 'mobile', placeholder: '9665xxxxxx', keyboardType: 'phone-pad' },
	{ key: 'identity', placeholder: 'National ID / IQAMA', keyboardType: 'alphanumeric' },
];
const emptyForm = { email: '', mobile: '', identity: '', year: '', month: '', day: '' };
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
}

export default function RegisterScreen({ navigation }) {
	const { showActionSheetWithOptions } = useActionSheet();
	const [language, setLanguage] = useState('en');
	const [gender, setGender] = useState('');
	const [acceptedTerms, setAcceptedTerms] = useState(false);
	const [form, setForm] = useState(emptyForm);
	const [errors, setErrors] = useState({});
	const [datePickerVisible, setDatePickerVisible] = useState(false);
	const [datePickerValue, setDatePickerValue] = useState(new Date(currentYear - 25, 0, 1));
	const text = copy[language];

	function updateForm(field, value) {
		if (field !== 'email' && !/^\d*$/.test(value)) return;
		setForm((current) => ({ ...current, [field]: value }));
		setErrors((current) => ({ ...current, [field]: field === 'mobile' ? value.length < 11 : false }));
	}



	function showCancelActions() {
		showActionSheetWithOptions({
			options: [text.cancel, text.clearForm, text.deleteAll],
			cancelButtonIndex: 0,
			destructiveButtonIndex: [1, 2],
			title: text.cancelTitle,
		}, (selectedIndex) => {
			if (selectedIndex === 1) {
				setForm((current) => ({ ...current, email: '', mobile: '', identity: '' }));
			}

			if (selectedIndex === 2) {
				setForm({ ...emptyForm });
				setGender('');
				setAcceptedTerms(false);
				setDatePickerVisible(false);
			}
		});
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

	function openDatePicker() {
		const currentDate = form.year && form.month && form.day
			? new Date(Number(form.year), Number(form.month) - 1, Number(form.day))
			: new Date(currentYear - 25, 0, 1);
		setDatePickerValue(currentDate > new Date() ? new Date() : currentDate);
		setDatePickerVisible(true);
	}

	function applySelectedDate(date) {
		setForm((current) => ({
			...current,
			year: String(date.getFullYear()),
			month: String(date.getMonth() + 1).padStart(2, '0'),
			day: String(date.getDate()).padStart(2, '0'),
		}));
		setErrors((current) => ({ ...current, year: false, month: false, day: false }));
	}

	function handleNativeDateChange(event, selectedDate) {
		if (Platform.OS === 'android') {
			setDatePickerVisible(false);
			if (event.type === 'set' && selectedDate) {
				applySelectedDate(selectedDate);
			}
			return;
		}

		if (selectedDate) {
			setDatePickerValue(selectedDate);
		}
	}

	const birthDateValue = form.year && form.month && form.day
		? `${form.day}/${form.month}/${form.year}`
		: '—';

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
						<Pressable accessibilityRole="button" accessibilityLabel="Back" onPress={() => navigation.goBack()} style={{ width: 28, height: 28, justifyContent: 'center' }}>
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

						<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{text.gender}</Text>
						<Dropdown
							accessibilityLabel={text.gender}
							style={{ height: 35, borderWidth: 1, borderColor: '#8393a8', borderRadius: 8, backgroundColor: '#001d31', paddingHorizontal: 12, marginBottom: 10 }}
							containerStyle={{ backgroundColor: '#001d31', borderColor: '#8393a8', borderRadius: 8 }}
							itemTextStyle={{ color: '#fff', fontSize: 11 }}
							selectedTextStyle={{ color: '#fff', fontSize: 11 }}
							placeholderStyle={{ color: '#bca3b4', fontSize: 11 }}
							iconColor="#bca3ba"
							activeColor="#1e303a"
							data={[
								{ label: text.female, value: 'female' },
								{ label: text.male, value: 'male' },
								{ label: text.other, value: 'other' },
							]}
							labelField="label"
							valueField="value"
							placeholder={text.selectGender}
							value={gender}
							maxHeight={140}
							dropdownPosition="bottom"
							onChange={(item) => setGender(item.value)}
							renderRightIcon={(isOpen) => (
								<Ionicons name={isOpen ? 'chevron-up' : 'chevron-down'} size={14} color="#bca3ba" />
							)}
						/>

						<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600', marginBottom: 6 }}>{text.birthDate}</Text>
						<Pressable
							accessibilityRole="button"
							accessibilityLabel={text.birthDate}
							onPress={openDatePicker}
							style={{ height: 35, borderWidth: 1, borderColor: '#8393a8', borderRadius: 8, backgroundColor: '#001d31', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12 }}
						>
							<Text style={{ flex: 1, color: birthDateValue === '—' ? '#9eafbd' : '#fff', fontSize: 11 }}>
								{birthDateValue}
							</Text>
							<Ionicons name="calendar-outline" size={15} color="#a3afbc" />
						</Pressable>
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

						<View style={{ flexDirection: 'row', gap: 10, marginTop: 8 }}>
							<Pressable accessibilityRole="button" onPress={showCancelActions} style={{ height: 36, flex: 1, borderWidth: 1, backgroundColor: '#8124ee', borderRadius: 7, alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{text.cancel}</Text>
							</Pressable>
							<Pressable accessibilityRole="button" onPress={submitRegistration} style={{ height: 36, flex: 1, borderRadius: 7, backgroundColor: '#8124ee', alignItems: 'center', justifyContent: 'center' }}>
								<Text style={{ color: '#fff', fontSize: 12, fontWeight: '600' }}>{text.continue}</Text>
							</Pressable>
						</View>
					</View>
				</ScrollView>
			</KeyboardAvoidingView>
			{datePickerVisible && Platform.OS === 'android' && (
				<DateTimePicker
					value={datePickerValue}
					mode="date"
					display="default"
					minimumDate={new Date(1900, 0, 1)}
					maximumDate={new Date()}
					onChange={handleNativeDateChange}
				/>
			)}
			{Platform.OS === 'ios' && (
				<Modal
					visible={datePickerVisible}
					transparent
					animationType="slide"
					onRequestClose={() => setDatePickerVisible(false)}
				>
					<View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.58)' }}>
						<Pressable
							onPress={() => setDatePickerVisible(false)}
							style={{ position: 'absolute', top: 0, right: 0, bottom: 0, left: 0 }}
						/>
						<View style={{ backgroundColor: '#1d1d1f', borderTopLeftRadius: 26, borderTopRightRadius: 26, paddingHorizontal: 20, paddingTop: 18, paddingBottom: 24 }}>
							<View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingBottom: 12 }}>
								<Pressable accessibilityRole="button" onPress={() => setDatePickerVisible(false)}>
									<Text style={{ color: '#35a2ff', fontSize: 17 }}>{text.cancel}</Text>
								</Pressable>
								<Text style={{ color: '#fff', fontSize: 17, fontWeight: '600' }}>{text.birthDate}</Text>
								<Pressable accessibilityRole="button" onPress={() => {
									applySelectedDate(datePickerValue);
									setDatePickerVisible(false);
								}}>
									<Text style={{ color: '#35a2ff', fontSize: 17, fontWeight: '600' }}>{language === 'en' ? 'Done' : 'تم'}</Text>
								</Pressable>
							</View>
							<DateTimePicker
								value={datePickerValue}
								mode="date"
								display="spinner"
								minimumDate={new Date(1900, 0, 1)}
								maximumDate={new Date()}
								onChange={handleNativeDateChange}
							/>
						</View>
					</View>
				</Modal>
			)}
		</SafeAreaView>
	);
};