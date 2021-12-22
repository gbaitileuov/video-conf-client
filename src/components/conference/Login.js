import { Button, Container, FormControlLabel, FormGroup, Paper, Switch, TextField, Tooltip, Typography, useMediaQuery, Zoom } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import VideocamOffOutlinedIcon from "@mui/icons-material/VideocamOffOutlined";
import MicNoneOutlinedIcon from "@mui/icons-material/MicNoneOutlined";
import MicOffOutlinedIcon from "@mui/icons-material/MicOffOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import { Box } from "@mui/system";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { closeMediaStream } from "../../utils";
import _ from "lodash";
import Settings from "./drawers/Settings";
import { setAudio, setVideo } from "../../store/localVideoSettingsSlice";
import { useTranslation } from "react-i18next";

const Login = ({ handleJoin }) => {
  const localVideoSettings = useSelector((state) => state.localVideoSettings.localVideoSettings);
  const deviceSettings = useSelector((state) => state.deviceSettings.deviceSettings);
  const devicesInitialized = useSelector((state) => state.deviceSettings.initialized);
  const dispatch = useDispatch();
  const [drawerOn, setDrawerOn] = useState(false);
  const [localStream, setLocalStream] = useState(null);
  const [updateState, setUpdateState] = useState(false);
  const previewVideoRef = useRef(null);
  const { t } = useTranslation();

  const videoHandler = (state) => {
    if (previewVideoRef.current.srcObject) {
      const userVideoTrack = previewVideoRef.current.srcObject.getVideoTracks()[0];
      userVideoTrack.enabled = state;
      dispatch(setVideo({ turnOn: state }));
    }
  };

  const videoSwitchHandler = () => {
    videoHandler(!localVideoSettings.video);
  };

  const audioSwitchHandler = () => {
    dispatch(setAudio({ turnOn: !localVideoSettings.audio }));
  };

  const drawerOpenHandler = (e) => {
    if (e.type === "keydown" && (e.key === "Tab" || e.key === "Shift")) {
      return;
    }
    setDrawerOn(!drawerOn);
  };

  useEffect(() => {
    if (devicesInitialized) {
      if (localStream || _.isEmpty(deviceSettings.videoDevice)) {
        closeMediaStream(localStream);
        if (_.isEmpty(deviceSettings.videoDevice)) {
          videoHandler(false);
          return;
        }
      }

      const constraints = {
        audio: deviceSettings.audioDevice ? { deviceId: { exact: deviceSettings.audioDevice } } : false,
        video: deviceSettings.videoDevice ? { deviceId: { exact: deviceSettings.videoDevice } } : false,
      };

      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          setLocalStream(stream);
          previewVideoRef.current.srcObject = stream;

          const userVideoTrack = previewVideoRef.current.srcObject.getVideoTracks()[0];
          userVideoTrack.enabled = localVideoSettings.video;

          const userAudioTrack = previewVideoRef.current.srcObject.getAudioTracks()[0];
          userAudioTrack.enabled = false;
          setUpdateState(!updateState);
        })
        .catch((error) => {
          console.error(error);
        });
    }
    // eslint-disable-next-line
  }, [devicesInitialized, deviceSettings.audioDevice, deviceSettings.videoDevice]);

  return (
    <Container className="login" maxWidth="xs">
      <div className="login__box">
        <div className="login__header">
          <Typography component="p" variant="body1">
            {t("chooseAudioVideoParams")}
          </Typography>
          <Typography className="login__title" component="h1" variant="h5">
            {t("forMeeting")}
          </Typography>
        </div>
        <Paper className="login-paper" elevation={4}>
          <video ref={previewVideoRef} autoPlay playsInline muted className="login-paper__video"></video>
          {previewVideoRef.current && (!previewVideoRef.current.srcObject || !previewVideoRef.current.srcObject.getVideoTracks()[0].enabled) && (
            <div className="login-paper__pl-container">
              <AccountCircleIcon className="login-paper__placeholder-icon" />
            </div>
          )}
          <div className="login-paper__controls" component="section">
            <FormGroup className="login-paper__group" row>
              <Tooltip TransitionComponent={Zoom} arrow title={localVideoSettings.video ? t("turnOffCamera") : t("turnOnCamera")}>
                <FormControlLabel
                  checked={localVideoSettings.video}
                  control={<Switch onChange={videoSwitchHandler} size="small" />}
                  labelPlacement="start"
                  label={
                    localVideoSettings.video ? (
                      <VideocamOutlinedIcon className="login-paper__icon" />
                    ) : (
                      <VideocamOffOutlinedIcon className="login-paper__icon" />
                    )
                  }
                />
              </Tooltip>
              <Tooltip TransitionComponent={Zoom} arrow title={localVideoSettings.audio ? t("turnOffMic") : t("turnOnMic")}>
                <FormControlLabel
                  sx={{ mr: "4px" }}
                  checked={localVideoSettings.audio}
                  control={<Switch onChange={audioSwitchHandler} size="small" />}
                  labelPlacement="start"
                  label={
                    localVideoSettings.audio ? (
                      <MicNoneOutlinedIcon className="login-paper__icon" />
                    ) : (
                      <MicOffOutlinedIcon className="login-paper__icon" />
                    )
                  }
                />
              </Tooltip>
              <Button
                variant="text"
                color="inherit"
                size="small"
                startIcon={<SettingsOutlinedIcon />}
                onClick={drawerOpenHandler}
                onKeyDown={drawerOpenHandler}
              >
                {useMediaQuery("(min-width:375px)") && t("settings")}
              </Button>
              {drawerOn && <Settings onClose={drawerOpenHandler} />}
            </FormGroup>
          </div>
        </Paper>
        <Box className="login__form" component="form" noValidate onSubmit={handleJoin}>
          <TextField
            className="login__input"
            label={t("enterName")}
            required
            size="small"
            id="name"
            name="name"
            autoFocus
            autoComplete="off"
            // value="Байтилеуов Гани"
          />
          {devicesInitialized ? (
            localVideoSettings.video ? (
              localStream ? (
                <Button size="small" variant="contained" type="submit">
                  {t("join")}
                </Button>
              ) : (
                <Button size="small" variant="contained" type="submit" disabled>
                  {t("join")}
                </Button>
              )
            ) : (
              <Button size="small" variant="contained" type="submit">
                {t("join")}
              </Button>
            )
          ) : (
            <Button size="small" variant="contained" type="submit" disabled>
              {t("join")}
            </Button>
          )}
        </Box>
      </div>
    </Container>
  );
};

export default Login;
