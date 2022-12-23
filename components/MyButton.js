import { StyleSheet, View, Text, Pressable } from "react-native";

function MyButton(props) {
  let width = props.width ? props.width : 250;
  let height = props.height ? props.height : 40;
  let flex = props.flex ? props.flex : 0;
  let color = props.color ? props.color : "#119fb8";
  let textColor = props.textColor ? props.textColor : "#ffffff";

  let buttonStyle = {
    ...styles.button,
  };
  if (flex === 0) {
    buttonStyle = {
      ...styles.button,
      ...{ width: width, height: height },
    };
  }
  if (props.heightOnly !== undefined) {
    buttonStyle = {
      ...styles.button,
      ...{ height: props.heightOnly },
    };
  }

  buttonStyle = {
    ...buttonStyle,
    ...{ backgroundColor: color },
  };
  return (
    <Pressable
      //   onPress={props.onDeleteItem.bind(this, props.id)}
      onPress={props.onPress}
      style={({ pressed }) => pressed && styles.pressed}
      flex={props.flex}
    >
      {/* View with button style and custom width */}
      {/* Text with button text style and custom text */}
      <View style={buttonStyle}>
        {/* <View style={styles.button}> */}
        <Text style={{ color: textColor }}>{props.text}</Text>
      </View>
    </Pressable>
  );
}

export default MyButton;

const styles = StyleSheet.create({
  button: {
    margin: 8,
    borderRadius: 6,
    padding: 8,
    color: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  pressed: { opacity: 0.5 },
});
