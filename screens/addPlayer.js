import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  FlatList,
  Alert,
} from "react-native";
import { useState, useEffect } from "react";
import MyButton from "../components/MyButton";
import PLayerItem from "../components/playerItem";
import { SafeAreaView } from "react-native-safe-area-context";
import axios from "axios";

async function addPlayerToDB(name, email, major, number, phone) {
  await axios({
    method: "post",
    url: "http://192.168.1.4:3000/players",
    data: {
      email: email,
      major: major,
      name: name,
      number: number,
      phone: phone,
    },
  })
    .then(function (response) {
      return response.data;
    })
    .catch(function (error) {
      console.log(error);
    });
}

function playerInfotoNames(playersInfo) {
  var playerNames = [];
  for (let i = 0; i < playersInfo.length; i++) {
    playerNames.push(playersInfo[i].name);
  }
  return playerNames;
}

const AddPlayer = () => {
  const [enteredName, setEnteredName] = useState("");
  function nameInputHandler(enteredText) {
    setEnteredName(enteredText);
  }

  async function getPlayers() {
    // use mysql to get all players
    return await axios({
      method: "get",
      url: "http://192.168.1.4:3000/players",
    }).then(function (response) {
      return response.data;
    });
  }

  const [players, setPlayers] = useState([]);
  const [enteredPlayer, setEnteredPlayer] = useState("");
  const [enteredNumber, setEnteredNumber] = useState(0);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPhone, setEnteredPhone] = useState("");
  const [enteredMajor, setEnteredMajor] = useState("");

  function deletePlayerHandler(playerName) {
    Alert.alert(
      "Are you sure?",
      "Do you really want to delete this player?",
      [
        { text: "No", style: "default" },

        {
          text: "Yes",
          style: "destructive",
          onPress: async () => {
            await axios({
              method: "delete",
              url: "http://192.168.1.4:3000/players/" + playerName,
            })
              .then(function (response) {
                return response.data;
              })
              .catch(function (error) {
                console.log(error);
              });
            setPlayers((currentPlayers) => {
              return currentPlayers.filter((player) => player !== playerName);
            });
          },
        },
      ],
      {
        cancelable: true,
      }
    );
  }

  function nameInputHandler(enteredText) {
    setEnteredPlayer(enteredText);
  }

  function numberInputHandler(enteredText) {
    setEnteredNumber(enteredText);
  }

  function emailInputHandler(enteredText) {
    setEnteredEmail(enteredText);
  }

  function phoneInputHandler(enteredText) {
    setEnteredPhone(enteredText);
  }

  function majorInputHandler(enteredText) {
    setEnteredMajor(enteredText);
  }

  const createOneButtonAlert = (alertTitle, alertMessage) =>
    Alert.alert(
      alertTitle,
      alertMessage,
      [{ text: "Ok", onPress: () => console.log("") }],
      {
        cancelable: true,
      }
    );

  const addPlayerHandler = () => {
    if (enteredPlayer === "") {
      createOneButtonAlert("No Name Entered", "Please enter a player name");
      return;
    }
    if (enteredNumber === 0) {
      createOneButtonAlert("No Number Entered", "Please enter a player number");
      return;
    }
    if (enteredEmail === "") {
      createOneButtonAlert("No Email Entered", "Please enter a player email");
      return;
    }
    if (enteredPhone === "") {
      createOneButtonAlert("No Phone Entered", "Please enter a player phone");
      return;
    }
    if (enteredMajor === "") {
      createOneButtonAlert("No Major Entered", "Please enter a player major");
      return;
    }
    if (players.includes(enteredPlayer)) {
      createOneButtonAlert(
        "Player Already Exists",
        "Please enter a different player name"
      );
      return;
    }
    addPlayerToDB(
      enteredPlayer,
      enteredEmail,
      enteredMajor,
      enteredNumber,
      enteredPhone
    );

    setPlayers((currentPlayers) => [...currentPlayers, enteredPlayer]);
    setEnteredPlayer("");
    setEnteredNumber(0);
    setEnteredEmail("");
    setEnteredPhone("");
    setEnteredMajor("");
  };

  // setPlayers((currentPlayers) => [...currentPlayers, enteredPlayer]);
  // addPlayerToDB(enteredPlayer);
  // setEnteredPlayer("");

  const onScreenLoad = async () => {
    try {
      var playersInfo = await getPlayers();
      var playerNames = playerInfotoNames(playersInfo);
      setPlayers(playerNames);
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    onScreenLoad();
  }, []);

  const ref_no = useRef();
  const ref_phone = useRef();
  const ref_major = useRef();
  const ref_email = useRef();

  return (
    <View style={styles.container}>
      <View style={styles.container2}>
        <TextInput
          onChangeText={nameInputHandler}
          style={styles.textInput}
          placeholder="Name"
          value={enteredPlayer}
          returnKeyType="next"
          autoFocus={true}
          onSubmitEditing={() => ref_no.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          keyboardType="numeric"
          onChangeText={numberInputHandler}
          style={{ ...styles.textInput, ...{ flex: 1 } }}
          placeholder="No"
          value={enteredNumber}
          ref={ref_no}
          returnKeyType="next"
          onSubmitEditing={() => ref_phone.current.focus()}
          blurOnSubmit={false}
        />
        <View flex={3}>
          <MyButton
            onPress={addPlayerHandler}
            flex={1}
            heightOnly={45}
            color={"#2bbf0a"}
            textColor={"#000000"}
            text="Add Player"
          />
        </View>
      </View>
      <View style={styles.container2}>
        <TextInput
          keyboardType="numeric"
          onChangeText={phoneInputHandler}
          style={styles.textInput}
          placeholder="Phone"
          value={enteredPhone}
          ref={ref_phone}
          returnKeyType="next"
          onSubmitEditing={() => ref_major.current.focus()}
          blurOnSubmit={false}
        />
        <TextInput
          onChangeText={majorInputHandler}
          style={styles.textInput}
          placeholder="Major"
          value={enteredMajor}
          ref={ref_major}
          returnKeyType="next"
          onSubmitEditing={() => ref_email.current.focus()}
          blurOnSubmit={false}
        />
      </View>
      <View style={styles.container2}>
        <TextInput
          onChangeText={emailInputHandler}
          style={styles.textInput}
          placeholder="Email"
          value={enteredEmail}
          ref={ref_email}
          returnKeyType="done"
          onSubmitEditing={() => Keyboard.dismiss()}
        />
      </View>

      <View style={styles.container3}>
        <FlatList
          style={{ width: "100%" }}
          data={players}
          renderItem={({ item, index }) => {
            return <PLayerItem onPress={deletePlayerHandler} text={item} />;
          }}
          keyExtractor={(item, index) => {
            return item;
          }}
        ></FlatList>
      </View>
    </View>
  );
};

export default AddPlayer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    // justifyContent: "center",
  },
  container3: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "center",
  },
  container2: {
    // flex: 1,
    backgroundColor: "#fff",
    alignItems: "flex-start",
    justifyContent: "space-evenly",
    height: 60,
    width: "100%",
    flexDirection: "row",
  },

  textInput: {
    borderWidth: 1,
    borderColor: "#808080",
    backgroundColor: "#bfbfbd",
    color: "#120438",
    borderRadius: 8,
    flex: 3,
    padding: 10,
    margin: 3,
  },
});
