import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
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
        <SafeAreaView style={styles.container}>  
        <Text>New Screen!</Text>
        <Text>{name}</Text>
        <Text>{birthday}</Text>
        <Text>{notes}</Text>
        <Text>{id}</Text>
        <Button title="press me" onPress={() => navigation.goBack()}/>
        <Button title="Delete entry" onPress={() => {deletePerson(id)}}/>
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