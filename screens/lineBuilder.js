import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect, useRef } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Pressable } from "react-native";

import * as SQLite from "expo-sqlite";

const db = SQLite.openDatabase("game.db");

function backColor(player) {
  if (player !== "") {
    return "#119fb8";
  } else {
    return "#ffffff";
  }
}

function textColor(player) {
  if (player !== "") {
    return "#ffffff";
  } else {
    return "red";
  }
}

const LineBuilder = ({ navigation }) => {
  const [players, setPlayers] = React.useState([]);
  const [selectedLine, setSelectedLine] = React.useState(0);
  const [line1Players, setLine1Players] = React.useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const [line2Players, setLine2Players] = React.useState([
    "",
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const line1PlayersRef = useRef([]);
  const line2PlayersRef = useRef([]);

  const [line1OffensePoints, setLine1OffensePoints] = React.useState(0);
  const [line1DefensePoints, setLine1DefensePoints] = React.useState(0);
  const [line1OffenseWins, setLine1OffenseWins] = React.useState(0);
  const [line1DefenseWins, setLine1DefenseWins] = React.useState(0);
  const [line2OffensePoints, setLine2OffensePoints] = React.useState(0);
  const [line2DefensePoints, setLine2DefensePoints] = React.useState(0);
  const [line2OffenseWins, setLine2OffenseWins] = React.useState(0);
  const [line2DefenseWins, setLine2DefenseWins] = React.useState(0);

  async function getPlayers() {
    let players = await new Promise((resolve, reject) => {
      db.transaction((tx) => {
        tx.executeSql(
          "select name from player;",
          [],
          (_, { rows: { _array } }) => resolve(_array),
          (_, error) => reject(error)
        );
      });
    });

    let playerNames = [];
    for (let i = 0; i < players.length; i++) {
      playerNames.push(players[i].name);
    }
    setPlayers(playerNames);
  }

  function selectPlayer(index) {
    if (selectedLine === 0) {
      if (line1Players.includes(players[index])) {
        return;
      }
      let newLine1Players = line1Players.map((player) => {
        return player;
      });
      let i = newLine1Players.indexOf("");
      newLine1Players[i] = players[index];
      setLine1Players(newLine1Players);
      line1PlayersRef.current.push(players[index]);
    } else {
      if (line2Players.includes(players[index])) {
        return;
      }
      let newLine2Players = line2Players.map((player) => {
        return player;
      });
      let i = newLine2Players.indexOf("");
      newLine2Players[i] = players[index];
      setLine2Players(newLine2Players);
      line2PlayersRef.current.push(players[index]);
    }
  }

  useEffect(() => {
    getPlayers();
  }, []);

  function unSelectPlayer(index, line) {
    if (line === 0) {
      if (line1Players[index] === "") {
        return;
      }
      let newLine1Players = line1Players.map((player) => {
        return player;
      });
      let player = newLine1Players[index];
      let i = line1PlayersRef.current.indexOf(player);
      line1PlayersRef.current.splice(i, 1);

      newLine1Players[index] = "";
      setLine1Players(newLine1Players);
    } else {
      if (line2Players[index] === "") {
        return;
      }
      let newLine2Players = line2Players.map((player) => {
        return player;
      });
      let player = newLine2Players[index];
      let i = line2PlayersRef.current.indexOf(player);
      line2PlayersRef.current.splice(i, 1);
      console.log(line2PlayersRef.current);
      newLine2Players[index] = "";
      setLine2Players(newLine2Players);
    }
  }

  function getPlayerText(name) {
    if (name === "") {
      return "open";
    } else {
      return name;
    }
  }
  function renderLine1() {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ width: "100%", padding: 10, paddingTop: 20 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedLine(0);
                }}
                style={({ pressed }) => [
                  pressed && {
                    opacity: 0.5,
                  },
                  { justifyContent: "center" },
                ]}
              >
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: selectedLine === 0 ? "#808080" : "#000",
                    }}
                  >
                    Line 1:
                  </Text>
                </View>
              </Pressable>
            </View>
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[0])}
              color={backColor(line1Players[0])}
              textColor={textColor(line1Players[0])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(0, 0);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[1])}
              color={backColor(line1Players[1])}
              textColor={textColor(line1Players[1])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(1, 0);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[2])}
              color={backColor(line1Players[2])}
              textColor={textColor(line1Players[2])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(2, 0);
              }}
            />
          </View>

          <View style={{ width: "100%", flexDirection: "row" }}>
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[3])}
              color={backColor(line1Players[3])}
              textColor={textColor(line1Players[3])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(3, 0);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[4])}
              color={backColor(line1Players[4])}
              textColor={textColor(line1Players[4])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(4, 0);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[5])}
              color={backColor(line1Players[5])}
              textColor={textColor(line1Players[5])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(5, 0);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line1Players[6])}
              color={backColor(line1Players[6])}
              textColor={textColor(line1Players[6])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(6, 0);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function renderLine2() {
    return (
      <View style={{ width: "100%" }}>
        <View style={{ width: "100%", padding: 10, paddingTop: 10 }}>
          <View
            style={{
              width: "100%",
              flexDirection: "row",
              alignContent: "center",
            }}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <Pressable
                onPress={() => {
                  setSelectedLine(1);
                }}
                style={({ pressed }) => [
                  pressed && {
                    opacity: 0.5,
                  },
                  { justifyContent: "center" },
                ]}
              >
                <View style={{}}>
                  <Text
                    style={{
                      fontSize: 17,
                      color: selectedLine === 1 ? "#808080" : "#000",
                    }}
                  >
                    Line 2:
                  </Text>
                </View>
              </Pressable>
            </View>
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[0])}
              color={backColor(line2Players[0])}
              textColor={textColor(line2Players[0])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(0, 1);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[1])}
              color={backColor(line2Players[1])}
              textColor={textColor(line2Players[1])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(1, 1);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[2])}
              color={backColor(line2Players[2])}
              textColor={textColor(line2Players[2])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(2, 1);
              }}
            />
          </View>

          <View style={{ width: "100%", flexDirection: "row" }}>
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[3])}
              color={backColor(line2Players[3])}
              textColor={textColor(line2Players[3])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(3, 1);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[4])}
              color={backColor(line2Players[4])}
              textColor={textColor(line2Players[4])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(4, 1);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[5])}
              color={backColor(line2Players[5])}
              textColor={textColor(line2Players[5])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(5, 1);
              }}
            />
            <MyButton
              heightOnly={45}
              padding={0}
              margin={1}
              text={getPlayerText(line2Players[6])}
              color={backColor(line2Players[6])}
              textColor={textColor(line2Players[6])}
              borderWidth={1}
              flex={1}
              onPress={() => {
                unSelectPlayer(6, 1);
              }}
            />
          </View>
        </View>
      </View>
    );
  }

  function getLine1Stats() {
    if (line1Players.length === 0) {
      return;
    }
    let offensePoints;
    let defensePoints;
    let offenseWins;
    let defenseWins;
  }

  return (
    <View
      style={{
        flexDirection: "column",
        width: "100%",
        height: "100%",
        backgroundColor: "#fff",
      }}
    >
      <View
        style={{
          borderBottomWidth: 0.5,
          width: "100%",
          flexDirection: "row",
        }}
      >
        <FlatList
          data={players}
          horizontal={true}
          renderItem={({ item, index }) => {
            return (
              <MyButton
                width={75}
                height={50}
                text={item}
                margin={4}
                onPress={() => {
                  selectPlayer(index);
                }}
              />
            );
          }}
        />
      </View>
      {renderLine1()}
      {renderLine2()}

      <View style={{ width: "100%" }}></View>
    </View>
  );
};

export default LineBuilder;

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
