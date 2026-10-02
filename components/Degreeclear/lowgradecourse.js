import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";

import axios from "axios";
import { useFocusEffect } from "@react-navigation/native";

const BASE_URL = "http://10.243.76.65:8080";

const lowgradecourse = ({ navigation, route }) => {
  const { registration_no } = route.params;

  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      getLowGradeCourses();
    }, [])
  );

  const getLowGradeCourses = async () => {
    try {
      setLoading(true);

      const res = await axios.get(
        `${BASE_URL}/api/lowgradecourses/${registration_no}`
      );

      setCourses(res.data.courses || []);
    } catch (err) {
      console.log(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.screen}>

      {/* ================= HEADER ================= */}

      <View style={styles.header}>

        <View>
          <Text style={styles.headerSmall}>
            ACADEMIC RECORD
          </Text>

          <Text style={styles.headerTitle}>
            Low Grade Courses
          </Text>
        </View>

        <View style={styles.headerIcon}>
          <Text style={styles.headerIconText}>
            C/D
          </Text>
        </View>

      </View>


      {/* ================= CONTENT ================= */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >

        {/* STUDENT INFO */}

        <View style={styles.studentCard}>

          <View style={styles.studentIcon}>
            <Text style={styles.studentIconText}>
              S
            </Text>
          </View>

          <View style={styles.studentInfo}>
            <Text style={styles.studentLabel}>
              Registration Number
            </Text>

            <Text style={styles.registrationNo}>
              {registration_no}
            </Text>
          </View>

        </View>


        {/* INFORMATION BOX */}

        <View style={styles.infoBox}>

          <View style={styles.infoLine} />

          <View style={styles.infoContent}>

            <Text style={styles.infoTitle}>
              Academic Warning
            </Text>

            <Text style={styles.infoText}>
              The following courses have a C or D grade.
              Please review your academic record carefully.
            </Text>

          </View>

        </View>


        {/* SECTION TITLE */}

        <View style={styles.sectionHeader}>

          <Text style={styles.sectionTitle}>
            Course Details
          </Text>

          {!loading && courses.length > 0 && (
            <View style={styles.courseCount}>
              <Text style={styles.courseCountText}>
                {courses.length}
              </Text>
            </View>
          )}

        </View>


        {/* ================= LOADING ================= */}

        {loading ? (

          <View style={styles.loadingBox}>

            <ActivityIndicator
              size="large"
              color="#23745D"
            />

            <Text style={styles.loadingText}>
              Loading course details...
            </Text>

          </View>

        ) : courses.length === 0 ? (

          /* ================= EMPTY ================= */

          <View style={styles.emptyBox}>

            <View style={styles.emptyCircle}>
              <Text style={styles.emptyCheck}>
                ✓
              </Text>
            </View>

            <Text style={styles.emptyTitle}>
              No Low Grade Courses
            </Text>

            <Text style={styles.emptyText}>
              No C or D grade courses were found
              for this student.
            </Text>

          </View>

        ) : (

          /* ================= COURSE LIST ================= */

          courses.map((item, index) => (

            <View
              key={index}
              style={styles.courseCard}
            >

              {/* CARD TOP */}

              <View style={styles.cardTop}>

                <View style={styles.courseNumberBox}>

                  <Text style={styles.courseNumber}>
                    {index + 1}
                  </Text>

                </View>

                <View style={styles.courseNameBox}>

                  <Text style={styles.courseLabel}>
                    COURSE
                  </Text>

                  <Text style={styles.courseName}>
                    {item.courseno}
                  </Text>

                </View>

                {/* GRADE */}

                <View
                  style={[
                    styles.gradeBadge,
                    item.grade === "D"
                      ? styles.dGrade
                      : styles.cGrade,
                  ]}
                >

                  <Text
                    style={[
                      styles.gradeText,
                      item.grade === "D"
                        ? styles.dGradeText
                        : styles.cGradeText,
                    ]}
                  >
                    {item.grade}
                  </Text>

                </View>

              </View>


              {/* DIVIDER */}

              <View style={styles.divider} />


              {/* CARD DETAILS */}

              <View style={styles.detailsRow}>

                <View style={styles.detailItem}>

                  <Text style={styles.detailLabel}>
                    Course Number
                  </Text>

                  <Text style={styles.detailValue}>
                    {item.courseno}
                  </Text>

                </View>


                <View style={styles.detailDivider} />


                <View style={styles.detailItem}>

                  <Text style={styles.detailLabel}>
                    Grade
                  </Text>

                  <Text
                    style={[
                      styles.detailValue,
                      item.grade === "D"
                        ? styles.dText
                        : styles.cText,
                    ]}
                  >
                    {item.grade}
                  </Text>

                </View>


                <View style={styles.detailDivider} />


                <View style={styles.detailItem}>

                  <Text style={styles.detailLabel}>
                    Attempt
                  </Text>

                  <Text style={styles.detailValue}>
                    {item.attemp}
                  </Text>

                </View>

              </View>

            </View>

          ))

        )}

        {/* BOTTOM SPACE */}

        <View style={{ height: 25 }} />

      </ScrollView>


      {/* ================= BACK BUTTON ================= */}

      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>
          Back
        </Text>
      </TouchableOpacity>

    </View>
  );
};

export default lowgradecourse;


/* ================================================= */
/*                     STYLES                        */
/* ================================================= */

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: "#F4F7F6",
  },


  /* ================= HEADER ================= */

  header: {
    backgroundColor: "#173F35",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 20,

    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },

  headerSmall: {
    color: "#B8D8CE",
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 1.5,
  },

  headerTitle: {
    color: "#FFFFFF",
    fontSize: 23,
    fontWeight: "800",
    marginTop: 4,
  },

  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,

    backgroundColor: "#2D6A5B",

    justifyContent: "center",
    alignItems: "center",

    borderWidth: 2,
    borderColor: "#79A99B",
  },

  headerIconText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "900",
  },


  /* ================= CONTENT ================= */

  container: {
    paddingHorizontal: 17,
    paddingTop: 17,
  },


  /* ================= STUDENT CARD ================= */

  studentCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 17,
    padding: 16,

    flexDirection: "row",
    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2EAE6",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.07,
    shadowRadius: 6,
    elevation: 3,
  },

  studentIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,

    backgroundColor: "#E1F1EB",

    justifyContent: "center",
    alignItems: "center",
  },

  studentIconText: {
    color: "#176B50",
    fontSize: 19,
    fontWeight: "800",
  },

  studentInfo: {
    marginLeft: 12,
  },

  studentLabel: {
    color: "#89938F",
    fontSize: 11,
    fontWeight: "600",
  },

  registrationNo: {
    color: "#173F35",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 4,
  },


  /* ================= INFO BOX ================= */

  infoBox: {
    backgroundColor: "#FFFFFF",

    marginTop: 14,

    borderRadius: 14,

    flexDirection: "row",

    overflow: "hidden",

    borderWidth: 1,
    borderColor: "#E5EBE8",
  },

  infoLine: {
    width: 4,
    backgroundColor: "#D29A24",
  },

  infoContent: {
    padding: 13,
    flex: 1,
  },

  infoTitle: {
    color: "#4C3B13",
    fontSize: 14,
    fontWeight: "800",
  },

  infoText: {
    color: "#7D7460",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 4,
  },


  /* ================= SECTION ================= */

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

    marginTop: 22,
    marginBottom: 11,
  },

  sectionTitle: {
    color: "#173F35",
    fontSize: 19,
    fontWeight: "800",
  },

  courseCount: {
    backgroundColor: "#DDEEE8",

    minWidth: 30,
    height: 30,

    borderRadius: 15,

    justifyContent: "center",
    alignItems: "center",
  },

  courseCountText: {
    color: "#23745D",
    fontSize: 13,
    fontWeight: "800",
  },


  /* ================= COURSE CARD ================= */

  courseCard: {
    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    padding: 16,

    marginBottom: 13,

    borderWidth: 1,
    borderColor: "#E2EAE6",

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

  courseNumberBox: {
    width: 38,
    height: 38,

    borderRadius: 11,

    backgroundColor: "#EDF5F2",

    justifyContent: "center",
    alignItems: "center",
  },

  courseNumber: {
    color: "#23745D",
    fontSize: 15,
    fontWeight: "800",
  },

  courseNameBox: {
    flex: 1,
    marginLeft: 11,
  },

  courseLabel: {
    color: "#9AA39F",
    fontSize: 9,
    fontWeight: "800",
    letterSpacing: 1,
  },

  courseName: {
    color: "#1F2D28",
    fontSize: 16,
    fontWeight: "800",
    marginTop: 3,
  },


  /* ================= GRADE BADGE ================= */

  gradeBadge: {
    width: 45,
    height: 45,

    borderRadius: 23,

    justifyContent: "center",
    alignItems: "center",
  },

  cGrade: {
    backgroundColor: "#FFF2D6",
  },

  dGrade: {
    backgroundColor: "#FCE3E3",
  },

  gradeText: {
    fontSize: 20,
    fontWeight: "900",
  },

  cGradeText: {
    color: "#A66B00",
  },

  dGradeText: {
    color: "#C23E3E",
  },


  /* ================= DIVIDER ================= */

  divider: {
    height: 1,
    backgroundColor: "#EDF1EF",
    marginVertical: 15,
  },


  /* ================= DETAILS ================= */

  detailsRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  detailItem: {
    flex: 1,
  },

  detailLabel: {
    color: "#929C98",
    fontSize: 10,
    fontWeight: "600",
  },

  detailValue: {
    color: "#273630",
    fontSize: 14,
    fontWeight: "800",
    marginTop: 4,
  },

  detailDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#E4EAE7",
    marginHorizontal: 10,
  },

  cText: {
    color: "#A66B00",
  },

  dText: {
    color: "#C23E3E",
  },


  /* ================= LOADING ================= */

  loadingBox: {
    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    paddingVertical: 40,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2EAE6",
  },

  loadingText: {
    color: "#7D8883",
    fontSize: 13,
    marginTop: 10,
  },


  /* ================= EMPTY ================= */

  emptyBox: {
    backgroundColor: "#FFFFFF",

    borderRadius: 17,

    padding: 30,

    alignItems: "center",

    borderWidth: 1,
    borderColor: "#E2EAE6",
  },

  emptyCircle: {
    width: 52,
    height: 52,

    borderRadius: 26,

    backgroundColor: "#DDEEE8",

    justifyContent: "center",
    alignItems: "center",

    marginBottom: 12,
  },

  emptyCheck: {
    color: "#23745D",
    fontSize: 25,
    fontWeight: "900",
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
    lineHeight: 19,
    marginTop: 6,
  },


  /* ================= BACK BUTTON ================= */

  backButton: {
    position: "absolute",

    bottom: 14,
    left: 17,
    right: 17,

    backgroundColor: "#173F35",

    paddingVertical: 13,

    borderRadius: 12,

    alignItems: "center",

    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.15,
    shadowRadius: 5,
    elevation: 4,
  },

  backButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
  },

});
