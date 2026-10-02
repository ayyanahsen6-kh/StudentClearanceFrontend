import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  TextInput,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from "react-native";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
const BASE_URL = "http://10.243.76.65:8080";

const Department = ({ navigation, route }) => {
  const [search, setSearch] = useState("");
  const [resendData, setResendData] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const [reason, setReason] = useState("");

  const { role, registration_no, department } = route.params;

  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // LOAD REJECTED REQUESTS
  const loadRejectedRequests = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/rejectedrequests/${role}`
      );

      setResendData(res.data);
    } catch (err) {
      console.log("Rejected Error:", err.message);
    }
  };

  const logout = async () => {
  try {
    // JWT token lo
    const token = await AsyncStorage.getItem("token");

    if (token) {
      // Backend logout API ko token ke sath call karo
      await axios.post(
        `${BASE_URL}/logout`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    }

    // Mobile se token delete karo
    await AsyncStorage.removeItem("token");

    Alert.alert("Success", "Logged out successfully");

    // Login screen par wapas jao
    navigation.replace("Login");

  } catch (error) {

    console.log(
      "Logout Error:",
      error.response?.data || error.message
    );

    // Agar backend request fail bhi ho jaye,
    // local token phir bhi delete kar do
    await AsyncStorage.removeItem("token");

    navigation.replace("Login");
  }
};

  // LOAD PENDING REQUESTS
  const loadRequests = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/clearancepending/${role}`
      );

      setData(res.data);
    } catch (err) {
      console.log("ERROR:", err.response?.data);
      console.log("MESSAGE:", err.message);

      Alert.alert(
        "Error",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
    loadRejectedRequests();
  }, []);

  // APPROVE / REJECT
  const action = async (registration_no, status) => {
    try {
      await axios.post(`${BASE_URL}/clearanceaction`, {
        registration_no,
        role,
        status,
        reason,
      });

      Alert.alert("Success", `Student ${status}`);

      setReason("");

      loadRequests();
      loadRejectedRequests();
    } catch (err) {
      console.log(err.message);
      Alert.alert("Error", "Action failed");
    }
  };

  // SEARCH REJECTED REQUESTS
  const filteredData = resendData.filter((item) =>
    item.registration_no
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="#173F35"
      />

      <View style={styles.container}>

        {/* ================= HEADER ================= */}

        <View style={styles.header}>
          <View>
            <Text style={styles.headerSmall}>
              CLEARANCE SYSTEM
            </Text>

            <Text style={styles.headerTitle}>
              {role.toUpperCase()} DASHBOARD
            </Text>
          </View>

          <View style={styles.roleCircle}>
            <Text style={styles.roleCircleText}>
              {role.charAt(0).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* ================= DEPARTMENT INFO ================= */}

        <View style={styles.infoCard}>

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>
              Registration No
            </Text>

            <Text style={styles.infoValue}>
              {registration_no}
            </Text>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.infoItem}>
            <Text style={styles.infoLabel}>
              Department
            </Text>

            <Text style={styles.infoValue}>
              {department}
            </Text>
          </View>

        </View>

        {/* ================= TABS ================= */}

        <View style={styles.tabs}>

          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "pending" &&
                styles.activePendingTab,
            ]}
            onPress={() => setActiveTab("pending")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "pending" &&
                  styles.activeTabText,
              ]}
            >
              Pending
            </Text>

            <View
              style={[
                styles.count,
                activeTab === "pending" &&
                  styles.activeCount,
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  activeTab === "pending" &&
                    styles.activeCountText,
                ]}
              >
                {data.length}
              </Text>
            </View>
          </TouchableOpacity>


          <TouchableOpacity
            style={[
              styles.tab,
              activeTab === "rejected" &&
                styles.activeRejectedTab,
            ]}
            onPress={() => setActiveTab("rejected")}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === "rejected" &&
                  styles.activeRejectedText,
              ]}
            >
              Rejected
            </Text>

            <View
              style={[
                styles.count,
                activeTab === "rejected" &&
                  styles.activeRejectedCount,
              ]}
            >
              <Text
                style={[
                  styles.countText,
                  activeTab === "rejected" &&
                    styles.activeRejectedCountText,
                ]}
              >
                {resendData.length}
              </Text>
            </View>
          </TouchableOpacity>

        </View>


        {/* ================================================= */}
        {/*                  PENDING TAB                       */}
        {/* ================================================= */}

        {activeTab === "pending" && (
          <>

            <Text style={styles.sectionTitle}>
              Pending Requests
            </Text>

            {loading ? (

              <View style={styles.emptyBox}>
                <Text style={styles.emptyText}>
                  Loading requests...
                </Text>
              </View>

            ) : data.length === 0 ? (

              <View style={styles.emptyBox}>

                <Text style={styles.emptyIcon}>
                  ✓
                </Text>

                <Text style={styles.emptyTitle}>
                  No Pending Requests
                </Text>

                <Text style={styles.emptyText}>
                  There are currently no students waiting
                  for approval.
                </Text>

              </View>

            ) : (

              <FlatList
                data={data}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}

                renderItem={({ item }) => (

                  /* ================================
                     NEW PENDING STUDENT CARD
                     ================================ */

                  <View style={styles.pendingCard}>

                    {/* STUDENT HEADER */}

                    <View style={styles.studentHeader}>

                      <View style={styles.studentAvatar}>
                        <Text style={styles.avatarText}>
                          {item.name
                            ? item.name
                                .charAt(0)
                                .toUpperCase()
                            : "S"}
                        </Text>
                      </View>


                      <View style={styles.studentDetails}>

                        <Text style={styles.studentName}>
                          {item.name}
                        </Text>

                        <Text style={styles.registrationText}>
                          Registration No:{" "}
                          {item.registration_no}
                        </Text>

                      </View>


                      <View style={styles.pendingBadge}>
                        <Text style={styles.pendingBadgeText}>
                          PENDING
                        </Text>
                      </View>

                    </View>


                    {/* REQUEST INFORMATION */}

                    <View style={styles.requestBox}>

                      <Text style={styles.requestTitle}>
                        Clearance Request
                      </Text>

                      <Text style={styles.requestDescription}>
                        This student is requesting clearance
                        from {role.toLowerCase()} department.
                      </Text>

                    </View>


                    {/* REJECTION REASON */}

                    <Text style={styles.reasonLabel}>
                      Rejection Reason
                    </Text>

                    <TextInput
                      placeholder="Write reason if rejecting..."
                      placeholderTextColor="#9A9A9A"
                      value={reason}
                      onChangeText={setReason}
                      style={styles.reasonInput}
                    />


                    {/* ACTION BUTTONS */}

                    <View style={styles.actionButtons}>

                      <TouchableOpacity
                        style={styles.rejectButton}
                        onPress={() =>
                          action(
                            item.registration_no,
                            "rejected"
                          )
                        }
                      >
                        <Text style={styles.rejectButtonText}>
                          Reject
                        </Text>
                      </TouchableOpacity>


                      <TouchableOpacity
                        style={styles.approveButton}
                        onPress={() =>
                          action(
                            item.registration_no,
                            "approved"
                          )
                        }
                      >
                        <Text style={styles.approveButtonText}>
                          Approve
                        </Text>
                      </TouchableOpacity>

                    </View>

                  </View>
                )}
              />

            )}

          </>
        )}


        {/* ================================================= */}
        {/*                  REJECTED TAB                      */}
        {/* ================================================= */}

        {activeTab === "rejected" && (
          <>

            <Text style={styles.sectionTitle}>
              Rejected Requests
            </Text>


            {/* SEARCH */}

            <View style={styles.searchBox}>

              <Text style={styles.searchIcon}>
                🔍
              </Text>

              <TextInput
                placeholder="Search registration number..."
                placeholderTextColor="#999"
                value={search}
                onChangeText={setSearch}
                style={styles.search}
              />

            </View>


            {filteredData.length === 0 ? (

              <View style={styles.emptyBox}>

                <Text style={styles.emptyIcon}>
                  ✓
                </Text>

                <Text style={styles.emptyTitle}>
                  No Rejected Requests
                </Text>

                <Text style={styles.emptyText}>
                  No rejected clearance requests found.
                </Text>

              </View>

            ) : (

              <FlatList
                data={filteredData}
                keyExtractor={(item) => item._id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.list}

                renderItem={({ item }) => (

                  <View style={styles.card}>

                    {/* STUDENT HEADER */}

                    <View style={styles.cardTop}>

                      <View style={styles.rejectedAvatar}>
                        <Text style={styles.rejectedAvatarText}>
                          {item.name
                            ? item.name
                                .charAt(0)
                                .toUpperCase()
                            : "S"}
                        </Text>
                      </View>

                      <View style={styles.studentInfo}>

                        <Text style={styles.name}>
                          {item.name}
                        </Text>

                        <Text style={styles.regText}>
                          {item.registration_no}
                        </Text>

                      </View>

                      <View style={styles.rejectedBadge}>

                        <Text style={styles.rejectedText}>
                          REJECTED
                        </Text>

                      </View>

                    </View>


                    <View style={styles.divider} />


                    <Text style={styles.requestText}>
                      Clearance Request
                    </Text>

                    <Text style={styles.description}>
                      Request for{" "}
                      {role.toLowerCase()} clearance.
                    </Text>


                    <TouchableOpacity
                      style={styles.approveButtonFull}
                      onPress={() =>
                        action(
                          item.registration_no,
                          "approved"
                        )
                      }
                    >
                      <Text style={styles.approveText}>
                        Approve Request
                      </Text>
                    </TouchableOpacity>

                  </View>

                )}
              />

            )}

          </>
        )}


        {/* ================= LOGOUT ================= */}

        <TouchableOpacity
  onPress={logout}
  style={styles.logoutBtn}
>
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
};

export default Department;


/* ========================================================= */
/*                         STYLES                            */
/* ========================================================= */

const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: "#173F35",
  },

  container: {
    flex: 1,
    backgroundColor: "#F4F7F6",
    paddingHorizontal: 16,
  },


  /* ================= HEADER ================= */

  header: {
    backgroundColor: "#173F35",
    marginHorizontal: -16,
    paddingHorizontal: 20,
    paddingVertical: 18,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomLeftRadius: 22,
    borderBottomRightRadius: 22,
  },

  headerSmall: {
    color: "#B8D8CE",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 21,
    fontWeight: "800",
    marginTop: 4,
  },

  roleCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#2D6A5B",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#79A99B",
  },

  roleCircleText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "800",
  },


  /* ================= INFO CARD ================= */

  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginTop: 16,
    flexDirection: "row",
    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    color: "#89938F",
    fontSize: 11,
    fontWeight: "600",
    marginBottom: 5,
  },

  infoValue: {
    color: "#173F35",
    fontSize: 15,
    fontWeight: "700",
  },

  verticalLine: {
    width: 1,
    height: 38,
    backgroundColor: "#E2E8E5",
    marginHorizontal: 15,
  },


  /* ================= TABS ================= */

  tabs: {
    flexDirection: "row",
    backgroundColor: "#E7EEEB",
    borderRadius: 13,
    padding: 4,
    marginTop: 18,
    marginBottom: 16,
  },

  tab: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 10,
    gap: 7,
  },

  activePendingTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  activeRejectedTab: {
    backgroundColor: "#FFFFFF",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },

  tabText: {
    color: "#71807A",
    fontSize: 14,
    fontWeight: "700",
  },

  activeTabText: {
    color: "#173F35",
  },

  activeRejectedText: {
    color: "#B13B3B",
  },

  count: {
    minWidth: 25,
    height: 25,
    borderRadius: 13,
    backgroundColor: "#D3DDD9",
    justifyContent: "center",
    alignItems: "center",
  },

  activeCount: {
    backgroundColor: "#DDF0E9",
  },

  activeRejectedCount: {
    backgroundColor: "#FCE3E3",
  },

  countText: {
    color: "#65736D",
    fontSize: 12,
    fontWeight: "800",
  },

  activeCountText: {
    color: "#1E735D",
  },

  activeRejectedCountText: {
    color: "#B13B3B",
  },


  /* ================= SECTION ================= */

  sectionTitle: {
    color: "#173F35",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 10,
  },

  list: {
    paddingBottom: 80,
  },


  /* ================================================= */
  /*              NEW PENDING CARD STYLES              */
  /* ================================================= */

  pendingCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,

    borderWidth: 1,
    borderColor: "#E4EBE7",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.08,
    shadowRadius: 7,
    elevation: 3,
  },

  studentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  studentAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E1F1EB",
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    color: "#176B50",
    fontSize: 20,
    fontWeight: "800",
  },

  studentDetails: {
    flex: 1,
    marginLeft: 12,
  },

  studentName: {
    fontSize: 17,
    fontWeight: "800",
    color: "#1F2D28",
  },

  registrationText: {
    fontSize: 12,
    color: "#7C8883",
    marginTop: 4,
  },

  pendingBadge: {
    backgroundColor: "#FFF3D6",
    paddingHorizontal: 9,
    paddingVertical: 6,
    borderRadius: 8,
  },

  pendingBadgeText: {
    color: "#A66B00",
    fontSize: 10,
    fontWeight: "800",
  },

  requestBox: {
    backgroundColor: "#F5F8F6",
    borderRadius: 12,
    padding: 13,
    marginTop: 16,
    borderLeftWidth: 3,
    borderLeftColor: "#23745D",
  },

  requestTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: "#26352F",
  },

  requestDescription: {
    fontSize: 12,
    color: "#78847F",
    lineHeight: 18,
    marginTop: 5,
  },

  reasonLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4C5954",
    marginTop: 15,
    marginBottom: 6,
  },

  reasonInput: {
    backgroundColor: "#FAFBFA",
    borderWidth: 1,
    borderColor: "#D9E2DE",
    borderRadius: 10,
    minHeight: 45,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: "#26352F",
    fontSize: 13,
  },

  actionButtons: {
    flexDirection: "row",
    marginTop: 13,
    gap: 10,
  },

  rejectButton: {
    flex: 1,
    backgroundColor: "#FFF7F7",
    borderWidth: 1,
    borderColor: "#D65B5B",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  rejectButtonText: {
    color: "#C43F3F",
    fontSize: 14,
    fontWeight: "800",
  },

  approveButton: {
    flex: 1,
    backgroundColor: "#23745D",
    borderRadius: 10,
    paddingVertical: 11,
    alignItems: "center",
  },

  approveButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },


  /* ================= REJECTED CARD ================= */

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  cardTop: {
    flexDirection: "row",
    alignItems: "center",
  },

  rejectedAvatar: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: "#FCE3E3",
    justifyContent: "center",
    alignItems: "center",
  },

  rejectedAvatarText: {
    color: "#B13B3B",
    fontSize: 18,
    fontWeight: "800",
  },

  studentInfo: {
    flex: 1,
    marginLeft: 11,
  },

  name: {
    color: "#1C2925",
    fontSize: 16,
    fontWeight: "800",
  },

  regText: {
    color: "#7A8581",
    fontSize: 13,
    marginTop: 3,
  },

  rejectedBadge: {
    backgroundColor: "#FCE3E3",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 7,
  },

  rejectedText: {
    color: "#B13B3B",
    fontSize: 10,
    fontWeight: "800",
  },

  divider: {
    height: 1,
    backgroundColor: "#EDF0EF",
    marginVertical: 13,
  },

  requestText: {
    color: "#33433E",
    fontSize: 14,
    fontWeight: "700",
  },

  description: {
    color: "#7A8581",
    fontSize: 13,
    marginTop: 5,
    lineHeight: 19,
  },

  approveButtonFull: {
    backgroundColor: "#23745D",
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 14,
  },

  approveText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },


  /* ================= SEARCH ================= */

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDE5E1",
    borderRadius: 11,
    paddingHorizontal: 12,
    marginBottom: 12,
  },

  searchIcon: {
    fontSize: 16,
    marginRight: 7,
  },

  search: {
    flex: 1,
    height: 45,
    color: "#26352F",
    fontSize: 13,
  },


  /* ================= EMPTY ================= */

  emptyBox: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
    marginTop: 5,
  },

  emptyIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DDF0E9",
    color: "#23745D",
    textAlign: "center",
    textAlignVertical: "center",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 12,
  },

  emptyTitle: {
    color: "#26352F",
    fontSize: 16,
    fontWeight: "800",
  },

  emptyText: {
    color: "#89938F",
    fontSize: 13,
    textAlign: "center",
    marginTop: 6,
    lineHeight: 19,
  },


  /* ================= LOGOUT ================= */

  logoutBtn: {
    position: "absolute",
    bottom: 12,
    left: 16,
    right: 16,
    backgroundColor: "#173F35",
    paddingVertical: 13,
    borderRadius: 12,
    alignItems: "center",
  },

  logoutText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

});