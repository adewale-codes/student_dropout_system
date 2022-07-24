import Grid from "@mui/material/Grid";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import CategoriesList from "examples/Lists/CategoriesList";
import MDBadge from "components/MDBadge";

import departmentsDoughnutChartData from "layouts/dashboards/departments/data/departmentsDoughnutChartData";
import departmentsListData from "layouts/dashboards/departments/data/departmentsListData";

function Departments() {
  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={1.5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <CategoriesList title="Departments list" categories={departmentsListData} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                  <MDBox mb={1.5}>
                    <DefaultDoughnutChart
                      icon={{ color: "success", component: "donut_small" }}
                      title="Top 6 departments"
                      description="Average CGPA"
                      chart={departmentsDoughnutChartData}
                    />
                  </MDBox>
                </Grid>
                <Grid item xs={12} md={12} lg={6}>
                  <Card mb={3}>
                    <MDBox p={3} mb={3}>
                      <MDTypography variant="body2" color="text">
                        Students under watch
                      </MDTypography>
                      <MDBox mt={2} mb={1} lineHeight={0}>
                        <MDTypography variant="h3" fontWeight="bold">
                          11
                        </MDTypography>
                      </MDBox>
                      <MDBadge variant="contained" color="error" badgeContent="-1.3%" container />
                    </MDBox>
                    <MDBox p={3} mt={3}>
                      <MDTypography variant="body2" color="text">
                        High dropout risk
                      </MDTypography>
                      <MDBox mt={2} mb={1} lineHeight={0}>
                        <MDTypography variant="h3" fontWeight="bold">
                          5
                        </MDTypography>
                      </MDBox>
                      <MDBadge variant="contained" color="success" badgeContent="+4.3%" container />
                    </MDBox>
                  </Card>
                </Grid>
              </Grid>
            </MDBox>
          </Grid>
        </Grid>
      </MDBox>
      <Footer />
    </DashboardLayout>
  );
}

export default Departments;
