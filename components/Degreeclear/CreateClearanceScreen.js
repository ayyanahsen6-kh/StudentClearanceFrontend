
import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import axios from "axios";

export default function CreateClearanceScreen({ route, navigation }) {

  const { registration_no } = route.params;

  const apply = async () => {
    try {
      await axios.post(
        "http://10.243.76.65:8080/clearancerequest",
        { registration_no }
      );

      Alert.alert(
        "Success",
        "Clearance Request Sent" 
      );
      navigation.goBack()

    } catch (err) {
      console.log(err.message);

      Alert.alert(
        "Error",
        err.response?.data || "Something went wrong"
      );
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >
      <TouchableOpacity
        onPress={apply}
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
          width: "100%"
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          Send Clearance To All Roles
        </Text>
      </TouchableOpacity>
    </View>
  );
}
{/* import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  Alert
} from "react-native";
import axios from "axios";

export default function CreateClearanceScreen({ route, navigation }) {

  const { studentId } = route.params;

  const apply = async () => {
    try {
      await axios.post(
        "http://10.120.106.65:5000/api/clearance/request",
        { 
          studentId
        }
      );

      Alert.alert(
        "Success",
        "Clearance Request Sent" 
      );
      navigation.goBack()

    } catch (err) {
      console.log(err.message);

  Alert.alert(
    "Error",
    err.response?.data?.message
);
    }
  };

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20
      }}
    >
      <TouchableOpacity
        onPress={apply}
        style={{
          backgroundColor: "green",
          padding: 15,
          borderRadius: 8,
          width: "100%"
        }}
      >
        <Text
          style={{
            color: "#fff",
            textAlign: "center",
            fontWeight: "bold"
          }}
        >
          Send Clearance To All Roles
        </Text>
      </TouchableOpacity>
    </View>
  );
}
  */}