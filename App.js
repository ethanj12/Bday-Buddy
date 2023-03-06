import HomeScreen from "./screens/HomeScreen";
import BirthdayScreen from "./screens/BirthdayScreen";
import CreateBirthdayScreen from "./screens/CreateBirthdayScreen";
import EditScreen from "./screens/EditScreen";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

const Stack = createNativeStackNavigator();


export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
                headerShown: false
                }}> 
        <Stack.Screen 
          name="HomeScreen"
          component={HomeScreen}
        />
        <Stack.Screen 
          name="CreateBirthdayScreen"
          component={CreateBirthdayScreen}
        />
        <Stack.Screen
          name="BirthdayScreen"
          component={BirthdayScreen}
        />
        <Stack.Screen
          name="EditScreen"
          component={EditScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
