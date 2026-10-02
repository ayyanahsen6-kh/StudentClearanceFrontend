import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  StyleSheet,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";
import Icon from "react-native-vector-icons/Feather";

const BASE_URL = "http://10.243.76.65:8080";

const StudentDashboard = ({ route, navigation }) => {
  const {
    studentId,
    registration_no,
    name,
    department,
    role,
  } = route.params;

  const [eligible, setEligible] = useState(false);
  const [cgpa, setCgpa] = useState(null);
  const [failedCourses, setFailedCourses] = useState([]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getStatus();
    }, [])
  );

  const getStatus = async () => {
    try {
      setLoading(true);

      const check = await axios.get(
        `${BASE_URL}/checkeligibility/${registration_no}`
      );

      console.log("Eligibility Response:", check.data);

      setEligible(check.data.eligible);
      setCgpa(check.data.cgpa);
      setFailedCourses(check.data.failedCourses || []);
    } catch (err) {
      console.log(
        "Eligibility Error:",
        err.response?.data || err.message
      );

      setEligible(false);
      setCgpa(null);
      setFailedCourses([]);
    }

    try {
      const res = await axios.get(
        `${BASE_URL}/clearancemy-status/${registration_no}`
      );

      console.log("Clearance Response:", res.data);

      setData(res.data);
    } catch (err) {
      console.log(
        "Clearance Error:",
        err.response?.data || err.message
      );

      setData(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return styles.approved;
    }

    if (status === "rejected") {
      return styles.rejected;
    }

    return styles.pending;
  };

  const resendRequest = async (departmentRole) => {
    try {
      await axios.post(`${BASE_URL}/requestagain`, {
        registration_no,
        role: departmentRole,
      });

      Alert.alert(
        "Success",
        `${departmentRole} request sent again`
      );

      getStatus();
    } catch (err) {
      console.log(err.response?.data || err.message);

      Alert.alert(
        "Error",
        err.response?.data || "Request Again failed"
      );
    }
  };

  return (
    <ScrollView
    style={styles.screen}  
    contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* TOP HEADER */}

      <View style={styles.topHeader}>

        <View style={styles.headerText}>
          <Text style={styles.smallWelcome}>
            WELCOME BACK
          </Text>

          <Text style={styles.studentName}>
            {name}
          </Text>

          <Text style={styles.dashboardText}>
            Student Dashboard
          </Text>
        </View>

        <TouchableOpacity
          style={styles.menuButton}
          onPress={() =>
            navigation.navigate("Menu", {
              registration_no,
            })
          }
        >
          <Icon
            name="menu"
            size={25}
            color="#fff"
          />
        </TouchableOpacity>

      </View>


      {/* STUDENT INFO */}

      <View style={styles.studentCard}>

        <View style={styles.studentCardHeader}>

          <View style={styles.profileCircle}>
            <Icon
              name="user"
              size={24}
              color="#fff"
            />
          </View>

          <View>
            <Text style={styles.profileTitle}>
              Student Profile
            </Text>

            <Text style={styles.profileSub}>
              Personal Information
            </Text>
          </View>

        </View>


        <View style={styles.infoLine}>

          <Text style={styles.infoTitle}>
            Registration No
          </Text>

          <Text style={styles.infoValue}>
            {registration_no}
          </Text>

        </View>


        <View style={styles.infoLine}>

          <Text style={styles.infoTitle}>
            Department
          </Text>

          <Text style={styles.infoValue}>
            {department}
          </Text>

        </View>


        <View style={styles.infoLine}>

          <Text style={styles.infoTitle}>
             System Role
          </Text>

          <Text style={styles.roleBadge}>
            {role}
          </Text>

        </View>

      </View>


      {/* CLEARANCE CARD */}

      <View style={styles.clearanceCard}>

        <View style={styles.sectionHeader}>

          <View>
            <Text style={styles.sectionTitle}>
              Clearance Status
            </Text>

            <Text style={styles.sectionSub}>
              Department approval progress
            </Text>
          </View>

          <View style={styles.statusIcon}>
            <Icon
              name="check-circle"
              size={22}
              color="green"
            />
          </View>

        </View>


        {/* FINANCE */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="credit-card"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Finance
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.finance_status
              )}
            >
              {data?.status?.finance_status ||
                "Not Requested"}
            </Text>

            {data?.status?.finance_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("finance")
                }
              >
                <Text style={styles.requestText}>
                  Request Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.finance_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.finance_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* DATACELL */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="database"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Datacell
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.datacell_status
              )}
            >
              {data?.status?.datacell_status ||
                "Not Requested"}
            </Text>

            {data?.status?.datacell_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("datacell")
                }
              >
                <Text style={styles.requestText}>
                   Request Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.datacell_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.datacell_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* LAB */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="tool"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Lab
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.lab_status
              )}
            >
              {data?.status?.lab_status ||
                "Not Requested"}
            </Text>

            {data?.status?.lab_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("lab")
                }
              >
                <Text style={styles.requestText}>
                 Request Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.lab_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.lab_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* LIBRARY */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="book-open"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Library
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.library_status
              )}
            >
              {data?.status?.library_status ||
                "Not Requested"}
            </Text>

            {data?.status?.library_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("library")
                }
              >
                <Text style={styles.requestText}>
                 Request Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.library_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.library_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* PHOTOCOPIER */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="copy"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Photocopier
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.photocopier_status
              )}
            >
              {data?.status?.photocopier_status ||
                "Not Requested"}
            </Text>

            {data?.status?.photocopier_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("photocopier")
                }
              >
                <Text style={styles.requestText}>
                Request  Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.photocopier_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.photocopier_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* REPORT */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="file-text"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Report
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.report_status
              )}
            >
              {data?.status?.report_status ||
                "Not Requested"}
            </Text>

            {data?.status?.report_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("report")
                }
              >
                <Text style={styles.requestText}>
                Request  Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.report_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.report_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}


        {/* CAFETERIA */}

        <View style={styles.statusRow}>

          <View style={styles.departmentName}>
            <Icon
              name="coffee"
              size={18}
              color="#555"
            />

            <Text style={styles.label}>
              Cafeteria
            </Text>
          </View>

          <View style={styles.statusRight}>

            <Text
              style={getStatusStyle(
                data?.status?.cafeteria_status
              )}
            >
              {data?.status?.cafeteria_status ||
                "Not Requested"}
            </Text>

            {data?.status?.cafeteria_status === "rejected" && (
              <TouchableOpacity
                style={styles.requestButton}
                onPress={() =>
                  resendRequest("cafeteria")
                }
              >
                <Text style={styles.requestText}>
                Request  Again
                </Text>
              </TouchableOpacity>
            )}

          </View>

        </View>


        {data?.status?.cafeteria_status === "rejected" && (
          <View style={styles.reasonBox}>
            <Icon
              name="alert-circle"
              size={15}
              color="#d32f2f"
            />

            <Text style={styles.reasonText}>
              {data?.status?.cafeteria_reason ||
                "No reason provided"}
            </Text>
          </View>
        )}

      </View>


      {/* APPLY CLEARANCE */}

      {eligible && !data?.registration_no && (
        <TouchableOpacity
          style={styles.applyButton}
          onPress={() =>
            navigation.navigate("CreateClearance", {
              registration_no,
            })
          }
        >
          <Icon
            name="send"
            size={19}
            color="#fff"
          />

          <Text style={styles.applyText}>
            Apply for Clearance
          </Text>
        </TouchableOpacity>
      )}
{/* FINAL CERTIFICATE */}

{data?.overall_status === "approved" && (
  <TouchableOpacity
    style={styles.finalCertificateButton}
    onPress={() =>
      navigation.navigate("FinalCertificate", {
        registration_no,
        name,
        department,
        role,
      })
    }
  >
    <Icon
      name="award"
      size={21}
      color="#fff"
    />

    <Text style={styles.finalCertificateText}>
      Final Certificate
    </Text>
  </TouchableOpacity>
)}

      {/* NOT ELIGIBLE */}

      {!eligible && (
        <View style={styles.notEligibleCard}>

          <View style={styles.warningHeader}>

            <View style={styles.warningCircle}>
              <Icon
                name="alert-triangle"
                size={22}
                color="#d32f2f"
              />
            </View>

            <View>
              <Text style={styles.notEligibleTitle}>
                Clearance Not Available
              </Text>

              <Text style={styles.notEligibleSub}>
                You currently do not meet the requirements.
              </Text>
            </View>

          </View>


          <View style={styles.cgpaCard}>

            <Text style={styles.cgpaTitle}>
              Current CGPA
            </Text>

            <Text style={styles.cgpaValue}>
              {cgpa ?? "Not Found"}
            </Text>

          </View>


          <View style={styles.failedCard}>

            <Text style={styles.failedTitle}>
              Failed Courses
            </Text>

            <Text style={styles.failedCount}>
              {failedCourses.length}
            </Text>

          </View>


          {failedCourses.length > 0 && (

            <View style={styles.courseList}>

              <Text style={styles.courseHeading}>
                Failed Course No:
              </Text>

              {failedCourses.map((course, index) => (
                <View
                  key={index}
                  style={styles.courseItem}
                >
                  <Icon
                    name="x-circle"
                    size={15}
                    color="#d32f2f"
                  />

                  <Text style={styles.courseText}>
                    {course.courseno}
                  </Text>
                </View>
              ))}

            </View>

          )}


          {failedCourses.length > 0 && (
            <Text style={styles.warningText}>
              You have failed course(s).
            </Text>
          )}


          {cgpa !== null && cgpa < 2.5 && (
            <TouchableOpacity
              style={styles.viewCourseButton}
              onPress={() =>
                navigation.navigate("lowgradecourse", {
                  registration_no,
                })
              }
            >
              <Icon
                name="book-open"
                size={18}
                color="#fff"
              />

              <Text style={styles.viewCourseText}>
                View C & D Grade Courses
              </Text>
            </TouchableOpacity>
          )}

        </View>
      )}

    </ScrollView>
  );
};

export default StudentDashboard;


const styles = StyleSheet.create({

  container: {
  padding: 18,
  paddingBottom: 40,
  backgroundColor: "rgb(165, 233, 188)",
},
screen: {
  flex: 1,
  backgroundColor:"#F1F4F3",
},


  /* HEADER */

  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },

  headerText: {
    flex: 1,
  },

  smallWelcome: {
    fontSize: 11,
    fontWeight: "bold",
    color: "green",
    letterSpacing: 1,
  },

  studentName: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#202124",
    marginTop: 2,
  },

  dashboardText: {
    fontSize: 13,
    color: "#777",
    marginTop: 2,
  },

  menuButton: {
    width: 47,
    height: 47,
    borderRadius: 14,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },


  /* STUDENT CARD */

  studentCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  studentCardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },

  profileCircle: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  profileTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#222",
  },

  profileSub: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },

  infoLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 9,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  infoTitle: {
    fontSize: 13,
    color: "#777",
  },

  infoValue: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#222",
  },
  finalCertificateButton: {
  backgroundColor: "#188038",
  borderRadius: 12,
  paddingVertical: 15,
  flexDirection: "row",
  justifyContent: "center",
  alignItems: "center",
  elevation: 4,
  marginBottom: 16,
},

finalCertificateText: {
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  marginLeft: 9,
},

  roleBadge: {
    backgroundColor: "#E8F5E9",
    color: "green",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: "bold",
  },


  /* CLEARANCE */

  clearanceCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 4,
    marginBottom: 16,
  },

  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 7,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#202124",
  },

  sectionSub: {
    color: "#888",
    fontSize: 12,
    marginTop: 3,
  },

  statusIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  departmentName: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  label: {
    fontSize: 15,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },

  statusRight: {
    flexDirection: "row",
    alignItems: "center",
  },


  /* STATUS */

  pending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 11,
    fontWeight: "bold",
  },

  approved: {
    backgroundColor: "#E8F5E9",
    color: "#188038",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 11,
    fontWeight: "bold",
  },

  rejected: {
    backgroundColor: "#FDE8E8",
    color: "#D32F2F",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 11,
    fontWeight: "bold",
  },


  /* REQUEST AGAIN */

  requestButton: {
    backgroundColor: "#1976D2",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    marginLeft: 6,
  },

  requestText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },


  /* REASON */

  reasonBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 9,
    borderRadius: 7,
    marginBottom: 6,
  },

  reasonText: {
    color: "#D32F2F",
    fontSize: 12,
    marginLeft: 6,
    flex: 1,
  },


  /* APPLY */

  applyButton: {
    backgroundColor: "green",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 16,
  },

  applyText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 9,
  },


  /* NOT ELIGIBLE */

  notEligibleCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    elevation: 4,
    borderLeftWidth: 5,
    borderLeftColor: "#D32F2F",
  },

  warningHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },

  warningCircle: {
    width: 43,
    height: 43,
    borderRadius: 22,
    backgroundColor: "#FDE8E8",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },

  notEligibleTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#D32F2F",
  },

  notEligibleSub: {
    fontSize: 11,
    color: "#888",
    marginTop: 3,
  },

  cgpaCard: {
    backgroundColor: "#F7F9FA",
    padding: 13,
    borderRadius: 10,
    marginBottom: 9,
  },

  cgpaTitle: {
    color: "#777",
    fontSize: 12,
  },

  cgpaValue: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#D32F2F",
    marginTop: 3,
  },

  failedCard: {
    backgroundColor: "#FFF7F7",
    padding: 13,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  failedTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },

  failedCount: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D32F2F",
  },

  courseList: {
    marginTop: 13,
  },

  courseHeading: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#555",
    marginBottom: 7,
  },

  courseItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },

  courseText: {
    color: "#D32F2F",
    fontSize: 13,
    marginLeft: 7,
  },

  warningText: {
    color: "#D32F2F",
    fontSize: 12,
    marginTop: 8,
  },

  viewCourseButton: {
    backgroundColor: "#1976D2",
    paddingVertical: 13,
    borderRadius: 10,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  viewCourseText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
    marginLeft: 8,
  },

});