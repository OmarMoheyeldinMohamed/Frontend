import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect } from "react";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import * as SQLite from "expo-sqlite";
// const ip = "http://192.168.76.177:3000";
const ip = "https://mayhembackend.onrender.com";
const db = SQLite.openDatabase("game.db");

const Home = ({ route, navigation }) => {
  const isAdmin = route.params.isAdmin;
  function onPlayerPress() {
    navigation.navigate("Add Player");
  }

  function onAddGamePress() {
    navigation.navigate("Add Game");
  }

  function onViewGamesPress() {
    navigation.navigate("View Games", { isAdmin: isAdmin });
  }

  function onViewStatsPress() {
    navigation.navigate("View Overall Stats");
  }

  function onPlayersStatsPress() {
    navigation.navigate("Players Overall Stats");
  }

  function onTeamStatsPress() {
    navigation.navigate("Team Stats");
  }

  async function getAllPlayers() {
    // use mysql to get all players

    let localPlayers = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "select * from player",
          [],
          (_, { rows: { _array } }) => {
            resolve(_array);
          },
          (_, error) => {
            reject(error);
          }
        );
      });
    });

    // add players on mysql to local storage
    let localPlayerNames = localPlayers.map((player) => {
      return player.name;
    });

    axios({
      method: "get",
      url: ip + "/players",
    })
      .then(async function (response) {
        let players = response.data;
        if (players !== undefined) {
          let playerNames = players.map((player) => {
            return player.name;
          });
          // console.log(playerNames);
          let newPlayers = [];
          let dirty = false;
          for (let i = 0; i < playerNames.length; i++) {
            if (!localPlayerNames.includes(playerNames[i])) {
              {
                newPlayers.push(players[i]);
                dirty = true;
              }
            }
          }

          // create values string
          if (dirty) {
            let values = "";
            for (let i = 0; i < newPlayers.length - 1; i++) {
              values +=
                "('" +
                newPlayers[i].name +
                "', '" +
                newPlayers[i].email +
                "', '" +
                newPlayers[i].major +
                "', '" +
                newPlayers[i].number +
                "', '" +
                newPlayers[i].phone +
                "'),";
            }

            values +=
              "('" +
              newPlayers[newPlayers.length - 1].name +
              "', '" +
              newPlayers[newPlayers.length - 1].email +
              "', '" +
              newPlayers[newPlayers.length - 1].major +
              "', '" +
              newPlayers[newPlayers.length - 1].number +
              "', '" +
              newPlayers[newPlayers.length - 1].phone +
              "')";

            // add new players to local storage
            // console.log(values);
            await new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  "insert into player (name, email, major, number, phone) values " +
                    values,
                  [],
                  (_, { rows: { _array } }) => {
                    resolve(_array);
                  },
                  (_, error) => {
                    reject(error);
                  }
                );
              });
            });
          }

          // see if a player is deleted on mysql
          let deletedPlayers = [];
          for (let i = 0; i < localPlayerNames.length; i++) {
            if (!playerNames.includes(localPlayerNames[i])) {
              deletedPlayers.push(localPlayerNames[i]);
            }
          }

          // delete players on local storage
          if (deletedPlayers.length > 0) {
            let values = "";
            let deleteQuery = "delete from player where name in (";
            for (let i = 0; i < deletedPlayers.length - 1; i++) {
              values += "'" + deletedPlayers[i] + "',";
            }
            values += "'" + deletedPlayers[deletedPlayers.length - 1] + "')";
            deleteQuery += values;
            // console.log(deleteQuery);
            await new Promise((resolve, reject) => {
              db.transaction((tx) => {
                tx.executeSql(
                  deleteQuery,
                  [],
                  (_, { rows: { _array } }) => {
                    resolve(_array);
                  },
                  (_, error) => {
                    reject(error);
                  }
                );
              });
            });
          }
        }

        return response.data;
      })
      .catch(function (error) {
        // console.log(error);
      });
  }

  const logout = () => {
    // delete local storage

    db.transaction((tx) => {
      tx.executeSql("delete from login;");
    });

    navigation.navigate("Login", { logout: true });
  };

  React.useEffect(() => {
    // Use `setOptions` to update the button that we previously specified
    // Now the button includes an `onPress` handler to update the count
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={logout}
          style={({ pressed }) => pressed && { opacity: 0.5 }}
        >
          <Image
            source={require("../assets/logout.png")}
            style={{
              width: 25,
              height: 25,
            }}
          />
        </Pressable>
      ),
    });
  }, [navigation]);
  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/logo.png")} />
      <MyButton
        onPress={onPlayerPress}
        text="Add Player"
        disabled={!isAdmin}
      ></MyButton>
      <MyButton
        onPress={onAddGamePress}
        text="Add Game"
        disabled={!isAdmin}
      ></MyButton>
      <MyButton onPress={onViewGamesPress} text="View Games"></MyButton>
      <MyButton onPress={onViewStatsPress} text="View Overall Stats"></MyButton>
      <MyButton
        onPress={onPlayersStatsPress}
        text="Players Overall Stats"
      ></MyButton>
      <MyButton onPress={onTeamStatsPress} text="View Team Stats"></MyButton>
      <StatusBar style="auto" />
    </View>
  );
};

export default Home;

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
    marginBottom: 20,
  },
});
