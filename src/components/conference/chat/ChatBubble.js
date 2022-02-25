import { Avatar } from "@mui/material";
import { stringAvatar, stringToColor } from "../../../utils";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import filesize from "file-size";
import { createPDF, createFile } from "./createFiles";
// import { useTranslation } from "react-i18next";

const ChatBubble = ({ message }) => {
  // const { t } = useTranslation();
  // Remote message
  if (message.id === 1) {
    return (
      <div className="chat-panel__bubble-left">
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
        <div className="chat-panel__bubble-msg-block">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-msg-text">{message.message}</div>
        </div>
      </div>
    );
  }
  // Self message
  else if (message.id === 0) {
    return (
      <div className="chat-panel__bubble-right">
        <div className="chat-panel__bubble-msg-block chat-panel__bubble-msg-block-right">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-msg-text">{message.message}</div>
        </div>
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
      </div>
    );
  }
  // System message
  else if (message.id === 2) {
    return <div className="chat-panel__bubble-middle">{message.message}</div>;
  }
  // Remote PDF file
  else if (message.id === 4) {
    return (
      <div className="chat-panel__bubble-left">
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
        <div className="chat-panel__bubble-msg-block">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-file-wrapper">
            <div className="chat-panel__bubble-file-block">
              <PictureAsPdfIcon />
              <div>
                <div className="chat-panel__bubble-file-name">{message.medFileName}.pdf</div>
                {/* <div className="chat-panel__bubble-file-size">{filesize(message.medFileSize).human("jedec")}</div> */}
              </div>
            </div>
            <div className="chat-panel__bubble-file-overlay" onClick={() => createPDF(message.medDiag, message.medPacient, message.medDoctor)}>
              <DownloadIcon />
            </div>
          </div>
        </div>
      </div>
    );
  }
  // Self PDF file
  else if (message.id === 3) {
    return (
      <div className="chat-panel__bubble-right">
        <div className="chat-panel__bubble-msg-block chat-panel__bubble-msg-block-right">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-file-wrapper">
            <div className="chat-panel__bubble-file-block">
              <PictureAsPdfIcon />
              <div>
                <div className="chat-panel__bubble-file-name">{message.medFileName}.pdf</div>
                {/* <div className="chat-panel__bubble-file-size">{filesize(message.medFileSize).human("jedec")}</div> */}
              </div>
            </div>
            <div className="chat-panel__bubble-file-overlay" onClick={() => createPDF(message.medDiag, message.medPacient, message.medDoctor)}>
              <DownloadIcon />
            </div>
          </div>
        </div>
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
      </div>
    );
  }

  // Remote File
  else if (message.id === 6) {
    return (
      <div className="chat-panel__bubble-left">
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
        <div className="chat-panel__bubble-msg-block">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-file-wrapper">
            <div className="chat-panel__bubble-file-block">
              <ImageIcon />
              <div>
                <div className="chat-panel__bubble-file-name">{message.fileName}</div>
                {message.bytelength ? (
                  <div className="chat-panel__bubble-file-size">{filesize(+message.bytelength).human("jedec")}</div>
                ) : (
                  <div className="chat-panel__bubble-file-size">{filesize(message.fileData.byteLength).human("jedec")}</div>
                )}
              </div>
            </div>
            {message.fileURL ? (
              <a className="chat-panel__bubble-file-overlay" target="_blank" rel="noreferrer" href={`https://tmed.su${message.fileURL}`}>
                <DownloadIcon />
              </a>
            ) : (
              <div className="chat-panel__bubble-file-overlay" onClick={() => createFile(message.fileName, message.fileData, message.fileMime)}>
                <DownloadIcon />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  // Self File
  else if (message.id === 5) {
    return (
      <div className="chat-panel__bubble-right">
        <div className="chat-panel__bubble-msg-block chat-panel__bubble-msg-block-right">
          <div className="chat-panel__bubble-sender-name" style={{ color: stringToColor(message.sender) }}>
            {message.sender}
          </div>
          <div className="chat-panel__bubble-file-wrapper">
            <div className="chat-panel__bubble-file-block">
              <ImageIcon />
              <div>
                <div className="chat-panel__bubble-file-name">{message.fileName}</div>
                {message.bytelength ? (
                  <div className="chat-panel__bubble-file-size">{filesize(+message.bytelength).human("jedec")}</div>
                ) : (
                  <div className="chat-panel__bubble-file-size">{filesize(message.fileData.byteLength).human("jedec")}</div>
                )}
              </div>
            </div>
            {message.fileURL ? (
              <a
                className="chat-panel__bubble-file-overlay"
                target="_blank"
                rel="noreferrer"
                download={message.fileName}
                href={`https://tmed.su${message.fileURL}`}
              >
                <DownloadIcon />
              </a>
            ) : (
              <div className="chat-panel__bubble-file-overlay" onClick={() => createFile(message.fileName, message.fileData, message.fileMime)}>
                <DownloadIcon />
              </div>
            )}
          </div>
        </div>
        <Avatar className="chat-panel__bubble-avatar" {...stringAvatar(message.sender)} />
      </div>
    );
  }
};

export default ChatBubble;
