import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "./components/MyButton";
import * as React from "react";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import Home from "./screens/Home";
import AddPlayer from "./screens/addPlayer";
import AddGame from "./screens/addGame";
import GameHome from "./screens/gameHome";
import ViewGames from "./screens/viewGames";
import RecordGame from "./screens/RecordGame";

const Stack = createNativeStackNavigator();

const MyStack = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            title: "Mayhem",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Add Player"
          component={AddPlayer}
          options={{
            title: "Add Player",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Add Game"
          component={AddGame}
          options={{
            title: "Mayhem",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="View Games"
          component={ViewGames}
          options={{
            title: "View Games",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Game Home"
          component={GameHome}
          options={{
            title: "Game",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
        <Stack.Screen
          name="Record Game"
          component={RecordGame}
          options={{
            title: "Record Game",
            headerStyle: {
              backgroundColor: "#119fb8",
            },
            headerTintColor: "#fff",
            headerTitleStyle: {
              fontWeight: "bold",
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default MyStack;

// export default function App() {
//   return (
//     <View style={styles.container}>
//       <Image style={styles.image} source={require("./assets/logo.png")} />
//       <MyButton text="Add Player"></MyButton>
//       <MyButton text="Add Game"></MyButton>
//       <MyButton text="View Games"></MyButton>

//       <StatusBar style="auto" />
//     </View>
//   );
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    marginBottom: 80,
  },
});
