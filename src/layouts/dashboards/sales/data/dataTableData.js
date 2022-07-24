import StudentCell from "layouts/dashboards/sales/components/StudentCell";
import CgpaCell from "layouts/dashboards/sales/components/CgpaCell";
import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";

import marie from "assets/images/marie.jpg";

const dataTableData = {
  columns: [
    { Header: "student", accessor: "student" },
    { Header: "department", accessor: "department" },
    { Header: "level", accessor: "level", align: "center" },
    { Header: "cgpa", accessor: "cgpa", align: "center" },
  ],

  rows: [
    {
      student: <StudentCell image={marie} name="Sade Peters" />,
      department: <DefaultCell>Computer Science</DefaultCell>,
      level: <DefaultCell>300L</DefaultCell>,
      cgpa: <CgpaCell value={1.0} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
    },
    {
      student: <StudentCell image={marie} name="William Jacob" />,
      department: <DefaultCell>Agric Science</DefaultCell>,
      level: <DefaultCell>200L</DefaultCell>,
      cgpa: <CgpaCell value={1.23} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
    },
    {
      student: <StudentCell image={marie} name="Bob Emeka" />,
      department: <DefaultCell>Political Science</DefaultCell>,
      level: <DefaultCell>400L</DefaultCell>,
      cgpa: <CgpaCell value={1.12} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
    },
    {
      student: <StudentCell image={marie} name="Adamu Ali" />,
      department: <DefaultCell>Int&apos;l Relations</DefaultCell>,
      level: <DefaultCell>300L</DefaultCell>,
      cgpa: <CgpaCell value={1.15} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
    },
    {
      student: <StudentCell image={marie} name="Mohi Aba" />,
      department: <DefaultCell>Geography</DefaultCell>,
      level: <DefaultCell>200L</DefaultCell>,
      cgpa: <CgpaCell value={1.21} icon={{ color: "error", name: "keyboard_arrow_down" }} />,
    },
  ],
};

export default dataTableData;
