import Card from "@mui/material/Card";
import Grid from "@mui/material/Grid";
import Icon from "@mui/material/Icon";

import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";

import SalesTable from "examples/Tables/SalesTable";

// Data
import semestersTableData from "layouts/dashboards/students/components/ResultsBySemester/data/semestersTableData";

function ResultsBySemester() {
  return (
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
            <SalesTable rows={semestersTableData} shadow={false} />
          </Grid>
        </Grid>
      </MDBox>
    </Card>
  );
}

export default ResultsBySemester;
