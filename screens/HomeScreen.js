import { ImageBackground, StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect } from 'react'
import { useFocusEffect  } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'



export default function HomeScreen({ navigation, route }) {
  const db = SQLite.openDatabase('Birthday.db')
  const [name, setName] = useState("");
  const [people, setPeople] = useState([""]);
  useEffect(() => {
    db.transaction(tx => {
        tx.executeSql(
          'CREATE TABLE IF NOT EXISTS birthdays (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday TEXT, notes TEXT)'
        )
      });

      db.transaction(tx => {
        tx.executeSql('SELECT * FROM birthdays', null,
          (txObj, resultSet) => setPeople(resultSet.rows._array),
          (txObj, error) => console.log(error)
        );
    })
  }, []);
  useFocusEffect(() => { //This might be running SQL every render. Def not best use of resources 0_0
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM birthdays', null,
        (txObj, resultSet) => setPeople(resultSet.rows._array),
        (txObj, error) => console.log(error)
      )
    })
  });

  const showScrollNames = () => {
    return people.map((item) => {
      return (
      <TouchableOpacity  key={item.id} style={styles.item} 
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
    <View>
      <ImageBackground source={{uri: 'https://i.pinimg.com/236x/99/d9/54/99d954303bc7de063b545cd1ad3f34d3.jpg'}} resizeMode="cover" style={styles.container}>
        <SafeAreaView style={styles.container}>
        
          <Button title="Create" onPress={() => navigation.navigate("CreateBirthdayScreen")}/>
          <Text>{name}</Text>
          <ScrollView>
            {showScrollNames()}
          </ScrollView>
          <StatusBar style="auto" />
          
        </SafeAreaView>
      </ImageBackground>
    </View>   
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    // backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button : {
    color: "#000"
  },
  item : {
    width: 100,
    marginTop: 5,
    padding: 20,
    backgroundColor: 'pink',
    fontSize: 24,
    flexDirection: 'row'
  }
});
