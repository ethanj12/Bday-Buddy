import { StyleSheet, Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
// import SQLite from "react-native-sqlite-storage"

import React, { useState } from 'react'

// const db = SQLite.openDatabase(
//   {
//     name: 'Main Database',
//     location: 'default'
//   },
//   () => {},
//   error => {console.log(error)}
// );

export default function CreateBirthdayScreen({ navigation, route }) {

    const [name, setName] = useState('');
    const [notes, setNotes] = useState('');
    const [currId, setCurrId] = useState('0');
    const [birthday, setDate] = useState(new Date());
    const [displaymode, setMode] = useState('date');
    const [isDisplayDate, setShow] = useState(false);


    const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setDate(currentDate);
    };
    const showMode = (currentMode) => {
      isDisplayDate ?  setShow(false) : setShow(true);
      setMode(currentMode);
    };
    const displayDatepicker = () => {
      showMode('date');
    };

  // const createTable=() => {
  //   db.transaction((tx) => {
  //     tx.executeSql(
  //       "CREATE TABLE IF NOT EXIST "
  //       +"Birthdays "
  //       +"(ID INTEGER PRIMARY KEY AUTOINCREMENT, Name TEXT, Birthday TEXT, Notes TEXT)"
  //     )
  //   })
  // }

  // const setData = async () => {
  //   try {
  //     await db.transaction(async (tx) => {
  //       await tx.executeSql (
  //         "INSERT INTO Birthdays (Name, Birthday, Notes) VALUES (?,?,?)",
  //         [name, birthday, notes]
  //       );
  //     })
  //     navigation.navigate("HomeScreen", merge=true)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

    return (
        <SafeAreaView style={styles.container}>  
            <TextInput 
              placeholder='name'
              onChangeText={setName}/>
            <Button onPress={displayDatepicker} title="Show date picker!" />
            {isDisplayDate && (
                  <DateTimePicker
                     testID="dateTimePicker"
                     value={birthday}
                     mode={displaymode}
                     is24Hour={true}
                     display="spinner"
                     onChange={changeSelectedDate}
                  />
            )}
            <Text>{name}</Text>
            <TextInput
              placeholder='Notes for gifts'
              onChangeText={setNotes}
            />
            <Button title='Create' 
              onPress={setBirthdayData()}
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