import React from 'react';
import { FlatList, StatusBar, StyleSheet, Text, View,TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
	const settings= [
   { id: '1', title: 'Profile'},
   { id: '2', title: 'Notifications'},
   { id: '3', title: 'Privacy'},
   { id: '4', title: 'Security'},
   
	];
const renderSetting = ({ item }) => { 
	return ( <TouchableOpacity style={styles.settingItem}> 
	<Text style={styles.settingText}>{item.title}</Text> 
	</TouchableOpacity> ); };
	 return ( 
	 <SafeAreaView style={styles.safeArea}> 
	 <StatusBar barStyle="light-content" backgroundColor="#0f143a" /> 
	 <View style={styles.container}> 
		<Text style={styles.message}> Settings </Text>
		 <FlatList data={settings} renderItem={renderSetting} keyExtractor={(item) => item.id} />
		 </View>
		  </SafeAreaView> ); }
	   
	   const styles = StyleSheet.create({
		 safeArea: { flex: 1, 
			backgroundColor: '#0f143a',
		 },
		 container: { flex: 1,
			paddingHorizontal: 20,
			paddingTop: 24,
		 },
		 message: { color: '#fff',
			fontSize: 28,
			fontWeight: '800',
			textAlign: 'center',
			marginBottom: 30,
		 },
		 settingItem: { backgroundColor: '#1a1a2e',
			padding: 18,
			marginBottom: 12,
			borderRadius: 10,
		 },
		 settingText: { color: '#fff',
			fontSize: 18,
			fontWeight: '600',
		 },
		});	
