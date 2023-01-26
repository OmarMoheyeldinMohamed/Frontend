import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View, Image } from "react-native";
import MyButton from "../components/MyButton";
import React, { useEffect } from "react";
import axios from "axios";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import * as SQLite from "expo-sqlite";
import { FlatList } from "react-native-gesture-handler";
import { Dimensions } from "react-native";
import Modal from "react-native-modal";
import DatePicker from "react-native-modern-datepicker";
import { useState } from "react";

const screenWidth = Dimensions.get("window").width;
// const ip = "http://192.168.76.177:3000";
const ip = "https://mayhembackend.onrender.com";
const db = SQLite.openDatabase("game.db");

const ViewPractices = ({ route, navigation }) => {
  const isAdmin = route.params.isAdmin;
  const [isModalVisible, setModalVisible] = React.useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const Date =
    selectedDate === ""
      ? ""
      : selectedDate.split(" ")[0].replace("/", "-").replace("/", "-");
  const [datepickerVisible, setDatepickerVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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
  }
  console.log("selectedDate", selectedDate);

  return (
    <View style={styles.container}>
      <Modal
        isVisible={isModalVisible}
        onBackButtonPress={toggleModal}
        onBackdropPress={toggleModal}
      >
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          {!datepickerVisible && (
            <View style={{ width: "90%", backgroundColor: "#fff" }}>
              <MyButton
                text="Choose Date"
                onPress={() => {
                  setDatepickerVisible(true);
                }}
                width={screenWidth * 0.4}
              />

              <Text style={{ padding: 10, fontSize: 15 }}>
                {"Selected Date: \n\n" + Date}
              </Text>
            </View>
          )}
          {datepickerVisible && (
            <DatePicker
              onSelectedChange={(date) => {
                setSelectedDate(date);
              }}
            />
          )}

          {datepickerVisible && (
            <View
              style={{
                width: "100%",
                backgroundColor: "#fff",
                alignItems: "flex-end",
              }}
            >
              <MyButton
                text="Ok"
                width={screenWidth * 0.2}
                onPress={() => {
                  setDatepickerVisible(false);
                }}
              />
            </View>
          )}
        </View>
      </Modal>
      <MyButton text="Add Practice" onPress={toggleModal} />
      <StatusBar style="auto" />
    </View>
  );
};

export default ViewPractices;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  },
  image: {
    width: 200,
    height: 200,
    margin: 20,
    marginBottom: 20,
  },
});
