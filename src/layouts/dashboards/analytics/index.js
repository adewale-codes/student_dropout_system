import { useEffect, useState } from "react";
import axios from "axios"

import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import SalesTable from "examples/Tables/SalesTable";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MixedChart from "examples/Charts/MixedChart";

import StudentCell from "layouts/dashboards/sales/components/StudentCell";
import CgpaCell from "layouts/dashboards/sales/components/CgpaCell";
import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";

export const groupBy = function (array, key) {
  return array.reduce(function (rv, x) {
    (rv[x[key]] = rv[x[key]] || []).push(x);
    return rv;
  }, {});
};

export const orderedObjects = (unordered) => (
  Object.keys(unordered).sort().reduce(
    (obj, key) => {
      obj[key] = unordered[key];
      return obj;
    },
    {}
  )
)

function Analytics() {

  const [allStudents, setAllStudents] = useState([]);
  const [allCgpas, setAllCgpas] = useState([]);
  const [allSessions, setAllSessions] = useState([]);
  const [allDepartments, setAllDepartments] = useState([]);
  const [cgpasBySession, setCgpasBySession] = useState([]);
  const [sessionNames, setSessionNames] = useState([]);
  const [departmentResults, setDepartmentResults] = useState([]);
  const [averageCgpa, setAverageCgpa] = useState([]);
  const [lowStudents, setLowStudents] = useState([]);
  const [dropoutTableData, setDropoutTableData] = useState(null);
  const [mixedChartData, setMixedChartData] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/students`);
      setAllStudents(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchCgpas = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/cgpas`);
      setAllCgpas(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchSessions = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/sessions`);
      setAllSessions(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/departments`);
      setAllDepartments(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }

  useEffect(() => {
    const totalCgpa = allStudents.reduce((acc, curr) => acc + Number(curr.cgpa), 0)
    const avgCgpa = (totalCgpa / allStudents.length).toFixed(2);

    const lowStudents = allStudents.filter(student => Number(student.cgpa) < 1.0);

    setLowStudents(lowStudents);

    setAverageCgpa(avgCgpa);

    const dropoutData = {
      columns: [
        { Header: "student", accessor: "student" },
        { Header: "Matric No", accessor: "matric_no" },
        { Header: "cgpa", accessor: "cgpa", align: "center" },
      ],

      rows: lowStudents.map(student => {
        return {
          student: <StudentCell image={student.avatar} name={`${student.first_name} ${student.last_name}`} />,
          matric_no: <DefaultCell>{student.matric_no}</DefaultCell>,
          cgpa: <CgpaCell value={student.cgpa} icon={{ color: "error", name: "keyboard_arrow_down" }} />
        }
      })
    }
    setDropoutTableData(dropoutData);
  }, [allStudents]);

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


  }, [allCgpas])

  useEffect(() => {
    if (allDepartments.length > 0 && allStudents.length > 0) {
      const groupedStudentsByDepartments = groupBy(allStudents, "department_id");
      let depts = {};
      allDepartments.map(department => {
        depts[department.id] = department.name;
      });

      const deptResults = [];

      for (const [key, value] of Object.entries(groupedStudentsByDepartments)) {
        const avg = value.reduce(function (avg, curr, _, { length }) {
          return avg + Number(curr.cgpa) / length;
        }, 0)
        deptResults.push({
          department: depts[key],
          averageCgpa: avg.toFixed(2),
          students: value.length
        })
      }
      setDepartmentResults(deptResults);
    }

  }, [allStudents, allDepartments])


  useEffect(() => {
    const sesssionNamesArray = allSessions.map(session => `${session.semester_name} ${session.session}`)
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

  useEffect(() => {
    fetchStudents();
    fetchCgpas();
    fetchSessions();
    fetchDepartments();
  }, [])


  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={1.5}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="dark"
                icon="person_add"
                title="Students"
                count={allStudents.length}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                icon="leaderboard"
                title="Average CGPA"
                count={averageCgpa}
              />
            </MDBox>
          </Grid>
          <Grid item xs={12} md={6} lg={4}>
            <MDBox mb={1.5}>
              <ComplexStatisticsCard
                color="error"
                icon="store"
                title="Underperforming students"
                count={lowStudents.length}
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
                  title="Students performance per semester"
                  description="Average CGPA per semester"
                  height="19.75rem"
                  chart={mixedChartData}
                />
              )
            }

            <MDBox mt={3}>
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
                    Average Result by Department
                  </MDTypography>
                </MDBox>
                <MDBox p={2}>
                  <Grid container>
                    <Grid item xs={12} md={12} lg={12}>
                      <SalesTable rows={departmentResults} shadow={false} />
                    </Grid>
                  </Grid>
                </MDBox>
              </Card>
            </MDBox>

          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Students at risk of dropping out {dropoutTableData?.rows ? `(${dropoutTableData.rows.length})` : null}
                </MDTypography>
              </MDBox>
              <MDBox py={1}>
                {dropoutTableData && (
                  <DataTable
                    table={dropoutTableData}
                    entriesPerPage={false}
                    showTotalEntries={false}
                    isSorted={false}
                    noEndBorder
                  />
                )}
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
