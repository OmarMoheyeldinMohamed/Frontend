import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image, FlatList } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect, useRef, useState } from "react";
import Modal from "react-native-modal";
import axios from "axios";

const RecordGame = ({ navigation }) => {
  const [isModalVisible, setModalVisible] = useState(true);
  const [playersOnCourt, setPlayersOnCourt] = useState(Array(7).fill(""));
  const [playersOnCourtText, setPlayersOnCourtText] = useState(
    playersOnCourt.map((player) => {
      if (player !== "") {
        return player;
      } else {
        return "open";
      }
    })
  );
  const unSelectPlayer = (index) => {
    let newPlayersOnCourt = playersOnCourt;
    let player = newPlayersOnCourt[index];
    newPlayersOnCourt[index] = "";
    setPlayersOnCourt(newPlayersOnCourt);
    setPlayersOnCourtText(
      playersOnCourt.map((player) => {
        if (player !== "") {
          return player;
        } else {
          return "open";
        }
      })
    );
    setPlayersOnBench((players) => [...players, player]);
  };

  const choosePlayer = (player) => {
    console.log(player);
    let index = playersOnCourt.indexOf("");
    let newPlayersOnCourt = playersOnCourt;
    newPlayersOnCourt[index] = player;
    setPlayersOnCourt(newPlayersOnCourt);
    setPlayersOnCourtText(
      playersOnCourt.map((player) => {
        if (player !== "") {
          return player;
        } else {
          return "open";
        }
      })
    );
    setPlayersOnBench(
      playersOnBench.filter((playerOnBench) => {
        return playerOnBench !== player;
      })
    );
  };
  const [allPlayers, setAllPlayers] = useState([]);
  const [playersOnBench, setPlayersOnBench] = useState([]);
  function onCourtBackgroundColors(player) {
    if (player !== "open") {
      return "#119fb8";
    } else {
      return "#ffffff";
    }
  }

  function onCourtTextColors(player) {
    if (player !== "open") {
      return "#ffffff";
    } else {
      return "red";
    }
  }

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

  async function getAllPlayers() {
    // use mysql to get all players
    let players = await axios({
      method: "get",
      url: "http://192.168.1.4:3000/players",
    }).then(function (response) {
      return response.data;
    });
    let playersNames = players.map((player) => {
      return player.name;
    });
    await setAllPlayers(playersNames);
    setPlayersOnBench(
      playersNames.filter((player) => {
        return !playersOnCourt.includes(player);
      })
    );
  }

  useEffect(() => {
    getAllPlayers();
  }, []);

  // initialize empty array of 7 elements

  let heightBench =
    53 * (playersOnBench.length / 4) + 30 > 260
      ? 260
      : 53 * (playersOnBench.length / 4) + 30;

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
      >
        <View
          style={{
            backgroundColor: "#fff",
            justifyContent: "center",
            alignItems: "center",
            alignContent: "center",
            padding: 10,
            borderRadius: 10,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              alignItems: "center",
              alignContent: "center",
              width: "100%",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                // alignContent: "flex-start",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#808080",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                  flex: 1,
                }}
              >
                Field:
              </Text>
              <MyButton
                textSize={11}
                text={playersOnCourtText[0]}
                color={onCourtBackgroundColors(playersOnCourtText[0])}
                textColor={onCourtTextColors(playersOnCourtText[0])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(0);
                }}
              />
              <MyButton
                textSize={11}
                text={playersOnCourtText[1]}
                color={onCourtBackgroundColors(playersOnCourtText[1])}
                textColor={onCourtTextColors(playersOnCourtText[1])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(1);
                }}
              />
              <MyButton
                textSize={11}
                text={playersOnCourtText[2]}
                color={onCourtBackgroundColors(playersOnCourtText[2])}
                textColor={onCourtTextColors(playersOnCourtText[2])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(2);
                }}
              />
            </View>
            <View
              style={{
                flexDirection: "row",
                alignContent: "flex-start",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "#ffffff",
                width: "100%",
              }}
            >
              <MyButton
                textSize={11}
                text={playersOnCourtText[3]}
                color={onCourtBackgroundColors(playersOnCourtText[3])}
                textColor={onCourtTextColors(playersOnCourtText[3])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(3);
                }}
              />
              <MyButton
                textSize={11}
                text={playersOnCourtText[4]}
                color={onCourtBackgroundColors(playersOnCourtText[4])}
                textColor={onCourtTextColors(playersOnCourtText[4])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(4);
                }}
              />
              <MyButton
                textSize={11}
                text={playersOnCourtText[5]}
                color={onCourtBackgroundColors(playersOnCourtText[5])}
                textColor={onCourtTextColors(playersOnCourtText[5])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(5);
                }}
              />
              <MyButton
                textSize={11}
                text={playersOnCourtText[6]}
                color={onCourtBackgroundColors(playersOnCourtText[6])}
                textColor={onCourtTextColors(playersOnCourtText[6])}
                flex={1}
                padding={11}
                margin={1}
                borderWidth={0.5}
                onPress={() => {
                  unSelectPlayer(6);
                }}
              />
            </View>
            <View
              style={{
                marginVertical: 10,
                // backgroundColor: "#ff9f8f",
                width: "100%",
              }}
            >
              <Text
                style={{
                  fontSize: 20,
                  color: "#808080",
                  alignItems: "center",
                  justifyContent: "center",
                  alignContent: "center",
                }}
              >
                Bench:
              </Text>
              <View style={{ flex: 0, height: heightBench }}>
                <FlatList
                  data={playersOnBench}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "column",
                        margin: 1,
                      }}
                    >
                      <MyButton
                        text={item}
                        flex={1}
                        margin={1}
                        verticalPadding={13}
                        textSize={12}
                        fontWeight="bold"
                        onPress={() => choosePlayer(item)}
                      />
                    </View>
                  )}
                  //Setting the number of column
                  numColumns={4}
                  keyExtractor={(item, index) => item}
                />
              </View>
              <View style={{ margin: 10 }}>
                <MyButton text="Done" />
              </View>
            </View>
          </View>
        </View>
      </Modal>
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
