import { connect } from "react-redux";
import AiSetting from "./component";
import { withTranslation } from "react-i18next";

const mapStateToProps = () => ({});
const actionCreator = {};
export default connect(
  mapStateToProps,
  actionCreator
)(withTranslation()(AiSetting as any) as any);
