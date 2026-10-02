import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";

//import Loginscreen from "./components/Finalproject/Loginscreen";
//import Homescreen from "./components/Finalproject/Homescreen";
///import Createcommittee from "./components/Finalproject/Createcommittee";
//import HamburgerMenu from "./components/Finalproject/HamburgerMenu";
//import Profilescreen from "./components/Finalproject/Profilescreen";
//import Joinscreen from "./components/Finalproject/Joinscreen";
//import Adminnot from "./components/Finalproject/Adminnot";
//import BiddingScreen from "./components/Finalproject/BiddingScreen";
//import NotificationsScreen from "./components/Finalproject/NotificationsScreen";
//import ResetPassword from "./components/Finalproject/ResetPassword";
//import CommitteeDetails from "./components/Finalproject/CommitteeDetails";
//import TransferAdmin from "./components/Finalproject/TransferAdmin";
//import MemberDashboard from"./components/Finalproject/MemberDashboard";
//import PaymentScreen from"./components/Finalproject/PaymentScreen";
//import InviteMember from "./components/Finalproject/InviteMember";
//import Profileview from "./components/Finalproject/Profileview";
///////////////////////
import FinalCertificate from "./components/Degreeclear/FinalCertificateScreen";
import LoginScreen from "./components/Degreeclear/LoginScreen";
import RegisterScreen from "./components/Degreeclear/RegisterScreen";
import StudentDashboard from "./components/Degreeclear/StudentDashboard";
import CreateClearanceScreen from "./components/Degreeclear/CreateClearanceScreen";
import MyClearanceRequestsScreen from "./components/Degreeclear/MyClearanceRequestsScreen";
import Department from "./components/Degreeclear/Department";
import Menu from "./components/Degreeclear/Menu";
//import FinalCertificate from "./components/Degreeclear/FinalCertificateScreen";
//import CertificateScreen from "./components/Degreeclear/CertificateScreen";
import lowgradecourse from  "./components/Degreeclear/lowgradecourse";
import ForgotPasswordScreen from "./components/Degreeclear/ForgotPasswordScreen";
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator  initialRouteName="Login"screenOptions={{ headerShown: true }}>
  
        <Stack.Screen name="Login" component={LoginScreen} options={{headerBackVisible: false}}/>
        <Stack.Screen name="RegisterScreen" component={RegisterScreen}/>
        <Stack.Screen name="StudentDashboard" component={StudentDashboard} options={{headerBackVisible: false}}/>
        <Stack.Screen name="Menu" component={Menu}/>
         <Stack.Screen name="CreateClearance" component={CreateClearanceScreen}/>
        <Stack.Screen name="MyClearanceRequestsScreen"component={MyClearanceRequestsScreen}/>
        <Stack.Screen name="DepartmentScreen" component={Department}  options={{headerBackVisible: false}}/>
         <Stack.Screen name="lowgradecourse" component={lowgradecourse} />
         <Stack.Screen name="ForgotPasswordScreen"component={ForgotPasswordScreen}/>
        <Stack.Screen name="FinalCertificate"component={FinalCertificate}/>
      </Stack.Navigator>

    </NavigationContainer>
  );
};

export default App;