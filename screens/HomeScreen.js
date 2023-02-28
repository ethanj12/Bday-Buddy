import { ImageBackground, StyleSheet, Text, View, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useFocusEffect  } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'



export default function HomeScreen({ navigation, route }) {
  const db = SQLite.openDatabase('Birthday.db')
  const [people, setPeople] = useState([""]);
  useEffect(() => {
    db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS birthdays (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday TEXT, notes TEXT)'
        )
      });

    //   db.transaction(tx => {
    //     tx.executeSql('SELECT * FROM birthdays', null,
    //       (txObj, resultSet) => setPeople(resultSet.rows._array),
    //       (txObj, error) => console.log(error)
    //     );
    // })
  }, []);
  useFocusEffect(() => { //This might be running SQL every render. Def not best use of resources 0_0
      db.transaction(tx => {
      tx.executeSql('SELECT * FROM birthdays ORDER BY birthday', null,
        (txObj, resultSet) => setPeople(resultSet.rows._array),
        (txObj, error) => console.log(error)
      )
    })
  });

  const showScrollNames = () => {
    return people.map((item) => {
      return (
      <TouchableOpacity  key={String(item.id)} style={styles.item} 
      onPress={() => navigation.navigate("BirthdayScreen", 
      {name: item.name,
      birthday: item.birthday,
      notes: item.notes,
      id: item.id})}>
        <Text style={{flex: 7, fontSize:35}}>{item.name}</Text>
        <Text style={{fontSize:35}}>{item.birthday}</Text>
      </TouchableOpacity >
      ) 
    })
  }

  return (
    <ImageBackground source={{uri: 'https://i.pinimg.com/236x/99/d9/54/99d954303bc7de063b545cd1ad3f34d3.jpg'}} style={styles.imageBackground}>
      <View style={styles.container}>
        {/* <Button title="Create" style={styles.button} onPress={() => navigation.navigate("CreateBirthdayScreen")}/> */}
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("CreateBirthdayScreen")}>
          <Text style={styles.buttonText}>Add Birthday</Text>
        </TouchableOpacity>
        <ScrollView style={styles.scrollView}>
          {showScrollNames()}
        </ScrollView>
        <StatusBar style="auto" />
      </View>
    </ImageBackground>
        
  );
}

const styles = StyleSheet.create({
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  container: {
    flex: 1,
    marginTop: '15%',
    marginBottom: '10%',
    paddingTop: 10,
    width: '95%',
    backgroundColor: '#fff',
    opacity: 0.9,
    borderRadius: 10,
    flexDirection: 'column-reverse',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button : {
    color: "#fff",
    height: 100,
    width: '100%',
    backgroundColor: '#000',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText : {
    color:'#fff',
    fontSize: 50,
  },
  scrollView: {
    flex: 1,
    width: '100%',
  },
  item : {
    width: '95%',
    marginTop: 8,
    padding: 20,
    backgroundColor: 'pink',
    fontSize: 24,
    flexDirection: 'row',
    alignSelf: 'center'
  }
});
