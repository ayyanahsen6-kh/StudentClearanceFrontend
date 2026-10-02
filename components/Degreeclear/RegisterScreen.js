import React,{useState} from "react";
import {
 View,
 Text,
 TextInput,
 TouchableOpacity,
 Alert,
 ScrollView
} from "react-native";
import { Picker } from '@react-native-picker/picker';
import axios from "axios";


const RegisterScreen = ({ navigation }) => {

  const [name,setName] = useState("");
 const [registration_no,setRegistration_no] = useState("");
 const [phoneno,setPhoneno] = useState("");
 const [password,setPassword] = useState("");
 const [department,setDepartment] = useState("");

 const signup = async () => {

  try {
   if (!name || !registration_no || !phoneno || !password || !department) 
  {
  Alert.alert(
    "Error",
    "Please fill all fields"
  );
  return;
}
   await axios.post("http://10.243.76.65:8080/signup",{
      name,
      registration_no,
      phoneno,
      password,
      department
    }
   );

   Alert.alert(
    "Success",
    "Account Created"
   );

   navigation.goBack();

  } catch(err) {

   Alert.alert(
    "Error",
    err.response?.data || "Failed"
   );
  }
 };

 return(
  <ScrollView
   contentContainerStyle={{
    padding:20
   }}
  >

   <TextInput
    placeholder="Name"
    value={name}
    onChangeText={setName}
    style={{
      borderWidth:1,
      marginBottom:10,
      padding:10
    }}
   />

   <TextInput
    placeholder="Student No"
    value={registration_no}
    onChangeText={setRegistration_no}
    style={{
      borderWidth:1,
      marginBottom:10,
      padding:10
    }}
   />

   <TextInput
    placeholder="Phone Number"
    value={phoneno}
    onChangeText={setPhoneno}
    style={{
      borderWidth:1,
      marginBottom:10,
      padding:10
    }}
   />
    <View
  style={{
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 10
  }}
>
  <Picker
    selectedValue={department}
    onValueChange={(itemValue) =>
      setDepartment(itemValue)
    }
  >
    <Picker.Item
      label="Select Department"
      value=""
    />

    <Picker.Item
      label="Computer Science"
      value="CS"
    />

    <Picker.Item
      label="Software Engineering"
      value="SE"
    />

    <Picker.Item
      label="Information Technology"
      value="IT"
    />

  </Picker>
</View>

   <TextInput
    placeholder="Password"
    secureTextEntry
    value={password}
    onChangeText={setPassword}
    style={{
      borderWidth:1,
      marginBottom:10,
      padding:10
    }}
   />

   <TouchableOpacity
    onPress={signup}
    style={{
      backgroundColor:"green",
      padding:15
    }}
   >
    <Text
     style={{
      color:"#fff",
      textAlign:"center"
     }}
    >
      Signup
    </Text>
   </TouchableOpacity>

  </ScrollView>
 );
}
export default RegisterScreen;