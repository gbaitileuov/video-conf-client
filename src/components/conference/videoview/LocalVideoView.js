import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { Paper } from "@mui/material";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import MicOffIcon from "@mui/icons-material/MicOff";

const LocalVideoView = ({ stream }) => {
  const videoRef = useRef();
  const localVideoSettings = useSelector((state) => state.localVideoSettings.localVideoSettings);

  useEffect(() => {
    videoRef.current.srcObject = stream;
    // eslint-disable-next-line
  }, []);

  return (
    <Paper className="local-video">
      <>
        {!localVideoSettings.audio && (
          <div className="local-video__status-bar">
            <MicOffIcon />
          </div>
        )}
        <video className="local-video__video" ref={videoRef} autoPlay playsInline muted />
      </>
      {!localVideoSettings.video && (
        <div className="local-video__avatar">
          <AccountCircleIcon className="local-video__avatar-icon" />
        </div>
      )}
    </Paper>
  );
};

export default LocalVideoView;
