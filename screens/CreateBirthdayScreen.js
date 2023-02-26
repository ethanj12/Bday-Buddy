import { StyleSheet, Text, View, SafeAreaView, TextInput, Button} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import React, { useState } from 'react'

export default function CreateBirthdayScreen({ navigation, route  }) {

    const [name, setName] = useState('')
    const [notes, setNotes] = useState('')
    const [birthday, setDate] = useState(new Date());
    const [displaymode, setMode] = useState('date');
    const [isDisplayDate, setShow] = useState(false);
    const changeSelectedDate = (event, selectedDate) => {
    const currentDate = selectedDate || birthday;
    setDate(currentDate);
    };
    const showMode = (currentMode) => {
      isDisplayDate ?  setShow(false) : setShow(true);
      setMode(currentMode);
    };
    const displayDatepicker = () => {
      showMode('date');
    };

    const { people } = route.params;
    return (
        <SafeAreaView style={styles.container}>  
            <TextInput 
              placeholder='name'
              onChangeText={setName}/>
            <Button onPress={displayDatepicker} title="Show date picker!" />
            {isDisplayDate && (
                  <DateTimePicker
                     testID="dateTimePicker"
                     value={birthday}
                     mode={displaymode}
                     is24Hour={true}
                     display="spinner"
                     onChange={changeSelectedDate}
                  />
            )}
            <Text>{name}</Text>
            <TextInput
              placeholder='Notes for gifts'
              onChangeText={setNotes}
            />
            <Text>{String(birthday)}</Text>
            <Button title='Create' 
              onPress={() => navigation.goBack(
                          {name: name,
                          birthday: birthday})}/>
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