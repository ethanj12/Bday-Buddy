import { StyleSheet, Text, View, SafeAreaView, Image, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
import React, { useState } from 'react'

export default function BirthdayScreen({ navigation, route}) {

    const { name, birthday } = route.params;
    return (
        <SafeAreaView style={styles.container}>  
        <Text>New Screen!</Text>
        <Text>{name}</Text>
        <Text>{birthday}</Text>
        <Button title="press me" onPress={() => navigation.goBack()}/>
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