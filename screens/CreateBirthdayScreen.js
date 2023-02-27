import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as SQLite from 'expo-sqlite'


import React, { useState } from 'react'

export default function CreateBirthdayScreen({ navigation, route }) {
    const db = SQLite.openDatabase('Birthday.db')

    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [mydate, setDate] = useState(new Date());
    const [birthday, setBirthday] = useState('')
    const [isDisplayDate, setShow] = useState(false);
    const [displaymode, setMode] = useState('date');

    const showMode = (currentMode) => {
      isDisplayDate ?  setShow(false) : setShow(true);
      setMode(displaymode);
    };
    const displayDatepicker = () => {
      showMode('date');
    };

  const addName = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO birthdays (name, birthday, notes) VALUES (?,?,?)', [name, birthday, notes])
    });
    navigation.navigate("HomeScreen");
  }

    return (
        <SafeAreaView style={styles.container}>  
            <TextInput 
              placeholder='name'
              onChangeText={setName}/>
            <Button onPress={displayDatepicker} title="Show date picker!" />
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
            )} 
            <Text>{name}</Text>
            <Text>{birthday}</Text>
            <TextInput
              placeholder='Notes for gifts'
              onChangeText={setNotes}
            />
            <Button title='Create' 
              onPress={() => {addName()}}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    color:"#fff",
    justifyContent: 'center'
  },

});