import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = "http://10.243.76.65:8080";

const Menu = ({ navigation, route }) => {

  // IMPORTANT:
  // route.params ke andar registration_no hai
  const { registration_no } = route.params;

  // HOME
  const goHome = () => {
    navigation.navigate("StudentDashboard", {
      registration_no: registration_no
    });
  };

  // LOGOUT
 const logout = async () => {
  try {

    const token = await AsyncStorage.getItem("token");

    if (!token) {
      Alert.alert("Error", "No token found");
      return;
    }

    const response = await axios.post(
      `${BASE_URL}/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    console.log("Logout response:", response.data);

    // JWT token remove from phone
    await AsyncStorage.removeItem("token");
    Alert.alert(
      "Success",
      "Logged out successfully"
    );

    navigation.replace("Login");

  } catch (error) {

    console.log(
      "Logout error:",
      error.response?.data || error.message
    );

    Alert.alert(
      "Logout Error",
      error.response?.data?.message ||
      error.message ||
      "Logout failed"
    );
  }
};

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Menu
      </Text>

      {/* HOME */}
      <TouchableOpacity
        style={styles.item}
        onPress={goHome}
      >
        <Text style={styles.text}>
          Home
        </Text>
      </TouchableOpacity>


      {/* MY CLEARANCE STATUS */}
      <TouchableOpacity
        style={styles.item}
        onPress={() =>
          navigation.navigate(
            "MyClearanceRequestsScreen",
            {
              registration_no: registration_no
            }
          )
        }
      >
        <Text style={styles.text}>
          Clearance Status
        </Text>
      </TouchableOpacity>


      {/* LOGOUT */}
      <TouchableOpacity
        style={[styles.item, styles.logout]}
        onPress={logout}
      >
        <Text style={[styles.text, { color: "#fff" }]}>
          Logout
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default Menu;


const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F5F5F5"
  },

  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20
  },

  item: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10
  },

  text: {
    fontSize: 16,
    fontWeight: "bold"
  },

  logout: {
    backgroundColor: "red"
  }

});