import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert, ImageBackground, TouchableOpacity, TouchableHighlight} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite'
import React, { useState } from 'react'

//Index in array is the number of maximum days in that month.
const days_in_month = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function CreateBirthdayScreen({ navigation, route }) {
    const db = SQLite.openDatabase('Birthday_data.db')
    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');

  const errorCheck = () => {
    if (name.length == 0){
      Alert.alert('Invalid Name', 'Please enter name')
      return false;
    }
    if (/\d/.test(name)) {
      Alert.alert('Invalid Name', 'Please do not enter digits into the name field')
      return false;
    }
    if (month.length == 0 || Number(month) < 0 || Number(month) > 12) {
      Alert.alert('Please enter a valid month')
      return false;
    }
    if (day.length == 0 || Number(day) > days_in_month[Number(month)] || Number(day) < 0) {
      Alert.alert('Please enter a valid day')
      return false;
    }
    return true;
  }
  const addName = () => {
    if(errorCheck()) {
      db.transaction(tx => {
            tx.executeSql('INSERT INTO birthday_data ( name, birthday_month, birthday_day, notes ) VALUES (?,?,?,?)', [name, month, day, notes])
          });
          navigation.navigate("HomeScreen");
    }
  }
    return (
        <ImageBackground source={{uri: 'https://i.postimg.cc/cJ45GdKH/background1.png'}} style={styles.imageBackground}>
          <View style={styles.container}>
            {/* <View style={styles.innerPlacard}> */}
              <TouchableHighlight style={styles.goBackButton} onPress={() => navigation.navigate("HomeScreen")}>
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableHighlight>
              <View style={styles.allButBottomButton}>
                <View style={styles.placeholderImage}/>
                    <TextInput 
                    placeholder='Name'
                    style={styles.nameInput}
                    onChangeText={setName}/>
                    <View style={styles.monthdayInput}>
                      <TextInput 
                        placeholder='Month'
                        onChangeText={setMonth}
                        style={styles.monthInput}
                        keyboardType='numeric'
                        returnKeyType='done'/>
                      <Text style={{fontSize:40, color:'#fff', alignSelf: 'center'}}> / </Text>
                      <TextInput 
                        placeholder='Day'
                        onChangeText={setDay}
                        style={styles.dayInput}
                        keyboardType='numeric'
                        returnKeyType='done'/>
                    </View>
                    <TextInput
                      placeholder='Notes for gifts'
                      multiline
                      style={styles.notesInput}
                      onChangeText={setNotes}
                    /> 
                </View>
              <TouchableHighlight style={styles.createButton} underlayColor='rgba(37, 84, 10, 1)' onPress={() => {addName()}}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableHighlight>
            {/* </View>    */}
          </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  allButBottomButton : {
    flex:1,
    alignItems: 'center'
  },
  notesInput : {
    height: 90, 
    width: '100%', 
    backgroundColor:'#fff', 
    textAlign: 'justify',
    width: 300
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameInput: {
    height: 50, 
    fontSize: 24, 
    backgroundColor:'#fff', 
    textAlign: 'center', 
    width: 300,
    marginBottom: 20
  },
  monthdayInput: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 50,
    width: 300,
    justifyContent: 'space-between',
  },
  monthInput: {
    backgroundColor: '#fff',
    textAlign: 'center', 
    width: '45%',
    fontSize: 24,
  },
  dayInput: {
    backgroundColor: '#fff',
    textAlign: 'center', 
    width: '45%',
    fontSize: 24,
  },  
  goBackButton : {
    height: 50,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  createButton : {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(37, 84, 10, 1)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText : {
    color:'#fff',
    fontSize: 25,
  },
  container: {
    flex: 1,
    marginTop: '15%',
    marginBottom: '40%',
    width: '95%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderImage : {
    height: 250,
    width: 250,
    backgroundColor: '#000',
    marginBottom: 20
  }
});