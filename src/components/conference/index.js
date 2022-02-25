import { CssBaseline } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import Login from "./Login";
import NavBar from "./NavBar";
import { Switch, Route, Redirect, useHistory } from "react-router-dom";
import Calling from "./Calling";
import { createContext, useEffect, useRef, useState } from "react";
import "./styles.scss";
import { findDevice, getDevices, PrivateRoute, PublicRoute } from "../../utils";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, setAudioDevice, setVideoDevice } from "../../store/deviceSettingsSlice";
import { v4 } from "uuid";
import socket from "./socket";
import { useTranslation } from "react-i18next";

const theme = createTheme({
  palette: {
    mode: "dark",
    background: {
      paper: "#2d333b",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
  },
});

function useProvideAuth() {
  const [user, setUser] = useState({});

  const join = (username, userId) => {
    if (!username.trim().length) return;

    let userInfo = {};

    // if (username === "Baitileuov Gani") {
    if (username === "1") {
      userInfo = {
        id: userId,
        name: username,
        role: "dr",
      };
      setUser(userInfo);
    } else {
      userInfo = {
        id: userId,
        name: username,
        role: "user",
      };
      setUser(userInfo);
    }
    return userInfo;
  };

  return {
    user,
    join,
  };
}

const userId = v4();

const Conference = () => {
  const { t, i18n } = useTranslation();
  const auth = useProvideAuth();
  const deviceSettings = useSelector((state) => state.deviceSettings.deviceSettings);
  const dispatch = useDispatch();
  const roomId = useRef();
  const [roomIdChecked, setRoomIdChecked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lang, setLang] = useState(i18n.language);
  const history = useHistory();

  const handleLangChange = (_, newLang) => {
    localStorage.setItem("i18nextLng", newLang);
    i18n.changeLanguage(newLang);
    setLang(newLang);
  };

  useEffect(() => {
    const roomIDAddress = window.location.search.substring(1).trim();
    if (roomIDAddress.length === 36) {
      const beUrl = "https://tmed.su/api/link-date/" + roomIDAddress + "/";

      socket.on("connect", () => {
        socket.emit("BE-allow-join-room", { roomId: roomIDAddress, userId: socket.id });

        socket.on("FE-allow-status", ({ allow }) => {
          if (allow) {
            fetch(beUrl, {
              method: "GET",
              mode: "cors",
              cache: "no-cache",
            })
              .then((response) => response.json())
              .then((datetime) => {
                setLoading(false);

                if (datetime && datetime.length > 0) {
                  setRoomIdChecked(true);
                }
                roomId.current = roomIDAddress;
              })
              .catch((e) => {
                console.error(e);
              });
          } else {
            setLoading(false);
            setRoomIdChecked(false);
          }
        });
      });
    } else {
      setLoading(false);
    }
  }, []);

  const updateDevices = () => {
    dispatch(changeStatus({ initialized: false }));
    getDevices().then((data) => {
      if (data.audioDevices.length < 1) {
        dispatch(
          setAudioDevice({
            audioDevice: "",
          }),
        );
      } else {
        if (!findDevice(deviceSettings.audioDevice, data.audioDevices)) {
          dispatch(
            setAudioDevice({
              audioDevice: data.audioDevices[0].deviceId,
            }),
          );
        }
      }

      if (data.videoDevices.length < 1) {
        dispatch(
          setVideoDevice({
            videoDevice: "",
          }),
        );
      } else {
        if (!findDevice(deviceSettings.videoDevice, data.videoDevices)) {
          dispatch(
            setVideoDevice({
              videoDevice: data.videoDevices[0].deviceId,
            }),
          );
        }
      }

      if (data.videoDevices.length !== 0 || data.audioDevices.length !== 0) {
        dispatch(changeStatus({ initialized: true }));
      }
    });
  };

  useEffect(() => {
    updateDevices();

    navigator.mediaDevices.addEventListener("devicechange", () => {
      // console.log("devicechange");
      updateDevices();
    });
    // eslint-disable-next-line
  }, []);

  const handleJoin = (e) => {
    e.preventDefault();

    if (!e.target.name.value) {
      e.target.name.focus();
      return;
    }

    auth.join(e.target.name.value, userId);

    const beUrl = "https://tmed.su/api/create-chat/";
    fetch(beUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: e.target.name.value, link: roomId.current }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (!data || !data.id) {
          console.error("create-chat addPeople error");
        }
      });

    history.push("/calling");
  };

  return (
    <StyledEngineProvider injectFirst>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <authContext.Provider value={auth}>
          <div className="header">
            <NavBar lang={lang} handleLangChange={handleLangChange} />
          </div>
          <main className="content">
            {!loading ? (
              <Switch>
                <PublicRoute path="/" roomIdChecked={roomIdChecked} exact>
                  <Login roomId={roomId.current} handleJoin={handleJoin} />
                </PublicRoute>
                <PrivateRoute path="/calling">
                  <Calling roomId={roomId.current} userId={userId} socket={socket} roomIdChecked={roomIdChecked} />
                </PrivateRoute>
                <Route path="*">
                  <Redirect to="/" />
                </Route>
              </Switch>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{t("wait")}</div>
            )}
          </main>
        </authContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
};

export const authContext = createContext();
export default Conference;
