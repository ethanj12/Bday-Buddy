import { StyleSheet, Text, View, SafeAreaView, TextInput, Button, Alert, ImageBackground, TouchableOpacity} from 'react-native';
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
        // <SafeAreaView style={styles.container}>  
        //     <TextInput 
        //       placeholder='name'
        //       onChangeText={setName}/>
        //     <Button onPress={displayDatepicker} title="Show date picker!" />
        //     {isDisplayDate && (
        //           <DateTimePicker
        //              testID="dateTimePicker"
        //              value={mydate}
        //              mode={displaymode}
        //              is24Hour={true}
        //              display="spinner"
        //              onChange={(evt, selectedDate) => {
        //               setDate(selectedDate);
        //               setBirthday(`${selectedDate.getMonth() + 1}-${selectedDate.getDate()}`);
        //             }}
        //           />
        //     )} 
        //     <Text>{name}</Text>
        //     <Text>{birthday}</Text>
        //     <TextInput
        //       placeholder='Notes for gifts'
        //       onChangeText={setNotes}
        //     />
        //     <Button title='Create' 
        //       onPress={() => {addName()}}
        //     />
        // </SafeAreaView>
        <ImageBackground source={{uri: 'https://i.pinimg.com/236x/99/d9/54/99d954303bc7de063b545cd1ad3f34d3.jpg'}} style={styles.imageBackground}>
          <View style={styles.container}>
            <View style={styles.innerPlacard}>
              <View style={styles.allButBottomButton}>
                <View style={styles.placeholderImage}/>
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
                    <TextInput
                      placeholder='Notes for gifts'
                      onChangeText={setNotes}
                    /> 
                </View>
              <TouchableOpacity style={styles.button} onPress={() => {addName()}}>
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
  button : {
    color: "#fff",
    height: 50,
    width: '100%',
    backgroundColor: '#000',
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
    paddingTop: '10%',
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