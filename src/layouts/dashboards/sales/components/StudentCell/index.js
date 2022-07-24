import PropTypes from "prop-types";

// Material Dashboard 2 PRO React components
import MDBox from "components/MDBox";
import MDTypography from "components/MDTypography";
import MDAvatar from "components/MDAvatar";

function StudentCell({ image, name }) {
  return (
    <MDBox display="flex" alignItems="center" pr={2}>
      <MDBox mr={2}>
        <MDAvatar src={image} alt={name} />
      </MDBox>
      <MDBox display="flex" flexDirection="column">
        <MDTypography variant="button" fontWeight="medium">
          {name}
        </MDTypography>
      </MDBox>
    </MDBox>
  );
}

// Typechecking props for the StudentCell
StudentCell.propTypes = {
  image: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

export default StudentCell;
