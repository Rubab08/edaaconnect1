import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert, ScrollView } from 'react-native';
import { getRequest } from '../components/mainURL.js';
import { postRequest } from '../components/mainURL.js';
import { GET_USERS, SAVE_USER, GET_DEPARTMENT, SAVE_DEPARTMENT } from '../components/EndPoints.js';

export default function TestScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [departmentName, setdepartmentName] = useState('');

 
  const [users, setUsers] = useState([]);
  const [department, setDepartment] = useState([]);

  // GET for user and department
  const loadScreenData = async () => {
    try {
      const usersData = await getRequest(GET_USERS);
      setUsers(usersData);

      const deptData = await getRequest(GET_DEPARTMENT);
      setDepartment(deptData);
    } catch (error) {
      console.error('Error fetching screen data:', error);
    }
  };

  useEffect(() => {
    loadScreenData();
  }, []);

  //  POST for User
  const handleSaveUser = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please enter both Name and Email');
      return;
    }
    try {
      const response = await postRequest(SAVE_USER, { name, email });
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'User saved to database!');
        setName('');
        setEmail('');
        loadScreenData(); // Refresh lists
      }
    } catch (error) {
      Alert.alert('Error', 'Could not save user');
    }
  };

  // POST for Department
  const handleSaveDepartment = async () => {
    if (!departmentName) {
      Alert.alert('Error', 'Please enter Department Name');
      return;
    }
    try {
      const response = await postRequest(SAVE_DEPARTMENT, { departmentName });
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Department saved to database!');
        setdepartmentName('');
        loadScreenData(); // Refresh
      }
    } catch (error) {
      Alert.alert('Error', 'Could not save department');
    }
  };

  return (
    <ScrollView style={styles.container}>
      
      {/* 1. USER ENTRY  */}
      <View style={styles.formSection}>
        <Text style={styles.header}>Add New User</Text>
        <TextInput style={styles.input} placeholder="Name" value={name} onChangeText={setName} />
        <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} keyboardType="email-address" />
        <TouchableOpacity style={styles.button} onPress={handleSaveUser}>
          <Text style={styles.buttonText}>Save User</Text>
        </TouchableOpacity>
      </View>

      {/* 2. DEPARTMENT ENTRY */}
      <View style={styles.formSection}>
        <Text style={styles.header}>Add New Department</Text>
        <TextInput style={styles.input} placeholder="Department Name (e.g., IT)" value={departmentName} onChangeText={setdepartmentName} />
        <TouchableOpacity style={styles.button} onPress={handleSaveDepartment}>
          <Text style={styles.buttonText}>Save Department</Text>
        </TouchableOpacity>
      </View>

      {/* 3. REFRESH BUTTON FOR BOTH */}
      <TouchableOpacity style={styles.refreshButton} onPress={loadScreenData}>
        <Text style={styles.buttonText}>Refresh All Data</Text>
      </TouchableOpacity>

      {/* 4. USERS LIST */}
      <Text style={styles.subHeader}>Saved Users:</Text>
      <FlatList
        scrollEnabled={false} 
        data={users}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Name: {item.Name}</Text>
            <Text style={styles.text}>Email: {item.Email}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No users found.</Text>}
      />

      {/* 5. DEPARTMENTS LIST */}
      <Text style={styles.subHeader}>Saved Department:</Text>
      <FlatList
        scrollEnabled={false}
        data={department}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.text}>Name: {item.departmentName}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>No department found.</Text>}
      />
      
      <View style={{ height: 60 }} /> 
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#20205f', marginTop: 40 },
  formSection: { marginBottom: 30, paddingBottom: 20, borderBottomWidth: 1, borderBottomColor: '#3a3a8a' },
  header: { fontSize: 22, fontWeight: 'bold', marginBottom: 15, color: 'white' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 20, marginBottom: 10, color: 'white' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#bd8aff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 5 },
  refreshButton: { backgroundColor: '#3a3a8a', padding: 15, borderRadius: 8, alignItems: 'center', marginVertical: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  card: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  text: { fontSize: 16 },
  emptyText: { color: '#bd8aff', fontStyle: 'italic' }
});