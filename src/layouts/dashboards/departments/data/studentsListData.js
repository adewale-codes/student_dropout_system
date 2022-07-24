import MDTypography from "components/MDTypography";

const studentsListData = [
  {
    color: "dark",
    name: "John Paul",
    description: (
      <>
        300L,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          4.23
        </MDTypography>
      </>
    ),
    route: "/students/john-paul",
  },
  {
    color: "dark",
    name: "Wale Peters",
    description: (
      <>
        200L,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          3.43
        </MDTypography>
      </>
    ),
    route: "/students/wale-peters",
  },
  {
    color: "dark",
    name: "Sade Adelekan",
    description: (
      <>
        100L,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          2.43
        </MDTypography>
      </>
    ),
    route: "/students/sade-adelekan",
  },
  {
    color: "dark",
    name: "Ali Ahmed",
    description: (
      <>
        400L,{" "}
        <MDTypography variant="caption" color="text" fontWeight="medium">
          4.22
        </MDTypography>
      </>
    ),
    route: "/students/ali-ahmed",
  },
];

export default studentsListData;
