import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator
} from "react-native";
import axios from "axios";

const BASE_URL = "http://10.243.76.65:8080";

export default function MyClearanceRequestsScreen({ route }) {

  const { registration_no } = route.params;

  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {

    try {

      setLoading(true);

      console.log(
        "Loading clearance for:",
        registration_no
      );

      const res = await axios.get(
        `${BASE_URL}/clearancemy-status/${registration_no}`
      );

      console.log(
        "My Clearance Response:",
        res.data
      );

      // Backend response:
      // {
      //   registration_no: "001",
      //   name: "Ali",
      //   status: {
      //      finance_status: "pending",
      //      ...
      //   }
      // }

      setStatus(res.data);

    } catch (err) {

      console.log(
        "My Clearance Error:",
        err.response?.data || err.message
      );

      setStatus(null);

    } finally {

      setLoading(false);
    }
  };


  const getColor = (value) => {

    if (value === "approved") {
      return "green";
    }

    if (value === "rejected") {
      return "red";
    }

    if (value === "pending") {
      return "orange";
    }

    return "gray";
  };


  const getStatusText = (value) => {

    if (!value) {
      return "Not Requested";
    }

    return value.toUpperCase();
  };


  if (loading) {

    return (
      <View style={styles.loader}>

        <ActivityIndicator
          size="large"
          color="green"
        />

        <Text style={{ marginTop: 10 }}>
          Loading Clearance Status...
        </Text>

      </View>
    );
  }


  return (

    <ScrollView
    style={{ backgroundColor: "#263A35" }}
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        My Clearance Status
      </Text>


      <Text style={styles.regNo}>
        Registration No: {registration_no}
      </Text>


      {/* FINANCE */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Finance Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.finance_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.finance_status
          )}
        </Text>

        {status?.status?.finance_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.finance_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* DATACELL */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Datacell Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.datacell_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.datacell_status
          )}
        </Text>

        {status?.status?.datacell_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.datacell_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* LAB */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Lab Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.lab_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.lab_status
          )}
        </Text>

        {status?.status?.lab_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.lab_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* LIBRARY */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Library Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.library_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.library_status
          )}
        </Text>

        {status?.status?.library_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.library_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* PHOTOCOPIER */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Photocopier Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.photocopier_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.photocopier_status
          )}
        </Text>

        {status?.status?.photocopier_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.photocopier_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* REPORT */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Report Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.report_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.report_status
          )}
        </Text>

        {status?.status?.report_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.report_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* CAFETERIA */}
      <View style={styles.card}>

        <Text style={styles.role}>
          Cafeteria Status
        </Text>

        <Text
          style={[
            styles.status,
            {
              color: getColor(
                status?.status?.cafeteria_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.status?.cafeteria_status
          )}
        </Text>

        {status?.status?.cafeteria_status === "rejected" && (

          <Text style={styles.reason}>
            Reason:{" "}
            {status?.status?.cafeteria_reason ||
              "No reason provided"}
          </Text>

        )}

      </View>


      {/* OVERALL STATUS */}
      <View style={styles.overallCard}>

        <Text style={styles.overallTitle}>
          Overall Clearance
        </Text>

        <Text
          style={[
            styles.overallStatus,
            {
              color: getColor(
                status?.overall_status
              )
            }
          ]}
        >
          {getStatusText(
            status?.overall_status
          )}
        </Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    padding: 15,
    paddingBottom: 30,
    backgroundColor: "#40a189",
  },

  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#263A35",
  },

  title: {
    fontSize: 23,
    fontWeight: "800",
    textAlign: "center",
    marginTop: 8,
    marginBottom: 8,
    color: "#FFFFFF",
  },

  regNo: {
    textAlign: "center",
    marginBottom: 18,
    fontSize: 14,
    color: "#B8C8C2",
  },

  card: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 15,
    marginBottom: 12,

    borderWidth: 1,
    borderColor: "#E2EAE6",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },

  role: {
    fontSize: 16,
    fontWeight: "800",
    color: "#3dad80",
  },

  status: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "800",
  },

  reason: {
    marginTop: 10,
    color: "#C23E3E",
    fontSize: 13,
    lineHeight: 19,

    backgroundColor: "#FFF5F5",
    padding: 9,
    borderRadius: 8,
  },

  overallCard: {
    backgroundColor: "#FFFFFF",
    padding: 18,
    borderRadius: 16,
    marginTop: 4,
    marginBottom: 20,

    borderWidth: 1,
    borderColor: "#DCE7E2",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 7,
    elevation: 5,
  },

  overallTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#173F35",
  },

  overallStatus: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: "900",
  }

});