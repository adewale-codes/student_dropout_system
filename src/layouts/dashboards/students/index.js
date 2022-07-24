import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import ReportsLineChart from "examples/Charts/LineCharts/ReportsLineChart";
import ComplexStatisticsCard from "examples/Cards/StatisticsCards/ComplexStatisticsCard";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DataTable from "examples/Tables/DataTable";
import MixedChart from "examples/Charts/MixedChart";

import ResultsBySemester from "layouts/dashboards/students/components/ResultsBySemester";

// Data
import carryoverTableData from "layouts/dashboards/students/data/carryoverTableData";
import reportsLineChartData from "layouts/dashboards/students/data/reportsLineChartData";
import mixedChartData from "layouts/pages/charts/data/mixedChartData";

function Student() {
  const { students } = reportsLineChartData;

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
                title="Current level"
                count="400"
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
                count={1.22}
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
                title="Carry overs"
                count={5}
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
            <MixedChart
              icon={{ color: "primary", component: "auto_graph" }}
              title="Performance for student per semester"
              description="Applied vs carryover"
              height="19.75rem"
              chart={mixedChartData}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Card>
              <MDBox pt={3} px={3}>
                <MDTypography variant="h6" fontWeight="medium">
                  Subjects carried over
                </MDTypography>
              </MDBox>
              <MDBox py={1}>
                <DataTable
                  table={carryoverTableData}
                  entriesPerPage={false}
                  showTotalEntries={false}
                  isSorted
                  noEndBorder
                />
              </MDBox>
            </Card>
          </Grid>
        </Grid>
      </MDBox>
      <MDBox py={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <ResultsBySemester />
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={12} md={12}>
            <ReportsLineChart
              color="dark"
              title="GPA trend"
              description={
                <>
                  (<strong>-15%</strong>) projected reesult this semester.
                </>
              }
              date="last semester"
              chart={students}
            />
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Student;
