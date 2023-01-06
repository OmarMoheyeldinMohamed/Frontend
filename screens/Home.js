import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect } from "react";
import axios from "axios";

import * as SQLite from "expo-sqlite";

const ip = "https://mayhembackend.onrender.com";
const db = SQLite.openDatabase("game.db");

const Home = ({ navigation }) => {
  function onPlayerPress() {
    navigation.navigate("Add Player");
  }

  function onAddGamePress() {
    navigation.navigate("Add Game");
  }

  function onViewGamesPress() {
    navigation.navigate("View Games");
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

  useEffect(() => {
    // Create all tables if they don't exist

    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `DROP TABLE player`,
    //     [],
    //     (tx, results) => {
    //       console.log("Player table dropped", results);
    //     },
    //     (tx, error) => {
    //       console.log("Error dropping player table", error);
    //     }
    //   );
    // });

    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `DROP TABLE game`,
    //     [],
    //     (tx, results) => {
    //       console.log("Game table dropped", results);
    //     },
    //     (tx, error) => {
    //       console.log("Error dropping game table", error);
    //     }
    //   );
    // });

    // db.transaction((tx) => {
    //   tx.executeSql(
    //     `DROP TABLE actionPerformed`,
    //     [],
    //     (tx, results) => {
    //       console.log("ActionPerformed table dropped", results);
    //     },
    //     (tx, error) => {
    //       console.log("Error dropping actionPerformed table", error);
    //     }
    //   );
    // });

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS player (
          name varchar(25) NOT NULL,
          number int DEFAULT NULL,
          phone varchar(15) DEFAULT NULL,
          major varchar(25) DEFAULT NULL,
          email varchar(50) DEFAULT NULL,
          PRIMARY KEY (name)
        )`,
        [],
        (tx, results) => {
          console.log("Player table created");
        },
        (tx, error) => {
          console.log("Error creating player table");
        }
      );
    });
    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS game (
          opponent varchar(25) NOT NULL,
          timestamp timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
          myScore int DEFAULT '-1',
          theirScore int DEFAULT '-1',
          home tinyint(1) DEFAULT NULL,
          category varchar(50) DEFAULT NULL,
          startOffence tinyint(1) DEFAULT '1',
          PRIMARY KEY (timestamp,opponent)
        ) `,
        [],
        (tx, results) => {
          console.log("Game table created");
        },
        (tx, error) => {
          console.log("Error creating game table");
        }
      );
    });

    db.transaction((tx) => {
      tx.executeSql(
        `CREATE TABLE IF NOT EXISTS actionPerformed (
          opponent varchar(25) NOT NULL,
          gameTimestamp timestamp NOT NULL,
          playerName varchar(25) DEFAULT NULL,
          action varchar(20) NOT NULL,
          id integer NOT NULL PRIMARY KEY AUTOINCREMENT,
          point int NOT NULL,
          associatedPlayer varchar(25) DEFAULT NULL,
          FOREIGN KEY (gameTimestamp) REFERENCES game (timestamp) ON DELETE CASCADE,
          FOREIGN KEY (playerName) REFERENCES player (name),
          FOREIGN KEY (associatedPlayer) REFERENCES player (name)
        )`,
        [],
        (tx, results) => {
          console.log("ActionPerformed table created");
        },
        (tx, error) => {
          console.log("Error creating actionPerformed table");
        }
      );
    });

    getAllPlayers();
  }, []);

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={require("../assets/logo.png")} />
      <MyButton onPress={onPlayerPress} text="Add Player"></MyButton>
      <MyButton onPress={onAddGamePress} text="Add Game"></MyButton>
      <MyButton onPress={onViewGamesPress} text="View Games"></MyButton>

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
    marginBottom: 80,
  },
});
