import { ImageBackground, StyleSheet, Text, View, ScrollView, StatusBar, Button, TouchableOpacity  } from 'react-native';
import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect  } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default function HomeScreen({ navigation, route }) {

  const db = SQLite.openDatabase('Birthday_data.db')
  const [people, setPeople] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();

  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS birthday_data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday_month TEXT, birthday_day TEXT, notes TEXT)'
      )})
    }; 

  useEffect(() => {
    createTable();
    registerForPushNotificationsAsync(Application.applicationId).then((token) =>
      setExpoPushToken(token)
    );
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        
      });

    return () => {
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  useFocusEffect(() => { //This might be running SQL every render. Def not best use of resources 0_0
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM birthday_data', null,
        (txObj, resultSet) => setPeople(resultSet.rows._array),
        (txObj, error) => console.log(error)
      )
    })
  });

  const showScrollNames = () => {
    return people.map((item) => {
      // console.log(item.month)
      return (
      <TouchableOpacity  key={String(item.id)} style={styles.item} 
      onPress={() => navigation.navigate("BirthdayScreen", 
      {name: item.name,
      birthday_month: item.month,
      birthday_day: item.day,
      notes: item.notes,
      id: item.id})}>
        <Text style={{flex: 2, fontSize:35}}>{item.name}</Text>
        <Text style={{fontSize:35, backgroundColor:'#000', flex:1, color: '#fff'}}>{item.birthday_month} / {item.birthday_day}</Text>
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
        <Button title="Schedule" onPress={() => {schedulePushNotification()}}/>
      </View>
    </ImageBackground>
        
  );
}


async function schedulePushNotification(expoPushToken) {
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body' + {expoPushToken},
      data: { data: 'goes here' },
      sound: 'default'
    },
    trigger: { seconds: 10 },
  });
}

async function registerForPushNotificationsAsync() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
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
