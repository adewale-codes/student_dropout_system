import DefaultCell from "layouts/dashboards/sales/components/DefaultCell";

const dropoutTableData = {
  columns: [
    { Header: "course", accessor: "course" },
    { Header: "level", accessor: "level", align: "center" },
    { Header: "result", accessor: "result", align: "center" },
  ],

  rows: [
    {
      course: <DefaultCell>CSE 101</DefaultCell>,
      level: <DefaultCell>100L</DefaultCell>,
      result: <DefaultCell>32F</DefaultCell>,
    },
    {
      course: <DefaultCell>GNS 204</DefaultCell>,
      level: <DefaultCell>200L</DefaultCell>,
      result: <DefaultCell>30F</DefaultCell>,
    },
    {
      course: <DefaultCell>MTH 302</DefaultCell>,
      level: <DefaultCell>300L</DefaultCell>,
      result: <DefaultCell>24F</DefaultCell>,
    },
    {
      course: <DefaultCell>ENG 204</DefaultCell>,
      level: <DefaultCell>200L</DefaultCell>,
      result: <DefaultCell>21F</DefaultCell>,
    },
    {
      course: <DefaultCell>GEO 132</DefaultCell>,
      level: <DefaultCell>100L</DefaultCell>,
      result: <DefaultCell>12F</DefaultCell>,
    },
  ],
};

export default dropoutTableData;
