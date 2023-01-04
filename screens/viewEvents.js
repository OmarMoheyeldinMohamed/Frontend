import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect } from "react";

import * as SQLite from "expo-sqlite";
import { FlatList } from "react-native-gesture-handler";

const db = SQLite.openDatabase("game.db");
let mayhemLogo = require("../assets/logo.png");
let allImages = {
  supernova: require("../assets/supernova.png"),
  thunder: require("../assets/thunder.png"),
  alex: require("../assets/alex.png"),
  natives: require("../assets/natives.png"),
  zayed: require("../assets/zayed.png"),
  airbenders: require("../assets/airbenders.png"),
  pharos: require("../assets/pharos.png"),
  mudd: require("../assets/mudd.png"),
  any: require("../assets/anyOpponent.png"),
};

let allActionImages = {
  Catch: require("../assets/catch.png"),
  Deep: require("../assets/deep.png"),
  Defence: require("../assets/defense.png"),
  Drop: require("../assets/drop.png"),
  Score: require("../assets/score.png"),
  Throwaway: require("../assets/throwaway.png"),
  "They Score": require("../assets/their_goal.png"),
  "Their Throwaway": require("../assets/their_throwaway.png"),
  Callahan: require("../assets/score.png"),
};

const ViewEvents = ({ route, navigation }) => {
  let opponent = route.params.opponent;
  let gameTimestamp = route.params.timestamp;

  const [allActionsPerformed, setAllActionsPerformed] = React.useState([]);

  useEffect(() => {
    db.transaction((tx) => {
      tx.executeSql(
        "select * from actionPerformed where gameTimestamp = ? and opponent = ?",
        [gameTimestamp, opponent],
        (_, { rows: { _array } }) => {
          //   console.log(_array);
          let actions = [];
          let actionsPerformed = _array;
          let a = { action: "Start" };
          actions.push(a);
          let myScore = 0;
          let theirScore = 0;

          for (let i = 0; i < actionsPerformed.length; i++) {
            let action = actionsPerformed[i];
            if (action.action === "Score") {
              myScore += 1;
              actions.push({
                action: "Score",
                player: action.playerName,
                point: action.point,
                associatedPlayer: action.associatedPlayer,
              });
              actions.push({
                action: "Update Score",
                myScore: myScore,
                theirScore: theirScore,
                ourPoint: 1,
              });
            } else if (action.action === "They Score") {
              theirScore += 1;
              actions.push({
                action: "They Score",
                player: null,
                point: action.point,
                associatedPlayer: null,
              });
              actions.push({
                action: "Update Score",
                myScore: myScore,
                theirScore: theirScore,
                ourPoint: 0,
              });
            } else if (action.action === "Their Throwaway") {
              actions.push({
                action: "Their Throwaway",
                player: null,
                point: action.point,
                associatedPlayer: null,
              });
            } else if (action.action === "Catch") {
              actions.push({
                action: "Catch",
                player: action.playerName,
                point: action.point,
                associatedPlayer: action.associatedPlayer,
              });
            } else if (action.action === "Throwaway") {
              actions.push({
                action: "Throwaway",
                player: action.playerName,
                point: action.point,
                associatedPlayer: null,
              });
            } else if (action.action === "Defence") {
              actions.push({
                action: "Defence",
                player: action.playerName,
                point: action.point,
                associatedPlayer: null,
              });
            } else if (action.action === "Deep") {
              actions.push({
                action: "Deep",
                player: action.playerName,
                point: action.point,
                associatedPlayer: action.associatedPlayer,
              });
            } else if (action.action === "Drop") {
              actions.push({
                action: "Drop",
                player: action.playerName,
                point: action.point,
                associatedPlayer: action.associatedPlayer,
              });
            } else if (action.action === "Stalled") {
              actions.push({
                action: "Stalled",
                player: action.playerName,
                point: action.point,
                associatedPlayer: null,
              });
            } else if (action.action === "Subbed In") {
              actions.push({
                action: "Subbed In",
                player: action.playerName,
                point: action.point,
                associatedPlayer: action.associatedPlayer,
              });
            } else if (action.action === "Callahan") {
              myScore += 1;
              actions.push({
                action: "Callahan",
                player: action.playerName,
                point: action.point,
                associatedPlayer: null,
              });
              actions.push({
                action: "Update Score",
                myScore: myScore,
                theirScore: theirScore,
                ourPoint: 1,
              });
            } else if (action.action === "Callahan'd") {
              theirScore += 1;
              actions.push({
                action: "Callahan'd",
                player: action.playerName,
                point: action.point,
                associatedPlayer: null,
              });
              actions.push({
                action: "Update Score",
                myScore: myScore,
                theirScore: theirScore,
                ourPoint: 0,
              });
            }
          }

          //   console.log(actions);
          setAllActionsPerformed(actions);
        }
      );
    });
  }, []);

  function renderPreviousPlays(curr) {
    // let curr = allActionsPerformed[index];
    let textStyle = { color: "#000" };
    // console.log(curr);

    let image = allActionImages[curr["action"]];
    let description = "";
    let player = "";
    let associatedPlayer = "";

    if (curr["action"] === "Start") {
      return (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            borderBottomColor: "#808080",
            borderBottomWidth: 1,
          }}
        >
          <Text style={{ fontSize: 22, fontWeight: "bold" }}>Game Started</Text>
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Image source={mayhemLogo} style={styles.image} />
            <View justifyContent="center">
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  justifyContent: "flex-end",
                }}
              >
                vs.
              </Text>
            </View>
            <Image
              source={allImages[opponent.toLowerCase()]}
              style={styles.image}
            />
          </View>
        </View>
      );
    } else if (curr["action"] === "Update Score") {
      let ourFont = { color: "#fff" };
      let theirFont = { color: "#fff" };
      if (curr["ourPoint"] === 1) {
        ourFont = { color: "#0f0" };
      } else {
        theirFont = { color: "#f00" };
      }

      return (
        <View
          style={{
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "#119fb8",
            paddingVertical: 8,
            borderColor: "#808080",
            borderBottomWidth: 0.5,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              width: "100%",
              justifyContent: "center",
            }}
          >
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: "400",
                  justifyContent: "flex-end",
                  color: "#fff",
                },
              ]}
            >
              Mayhem{"  "}
            </Text>
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  justifyContent: "flex-end",
                },
                ourFont,
              ]}
            >
              {curr["myScore"]}
            </Text>
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                justifyContent: "flex-end",
                color: "#fff",
              }}
            >
              {" "}
              -{" "}
            </Text>
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  justifyContent: "flex-end",
                },
                theirFont,
              ]}
            >
              {curr["theirScore"]}
            </Text>
            <Text
              style={[
                {
                  fontSize: 20,
                  fontWeight: "400",
                  justifyContent: "flex-end",
                  color: "#fff",
                },
              ]}
            >
              {"  " + opponent}
            </Text>
          </View>
        </View>
      );
    }

    if (curr["player"] === null) {
      player = "UNKNOWN";
    } else {
      player = curr["player"];
    }
    if (curr["associatedPlayer"] === null) {
      associatedPlayer = "UNKNOWN";
    } else {
      associatedPlayer = curr["associatedPlayer"];
    }

    if (curr["action"] === "Callahan") {
      description = player + " fashee5(a) w 3amal(et)" + " Callahan";
    } else if (curr["action"] === "Catch") {
      description = player + " catched disc from " + associatedPlayer;
    } else if (curr["action"] === "Deep") {
      description = player + " catched a deep from " + associatedPlayer;
    } else if (curr["action"] === "Defence") {
      description = player + " got a defence";
    } else if (curr["action"] === "Drop") {
      description = player + " msh 3aref yemsek disc mn " + associatedPlayer;
    } else if (curr["action"] === "Score") {
      description = player + " scored a goal, assist " + associatedPlayer;
    } else if (curr["action"] === "Throwaway") {
      description = player + " mabye3rafsh yermy disc";
    } else if (curr["action"] === "Their Throwaway") {
      description = "Their Throwaway, good pressure";
    } else if (curr["action"] === "They Score") {
      description = "They got a point, hard luck";
    }

    return (
      <View
        style={{
          width: "100%",
          backgroundColor: "#ffffff",
          paddingVertical: 8,
          borderBottomWidth: 0.5,
          borderColor: "#808080",
          flexDirection: "row",
        }}
      >
        <Image style={{ width: 75, height: 75 }} source={image} />
        <View style={{ flex: 1, justifyContent: "center", marginLeft: 8 }}>
          <Text style={textStyle}>{description}</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={allActionsPerformed}
        style={{ width: "100%" }}
        renderItem={({ item, index }) => {
          return renderPreviousPlays(item);
        }}
      />

      <StatusBar style="auto" />
    </View>
  );
};

export default ViewEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 55,
    height: 55,
    margin: 10,
  },
});
