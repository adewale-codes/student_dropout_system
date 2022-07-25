import Grid from "@mui/material/Grid";
import { useEffect, useState, useCallback } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";
import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";
import { groupBy, orderedObjects } from "layouts/dashboards/analytics"
import SalesTable from "examples/Tables/SalesTable";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MixedChart from "examples/Charts/MixedChart";

function Student() {
  const { studentId } = useParams();
  const [student, setStudent] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [allCgpas, setAllCgpas] = useState([]);
  const [results, setResults] = useState([]);
  const [carryOvers, setCarryOvers] = useState([]);
  const [carryOverData, setCarryOverData] = useState(null);
  const [cgpasBySession, setCgpasBySession] = useState([]);
  const [sessionNames, setSessionNames] = useState([]);
  const [mixedChartData, setMixedChartData] = useState(null);
  const [resultSessions, setResultSessions] = useState([]);


  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/departments`);
      let departmentsObj = {};
      res.data.map(department => {
        departmentsObj[department.id] = department.name;
      });
      setAllDepartments(departmentsObj);
    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/courses`);
      let coursesObj = {};
      res.data.map(course => {
        coursesObj[course.id] = course.name;
      });
      setAllCourses(coursesObj);
    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sessions`);
      let sessionsObj = {};
      res.data.map(session => {
        sessionsObj[session.id] = `${session.semester_name}, ${session.session}`;
      });
      setAllSessions(sessionsObj);
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    const sesssionNamesArray = Object.values(allSessions).map(sessionName => sessionName);
    setSessionNames(sesssionNamesArray);
  }, [allSessions])

  useEffect(() => {
    const mixedData = {
      labels: sessionNames,
      datasets: [
        {
          chartType: "thin-bar",
          label: "Average CGPA",
          color: "dark",
          data: cgpasBySession,
        },
      ],
    };
    setMixedChartData(mixedData);
  }, [sessionNames, cgpasBySession])

  const fetchCgpas = useCallback(
    async () => {
      try {
        if (student) {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cgpas`);
          const allCgpas = res.data.filter(cgpa => cgpa.matric_no === student.matric_no);
          setAllCgpas(allCgpas);
        }
      } catch (error) {
        console.error("error", error)
      }
    }, [student]);

  const fetchStudent = useCallback(
    async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/students/${studentId}`);
        setStudent(res.data);
      } catch (error) {
        console.error("error", error)
      }
    }, [studentId]);

  const fetchResults = useCallback(
    async () => {
      try {
        if (student) {
          const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/results`);
          const studentResults = res.data.filter(result => result.matric_no === student.matric_no);
          setResults(studentResults);
        }
      } catch (error) {
        console.error("error", error)
      }
    }, [student]);

  useEffect(() => {
    if (allSessions && Object.keys(allSessions).length > 0 && allCourses && Object.keys(allCourses).length > 0 && results.length > 0) {
      const resultsWithName = [];
      results.filter(result => {
        if (result.score < 40) {
          resultsWithName.push({
            course: allCourses[result.course_id],
            session: allSessions[result.session_id],
            score: `${result.score}F`,
          })
        }
      });
      setCarryOvers(resultsWithName);
    }
  }, [allCourses, allSessions, results])

  useEffect(() => {
    const groupedCgpasBySession = groupBy(allCgpas, "session_id");
    const sortedCgpasBySession = orderedObjects(groupedCgpasBySession);
    const cgpaValsBySession = []
    Object.values(sortedCgpasBySession).map(value => {
      let avg = value.reduce(function (avg, curr, _, { length }) {
        return avg + Number(curr.gpa) / length;
      }, 0)
      cgpaValsBySession.push(avg)
    })
    setCgpasBySession(cgpaValsBySession);
    const resultsWithSessionNames = [];
    for (const [key, value] of Object.entries(sortedCgpasBySession)) {
      resultsWithSessionNames.push({
        session: allSessions[key],
        gpa: value.reduce(function (avg, curr, _, { length }) {
          return avg + Number(curr.gpa) / length;
        }, 0),
      })
    }
    setResultSessions(resultsWithSessionNames);
  }, [allCgpas, allSessions])

  useEffect(() => {
    const dropoutTableData = {
      columns: [
        { Header: "course", accessor: "course" },
        { Header: "session", accessor: "session", align: "center" },
        { Header: "score", accessor: "score", align: "center" },
      ],
      rows: carryOvers.map(carryOver => ({
        course: <DefaultCell>{carryOver.course}</DefaultCell>,
        session: <DefaultCell>{carryOver.session}</DefaultCell>,
        score: <DefaultCell>{carryOver.score}</DefaultCell>
      }))
    };
    setCarryOverData(dropoutTableData);
  }, [carryOvers])

  useEffect(() => {
    fetchDepartments();
    fetchCourses();
    fetchSessions();
  }, [])

  useEffect(() => {
    fetchResults();
  }, [fetchResults])

  useEffect(() => {
    fetchCgpas();
  }, [fetchCgpas])

  useEffect(() => {
    fetchStudent();
  }, [fetchStudent])


  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={1.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="person"
                title="Name"
                count={student ? `${student.first_name} ${student.last_name}` : ""}
                percentage={{
                  color: "danger",
                  amount: "",
                  label: "t",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="leaderboard"
                title="Current CGPA"
                count={student?.cgpa}
                percentage={{
                  color: "success",
                  amount: "+5%",
                  label: "than last semester",
                }}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="store"
                title="Department"
                count={student ? allDepartments[student.department_id] : ""}
                percentage={{
                  color: "dangeer",
                  amount: "+3%",
                  label: "than last semester",
                }}
              />
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox mb={6}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            {
              mixedChartData && (
                <MixedChart
                  icon={{ color: "primary", component: "auto_graph" }}
                  title="Performance for student per semester"
                  description="Applied vs carryover"
                  height="19.75rem"
                  chart={mixedChartData}
                />
              )
            }

          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Subjects carried over
                </MDTypography>
              </MDBox>
              <MDBox py={1}>
                {carryOverData && (
                  <DataTable
                    table={carryOverData}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    isSorted
                    noEndBorder
                  />
                )}

              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <Card sx={{ width: "100%" }}>
              <MDBox display="flex">
                <MDBox
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                  width="4rem"
                  height="4rem"
                  variant="gradient"
                  bgColor="success"
                  color="white"
                  shadow="md"
                  borderRadius="xl"
                  ml={3}
                  mt={-2}
                >
                  <Icon fontSize="medium" color="inherit">
                    book
                  </Icon>
                </MDBox>
                <MDTypography variant="h6" sx={{ mt: 2, mb: 1, ml: 2 }}>
                  Result by Semester
                </MDTypography>
              </MDBox>
              <MDBox p={2}>
                <Grid container>
                  <Grid item xs={12} md={12} lg={12}>
                    <SalesTable rows={resultSessions} shadow={false} />
                  </Grid>
                </Grid>
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Student;
