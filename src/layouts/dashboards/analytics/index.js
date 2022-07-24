import { useEffect, useState } from "react";
import axios from "axios"

import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsBarChart from "examples/Charts/BarCharts/ReportsBarChart";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MixedChart from "examples/Charts/MixedChart";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";

import StudentCell from "layouts/dashboards/sales/components/StudentCell";
import CgpaCell from "layouts/dashboards/sales/components/CgpaCell";
import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";

import ResultsByDepartment from "layouts/dashboards/analytics/components/ResultsByDepartment";

// Data
import reportsBarChartData from "layouts/dashboards/analytics/data/reportsBarChartData";
import reportsLineChartData from "layouts/dashboards/analytics/data/reportsLineChartData";
import mixedChartData from "layouts/pages/charts/data/mixedChartData";
import defaultDoughnutChartData from "layouts/pages/charts/data/defaultDoughnutChartData";

function Analytics() {
  const { students } = reportsLineChartData;

  const [allStudents, setAllStudents] = useState([]);
  const [averageCgpa, setAverageCgpa] = useState([]);
  const [lowStudents, setLowStudents] = useState([]);
  const [dropoutTableData, setDropoutTableData] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/students`);
      setAllStudents(res.data);
    } catch (error) {
      console.log("error", error)
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
    fetchStudents();
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
            <MixedChart
              icon={{ color: "primary", component: "auto_graph" }}
              title="Students performance per semester"
              description="Applied vs left"
              height="19.75rem"
              chart={mixedChartData}
            />
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
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ResultsByDepartment />
          </Grid>
          <Grid item xs={12} md={6}>
            <DefaultDoughnutChart
              icon={{ color: "success", component: "donut_small" }}
              title="Students by Class"
              description=""
              chart={defaultDoughnutChartData}
            />
          </Grid>
        </Grid>
        <MDBox mt={6}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsBarChart
                  color="info"
                  title="Student dropouts"
                  description="By department"
                  date="last semester"
                  chart={reportsBarChartData}
                />
              </MDBox>
            </Grid>
            <Grid item xs={12} md={6} lg={6}>
              <MDBox mb={3}>
                <ReportsLineChart
                  color="dark"
                  title="last 10 sessions"
                  description={
                    <>
                      (<strong>+15%</strong>) projected dropouts this session.
                    </>
                  }
                  date="last semester"
                  chart={students}
                />
              </MDBox>
            </Grid>
          </Grid>
        </MDBox>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Analytics;
