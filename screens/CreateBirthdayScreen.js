import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert, ImageBackground, TouchableOpacity} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite'
import React, { useState } from 'react'


export default function CreateBirthdayScreen({ navigation, route }) {
    const db = SQLite.openDatabase('Birthday_data.db')

    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [month, setMonth] = useState('');
    const [day, setDay] = useState('');
    const [isDisplayDate, setShow] = useState(false);
    const [displaymode, setMode] = useState('date');

    const showMode = (currentMode) => {
      isDisplayDate ?  setShow(false) : setShow(true);
      setMode(displaymode);
    };
    const displayDatepicker = () => {
      showMode('date');
    };


  const errorCheck = () => {
    if (name.length == 0){
      Alert.alert('Invalid Name', 'Please enter name')
      return false;
    }
    if (/\d/.test(name)) {
      Alert.alert('Invalid Name', 'Please do not enter digits into the name field')
      return false;
    }
    if (month.length == 0) {
      Alert.alert('Invalid Birthday', 'Please enter a birthday')
      return false;
    }
    if (day.length == 0) {
      Alert.alert('Invalid Birthday', 'Please enter a birthday')
      return false;
    }
    return true;
  }
  const addName = () => {
    console.log(typeof(name) + typeof(month)  + typeof(day)  + typeof(notes))
    if(errorCheck()) {
      db.transaction(tx => {
            tx.executeSql('INSERT INTO birthday_data ( name, birthday_month, birthday_day, notes ) VALUES (?,?,?,?)', [name, month, day, notes])
          });
          navigation.navigate("HomeScreen");
    }
  }
    return (
        <ImageBackground source={{uri: 'https://i.pinimg.com/236x/99/d9/54/99d954303bc7de063b545cd1ad3f34d3.jpg'}} style={styles.imageBackground}>
          <View style={styles.container}>
            <View style={styles.innerPlacard}>
              <TouchableOpacity style={styles.goBackButton} onPress={() => navigation.navigate("HomeScreen")}>
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
              <View style={styles.allButBottomButton}>
                <View style={styles.placeholderImage}/>
                    <TextInput 
                    placeholder='Name'
                    style={{height: 50, fontSize: 24, backgroundColor:'#fff', textAlign: 'center', width:250}}
                    onChangeText={setName}/>
                    <View>
                      <TextInput 
                        placeholder='Month'
                        onChangeText={setMonth}
                        keyboardType='numeric'
                        returnKeyType='done'/>
                      <TextInput 
                        placeholder='Day'
                        onChangeText={setDay}
                        keyboardType='numeric'
                        returnKeyType='done'/>
                    </View>
                    {/* <Button onPress={displayDatepicker} title="Show date picker!" />
                    {isDisplayDate && (
                        <DateTimePicker
                          testID="dateTimePicker"
                          value={mydate}
                          mode={displaymode}
                          is24Hour={true}
                          display="spinner"
                          onChange={(evt, selectedDate) => {
                            setDate(selectedDate);
                            setBirthday(`${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`);
                          }}
                        />
                    )} */}
                    <TextInput
                      placeholder='Notes for gifts'
                      style={{height: 90, width: 250, backgroundColor:'#fff', textAlign: 'center'}}
                      onChangeText={setNotes}
                    /> 
                </View>
              <TouchableOpacity style={styles.createButton} onPress={() => {addName()}}>
                <Text style={styles.buttonText}>Create</Text>
              </TouchableOpacity>
            </View>   
          </View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
  allButBottomButton : {
    flex:1,
    alignItems: 'center'
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
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
  innerPlacard : {
    backgroundColor: "#555",
    height: '80%',
    width: "80%",
    borderRadius: 10,
    alignItems: 'center'
  },
  container: {
    flex: 1,
    marginTop: '30%',
    marginBottom: '20%',
    paddingTop: 10,
    width: '95%',
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  placeholderImage : {
    height: 250,
    width: 250,
    backgroundColor: '#000'
  }
});