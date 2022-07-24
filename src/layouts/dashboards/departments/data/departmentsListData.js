import MDTypography from "components/MDTypography";

const departmentsListData = [
  {
    color: "dark",
    name: "Computer Science",
    description: (
      <>
        250 students,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          9 on watch
        </MDTypography>
      </>
    ),
    route: "/departments/computer",
  },
  {
    color: "dark",
    name: "Microbiology",
    description: (
      <>
        132 students,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          5 on watch
        </MDTypography>
      </>
    ),
    route: "/departments/microbiology",
  },
  {
    color: "dark",
    name: "Agric Economics",
    description: (
      <>
        100 students,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          3 on watch
        </MDTypography>
      </>
    ),
    route: "/departments/agriceconomics",
  },
  {
    color: "dark",
    name: "Mechatronics",
    description: (
      <>
        87 students,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          7 on watch
        </MDTypography>
      </>
    ),
    route: "/departments/mechatronics",
  },
];

export default departmentsListData;
