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

import axios from "axios";
import Icon from "react-native-vector-icons/Feather";

const BASE_URL = "http://10.243.76.65:8080";

const ForgotPasswordScreen = ({ navigation }) => {

  const [registration_no, setRegistrationNo] = useState("");
  const [phoneno, setPhoneno] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);

  const resetPassword = async () => {

    if (
      !registration_no ||
      !phoneno ||
      !newPassword ||
      !confirmPassword
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill all fields."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert(
        "Password Error",
        "New password and confirm password do not match."
      );
      return;
    }

    try {

      setLoading(true);

      const res = await axios.post(
        `${BASE_URL}/forgot-password`,
        {
          registration_no,
          phoneno,
          newPassword
        }
      );

      Alert.alert(
        "Success",
        "Password reset successfully. You can now login with your new password.",
        [
          {
            text: "OK",
            onPress: () => navigation.goBack()
          }
        ]
      );

    } catch (err) {

      console.log(
        "Forgot Password Error:",
        err.response?.data || err.message
      );

      Alert.alert(
        "Reset Failed",
        err.response?.data?.message ||
        "Registration number or phone number is incorrect."
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

        {/* ICON */}

        <View style={styles.logoCircle}>

          <Icon
            name="lock"
            size={40}
            color="#fff"
          />

        </View>


        {/* TITLE */}

        <Text style={styles.title}>
          Forgot Password
        </Text>

        <Text style={styles.subtitle}>
          Reset your password to access your account
        </Text>


        {/* CARD */}

        <View style={styles.card}>

          {/* REGISTRATION NUMBER */}

          <Text style={styles.label}>
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


          {/* PHONE NUMBER */}

          <Text style={styles.label}>
            Phone Number
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="phone"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />

            <TextInput
              placeholder="Enter registered phone number"
              placeholderTextColor="#999"
              value={phoneno}
              onChangeText={setPhoneno}
              style={styles.input}
              keyboardType="phone-pad"
            />

          </View>


          {/* NEW PASSWORD */}

          <Text style={styles.label}>
            New Password
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="lock"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />

            <TextInput
              placeholder="Enter new password"
              placeholderTextColor="#999"
              secureTextEntry={!showPassword}
              value={newPassword}
              onChangeText={setNewPassword}
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


          {/* CONFIRM PASSWORD */}

          <Text style={styles.label}>
            Confirm Password
          </Text>

          <View style={styles.inputContainer}>

            <Icon
              name="lock"
              size={20}
              color="#777"
              style={styles.inputIcon}
            />

            <TextInput
              placeholder="Confirm new password"
              placeholderTextColor="#999"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              style={styles.input}
            />

            <TouchableOpacity
              onPress={() =>
                setShowConfirmPassword(
                  !showConfirmPassword
                )
              }
            >

              <Icon
                name={
                  showConfirmPassword
                    ? "eye-off"
                    : "eye"
                }
                size={20}
                color="#777"
              />

            </TouchableOpacity>

          </View>


          {/* RESET BUTTON */}

          <TouchableOpacity
            style={[
              styles.resetButton,
              loading && styles.disabledButton
            ]}
            onPress={resetPassword}
            disabled={loading}
          >

            <Text style={styles.resetButtonText}>
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </Text>

            {!loading && (
              <Icon
                name="check"
                size={20}
                color="#fff"
              />
            )}

          </TouchableOpacity>


          {/* BACK TO LOGIN */}

          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >

            <Icon
              name="arrow-left"
              size={17}
              color="#16803C"
            />

            <Text style={styles.backText}>
              Back to Login
            </Text>

          </TouchableOpacity>

        </View>


        <Text style={styles.footer}>
          © 2026 Clearance Management System
        </Text>

      </ScrollView>

    </KeyboardAvoidingView>

  );
};

export default ForgotPasswordScreen;


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

  logoCircle: {
    width: 78,
    height: 78,
    borderRadius: 39,
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

  title: {
    fontSize: 27,
    fontWeight: "bold",
    color: "#16803C",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 5,
    marginBottom: 25,
    textAlign: "center",
  },

  card: {
    width: "100%",
    maxWidth: 430,
    backgroundColor: "#fff",
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

  label: {
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

  resetButton: {
    height: 52,
    backgroundColor: "#16803C",
    borderRadius: 10,

    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",

    marginTop: 18,

    elevation: 3,
  },

  disabledButton: {
    backgroundColor: "#8AB89A",
  },

  resetButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 10,
  },

  backButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },

  backText: {
    color: "#16803C",
    fontSize: 13,
    fontWeight: "bold",
    marginLeft: 6,
  },

  footer: {
    marginTop: 20,
    fontSize: 11,
    color: "#999",
    textAlign: "center",
  },

});