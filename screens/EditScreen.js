import { StyleSheet, Text, View, Image, TextInput, Alert, ImageBackground, TouchableWithoutFeedback, TouchableHighlight} from 'react-native';
import { Icon } from 'react-native-elements'
import * as SQLite from 'expo-sqlite'
import React, { useState } from 'react'
import * as ImagePicker from 'expo-image-picker';

//Index in array is the number of maximum days in that month.
const days_in_month = [0, 31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

export default function CreateBirthdayScreen({ navigation, route }) {

  const { name_input, month_input, day_input, notes_input, image_input, id_input } = route.params;
  const db = SQLite.openDatabase('Birthday_data.db')
  const [name, setName] = useState(name_input);
  const [month, setMonth] = useState(month_input);
  const [day, setDay] = useState(day_input);
  const [notes, setNotes] = useState(notes_input);
  const [image, setImage] = useState(image_input);

  if (image == '') {
    setImage('https://upload.wikimedia.org/wikipedia/commons/thumb/0/06/OOjs_UI_icon_add.svg/2048px-OOjs_UI_icon_add.svg.png');
  }
  console.log(id_input);
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  /* INPUTS: None
  *  OUTPUTS: True if the input to the name and month/day textinput are valid, false otherwise
  *  DESC: This is the error chekcing portion for the inputs of the create birthday screen. We want to check
  *  whether the user has input anything invalid, like numbers in the name field or put a month above 12 (not a
  *  valid month). If the user has input anything that does not fit the reuqirments, an alert shows to tell them to fix
  *  the inputs of the TextInput fields of this screen.
  */
  const errorCheck = () => {
    if (name.length == 0){
      Alert.alert('Invalid Name', 'Please enter name')
      return false;
    }
    if (/\d/.test(name)) {
      Alert.alert('Invalid Name', 'Please do not enter digits into the name field')
      return false;
    }
    if (month.length == 0 || Number(month) < 0 || Number(month) > 12) {
      Alert.alert('Please enter a valid month')
      return false;
    }
    if (day.length == 0 || Number(day) > days_in_month[Number(month)] || Number(day) < 0) {
      Alert.alert('Please enter a valid day')
      return false;
    }
    return true;
  }
  /* INPUTS: None
  *  OUTPUTS: None
  *  DESC: This function calls errorCheck(). If errorCheck() returns true, then this function executes sql to put the person entered
  *  into the text input fields of this screen into the database of the app. This allows us to pull the information to the home screen, create notifcations,
  *  and also edit/delete people in the future.
  */
  const updateName = () => {
    if(errorCheck()) {
        console.log("Updating")
      db.transaction(tx => {
        tx.executeSql("UPDATE birthday_data SET name = ?, birthday_month = ?, birthday_day = ?, notes = ?, imageURI = ? WHERE id = ?", [name, month, day, notes, image, id_input])
      });
      navigation.navigate("HomeScreen");
    }
  }

  return (
  <ImageBackground source={{uri: 'https://i.postimg.cc/cJ45GdKH/background1.png'}} style={styles.imageBackground}>
    <View style={styles.container}>
      <View style={styles.backButton}>
          <Icon type ='ionicon' name="arrow-back-outline" color="#fff" size={40} style={{marginLeft: 10, marginRight: 20}} onPress={() => {
            updateName();
            navigation.navigate("HomeScreen")}}/>
      </View>
      <View style={styles.allButBottomButton}>
        <TouchableWithoutFeedback onPress={() => pickImage()}>
          <View>
            {image && <Image source={{ uri: image }} style={styles.placeholderImage} />}
          </View>
        </TouchableWithoutFeedback>
        <TextInput 
          placeholder='Name'
          style={styles.nameInput}
          onChangeText={setName}
          value={name}/>
        <View style={styles.monthdayInput}>
          <TextInput 
            placeholder='Month'
            onChangeText={setMonth}
            value={month}
            style={styles.monthInput}
            keyboardType='numeric'
            returnKeyType='done'/>
          <Text style={{fontSize:40, color:'#fff', alignSelf: 'center'}}> / </Text>
          <TextInput 
            placeholder='Day'
            onChangeText={setDay}
            value={day}
            style={styles.dayInput}
            keyboardType='numeric'
            returnKeyType='done'/>
          </View>
        <TextInput
          placeholder='Notes for gifts'
          multiline
          style={styles.notesInput}
          onChangeText={setNotes}
          value={notes}
        /> 
        </View>
      <TouchableHighlight style={styles.createButton} underlayColor='rgba(37, 84, 10, 1)' onPress={() => {updateName()}}>
        <Text style={styles.buttonText}>Finish Edit</Text>
      </TouchableHighlight>
    </View>
  </ImageBackground>
  );
}

const styles = StyleSheet.create({
  allButBottomButton : {
    flex:1,
    alignItems: 'center'
  },
  notesInput : {
    height: 90, 
    width: '100%', 
    backgroundColor:'#fff', 
    textAlign: 'justify',
    width: 300
  },
  imageBackground: {
    width: '100%',
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  nameInput: {
    height: 50, 
    fontSize: 24, 
    backgroundColor:'#fff', 
    textAlign: 'center', 
    width: 300,
    marginBottom: 20
  },
  monthdayInput: {
    flexDirection: 'row',
    marginBottom: 20,
    height: 50,
    width: 300,
    justifyContent: 'space-between',
  },
  monthInput: {
    backgroundColor: '#fff',
    textAlign: 'center', 
    width: '45%',
    fontSize: 24,
  },
  dayInput: {
    backgroundColor: '#fff',
    textAlign: 'center', 
    width: '45%',
    fontSize: 24,
  },  
  goBackButton : {
    height: 50,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  createButton : {
    height: 50,
    width: '100%',
    backgroundColor: 'rgba(37, 84, 10, 1)',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText : {
    color:'#fff',
    fontSize: 25,
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
    backgroundColor: '#555',
    marginBottom: 20,
    borderRadius: 3,
    borderColor: '#000',
    borderWidth: 3,
  },
  backButton : {
    height: 50,
    width: '100%',
    backgroundColor: '#000',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
});