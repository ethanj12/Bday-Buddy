import { ImageBackground, StyleSheet, Text, View, ScrollView, StatusBar, Button, TouchableOpacity, TouchableHighlight, TextInput  } from 'react-native';
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
  const db = SQLite.openDatabase('Birthday_data.db');
  const [people, setPeople] = useState([]);
  const [expoPushToken, setExpoPushToken] = useState("");
  const [notification, setNotification] = useState(false);
  const [hasUpdated, setHasUpdated] = useState(false);
  const [search, setSearch] = useState('')
  const notificationListener = useRef();
  const responseListener = useRef();


  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS birthday_data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday_month TEXT, birthday_day TEXT, notes TEXT)'
      )}
    )
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
      tx.executeSql(
        "SELECT *, " +
          "CASE WHEN CAST(birthday_month AS INTEGER) >= curr_month " +
            "THEN 1 " +
            "ELSE 0 " +
            "END AS month_has_past ," +
          "CASE WHEN CAST(birthday_day AS INTEGER) >= curr_day " +
            "THEN 1 " +
            "ELSE 0 " +
            "END AS day_has_past " +
          "FROM (SELECT *, " +
                "CAST(strftime(\'%m\', DATE(\'now\')) AS INTEGER) AS curr_month, " +
                "CAST(strftime(\'%d\', DATE(\'now\')) AS INTEGER) AS curr_day " +
                "FROM birthday_data) " +
          "WHERE name LIKE '%' || ? || '%' " +
          "ORDER BY month_has_past DESC, day_has_past DESC, CAST(birthday_month AS INTEGER), CAST(birthday_day AS INTEGER)",
        [search],
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
          birthday_month: item.birthday_month,
          birthday_day: item.birthday_day,
          notes: item.notes,
          id: item.id})}>
            <Text style={{flex: 1, fontSize:35}}>{item.name}</Text>
            <Text style={{fontSize:35}}>{item.birthday_month} / {item.birthday_day}</Text>
        </TouchableOpacity >
      ) 
    })
  }
  return (
    <ImageBackground source={{uri: 'https://i.postimg.cc/cJ45GdKH/background1.png'}} style={styles.imageBackground}>
      <View style={styles.container}> 
        <Button title="Schedule" onPress={() => {schedulePushNotification()}}/>
        <View style={styles.searchBarView}>
          <TextInput placeholder='Search' style={styles.searchBar} onChangeText={setSearch}/>
        </View>
        <ScrollView style={styles.scrollView}>
          {showScrollNames()}
        </ScrollView>
        <StatusBar style="auto" />
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("CreateBirthdayScreen")}>
          <Text style={styles.buttonText}>Add Birthday</Text>
        </TouchableHighlight>
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
  searchBarView: {
    backgroundColor: "#fff",
    height: 50,
    borderRadius: 50,
    width: '95%',
    marginBottom: 10,
    borderColor: '#000',
    borderWidth: 2
  },
  searchBar: {
    height: '100%',
    fontSize: 24,
    textAlign: 'center'
  },
  container: {
    flex: 1,
    marginTop: '15%',
    marginBottom: '10%',
    paddingTop: 10,
    width: '95%',
    opacity: 0.9,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  button : {
    color: "#fff",
    height: 100,
    width: '95%',
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
    paddingBottom: 10
  },
  item : {
    width: '95%',
    marginTop: 4,
    marginBottom: 4,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    fontSize: 24,
    flexDirection: 'row',
    alignSelf: 'center',
    borderColor: '#000',
    borderWidth: 2
  }
});
