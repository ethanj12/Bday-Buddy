import { ImageBackground, StyleSheet, Text, View, ScrollView, StatusBar, TouchableHighlight, TextInput } from 'react-native';
import { Icon } from 'react-native-elements'
import React, { useState, useEffect, useRef } from 'react'
import { useFocusEffect  } from '@react-navigation/native';
import * as SQLite from 'expo-sqlite'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import * as Application from 'expo-application';

/* INPUTS: NONE
  *  OUTPUTS:  NONE
  *  DESC: Sets up the notification handler with all of the valid options. Changing these fields will change how notifications are presented on the device.
  */
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
  const [search, setSearch] = useState('');
  const notificationListener = useRef();
  const responseListener = useRef();

  /* 
  *  DESC: THis for loops checks if we have already created a notification for this person's birthday. We loop over each person,
  *  and if no notifcation has been set, then calls the schedulePushNotification() function
  */
  for(let i = 0; i < people.length; i++) {
    db.transaction(tx => {
      tx.executeSql(
        "SELECT * FROM birthday_data WHERE id = ?",
        [people[i].id],
        (txObj, resultSet) => {
          resultSet.rows._array[0].hasNotification == 0 ? schedulePushNotification(expoPushToken, resultSet.rows._array[0], db) : null
        },
        (txObj, error) => console.log(error)
      )
    });
  };

  /* INPUTS: None
  *  OUTPUTS: None
  *  DESC: Executes a SQL query to create the database table if there was not one found. This should only be the case for the first time that the user
  *  opens the app. After this, this code should not execute because the database will already have been created.
  */
  const createTable = () => {
    db.transaction(tx => {
      tx.executeSql(
        'CREATE TABLE IF NOT EXISTS birthday_data (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, birthday_month TEXT, birthday_day TEXT, notes TEXT, hasNotification INTEGER, imageURI TEXT)'
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
  }, [people]);

  useFocusEffect(() => { //This might be running SQL every render. Def not best use of resources 0_0
    db.transaction(tx => {
      tx.executeSql(
        "SELECT *, " +
          "CASE  WHEN CAST(birthday_month AS INTEGER) > curr_month THEN  3 " +
                "WHEN CAST(birthday_month AS INTEGER) < curr_month THEN  4 " +
                "WHEN CAST(birthday_month AS INTEGER) = curr_month AND CAST(birthday_day AS INTEGER) = curr_day THEN 1 " +
                "WHEN CAST(birthday_month AS INTEGER) = curr_month AND CAST(birthday_day AS INTEGER) > curr_day THEN 2 " +
                "WHEN CAST(birthday_month AS INTEGER) = curr_month AND CAST(birthday_day AS INTEGER) < curr_day THEN 5 " +
                "ELSE 0 " +
                "END AS month_has_past " +
          "FROM (SELECT *, " +
               "CAST(strftime(\'%m\', DATE(\'now\')) AS INTEGER) AS curr_month, " +
               "CAST(strftime(\'%d\', DATE(\'now\')) AS INTEGER) AS curr_day "  +
               "FROM birthday_data)  " +
               "WHERE name LIKE '%' || ? || '%' " +
          "ORDER BY month_has_past, CAST(birthday_month AS INTEGER), CAST(birthday_day AS INTEGER)",
        [search],
        (txObj, resultSet) => setPeople(resultSet.rows._array),
        (txObj, error) => console.log(error)
      )
    })
  });

  const showScrollNames = () => {
    return people.map((item) => {
      return (
        <TouchableHighlight  key={String(item.id)} style={styles.item} 
          onPress={() => navigation.navigate("BirthdayScreen", 
          {name: item.name,
          birthday_month: item.birthday_month,
          birthday_day: item.birthday_day,
          notes: item.notes,
          id: item.id,
          image: item.imageURI})}
          underlayColor={'rgba(0, 0, 0, 0)'}>
            <View style={{flexDirection: 'row', alignContent: 'space-between'}}>
              <Text style={{fontSize:35, width:'65%'}}>{item.name}</Text>
              <Text style={{fontSize:35, width:'35%'}}>{item.birthday_month} / {item.birthday_day}</Text>
            </View>
        </TouchableHighlight >
      ) 
    })
  }
  return (
    <ImageBackground source={{uri: 'https://i.postimg.cc/cJ45GdKH/background1.png'}} style={styles.imageBackground}>
      <View style={styles.container}> 
        <View style={styles.searchBarView}>
          <Icon name="search" style={{marginLeft: 20, marginRight: 20}}/>
          <TextInput placeholder='Search' style={styles.searchBar} onChangeText={setSearch}/>
        </View>
        <ScrollView style={styles.scrollView}>
          {showScrollNames()}
        </ScrollView>
        <StatusBar style="auto" />
        <TouchableHighlight style={styles.button} onPress={() => navigation.navigate("CreateBirthdayScreen",
          {name_input: '',
            month_input: '',
            day_input: '',
            notes_input: '',
            image_input: ''})}>
          <Text style={styles.buttonText}>Add Birthday</Text>
        </TouchableHighlight>
      </View>
    </ImageBackground>
        
  );
}

/* INPUTS:  The valid expo push token used to authorize notifications, the person to scheudle the notification for (as a dict), and the database we use
  *  OUTPUTS:None
  *  DESC: This function takes in a person to create a notification for.  It creates a date based off of the birthday_month and birthday_day in the database
  *  and from there creates a date object to pass to the notification handler. If the date has already passed this year, then a year is added to the 
  *  date and the notification is scheduled for next year. Then the database is updated when a notification was successfuly scheduled.
  */
async function schedulePushNotification(expoPushToken, person, db) {
  const year = new Date().getFullYear();
  let birthday_date = new Date(year, person.birthday_month - 1, person.birthday_day);
  const curr_date = new Date();
  if (birthday_date < curr_date) {
    birthday_date.setFullYear(year + 1);
  }
  birthday_date = birthday_date.getTime() + 10800000; //Time defaults to 5 am when make date. Don't know why, but must add 3 hours of ms for noti at 8am

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "You've got mail! 📬",
      body: 'Here is the notification body' + birthday_date,
      data: { data: expoPushToken },
      sound: 'default'
    },
    trigger: { date : birthday_date }
  }).then(
    db.transaction(tx => {
      tx.executeSql(
        "UPDATE birthday_data SET hasNotification = 1 WHERE id = ?",
        [person.id],
        (txObj, resultSet) => null,
        (txObj, error) => console.log(error)
      )
    })
  );
}

/* INPUTS: None
  *  OUTPUTS: None
  *  DESC: Handles a lot of the nitty gritty of notication permissions. Detects the type of device used by the user and then gets the valid
  *  persmissions and tokens needed in order to sent the user notifcations
  */
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
    borderWidth: 2,
    flexDirection: 'row',
    alignItems: 'center' 
  },
  searchBar: {
    height: '100%',
    width: '80%',
    fontSize: 24,
    textAlign: 'center',
    textAlign: 'left'
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
