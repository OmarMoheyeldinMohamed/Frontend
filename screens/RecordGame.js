import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";

const RecordGame = ({ navigation }) => {
  function onPlayerPress() {
    navigation.navigate("Add Player");
  }

  function onAddGamePress() {
    navigation.navigate("Add Game");
  }

  function onViewGamesPress() {
    navigation.navigate("View Games");
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
    </View>
  );
};

export default RecordGame;

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
