import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image, FlatList } from "react-native";
import MyButton from "../components/MyButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import GameItem from "../components/gameItem";
import * as SQLite from "expo-sqlite";

const ip = "192.168.1.4";
const db = SQLite.openDatabase("game.db");

function getGames() {
  return axios
    .get("http://" + ip + ":3000/game")
    .then((response) => {
      //   console.log(response.data);
      return response.data;
    })
    .catch((error) => {
      console.log(error);
    });
}

const ViewGames = ({ navigation }) => {
  const [games, setGames] = React.useState([]);
  const onScreenLoad = async () => {
    try {
      setGames(await getGames());
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    onScreenLoad();
  }, []);

  const deleteItemHandler = async (item) => {
    var date = new Date(item.timestamp);
    let timestampStr =
      date.getFullYear() +
      "-" +
      (date.getMonth() + 1) +
      "-" +
      date.getDate() +
      " " +
      date.getHours() +
      ":" +
      date.getMinutes() +
      ":" +
      date.getSeconds();
    await axios
      .delete(
        "http://" + ip + ":3000/game/" + item.opponent + "/" + timestampStr
      )
      .then((response) => {
        console.log(response.data);
        onScreenLoad();
      })
      .catch((error) => {
        console.log(error);
      });

    await db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM game WHERE opponent=? AND timestamp=?;",
        [item.opponent, timestampStr],
        (tx, results) => {
          console.log(results);
        },
        (tx, error) => {
          console.log(error);
        }
      );
    });
  };

  const [swipeableRow, setSwipeableRow] = React.useState([]);
  const [prevOpenedRow, setPrevOpenedRow] = React.useState(null);

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <FlatList
        width="100%"
        data={games}
        renderItem={({ item, index }) => (
          <GameItem
            onPress={() => {
              navigation.navigate("Game Home", { game: item });
            }}
            onDelete={() => {
              deleteItemHandler(item);
            }}
            content={item}
            index={index}
            swipeableRow={swipeableRow}
            setSwipeableRow={setSwipeableRow}
            prevOpenedRow={prevOpenedRow}
            setPrevOpenedRow={setPrevOpenedRow}
          />
        )}
      />
    </View>
  );
};

export default ViewGames;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    marginBottom: 80,
  },
});
