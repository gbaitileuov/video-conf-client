import PropTypes from "prop-types";
import { useContext } from "react";
import { Redirect, Route } from "react-router";
import { authContext } from "./components/conference";
import { useTranslation } from "react-i18next";

export const stringToColor = (string) => {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.substr(-2);
  }

  return color;
};

export const stringAvatar = (name) => {
  name = name.replace(/\s+/g, " ");
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0]}` + (name.split(" ").length > 1 ? `${name.split(" ")[1][0]}` : ""),
  };
};

export function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} id={`full-width-tabpanel-${index}`} aria-labelledby={`full-width-tab-${index}`} {...other}>
      {value === index && <>{children}</>}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

export function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}

export function PublicRoute({ children, path, roomIdChecked, ...rest }) {
  const { t } = useTranslation();
  return <Route path={path} {...rest} render={() => (roomIdChecked ? children : <div className="broken-url">{t("linkIsNotValid")}</div>)} />;
}

export function PrivateRoute({ children, ...rest }) {
  const auth = useContext(authContext);
  return (
    <Route
      {...rest}
      render={({ location }) => {
        if (auth.user.name) {
          return children;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/",
                state: { from: location },
              }}
            />
          );
        }
      }}
    />
  );
}

export const closeMediaStream = function (stream) {
  if (!stream) {
    return;
  }
  if (MediaStreamTrack && MediaStreamTrack.prototype && MediaStreamTrack.prototype.stop) {
    var tracks, i, len;

    if (stream.getTracks) {
      tracks = stream.getTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    } else {
      tracks = stream.getAudioTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }

      tracks = stream.getVideoTracks();
      for (i = 0, len = tracks.length; i < len; i += 1) {
        tracks[i].stop();
      }
    }
    // Deprecated by the spec, but still in use.
  } else if (typeof stream.stop === "function") {
    stream.stop();
  }
};

export const getDevices = () => {
  return new Promise((resolve) => {
    let videoDevices = [];
    let audioDevices = [];
    navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    navigator.mediaDevices
      .enumerateDevices()
      .then((devices) => {
        for (let device of devices) {
          if (device.kind === "videoinput") {
            videoDevices.push(device);
          } else if (device.kind === "audioinput") {
            audioDevices.push(device);
          }
        }
      })
      .then(() => {
        resolve({ videoDevices, audioDevices });
      });
  });
};

export const findDevice = (deviceId, devices) => {
  for (const device of devices) {
    if (device.deviceId === deviceId) {
      return true;
    }
  }
  return false;
};

export const getDateTime = (onlyDate = true) => {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var day = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  if (month.toString().length === 1) {
    month = "0" + month;
  }
  if (day.toString().length === 1) {
    day = "0" + day;
  }
  if (hour.toString().length === 1) {
    hour = "0" + hour;
  }
  if (minute.toString().length === 1) {
    minute = "0" + minute;
  }
  if (second.toString().length === 1) {
    second = "0" + second;
  }
  var dateTime = day + "." + month + "." + year + (!onlyDate ? " " + hour + ":" + minute + ":" + second : "");
  return dateTime;
};
