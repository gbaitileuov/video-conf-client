import { Avatar, Grid } from "@mui/material";
import React, { useEffect, useRef } from "react";
import { stringAvatar } from "../../../utils";

const RemoteVideoView = ({ peer, count, peersVideoAudio }) => {
  const videoRef = useRef();

  useEffect(() => {
    peer.peer.on("stream", (stream) => {
      videoRef.current.srcObject = stream;
    });
  }, [peer.peer]);

  return (
    <>
      <Grid item xs={12} sm={count === 1 ? 12 : 6} className="video-area__avatarbox" style={{ position: "relative" }}>
        {/* <div style={{ position: "absolute", left: "10px", top: "10px" }}>{peer.userName}</div> */}
        {peersVideoAudio.hasOwnProperty(peer.peerID) && !peersVideoAudio[peer.peerID].video && (
          <Avatar className="video-area__avatar" {...stringAvatar(peer.userName)} />
        )}
        <video
          className="video-area__video"
          ref={videoRef}
          autoPlay
          playsInline
          style={{ display: peersVideoAudio.hasOwnProperty(peer.peerID) && !peersVideoAudio[peer.peerID].video ? "none" : "block" }}
        />
      </Grid>
    </>
  );
};

export default RemoteVideoView;
