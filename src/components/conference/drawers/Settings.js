import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Divider, IconButton, MenuItem, Paper, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Offset } from "../NavBar";
import { useSelector, useDispatch } from "react-redux";
import { setAudioDevice, setVideoDevice } from "../../../store/deviceSettingsSlice";
import { getDevices } from "../../../utils";
import { useTranslation } from "react-i18next";

const drawerWidth = 320;

const Settings = ({ onClose }) => {
  const deviceSettings = useSelector((state) => state.deviceSettings.deviceSettings);
  const dispatch = useDispatch();
  const [audioDevices, setAudioDevices] = useState([]);
  const [videoDevices, setVideoDevices] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    getDevices().then((data) => {
      setAudioDevices(data.audioDevices);
      setVideoDevices(data.videoDevices);
    });
  }, [deviceSettings.audioDevice, deviceSettings.videoDevice]);

  const handleAudioDeviceChange = (e) => {
    dispatch(
      setAudioDevice({
        audioDevice: e.target.value,
      }),
    );
  };

  const handleVideoDeviceChange = (e) => {
    dispatch(
      setVideoDevice({
        videoDevice: e.target.value,
      }),
    );
  };

  return (
    <div className="drawer" style={{ width: `${drawerWidth}px` }}>
      <Offset className="drawer__header">
        <IconButton className="drawer__navbar-phone-back" onClick={onClose}>
          <ArrowBackIosNewIcon />
        </IconButton>
        <Typography variant="h6">{t("deviceSettings")}</Typography>
        <IconButton className="drawer__close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Offset>
      <Divider />
      <Paper className="drawer__body">
        <Paper className="settings-content" elevation={4}>
          <TextField
            margin="normal"
            fullWidth
            label={t("microphone")}
            value={deviceSettings.audioDevice}
            select
            size="small"
            variant="standard"
            onChange={handleAudioDeviceChange}
          >
            {audioDevices.map((device) => {
              return (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              );
            })}
          </TextField>
        </Paper>

        <div className="settings-content">
          <TextField
            fullWidth
            label={t("camera")}
            value={deviceSettings.videoDevice}
            select
            size="small"
            variant="standard"
            onChange={handleVideoDeviceChange}
          >
            {videoDevices.map((device) => {
              return (
                <MenuItem value={device.deviceId} key={device.deviceId}>
                  {device.label}
                </MenuItem>
              );
            })}
          </TextField>
        </div>
      </Paper>
    </div>
  );
};

export default Settings;
