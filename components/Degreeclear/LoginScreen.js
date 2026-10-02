import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Icon from "react-native-vector-icons/Feather";

const LoginScreen = ({ navigation }) => {

  const [registration_no, setRegistrationNo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {

    try {

      if (!registration_no || !password) {
        Alert.alert(
          "Missing Information",
          "Please enter registration number and password."
        );
        return;
      }

      setLoading(true);

      const res = await axios.post(
        "http://10.243.76.65:8080/login",
        {
          registration_no,
          password
        }
      );

      const token = res.data.token;
await AsyncStorage.setItem("token", token);
const user = res.data.user;
      // ROLE BASED ROUTING
      if (user.role === "student") {

        navigation.replace("StudentDashboard", {
          studentId: user.id,
          registration_no: user.registration_no,
          name: user.name,
          department: user.department,
          role: user.role
        });

      }
      else {

        navigation.replace("DepartmentScreen", {

          studentId: user.id,
          role: user.role,
          registration_no: user.registration_no,
          department: user.department

        });

      }

    } catch (err) {

      console.log(err.response?.data || err.message);

      Alert.alert(
        "Login Failed",
        "Invalid registration number or password."
      );

    } finally {

      setLoading(false);

    }
  };

  return (

    <KeyboardAvoidingView
      style={styles.mainContainer}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >

        {/* TOP LOGO */}

        <View style={styles.logoCircle}>
          <Icon
            name="shield"
            size={42}
            color="#ffffff"
          />
        </View>


        {/* APP NAME */}

        <Text style={styles.appName}>
          Clearance System
        </Text>

        <Text style={styles.appSubtitle}>
          Student Clearance Management
        </Text>


        {/* LOGIN CARD */}

        <View style={styles.loginCard}>

          <Text style={styles.heading}>
            Welcome Back
          </Text>

          <Text style={styles.description}>
            Login to continue to your account
          </Text>


          {/* REGISTRATION NUMBER */}

          <Text style={styles.inputLabel}>
            Registration Number
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="user"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />

            <TextInput
              placeholder="Enter registration number"
              placeholderTextColor="#999"
              value={registration_no}
              onChangeText={setRegistrationNo}
              style={styles.input}
              autoCapitalize="none"
            />

          </View>


          {/* PASSWORD */}

          <Text style={styles.inputLabel}>
            Password
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="lock"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />

            <TextInput
              placeholder="Enter your password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowPassword(!showPassword)
              }
            >

              <Icon
                name={
                  showPassword
                    ? "eye-off"
                    : "eye"
                }
                size={20}
                color="#777"
              />

            </TouchableOpacity>

          </View>


          {/* FORGOT PASSWORD */}

      <TouchableOpacity style={styles.forgotContainer}
  onPress={() => navigation.navigate("ForgotPasswordScreen")}
>
  <Text style={styles.forgotText}>
    FORGOT PASSWORD
  </Text>
</TouchableOpacity>
          {/* LOGIN BUTTON */}

          <TouchableOpacity
            style={[
              
              styles.loginButton,
              loading && styles.disabledButton
            ]}
            onPress={login}
            disabled={loading}
          >

            <Text style={styles.loginButtonText}>

              {loading
                ? "Logging in..."
                : "Login"}

            </Text>

            {!loading && (
              <Icon
                name="arrow-right"
                size={20}
                color="#fff"
              />
            )}

          </TouchableOpacity>


          {/* SIGN UP */}

          <View style={styles.signupContainer}>

            <Text style={styles.noAccount}>
              Don't have an account?
            </Text>

            <TouchableOpacity
               onPress={() => navigation.navigate("RegisterScreen")}
            >

              <Text style={styles.signup}>
                Sign Up
              </Text>

            </TouchableOpacity>

          </View>

        </View>


        {/* FOOTER */}

        <Text style={styles.footer}>
          © 2026 Clearance Management System
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>

  );
};

export default LoginScreen;


const styles = StyleSheet.create({

  mainContainer: {
    flex: 1,
    backgroundColor: "#F4F7F5",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },


  /* LOGO */

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#16803C",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,

    elevation: 7,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },


  appName: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#16803C",
    textAlign: "center",
  },

  appSubtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
    marginBottom: 25,
    textAlign: "center",
  },


  /* CARD */

  loginCard: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 22,

    elevation: 6,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 8,
  },


  heading: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#222",
    textAlign: "center",
  },

  description: {
    textAlign: "center",
    color: "#777",
    fontSize: 14,
    marginTop: 6,
    marginBottom: 25,
  },


  /* INPUT */

  inputLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginBottom: 7,
    marginTop: 8,
  },

  inputContainer: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D9D9D9",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    backgroundColor: "#FAFAFA",
    marginBottom: 8,
  },

  inputIcon: {
    marginRight: 10,
  },

  input: {
    flex: 1,
    fontSize: 15,
    color: "#222",
    paddingVertical: 0,
  },


  /* FORGOT */

  forgotContainer: {
    alignItems: "flex-end",
    marginTop: 5,
    marginBottom: 20,
  },

  forgotText: {
    color: "#16803C",
    fontSize: 13,
    fontWeight: "600",
  },


  /* LOGIN */

  loginButton: {
    height: 52,
    backgroundColor: "#16803C",
    borderRadius: 10,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    elevation: 3,
  },

  disabledButton: {
    backgroundColor: "#8AB89A",
  },

  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },


  /* SIGN UP */

  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
  },

  noAccount: {
    color: "#777",
    fontSize: 13,
    marginRight: 5,
  },

  signup: {
    color: "#16803C",
    fontSize: 13,
    fontWeight: "bold",
  },


  /* FOOTER */

  footer: {
    marginTop: 20,
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },

});