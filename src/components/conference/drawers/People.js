import { Avatar, Badge, IconButton, List, ListItem, ListItemAvatar, ListItemText, Paper, Typography } from "@mui/material";
// import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
// import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import CloseIcon from "@mui/icons-material/Close";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Offset } from "../NavBar";
import { stringAvatar } from "../../../utils";
import { useTranslation } from "react-i18next";

const drawerWidth = 320;

const People = ({ auth, onClose, peersRef }) => {
  const { t } = useTranslation();
  return (
    <div className="drawer" style={{ width: `${drawerWidth}px` }}>
      <div className="drawer__header">
        <Offset className="drawer__navbar" style={{ width: `${drawerWidth}px` }}>
          <div className="drawer__navbar-content">
            <IconButton className="drawer__navbar-phone-back" onClick={onClose}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <Badge className="drawer__navbar-content-badge" badgeContent={peersRef.current.length + 1} color="primary">
              <PeopleAltOutlinedIcon />
            </Badge>
            <Typography variant="h6">{t("meetingParticipants")}</Typography>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Offset>
        <Offset />
      </div>
      <Paper className="drawer__body">
        <List className="people-list">
          <ListItem
            className="people-list__item"
            // secondaryAction={
            //   <IconButton edge="end">
            //     <MicNoneOutlinedIcon />
            //   </IconButton>
            // }
          >
            <ListItemAvatar>
              <Avatar {...stringAvatar(auth.user.name)} />
            </ListItemAvatar>
            <ListItemText primary={auth.user.name} secondary={auth.user.role === "dr" ? t("doctor") : t("patient_")} />
          </ListItem>
          {peersRef.current.map((item, index) => (
            <ListItem
              key={index}
              className="people-list__item"
              // secondaryAction={
              //   <IconButton edge="end">
              //     <MicNoneOutlinedIcon />
              //   </IconButton>
              // }
            >
              <ListItemAvatar>
                <Avatar {...stringAvatar(item.userName)} />
              </ListItemAvatar>
              <ListItemText primary={item.userName} secondary={item.userRole === "dr" ? t("doctor") : t("patient_")} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </div>
  );
};

export default People;
