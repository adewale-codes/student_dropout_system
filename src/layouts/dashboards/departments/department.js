import Grid from "@mui/material/Grid";
import { useEffect, useState, useCallback } from "react";
import axios from "axios"
import { useParams } from "react-router-dom";

import MDBox from "components/MDBox";

import DashboardLayout from "examples/LayoutContainers/DashboardLayout";
import DashboardNavbar from "examples/Navbars/DashboardNavbar";
import Footer from "examples/Footer";
import Card from "@mui/material/Card";
import MDTypography from "components/MDTypography";
import DefaultDoughnutChart from "examples/Charts/DoughnutCharts/DefaultDoughnutChart";
import CategoriesList from "examples/Lists/CategoriesList";


function Department() {
  const { departmentName } = useParams();
  const [department, setDepartment] = useState(null);
  const [allDepartments, setAllDepartments] = useState([]);
  const [allStudents, setAllStudents] = useState([]);
  const [studentValsByDepartment, setStudentValsByDepartment] = useState([]);
  const [studentsDoughnutChartData, setStudentsDoughnutChartData] = useState([]);
  const [watchList, setWatchList] = useState([]);
  const [dropoutList, setDropoutList] = useState([]);
  const [studentsListData, setStudentsListData] = useState([])

  const fetchDepartments = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/departments`);
      setAllDepartments(res.data);
    } catch (error) {
      console.error("error", error)
    }
  }
  const fetchStudents = useCallback(
    async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/students`);
        if (department) {
          const filteredStudents = res.data.filter(student => student.department_id === department.id)
          const sortedStudents = filteredStudents.sort((a, b) => (Number(a.cgpa) > Number(b.cgpa)) ? -1 : 1)
          setAllStudents(sortedStudents);
        }
      } catch (error) {
        console.error("error", error)
      }
    },
    [department],
  )

  useEffect(() => {
    const selectedDepartment = allDepartments.find(department => department.name === departmentName);
    setDepartment(selectedDepartment);
  }, [allDepartments, departmentName])

  useEffect(() => {
    if (allStudents.length > 0) {
      const studentDepartmentVals = []
      allStudents.map(student => {
        studentDepartmentVals.push({
          name: `${student.first_name} ${student.last_name}`,
          value: Number(student.cgpa)
        })
      })
      setStudentValsByDepartment(studentDepartmentVals)
      const listData = allStudents.map(student => {
        return ({
          color: "dark",
          name: `${student.first_name} ${student.last_name}`,
          description: (
            <>
              CGPA - {" "}
              <MDTypography variant="caption" color="text" fontWeight="medium">
                {student.cgpa}
              </MDTypography>
            </>
          ),
          route: `/students/${student.id}`,
        })
      })
      setStudentsListData(listData);
    }
  }, [allStudents, department])

  useEffect(() => {
    const names = studentValsByDepartment.map(val => val.name)
    const values = studentValsByDepartment.map(val => val.value)
    const chartData = {
      labels: names.slice(0, 6),
      datasets: {
        label: "Projects",
        backgroundColors: ["info", "dark", "error", "secondary", "primary", "success"],
        data: values.slice(0, 6),
      },
    };
    setStudentsDoughnutChartData(chartData)
  }, [studentValsByDepartment])

  useEffect(() => {
    const watches = allStudents.filter(student => (Number(student.cgpa) <= 2 && Number(student.cgpa) >= 1.0));
    const drops = allStudents.filter(student => (Number(student.cgpa) < 1.0));
    setWatchList(watches);
    setDropoutList(drops);
  }, [allStudents])


  useEffect(() => {
    fetchDepartments();
  }, [])

  useEffect(() => {
    fetchStudents();
  }, [fetchStudents])

  return (
    <DashboardLayout>
      <DashboardNavbar />

      <MDBox mt={1.5} mb={3}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6} lg={6}>
            <CategoriesList title="All students" categories={studentsListData} />
          </Grid>
          <Grid item xs={12} md={6} lg={6}>
            <MDBox mb={3}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={12} lg={6}>
                  <MDBox mb={1.5}>
                    <DefaultDoughnutChart
                      icon={{ color: "success", component: "donut_small" }}
                      title="Top 6 students"
                      description="CGPA"
                      chart={studentsDoughnutChartData}
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

export default Department;
