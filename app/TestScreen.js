import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import API_URL from '../components/mainURL';
import { GET_USERS , SAVE_USER  } from '../components/EndPoints';

export default function TestScreen() {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);

  const loadAllData = async () => {
    try {
      // 1. Fetch Users using the standardized method
      const usersData = await getRequest(GET_USERS);
      setUsers(usersData);

      // 2. Fetch Departments using the exact same method
      const deptData = await getRequest(GET_DEPARTMENTS);
      setDepartments(deptData);
    } catch (error) {
      console.error('Failed to load screen data', error);
    }
  };

  
  useEffect(() => {
    fetchUsers();
  }, []);

  // Save new user 
  const handleSave = async () => {
    if (!name || !email) {
      Alert.alert('Error', 'Please enter both Name and Email');
      return;
    }

    try {
      const response = await axios.post(`${API_URL}${SAVE_USER}`, {
        name: name,
        email: email,
      });

    
      if (response.status === 201 || response.status === 200) {
        Alert.alert('Success', 'Data saved to MS SQL');
        setName('');
        setEmail('');
        fetchUsers(); 
      }
    } catch (error) {
      Alert.alert('Error', 'Could not connect to backend');
      console.error('Axios error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Enter Details</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save to Database</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.refreshButton} onPress={fetchUsers}>
        <Text style={styles.buttonText}>Refresh Data</Text>
      </TouchableOpacity>

      <Text style={styles.subHeader}>Saved Users:</Text>
      <FlatList
        data={users}
        keyExtractor={(item) => item.Id.toString()}
        renderItem={({ item }) => (
          <View style={styles.userCard}>
            <Text style={styles.userText}>Name: {item.Name}</Text>
            <Text style={styles.userText}>Email: {item.Email}</Text>
          </View>
        )}
        ListEmptyComponent={<Text>No data found in database.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#20205f', marginTop: 40 },
  header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, color: 'white' },
  subHeader: { fontSize: 18, fontWeight: 'bold', marginTop: 30, marginBottom: 10, color: 'white' },
  input: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 15, borderWidth: 1, borderColor: '#ddd' },
  button: { backgroundColor: '#bd8aff', padding: 15, borderRadius: 8, alignItems: 'center' },
  refreshButton: { backgroundColor: '#bd8aff', padding: 15, borderRadius: 8, alignItems: 'center', marginTop: 10 },
  buttonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
  userCard: { backgroundColor: 'white', padding: 15, borderRadius: 8, marginBottom: 10, borderWidth: 1, borderColor: '#eee' },
  userText: { fontSize: 16 }
});