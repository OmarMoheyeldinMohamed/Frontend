import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image, FlatList } from "react-native";
import MyButton from "../components/MyButton";
import axios from "axios";
import React, { useEffect, useState } from "react";
import GameItem from "../components/gameItem";
import * as SQLite from "expo-sqlite";

const ip = "192.168.1.4";
const db = SQLite.openDatabase("game.db");

async function getGames() {
  // axios
  //   .get("http://" + ip + ":3000/game")
  //   .then((response) => {
  //     //   console.log(response.data);
  //     return response.data;
  //   })
  //   .catch((error) => {
  //     console.log(error);
  //   });

  let games = await new Promise((resolve, reject) => {
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM game;",
        [],
        (tx, results) => {
          console.log("result ", results["rows"]["_array"]);
          resolve(results["rows"]["_array"]);
        },
        (tx, error) => {
          console.log(error);
          reject(error);
        }
      );
    });
  });

  return games;
}

const ViewGames = ({ navigation }) => {
  const [games, setGames] = React.useState([]);
  const onScreenLoad = async () => {
    try {
      setGames(await getGames(), console.log(games));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    onScreenLoad();
  }, []);

  const deleteItemHandler = async (item) => {
    let year = item.timestamp.substring(0, 4);
    let month = item.timestamp.split("-")[1];
    let day = item.timestamp.split("-")[2];
    day = day.split(" ")[0];

    let time = item.timestamp.split(" ")[1];
    let hour = time.split(":")[0];
    let minute = time.split(":")[1];
    let second = time.split(":")[2];

    let date = new Date(year, month - 1, day, hour, minute, second);
    console.log("hi", date);
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
    onScreenLoad();
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
