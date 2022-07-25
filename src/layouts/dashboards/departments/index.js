import { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import axios from "axios"
import { groupBy, orderedObjects } from "layouts/dashboards/analytics"

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import CategoriesList from "examples/Lists/CategoriesList";

function Departments() {
  const [allDepartments, setAllDepartments] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [deptsListData, setDeptsListData] = useState([]);
  const [departmentsList, setDepartmentsList] = useState(null);
  const [studentValsByDepartment, setStudentValsByDepartment] = useState([]);
  const [departmentsDoughnutChartData, setDepartmentsDoughnutChartData] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [dropoutList, setDropoutList] = useState([]);

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/departments`);
      setAllDepartments(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }
  const fetchStudents = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/students`);
      setAllStudents(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }
  useEffect(() => {
    if (allDepartments.length > 0 && allStudents.length > 0) {
      const groupedStudentsByDepartments = groupBy(allStudents, "department_id");
      let depts = {};
      allDepartments.map(department => {
        depts[department.id] = department.name;
      });
      setDepartmentsList(depts)
      const deptResults = [];

      for (const [key, value] of Object.entries(groupedStudentsByDepartments)) {
        const studentsOnWatch = value.filter(student => (Number(student.cgpa) <= 2 && Number(student.cgpa) >= 1.0));
        deptResults.push({
          department: depts[key],
          onWatch: studentsOnWatch.length,
          students: value.length
        })
      }
      const deptsData = deptResults.map(dept => {
        return {
          color: "dark",
          name: dept.department,
          description: (
            <>
              {dept.students} students,{" "}
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {dept.onWatch} on watch
              </MDTypography>
            </>
          ),
          route: `/departments/${encodeURIComponent(dept.department)}`,
        }
      })
      setDeptsListData(deptsData);
    }

  }, [allDepartments, allStudents])

  useEffect(() => {
    if (allStudents.length > 0 && departmentsList
      && Object.keys(departmentsList).length > 0) {
      const groupedStudentsByDepartment = groupBy(allStudents, "department_id");
      const sortedStudentsByDepartment = orderedObjects(groupedStudentsByDepartment);
      const studentDepartmentVals = []
      for (const [key, value] of Object.entries(sortedStudentsByDepartment)) {
        let avg = value.reduce(function (avg, curr, _, { length }) {
          return avg + Number(curr.cgpa) / length;
        }, 0)
        studentDepartmentVals.push({
          department: departmentsList[key],
          value: avg
        })
      }
      const sorted = studentDepartmentVals.sort((a, b) => (a.value > b.value) ? -1 : 1)
      setStudentValsByDepartment(sorted);
    }

  }, [allStudents, departmentsList])

  useEffect(() => {
    const names = studentValsByDepartment.map(val => val.department)
    const values = studentValsByDepartment.map(val => val.value)
    const chartData = {
      labels: names.slice(0, 6),
      datasets: {
        label: "Projects",
        backgroundColors: ["info", "dark", "error", "secondary", "primary", "success"],
        data: values.slice(0, 6),
      },
    };
    setDepartmentsDoughnutChartData(chartData)
  }, [studentValsByDepartment])

  useEffect(() => {
    const watches = allStudents.filter(student => (Number(student.cgpa) <= 2 && Number(student.cgpa) >= 1.0));
    const drops = allStudents.filter(student => (Number(student.cgpa) < 1.0));
    setWatchList(watches);
    setDropoutList(drops);
  }, [allStudents])



  useEffect(() => {
    fetchDepartments();
    fetchStudents();
  }, [])

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={1.5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            {
              <CategoriesList title="Departments list" categories={deptsListData} />
            }
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
                          {watchList.length}
                        </MDTypography>
                      </MDBox>
                    </MDBox>
                    <MDBox p={3} mt={3}>
                      <MDTypography variant="body2" color="text">
                        High dropout risk
                      </MDTypography>
                      <MDBox mt={2} mb={1} lineHeight={0}>
                        <MDTypography variant="h3" fontWeight="bold">
                          {dropoutList.length}
                        </MDTypography>
                      </MDBox>
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
