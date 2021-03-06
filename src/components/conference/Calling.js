import Chat from "./drawers/Chat";
import Med from "./drawers/Med";
import People from "./drawers/People";
import { useContext, useEffect, useRef, useState } from "react";
import { authContext } from ".";
import {
  ToggleButtonGroup,
  ToggleButton,
  Grid,
  Tooltip,
  Zoom,
  useTheme,
  useMediaQuery,
  CircularProgress,
  Snackbar,
  IconButton,
  Alert,
  Link,
  Paper,
  Container,
  TextField,
  Rating,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import { closeMediaStream } from "../../utils";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import MicSharpIcon from "@mui/icons-material/MicSharp";
import MicOffSharpIcon from "@mui/icons-material/MicOffSharp";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import PhoneDisabledIcon from "@mui/icons-material/PhoneDisabled";
import CloseIcon from "@mui/icons-material/Close";
import StarIcon from "@mui/icons-material/Star";
import Settings from "./drawers/Settings";
import LocalVideoView from "./videoview/LocalVideoView";
import { useDispatch, useSelector } from "react-redux";
import { setAudio, setVideo } from "../../store/localVideoSettingsSlice";
import _ from "lodash";
import RemoteVideoView from "./videoview/RemoteVideoView";
import Message from "./chat/message";
import Peer from "simple-peer";
import { useTranslation } from "react-i18next";

const multiActions = ["videoOn", "audioOn", "phoneOn"];
const exclusiveActions = ["settingsOn", "medOn", "chatOn", "peopleOn"];

const Calling = ({ roomId, userId, socket, roomIdChecked }) => {
  const auth = useContext(authContext);
  const videoAreaRef = useRef();
  const [drawerActions, setDrawerActions] = useState([]);
  const localVideoSettings = useSelector((state) => state.localVideoSettings.localVideoSettings);
  const deviceSettings = useSelector((state) => state.deviceSettings.deviceSettings);
  const devicesInitialized = useSelector((state) => state.deviceSettings.initialized);
  const [settingsOn, setSettingsOn] = useState(false);
  const [medOn, setMedOn] = useState(false);
  const [chatOn, setChatOn] = useState(false);
  const [peopleOn, setPeopleOn] = useState(false);
  const [localStreamLoaded, setLocalStreamLoaded] = useState(false);
  const localStreamRef = useRef();
  const peersRef = useRef([]);
  const [peersVideoAudio, setPeersVideoAudio] = useState({});
  const [peersCount, setPeersCount] = useState(0);
  const [msg, setMsg] = useState([]);
  const [diag, setDiag] = useState("");
  const [sendingMsg, setSendingMsg] = useState(false);
  const [alertDiagNazOpen, setAlertDiagNazOpen] = useState(false);
  const { t } = useTranslation();
  const [callEnd, setCallEnd] = useState(false);
  const [rateValue, setRateValue] = useState(0);
  const [rateHover, setRateHover] = useState(-1);
  const [endCallAlertOpen, setEndCallAlertOpen] = useState(false);

  const handleAlertDiagNazClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertDiagNazOpen(false);
  };

  const dispatch = useDispatch();

  const theme = useTheme();
  const drawerMatchLG = useMediaQuery(theme.breakpoints.down("lg"));

  const videoSwitchHandler = () => {
    const userVideoTrack = localStreamRef.current.getVideoTracks()[0];
    userVideoTrack.enabled = !localVideoSettings.video;
    dispatch(setVideo({ turnOn: !localVideoSettings.video }));

    socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: "video", state: !localVideoSettings.video });
  };

  const audioSwitchHandler = () => {
    const userAudioTrack = localStreamRef.current.getAudioTracks()[0];
    userAudioTrack.enabled = !localVideoSettings.audio;
    dispatch(setAudio({ turnOn: !localVideoSettings.audio }));

    socket.emit("BE-toggle-camera-audio", { roomId, switchTarget: "audio", state: !localVideoSettings.audio });
  };

  const phoneSwitchHandler = () => {
    goToBack();
  };

  const handleDrawerActions = (_, actions, closeAll = false) => {
    if (closeAll) {
      actions = actions.filter((el) => !exclusiveActions.find((rm) => rm === el));
    } else {
      const currentAction = actions[actions.length - 1];

      if (exclusiveActions.includes(currentAction)) {
        actions = actions.filter((el) => !exclusiveActions.find((rm) => rm === el));
        actions.push(currentAction);
      }
    }

    setDrawerActions(actions);

    setSettingsOn(false);
    setMedOn(false);
    setChatOn(false);
    setPeopleOn(false);

    const action = actions.filter((el) => exclusiveActions.find((rm) => rm === el));
    switch (action[0]) {
      case exclusiveActions[0]:
        setSettingsOn(true);
        break;
      case exclusiveActions[1]:
        setMedOn(true);
        break;
      case exclusiveActions[2]:
        setChatOn(true);
        break;
      case exclusiveActions[3]:
        setPeopleOn(true);
        break;
      default:
        break;
    }
  };
  const closeDrawerActions = () => handleDrawerActions(null, drawerActions, true);

  useEffect(() => {
    if (!videoAreaRef.current) return;
    if (settingsOn || chatOn || peopleOn) {
      videoAreaRef.current.style.marginRight = "320px";
    } else if (medOn) {
      videoAreaRef.current.style.marginRight = drawerMatchLG ? "320px" : "600px";
    } else {
      videoAreaRef.current.style.marginRight = 0;
    }
  }, [settingsOn, medOn, chatOn, peopleOn, drawerMatchLG]);

  function goToBack() {
    // socket.emit("BE-leave-room", { roomId });
    setCallEnd(true);
  }

  useEffect(() => {
    ["popstate"].forEach((event) => window.addEventListener(event, () => (window.location.href = "/?" + roomId)));

    const beUrl = "https://tmed.su/api/chatDetails/" + roomId + "/";
    fetch(beUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((datas) => {
        if (datas && datas.length > 0) {
          // console.log("datas:", datas);
          //
          datas.forEach((data) => {
            if (!_.isEmpty(data.message)) {
              if (auth.user.name !== data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 1,
                    sender: data.username,
                    message: data.message,
                  }),
                ]);
              } else if (auth.user.name === data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 0,
                    sender: t("me"),
                    message: data.message,
                  }),
                ]);
              }
            } else if (!_.isEmpty(data.diagnoz)) {
              if (auth.user.name !== data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 4,
                    sender: data.username,
                    medFileName: `${t("diagnosis")}`,
                    medDiag: data.diagnoz,
                    medPacient: data.pacient,
                    medDoctor: data.username,
                  }),
                ]);
              } else if (auth.user.name === data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 3,
                    sender: t("me"),
                    medFileName: `${t("diagnosis")}`,
                    medDiag: data.diagnoz,
                    medPacient: data.pacient,
                    medDoctor: data.username,
                  }),
                ]);
              }
            } else if (!_.isEmpty(data.files) && !_.isEmpty(data.username) && !_.isEmpty(data.link)) {
              if (auth.user.name !== data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 6,
                    sender: data.username,
                    fileName: data.filename,
                    fileExt: data.fileext,
                    fileMime: data.filemime,
                    bytelength: data.bytelength,
                    fileURL: data.files,
                  }),
                ]);
              } else if (auth.user.name === data.username) {
                setMsg((msgs) => [
                  ...msgs,
                  new Message({
                    id: 5,
                    sender: t("me"),
                    fileName: data.filename,
                    fileExt: data.fileext,
                    fileMime: data.filemime,
                    bytelength: data.bytelength,
                    fileURL: data.files,
                  }),
                ]);
              }
            }
          });
        }
      });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!roomIdChecked) {
      goToBack();
    }
    // eslint-disable-next-line
  }, [roomIdChecked]);

  useEffect(() => {
    if (!devicesInitialized) return;

    if (localStreamRef.current) {
      closeMediaStream(localStreamRef.current);
      localStreamRef.current = null;
    }

    if (_.isEmpty(deviceSettings.audioDevice) && _.isEmpty(deviceSettings.videoDevice)) return;

    const constraints = {
      audio: deviceSettings.audioDevice ? { deviceId: { exact: deviceSettings.audioDevice } } : false,
      video: deviceSettings.videoDevice ? { deviceId: { exact: deviceSettings.videoDevice } } : false,
    };

    navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
      localStreamRef.current = stream;
      setLocalStreamLoaded(true);

      const userVideoTrack = localStreamRef.current.getVideoTracks()[0];
      userVideoTrack.enabled = localVideoSettings.video;

      const userAudioTrack = localStreamRef.current.getAudioTracks()[0];
      userAudioTrack.enabled = localVideoSettings.audio;

      setPeersCount(0);

      socket.emit("BE-join-room", {
        roomId,
        userId,
        userName: auth.user.name,
        userRole: auth.user.role,
        userVideo: localVideoSettings.video,
        userAudio: localVideoSettings.audio,
      });

      socket.on("FE-user-join", (users) => {
        users.forEach(({ userId, info }) => {
          if (!findPeer(userId) && info.userId !== auth.user.id) {
            const peer = createPeer(userId, socket.id, stream);

            peersRef.current.push({
              peerID: userId,
              peer,
              userId: info.userId,
              userName: info.userName,
              userRole: info.userRole,
            });

            setPeersCount((prev) => prev + 1);

            setPeersVideoAudio((prev) => {
              return {
                ...prev,
                [userId]: { video: info.userVideo, audio: info.userAudio },
              };
            });
          }
        });
      });

      socket.on("FE-receive-call", ({ signal, from, info }) => {
        const peerIdx = findPeer(from);
        if (!peerIdx) {
          const peer = addPeer(signal, from, stream);

          peersRef.current.push({
            peerID: from,
            peer,
            userId: info.userId,
            userName: info.userName,
            userRole: info.userRole,
          });

          setPeersCount((prev) => prev + 1);

          setPeersVideoAudio((prev) => {
            return {
              ...prev,
              [from]: { video: info.userVideo, audio: info.userAudio },
            };
          });

          // const beUrl = "https://tmed.su/api/create-chat/";
          // fetch(beUrl, {
          //   method: "POST",
          //   mode: "cors",
          //   cache: "no-cache",
          //   headers: {
          //     Accept: "application/json",
          //     "Content-Type": "application/json",
          //   },
          //   body: JSON.stringify({ link: roomId, startdate: getDateTime() }),
          // })
          //   .then((response) => response.json())
          //   .then((data) => {
          //     console.log("data:", data);
          //     if (!data || !data.id) {
          //       console.error("create-chat startdate error");
          //     }
          //   });
        }
      });

      socket.on("FE-call-accepted", ({ signal, answerId }) => {
        const peerIdx = findPeer(answerId);
        peerIdx.peer.signal(signal);
      });

      socket.on("FE-user-leave", ({ userId }) => {
        const peerIdx = findPeer(userId);
        if (peerIdx) {
          peerIdx.peer.destroy();

          peersRef.current = peersRef.current.filter((peer) => peer.peerID !== peerIdx.peerID);
          setPeersCount((prev) => prev - 1);
        }
      });

      socket.on("FE-receive-message", ({ data }) => {
        setSendingMsg(false);
        if (!_.isEmpty(data.text)) {
          if (auth.user.id !== data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 1,
                sender: data.name,
                message: data.text,
              }),
            ]);
          } else if (auth.user.id === data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 0,
                sender: t("me"),
                message: data.text,
              }),
            ]);
          }
        } else if (!_.isEmpty(data.diag)) {
          if (auth.user.id !== data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 4,
                sender: data.name,
                medFileName: `${t("diagnosis")}`,
                medDiag: data.diag,
                medPacient: data.pacient,
                medDoctor: data.name,
              }),
            ]);
          } else if (auth.user.id === data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 3,
                sender: t("me"),
                medFileName: `${t("diagnosis")}`,
                medDiag: data.diag,
                medPacient: data.pacient,
                medDoctor: data.name,
              }),
            ]);
          }
        } else if (!_.isEmpty(data.fileName) && !_.isEmpty(data.fileExt) && !_.isEmpty(data.fileMime) && data.fileData.byteLength !== 0) {
          if (auth.user.id !== data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 6,
                sender: data.name,
                fileName: data.fileName,
                fileExt: data.fileExt,
                fileMime: data.fileMime,
                fileData: data.fileData,
              }),
            ]);
          } else if (auth.user.id === data.uid) {
            setMsg((msgs) => [
              ...msgs,
              new Message({
                id: 5,
                sender: t("me"),
                fileName: data.fileName,
                fileExt: data.fileExt,
                fileMime: data.fileMime,
                fileData: data.fileData,
              }),
            ]);
          }
        }
      });
    });

    socket.on("FE-toggle-camera", ({ userId, switchTarget, state }) => {
      const peerIdx = findPeer(userId);
      if (peerIdx) {
        setPeersVideoAudio((prev) => {
          let video = prev[peerIdx.peerID].video;
          let audio = prev[peerIdx.peerID].audio;

          if (switchTarget === "video") video = state;
          else audio = state;

          return {
            ...prev,
            [peerIdx.peerID]: { video, audio },
          };
        });
      }
    });

    return () => {
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, [devicesInitialized, deviceSettings.audioDevice, deviceSettings.videoDevice]);

  const sendDiagNazToChat = () => {
    if (_.isEmpty(diag.trim())) return;
    const data = {
      uid: auth.user.id,
      name: auth.user.name,
      diag,
      pacient: peersRef.current[0] ? peersRef.current[0].userName : "Unknown",
    };
    socket.emit("BE-send-message", { roomId, data });

    const beUrl = "https://tmed.su/api/create-chat/";
    fetch(beUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: roomId, username: auth.user.name, diagnoz: diag, pacient: data.pacient, appointment: "111" }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data:", data);
        if (!data || !data.id) {
          console.error("create-chat sendDiagNazToChat error");
        } else {
          setAlertDiagNazOpen(true);
        }
      });
  };

  function createPeer(userId, caller, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-call-user", {
        userToCall: userId,
        from: caller,
        signal,
      });
    });

    return peer;
  }

  function addPeer(incomingSignal, callerId, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("BE-accept-call", { roomId, signal, to: callerId });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  function findPeer(id) {
    return peersRef.current.find((p) => p.peerID === id);
  }

  const handleRate = (e) => {
    e.preventDefault();

    if (!e.target.rate_text.value) {
      e.target.rate_text.focus();
      return;
    }

    const beUrl = "https://tmed.su/api/create-chat/";
    fetch(beUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review: e.target.rate_text.value, star: rateValue, link: roomId }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.id) {
          console.error("create-chat addReview and addRate error");
          return;
        }

        setEndCallAlertOpen(true);
        // setTimeout(() => (window.location.href = "/?" + roomId), 5000);
        window.location.href = "/?" + roomId;
      })
      .catch((e) => console.log(e));
  };

  const handleEndCallAlertClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setEndCallAlertOpen(false);
  };

  if (callEnd) {
    if (auth.user.role === "dr") {
      window.location.href = "/?" + roomId;
      return;
    }

    socket.disconnect();

    const labels = t("endCallRateTextArray", { returnObjects: true });
    return (
      <>
        <Container className="call-end" maxWidth="sm">
          <Paper className="call-end__paper">
            <div className="call-end__header">{t("endCallHeader")}</div>
            <form onSubmit={handleRate}>
              <TextField
                className="call-end__textarea"
                name="rate_text"
                fullWidth
                multiline
                minRows={7}
                maxRows={20}
                placeholder={t("endCallTextareaPlaceholder")}
                helperText={t("endCallTextareaHelperText")}
              />
              <Stack className="call-end__rating" spacing={2} direction="row" alignItems="center">
                <Rating
                  name="rate_stars"
                  value={rateValue}
                  size="large"
                  onChange={(_, newValue) => {
                    setRateValue(newValue);
                  }}
                  onChangeActive={(_, newHover) => {
                    setRateHover(newHover);
                  }}
                  emptyIcon={<StarIcon style={{ opacity: 0.55 }} fontSize="inherit" />}
                />
                {rateValue !== null && <div className="call-end__rating-label">{labels[rateHover !== -1 ? rateHover : rateValue]}</div>}
              </Stack>
              <Divider />
              <Stack className="call-end__bottom" spacing={4} direction="row" alignItems="center">
                <Link href={`/?${roomId}`}>{t("endCallStartOver")}</Link>
                <Button variant="contained" color="primary" type="submit">
                  {t("endCallSendBtn")}
                </Button>
              </Stack>
            </form>
          </Paper>
        </Container>
        <Snackbar
          open={endCallAlertOpen}
          autoHideDuration={5000}
          onClose={handleEndCallAlertClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          action={
            <IconButton size="small" color="inherit" onClick={handleEndCallAlertClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
          }
        >
          <Alert onClose={handleEndCallAlertClose} severity="success">
            {t("endCallAlert")}
          </Alert>
        </Snackbar>
      </>
    );
  }

  return (
    <>
      <section ref={videoAreaRef} className="video-area">
        {localStreamLoaded && localStreamRef.current && <LocalVideoView stream={localStreamRef.current} />}
        {peersCount === 0 ? (
          <div className="video-area__waiting">
            <CircularProgress />
            <p>{t("waitingForOtherParticipants")}</p>
          </div>
        ) : (
          <Grid container className="video-area__avatar-container">
            {peersRef.current.map((peer, index) => (
              <RemoteVideoView key={index} peer={peer} count={peersCount} peersVideoAudio={peersVideoAudio} />
            ))}
          </Grid>
        )}

        <ToggleButtonGroup className="video-area__controls" size="small" color="primary" value={drawerActions} onChange={handleDrawerActions}>
          <ToggleButton className="video-area__control-first-group" value={multiActions[0]} onClick={videoSwitchHandler} selected={false}>
            <Tooltip TransitionComponent={Zoom} arrow title={localVideoSettings.video ? t("turnOffCamera") : t("turnOonCamera")}>
              {localVideoSettings.video ? <VideocamIcon /> : <VideocamOffIcon />}
            </Tooltip>
          </ToggleButton>
          <ToggleButton className="video-area__control-first-group" value={multiActions[1]} onClick={audioSwitchHandler} selected={false}>
            <Tooltip TransitionComponent={Zoom} arrow title={localVideoSettings.audio ? t("turnOffMic") : t("turnOnMic")}>
              {localVideoSettings.audio ? <MicSharpIcon /> : <MicOffSharpIcon />}
            </Tooltip>
          </ToggleButton>
          {/* <ToggleButton className="video-area__control-second-group" value={exclusiveActions[0]}>
            <Tooltip TransitionComponent={Zoom} arrow title="?????????????????? ??????????????????">
              <MoreVertIcon />
            </Tooltip>
          </ToggleButton> */}
          {auth.user.role === "dr" && (
            <ToggleButton className="video-area__control-second-group video-area__control-med" value={exclusiveActions[1]}>
              <Tooltip TransitionComponent={Zoom} arrow title={t("doctorsNotes")}>
                <LocalHospitalOutlinedIcon />
              </Tooltip>
            </ToggleButton>
          )}
          <ToggleButton className="video-area__control-second-group" value={exclusiveActions[2]}>
            <Tooltip TransitionComponent={Zoom} arrow title={t("chat")}>
              <ChatOutlinedIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton className="video-area__control-second-group" value={exclusiveActions[3]}>
            <Tooltip TransitionComponent={Zoom} arrow title={t("meetingParticipants")}>
              <PeopleAltOutlinedIcon />
            </Tooltip>
          </ToggleButton>
          <ToggleButton
            className="video-area__control-second-group video-area__control-phone"
            value={multiActions[2]}
            onClick={phoneSwitchHandler}
            color="error"
            selected={false}
          >
            <Tooltip TransitionComponent={Zoom} arrow title={t("endCall")}>
              <PhoneDisabledIcon />
            </Tooltip>
          </ToggleButton>
        </ToggleButtonGroup>
      </section>
      <Snackbar
        open={alertDiagNazOpen}
        autoHideDuration={6000}
        onClose={handleAlertDiagNazClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton size="small" color="inherit" onClick={handleAlertDiagNazClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleAlertDiagNazClose} severity="success">
          {t("fileDiagNazSend")}{" "}
          <Link
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDrawerActions("", ["medOn", "chatOn"]);
            }}
          >
            {t("chat").toLowerCase()}
          </Link>
        </Alert>
      </Snackbar>
      {settingsOn && <Settings onClose={closeDrawerActions} />}
      {medOn && (
        <Med onClose={closeDrawerActions} diag={diag} setDiag={setDiag} sendDiagNazToChat={sendDiagNazToChat} roomId={roomId} peersRef={peersRef} />
      )}
      {chatOn && <Chat onClose={closeDrawerActions} roomId={roomId} msg={msg} sendingMsg={sendingMsg} setSendingMsg={setSendingMsg} />}
      {peopleOn && <People auth={auth} onClose={closeDrawerActions} peersRef={peersRef} />}
    </>
  );
};

export default Calling;
