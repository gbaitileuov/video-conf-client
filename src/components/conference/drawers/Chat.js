import { Alert, IconButton, InputAdornment, OutlinedInput, Paper, Snackbar, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { Offset } from "../NavBar";
import SendIcon from "@mui/icons-material/Send";
import { useContext, useEffect, useRef, useState, useCallback } from "react";
import ChatBubble from "../chat/ChatBubble";
import socket from "../socket";
// import ss from "socket.io-stream";
import { authContext } from "../";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { useDropzone } from "react-dropzone";
import mimeDb from "mime-db";
import { useTranslation } from "react-i18next";

const drawerWidth = 320;

const Chat = ({ onClose, roomId, msg, sendingMsg, setSendingMsg }) => {
  const auth = useContext(authContext);
  const chat = useRef();
  const dropzoneRef = useRef();
  const [alertOpen, setAlertOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const { t } = useTranslation();

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    if (sendingMsg) {
      return;
    }
    dropzoneRef.current.style = "display: none";

    if (fileRejections.length > 0) {
      setAlertOpen(true);
    }

    acceptedFiles.forEach((file) => {
      const fileName = file.name;
      const fileMime = file.type;
      const mime = mimeDb[fileMime];
      const fileExt = mime.extensions[0];
      const reader = new FileReader();

      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = () => {
        const binaryStr = reader.result;

        const data = {
          uid: auth.user.id,
          name: auth.user.name,
          fileName: fileName,
          fileExt: fileExt,
          fileMime: fileMime,
          fileData: binaryStr,
        };

        setSendingMsg(true);

        socket.emit("BE-send-message", { roomId, data });

        const formData = new FormData();
        formData.append("files", file);
        formData.append("link", roomId);
        formData.append("username", auth.user.name);
        formData.append("filename", fileName);
        formData.append("fileext", fileExt);
        formData.append("filemime", fileMime);
        formData.append("bytelength", binaryStr.byteLength);

        const beUrl = "https://tmedback.herokuapp.com/api/create-chat/";
        fetch(beUrl, {
          method: "POST",
          mode: "cors",
          cache: "no-cache",
          body: formData,
        })
          .then((response) => response.json())
          .then((data) => {
            // console.log("data:", data);
            if (!data || !data.id) {
              console.error("create-chat sendFile error");
            }
          })
          .catch((e) => {
            console.error(e);
          });
      };
      reader.readAsArrayBuffer(file);
    });
    // eslint-disable-next-line
  }, []);
  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    // accept: "image/jpeg, image/png",
    multiple: false,
    minSize: 50000,
    maxSize: 5242880000, //5242880
  });

  const renderGroup = (messages, index, id) => {
    let group = [];

    for (let i = index; messages[i] ? messages[i].id === id : false; i--) {
      group.push(messages[i]);
    }

    var message_nodes = group.reverse().map((curr) => {
      return <ChatBubble key={Math.random().toString(36)} message={curr} />;
    });
    return (
      <div key={Math.random().toString(36)} className="chat-panel__wrapper">
        {message_nodes}
      </div>
    );
  };

  const renderMessages = (messages) => {
    // eslint-disable-next-line array-callback-return
    var message_nodes = messages.map((curr, index) => {
      if ((messages[index + 1] ? false : true) || messages[index + 1].id !== curr.id) {
        return renderGroup(messages, index, curr.id);
      }
      // return message_nodes;
    });
    return message_nodes;
  };

  // Scroll to Bottom of Message List
  useEffect(() => {
    scrollToBottom();
  }, [msg.length]);

  const onDragEnter = useCallback(() => {
    if (!sendingMsg) {
      dropzoneRef.current.style = "display: block";
    }
  }, [sendingMsg]);

  const onDragLeave = useCallback(() => {
    dropzoneRef.current.style = "display: none";
  }, []);

  const scrollToBottom = () => {
    chat.current.scrollIntoView({ behavior: "smooth" });
  };

  const onInputChange = (event) => {
    setInputMessage(event.target.value);
  };

  const onBtnSendHandler = () => {
    sendMessage();
  };

  const onInputKeyUp = (event) => {
    if (event.ctrlKey && event.keyCode === 13) {
      // CTRL + ENTER listener
      sendMessage();
    }
  };

  const handleAlertClose = (_, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setAlertOpen(false);
  };

  const sendMessage = () => {
    let msg = inputMessage;

    if (msg.trim().length === 0 || sendingMsg) {
      return;
    }
    if (msg.replace(/(^\s*)|(\s*$)/g, "").length === 0) {
      return;
    }

    const data = {
      uid: auth.user.id,
      name: auth.user.name,
      text: msg,
    };

    socket.emit("BE-send-message", { roomId, data });
    setInputMessage("");

    const beUrl = "https://tmedback.herokuapp.com/api/create-chat/";
    fetch(beUrl, {
      method: "POST",
      mode: "cors",
      cache: "no-cache",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ link: roomId, username: auth.user.name, message: msg }),
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data:", data);
        if (!data || !data.id) {
          console.error("create-chat sendMessage error");
        }
      });
  };

  return (
    <>
      <div className="drawer" style={{ width: `${drawerWidth}px` }}>
        <div className="drawer__header">
          <Offset className="drawer__navbar" style={{ width: `${drawerWidth}px` }}>
            <div className="drawer__navbar-content">
              <IconButton className="drawer__navbar-phone-back" onClick={onClose}>
                <ArrowBackIosNewIcon />
              </IconButton>
              <ChatOutlinedIcon />
              <Typography variant="h6">{t("chat")}</Typography>
            </div>
            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Offset>
          <Offset />
        </div>
        <Paper className="drawer__body">
          <div id="chat-panel" className="chat-panel" onDragEnter={onDragEnter}>
            <div className="chat-panel__history" ref={chat}>
              {renderMessages(msg)}
            </div>
            <div className="chat-panel__input">
              <OutlinedInput
                placeholder={t("enterMessage")}
                size="small"
                fullWidth
                multiline
                maxRows={18}
                onKeyUp={onInputKeyUp}
                onChange={onInputChange}
                value={inputMessage}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton onClick={open} edge="end" disabled={sendingMsg}>
                      <AttachFileIcon />
                    </IconButton>
                  </InputAdornment>
                }
                disabled={sendingMsg}
              />
              <IconButton sx={{ ml: "4px" }} onClick={onBtnSendHandler} disabled={sendingMsg}>
                <SendIcon fontSize="small" />
              </IconButton>
            </div>
            <div {...getRootProps({ className: "dropzone" })} ref={dropzoneRef} onDragLeave={onDragLeave}>
              <input {...getInputProps()} />
            </div>
          </div>
        </Paper>
      </div>
      <Snackbar
        open={alertOpen}
        autoHideDuration={6000}
        onClose={handleAlertClose}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        action={
          <IconButton size="small" color="inherit" onClick={handleAlertClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        <Alert onClose={handleAlertClose} severity="error">
          {t("chatAlert")}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Chat;
