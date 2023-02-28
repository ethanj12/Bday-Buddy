import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableOpacity, ImageBackground  } from 'react-native';
import React, { useState } from 'react'
import * as SQLite from 'expo-sqlite'

export default function BirthdayScreen({ navigation, route}) {

    const db = SQLite.openDatabase('Birthday.db')
    const { name, birthday, notes, id } = route.params;

  const deletePerson = (id) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM birthdays WHERE id = ?', [id])
    })
    navigation.navigate("HomeScreen")
  }

    return (
        // <SafeAreaView style={styles.container}>  
        // <Text>New Screen!</Text>
        
        // <Button title="press me" onPress={() => navigation.goBack()}/>
        // <Button title="Delete entry" onPress={() => {deletePerson(id)}}/>
        // </SafeAreaView>
        <ImageBackground source={{uri: 'https://i.pinimg.com/236x/99/d9/54/99d954303bc7de063b545cd1ad3f34d3.jpg'}} style={styles.imageBackground}>
          <View style={styles.container}>
            <View style={styles.innerPlacard}>
              <View style={styles.allButBottomButton}>
                <View style={styles.placeholderImage}/>
                <Text style={{fontSize: 40, paddingTop:10}}>{name}</Text>
                <Text style={{fontSize: 40, paddingTop:5}}>{birthday}</Text>
                <Text style={{fontSize: 20, paddingTop:5}}>{notes}</Text>
                <Text>{id}</Text>
              </View>
              <Button title="Delete entry" onPress={() => {deletePerson(id)}}/>
              <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("HomeScreen")}>
                <Text style={styles.buttonText}>Go Back</Text>
              </TouchableOpacity>
              </View>
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
  allButBottomButton : {
    flex:1,
    alignItems: 'center'
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