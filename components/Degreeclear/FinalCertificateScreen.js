import React, { useEffect, useState } from "react";

import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  Platform,
} from "react-native";

import axios from "axios";
import Icon from "react-native-vector-icons/Feather";

import { generatePDF } from "react-native-html-to-pdf";
import ReactNativeBlobUtil from "react-native-blob-util";

const BASE_URL = "http://10.243.76.65:8080";

const FinalCertificateScreen = ({ route }) => {
  const {
    registration_no,
    name,
    department,
    role,
  } = route.params;

  const [data, setData] = useState(null);
  const [cgpa, setCgpa] = useState(null);
  const [failedCourses, setFailedCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getFinalRecord();
  }, []);

  // =========================================
  // GET FINAL RECORD
  // =========================================

  const getFinalRecord = async () => {
    try {
      setLoading(true);

      // Clearance record
      const clearanceResponse = await axios.get(
        `${BASE_URL}/clearancemy-status/${registration_no}`
      );

      setData(clearanceResponse.data);

      // CGPA + failed courses
      const eligibilityResponse = await axios.get(
        `${BASE_URL}/checkeligibility/${registration_no}`
      );

      setCgpa(eligibilityResponse.data.cgpa);

      setFailedCourses(
        eligibilityResponse.data.failedCourses || []
      );

    } catch (error) {
      console.log(
        "Final Certificate Error:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  // =========================================
  // STATUS ICON
  // =========================================

  const getStatusIcon = (status) => {
    if (status === "approved") {
      return "check-circle";
    }

    if (status === "rejected") {
      return "x-circle";
    }

    return "clock";
  };

  // =========================================
  // STATUS STYLE
  // =========================================

  const getStatusStyle = (status) => {
    if (status === "approved") {
      return styles.approved;
    }

    if (status === "rejected") {
      return styles.rejected;
    }

    return styles.pending;
  };

  // =========================================
  // DEPARTMENT ROW
  // =========================================

  const DepartmentRow = ({
    icon,
    name,
    status,
    reason,
  }) => {
    return (
      <View>

        <View style={styles.departmentRow}>

          <View style={styles.departmentLeft}>

            <View style={styles.departmentIcon}>

              <Icon
                name={icon}
                size={18}
                color="green"
              />

            </View>

            <Text style={styles.departmentName}>
              {name}
            </Text>

          </View>

          <View style={styles.statusContainer}>

            <Icon
              name={getStatusIcon(status)}
              size={17}
              color={
                status === "approved"
                  ? "green"
                  : status === "rejected"
                  ? "#D32F2F"
                  : "#856404"
              }
            />

            <Text style={getStatusStyle(status)}>
              {status || "Not Requested"}
            </Text>

          </View>

        </View>

        {status === "rejected" && (
          <View style={styles.reasonBox}>

            <Icon
              name="alert-circle"
              size={15}
              color="#D32F2F"
            />

            <Text style={styles.reasonText}>
              {reason || "No reason provided"}
            </Text>

          </View>
        )}

      </View>
    );
  };

  // =========================================
  // DOWNLOAD / CREATE PDF
  // =========================================

  const downloadCertificate = async () => {
    try {

      if (!data) {
        Alert.alert(
          "Error",
          "Certificate data not available."
        );
        return;
      }

      // =====================================
      // PDF HTML
      // =====================================

      const html = `
        <html>

          <head>

            <style>

              body {
                font-family: Arial, sans-serif;
                padding: 25px;
                color: #222;
              }

              .header {
                text-align: center;
                margin-bottom: 25px;
              }

              .title {
                font-size: 25px;
                font-weight: bold;
                color: #188038;
              }

              .subtitle {
                font-size: 14px;
                color: #666;
                margin-top: 5px;
              }

              .success {
                background-color: #E8F5E9;
                padding: 15px;
                text-align: center;
                border: 1px solid #A5D6A7;
                margin-bottom: 20px;
              }

              .successTitle {
                color: #188038;
                font-size: 18px;
                font-weight: bold;
              }

              .card {
                border: 1px solid #ddd;
                padding: 15px;
                margin-bottom: 18px;
              }

              .cardTitle {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 12px;
                color: #222;
              }

              .row {
                padding: 9px 0;
                border-bottom: 1px solid #eee;
              }

              .label {
                color: #777;
                font-size: 13px;
              }

              .value {
                font-weight: bold;
                font-size: 14px;
              }

              .approved {
                color: #188038;
                font-weight: bold;
              }

              .rejected {
                color: #D32F2F;
                font-weight: bold;
              }

              .pending {
                color: #856404;
                font-weight: bold;
              }

              .overall {
                background-color: #E8F5E9;
                padding: 15px;
                text-align: center;
                border: 1px solid #A5D6A7;
              }

              .overallTitle {
                font-size: 14px;
                color: #555;
              }

              .overallStatus {
                font-size: 22px;
                font-weight: bold;
                color: #188038;
                margin-top: 5px;
              }

              .footer {
                text-align: center;
                margin-top: 25px;
                color: #888;
                font-size: 11px;
              }

            </style>

          </head>

          <body>

            <div class="header">

              <div class="title">
                FINAL CLEARANCE CERTIFICATE
              </div>

              <div class="subtitle">
                Student Clearance Record
              </div>

            </div>

            <div class="success">

              <div class="successTitle">
                CLEARANCE COMPLETED
              </div>

              <p>
                All departments have approved the student's clearance.
              </p>

            </div>

            <!-- STUDENT INFORMATION -->

            <div class="card">

              <div class="cardTitle">
                Student Information
              </div>

              <div class="row">

                <span class="label">
                  Student Name
                </span>

                <br />

                <span class="value">
                  ${name || data.name || ""}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Registration No
                </span>

                <br />

                <span class="value">
                  ${registration_no}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Department
                </span>

                <br />

                <span class="value">
                  ${department || ""}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  System Role
                </span>

                <br />

                <span class="value">
                  ${role || "student"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  CGPA
                </span>

                <br />

                <span class="value">
                  ${cgpa ?? "Not Found"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Failed Courses
                </span>

                <br />

                <span class="value">
                  ${failedCourses.length}
                </span>

              </div>

            </div>

            <!-- DEPARTMENT CLEARANCE -->

            <div class="card">

              <div class="cardTitle">
                Department Clearance Status
              </div>

              <div class="row">

                <span class="label">
                  Finance
                </span>

                <br />

                <span class="${data.status?.finance_status}">
                  ${data.status?.finance_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Datacell
                </span>

                <br />

                <span class="${data.status?.datacell_status}">
                  ${data.status?.datacell_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Lab
                </span>

                <br />

                <span class="${data.status?.lab_status}">
                  ${data.status?.lab_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Library
                </span>

                <br />

                <span class="${data.status?.library_status}">
                  ${data.status?.library_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Photocopier
                </span>

                <br />

                <span class="${data.status?.photocopier_status}">
                  ${data.status?.photocopier_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Report
                </span>

                <br />

                <span class="${data.status?.report_status}">
                  ${data.status?.report_status || "Not Requested"}
                </span>

              </div>

              <div class="row">

                <span class="label">
                  Cafeteria
                </span>

                <br />

                <span class="${data.status?.cafeteria_status}">
                  ${data.status?.cafeteria_status || "Not Requested"}
                </span>

              </div>

            </div>

            <!-- OVERALL STATUS -->

            <div class="overall">

              <div class="overallTitle">
                OVERALL CLEARANCE STATUS
              </div>

              <div class="overallStatus">
                ${data.overall_status || "pending"}
              </div>

            </div>

            <div class="footer">

              Final Clearance Record

              <br />

              Registration No: ${registration_no}

            </div>

          </body>

        </html>
      `;

      // =====================================
      // STEP 1: CREATE PDF
      // =====================================

      const pdf = await generatePDF({
        html: html,
        fileName: `Final_Certificate_${registration_no}`,
        base64: false,
      });

      console.log(
        "PDF Created:",
        pdf.filePath
      );

      // =====================================
      // STEP 2: DOWNLOADS FOLDER PATH
      // =====================================

      const downloadPath =
        `${ReactNativeBlobUtil.fs.dirs.DownloadDir}/Final_Certificate_${registration_no}.pdf`;

      console.log(
        "Download Path:",
        downloadPath
      );

      // =====================================
      // STEP 3: COPY PDF TO DOWNLOADS
      // =====================================

      await ReactNativeBlobUtil.fs.cp(
        pdf.filePath,
        downloadPath
      );

      // =====================================
      // STEP 4: ANDROID DOWNLOAD NOTIFICATION
      // =====================================

      if (Platform.OS === "android") {

        await ReactNativeBlobUtil.android.addCompleteDownload({
          title: `Final_Certificate_${registration_no}.pdf`,
          description: "Final Clearance Certificate",
          mime: "application/pdf",
          path: downloadPath,
          showNotification: true,
          notification: true,
          mediaScannable: true,
        });

      }

      // =====================================
      // SUCCESS MESSAGE
      // =====================================

      Alert.alert(
        "Download Complete",
        `Final Certificate Downloads folder mein save ho gaya hai.\n\nFile:\nFinal_Certificate_${registration_no}.pdf`
      );

    } catch (error) {

      console.log(
        "PDF Download Error:",
        error
      );

      Alert.alert(
        "Download Error",
        error.message ||
          "PDF download nahi ho saki."
      );

    }
  };

  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (
      <View style={styles.loadingContainer}>

        <ActivityIndicator
          size="large"
          color="green"
        />

        <Text style={styles.loadingText}>
          Loading final record...
        </Text>

      </View>
    );
  }

  // =========================================
  // NO DATA
  // =========================================

  if (!data) {

    return (
      <View style={styles.loadingContainer}>

        <Icon
          name="alert-circle"
          size={45}
          color="#D32F2F"
        />

        <Text style={styles.errorText}>
          Final record not found
        </Text>

      </View>
    );
  }

  // =========================================
  // MAIN SCREEN
  // =========================================

  return (

    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.certificateIcon}>

          <Icon
            name="award"
            size={35}
            color="#fff"
          />

        </View>

        <Text style={styles.title}>
          Final Clearance Certificate
        </Text>

        <Text style={styles.subtitle}>
          Student Clearance Record
        </Text>

      </View>

      {/* APPROVED MESSAGE */}

      <View style={styles.approvedCard}>

        <View style={styles.approvedCircle}>

          <Icon
            name="check"
            size={28}
            color="#fff"
          />

        </View>

        <View style={{ flex: 1 }}>

          <Text style={styles.approvedTitle}>
            Clearance Completed
          </Text>

          <Text style={styles.approvedSubtitle}>
            All departments have approved your clearance.
          </Text>

        </View>

      </View>

      {/* STUDENT INFORMATION */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Student Information
        </Text>

        <Text style={styles.cardSubtitle}>
          Personal and academic record
        </Text>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            Student Name
          </Text>

          <Text style={styles.infoValue}>
            {name || data.name}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            Registration No
          </Text>

          <Text style={styles.infoValue}>
            {registration_no}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            Department
          </Text>

          <Text style={styles.infoValue}>
            {department}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            System Role
          </Text>

          <Text style={styles.infoValue}>
            {role || "student"}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            CGPA
          </Text>

          <Text style={styles.cgpaValue}>
            {cgpa ?? "Not Found"}
          </Text>

        </View>

        <View style={styles.infoRow}>

          <Text style={styles.infoLabel}>
            Failed Courses
          </Text>

          <Text style={styles.infoValue}>
            {failedCourses.length}
          </Text>

        </View>

      </View>

      {/* DEPARTMENT CLEARANCE */}

      <View style={styles.card}>

        <Text style={styles.cardTitle}>
          Department Clearance
        </Text>

        <Text style={styles.cardSubtitle}>
          Complete approval record
        </Text>

        <DepartmentRow
          icon="credit-card"
          name="Finance"
          status={data.status?.finance_status}
          reason={data.status?.finance_reason}
        />

        <DepartmentRow
          icon="database"
          name="Datacell"
          status={data.status?.datacell_status}
          reason={data.status?.datacell_reason}
        />

        <DepartmentRow
          icon="tool"
          name="Lab"
          status={data.status?.lab_status}
          reason={data.status?.lab_reason}
        />

        <DepartmentRow
          icon="book-open"
          name="Library"
          status={data.status?.library_status}
          reason={data.status?.library_reason}
        />

        <DepartmentRow
          icon="copy"
          name="Photocopier"
          status={data.status?.photocopier_status}
          reason={data.status?.photocopier_reason}
        />

        <DepartmentRow
          icon="file-text"
          name="Report"
          status={data.status?.report_status}
          reason={data.status?.report_reason}
        />

        <DepartmentRow
          icon="coffee"
          name="Cafeteria"
          status={data.status?.cafeteria_status}
          reason={data.status?.cafeteria_reason}
        />

      </View>

      {/* OVERALL STATUS */}

      <View style={styles.finalCard}>

        <Icon
          name="check-circle"
          size={30}
          color="green"
        />

        <View style={{ marginLeft: 12 }}>

          <Text style={styles.finalTitle}>
            Overall Clearance
          </Text>

          <Text style={styles.finalStatus}>
            {data.overall_status}
          </Text>

        </View>

      </View>

      {/* DOWNLOAD BUTTON */}

      <TouchableOpacity
        style={styles.downloadButton}
        onPress={downloadCertificate}
      >

        <Icon
          name="download"
          size={21}
          color="#fff"
        />

        <Text style={styles.downloadText}>
          Download Final Certificate
        </Text>

      </TouchableOpacity>

      {/* FOOTER */}

      <View style={styles.footer}>

        <Text style={styles.footerText}>
          This is the final clearance record of the student.
        </Text>

        <Text style={styles.footerSub}>
          Registration No: {registration_no}
        </Text>

      </View>

    </ScrollView>
  );
};

export default FinalCertificateScreen;

// =========================================
// STYLES
// =========================================

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#F1F4F3",
  },

  container: {
    padding: 18,
    paddingBottom: 40,
  },

  // LOADING

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F4F3",
  },

  loadingText: {
    marginTop: 12,
    color: "#555",
    fontSize: 14,
  },

  errorText: {
    marginTop: 15,
    color: "#D32F2F",
    fontSize: 17,
    fontWeight: "bold",
  },

  // HEADER

  header: {
    alignItems: "center",
    marginBottom: 18,
  },

  certificateIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },

  title: {
    fontSize: 23,
    fontWeight: "bold",
    color: "#202124",
    textAlign: "center",
  },

  subtitle: {
    fontSize: 13,
    color: "#777",
    marginTop: 4,
  },

  // APPROVED

  approvedCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#A5D6A7",
  },

  approvedCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "green",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },

  approvedTitle: {
    fontSize: 17,
    fontWeight: "bold",
    color: "#188038",
  },

  approvedSubtitle: {
    fontSize: 12,
    color: "#4F6F52",
    marginTop: 3,
  },

  // CARD

  card: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    elevation: 4,
  },

  cardTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#202124",
  },

  cardSubtitle: {
    fontSize: 12,
    color: "#888",
    marginTop: 3,
    marginBottom: 12,
  },

  // STUDENT INFO

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 11,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  infoLabel: {
    color: "#777",
    fontSize: 13,
  },

  infoValue: {
    color: "#222",
    fontSize: 14,
    fontWeight: "bold",
    maxWidth: "55%",
    textAlign: "right",
  },

  cgpaValue: {
    color: "green",
    fontSize: 16,
    fontWeight: "bold",
  },

  // DEPARTMENT

  departmentRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 13,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },

  departmentLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },

  departmentIcon: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#E8F5E9",
    justifyContent: "center",
    alignItems: "center",
  },

  departmentName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#333",
    marginLeft: 10,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  pending: {
    backgroundColor: "#FFF3CD",
    color: "#856404",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },

  approved: {
    backgroundColor: "#E8F5E9",
    color: "#188038",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },

  rejected: {
    backgroundColor: "#FDE8E8",
    color: "#D32F2F",
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 15,
    fontSize: 10,
    fontWeight: "bold",
    marginLeft: 5,
  },

  reasonBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF5F5",
    padding: 9,
    borderRadius: 8,
    marginBottom: 7,
  },

  reasonText: {
    flex: 1,
    color: "#D32F2F",
    fontSize: 11,
    marginLeft: 6,
  },

  // FINAL STATUS

  finalCard: {
    backgroundColor: "#E8F5E9",
    borderRadius: 16,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#A5D6A7",
    marginBottom: 16,
  },

  finalTitle: {
    color: "#555",
    fontSize: 12,
  },

  finalStatus: {
    color: "green",
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 2,
    textTransform: "uppercase",
  },

  // DOWNLOAD BUTTON

  downloadButton: {
    backgroundColor: "green",
    borderRadius: 12,
    paddingVertical: 15,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
    marginBottom: 16,
  },

  downloadText: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "bold",
    marginLeft: 9,
  },

  // FOOTER

  footer: {
    alignItems: "center",
    paddingVertical: 15,
  },

  footerText: {
    color: "#777",
    fontSize: 11,
    textAlign: "center",
  },

  footerSub: {
    color: "#999",
    fontSize: 10,
    marginTop: 4,
  },

});