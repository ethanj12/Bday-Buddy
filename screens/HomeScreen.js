import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useIsFocused } from '@react-navigation/native';
// import SQLite from "react-native-sqlite-storage"


// const db = SQLite.openDatabase(
//   {
//     name: 'Main Database',
//     location: 'default'
//   },
//   () => {},
//   error => {console.log(error)}
// );

export default function HomeScreen({ navigation, route }) {

  // useEffect(() => {
  //   createTable
  // }, []);

  const [name, setName] = useState("")
  const [people, setPeople] = useState([
  //   // {name: 'yoshi', birthday: '01-01', key: '1'},
  //   // {name: 'mario', birthday: '01-01', key: '2'},
  //   // {name: 'luigi', birthday: '01-01', key: '3'},
  //   // {name: 'peach', birthday: '01-01', key: '4'},
  //   // {name: 'ethan', birthday: '01-01', key: '5'},
  //   // {name: 'hari', birthday: '01-01', key: '6'},
  //   // {name: 'palver', birthday: '01-01', key: '7'}
  ])

  
  // const getData = async() => {
  
  // }

  return (
    <SafeAreaView style={styles.container}>  
      <Button title="Create" onPress={() => navigation.navigate("CreateBirthdayScreen", {people})}/>
      <Text>{name}</Text>
      <ScrollView>
        { people.map((item) => {
          return (
          <TouchableOpacity  key={item.key} style={styles.item} 
          onPress={() => navigation.navigate("BirthdayScreen", 
          {name: item.name,
          birthday: item.birthday})}>
            <Text style={{flex: 7, fontSize:35}}>{item.name}</Text>
            <Text style={{fontSize:35}}>{item.birthday}</Text>
          </TouchableOpacity >
          ) 
        })}
      </ScrollView>
      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button : {
    color: "#000"
  },
  item : {
    width: 400,
    marginTop: 5,
    padding: 20,
    backgroundColor: 'pink',
    fontSize: 24,
    flexDirection: 'row'
  }
});
