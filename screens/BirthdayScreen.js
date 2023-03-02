import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableHighlight, ImageBackground  } from 'react-native';
import React, { useState } from 'react'
import * as SQLite from 'expo-sqlite'

export default function BirthdayScreen({ navigation, route}) {

  const db = SQLite.openDatabase('Birthday_data.db')
  const { name, birthday_month, birthday_day, notes, id } = route.params;

  const deletePerson = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM birthday_data WHERE id = ?', [id])
    })
    navigation.navigate("HomeScreen")
  }

  return (
    <ImageBackground source={{uri: 'https://i.postimg.cc/cJ45GdKH/background1.png'}} style={styles.imageBackground}>
      <View style={styles.container}>
        <TouchableHighlight style={styles.backButton} onPress={() => navigation.navigate("HomeScreen")}>
          <Text style={styles.buttonText}>Go Back</Text>
        </TouchableHighlight>
          <View style={styles.allButBottomButton}>
            <View style={styles.placeholderImage}/>
            <Text style={styles.nameStyle}>{name}</Text>
            <View style={styles.monthday}>
              <Text style={styles.monthStyle}>Birthday: {birthday_month} / {birthday_day}</Text>
            </View>
            <View style={styles.notesContainer}>
              <Text style={{flex: 1, fontSize: 20, marginRight: 10}}>Notes: </Text>
              <Text style={{flex: 4, fontSize: 20}}>{notes.length == 0 ? 'No Notes' : notes}</Text>
            </View>    
        </View>
        <TouchableHighlight style={styles.deleteButton} underlayColor='#f00' onPress={() => {deletePerson(id)}}>
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableHighlight>
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
  notesContainer : {
    height: 200, 
    width: '100%',  
    textAlign: 'justify',
    width: 300,
    flexDirection: 'row'
  },
  monthStyle : {
    textAlign: 'center', 
    width: '100%',
    fontSize: 40,
  },
  monthday : {
    flexDirection: 'row',
    marginBottom: 20,
    height: 50,
    justifyContent: 'space-between',
  },
  nameStyle: {
    height: 50, 
    fontSize: 40,  
    textAlign: 'center', 
    width: 300,
    marginBottom: 20
  },
  backButton : {
    height: 50,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  deleteButton : {
    height: 50,
    width: '100%',
    backgroundColor: '#f00',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText : {
    color:'#fff',
    fontSize: 25,
  },
  allButBottomButton : {
    flex:1,
    alignItems: 'center'
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