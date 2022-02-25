import { useEffect, useState } from "react";
import { Avatar, Button, IconButton, Link, Paper, TextField, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import LibraryBooksOutlinedIcon from "@mui/icons-material/LibraryBooksOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ImageIcon from "@mui/icons-material/Image";
import { Offset } from "../NavBar";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import { a11yProps, getDateTime, TabPanel } from "../../../utils";
import { Box } from "@mui/system";
import Lightbox from "react-image-lightbox";
import "react-image-lightbox/style.css";
import { useTranslation } from "react-i18next";

const drawerWidth = 600;

// const dates = [
//   {
//     date: "20 Октября, 2021",
//     analyzes: [
//       {
//         url: "/images/a1.jpg",
//         title: "Анализ-1.jpg",
//         size: "2.6 MB",
//         ext: "JPG",
//       },
//       {
//         url: "/images/a2.jpg",
//         title: "Анализ-2.jpg",
//         size: "1.2 MB",
//         ext: "JPG",
//       },
//       {
//         url: "/images/a1.jpg",
//         title: "Анализ-3.jpg",
//         size: "2.6 MB",
//         ext: "JPG",
//       },
//     ],
//   },
//   {
//     date: "1 Сентября, 2020",
//     analyzes: [
//       {
//         url: "/images/a2.jpg",
//         title: "Анализ-2.jpg",
//         size: "1.2 MB",
//         ext: "JPG",
//       },
//     ],
//   },
// ];

const Med = ({ onClose, diag, naz, setDiag, setNaz, sendDiagNazToChat, roomId, peersRef }) => {
  const [tab, setTab] = useState(0);
  const [naprOpen, setNaprOpen] = useState(false);
  const [analyzOpen, setAnalyzOpen] = useState({
    dateIndex: 0,
    photoIndex: 0,
    isOpen: false,
  });
  const [naprUrl, setNaprUrl] = useState();
  const [datesUrl, setDatesUrl] = useState([]);
  const [naprAnalyzLoaded, setNaprAnalyzLoaded] = useState(false);
  const { t } = useTranslation();

  let dateIndex = 0;
  let analyzes = [];
  let photoIndex = 0;
  if (analyzOpen.isOpen && datesUrl && datesUrl.length > 0) {
    dateIndex = analyzOpen.dateIndex;
    photoIndex = analyzOpen.photoIndex;
    analyzes = datesUrl[analyzOpen.dateIndex].analyzes;
  }

  const handleTabChange = (_, newValue) => {
    setTab(newValue);
  };

  useEffect(() => {
    setDatesUrl([]);
    const beUrl = "https://tmed.su/api/client-files/" + roomId + "/";
    fetch(beUrl, {
      method: "GET",
      mode: "cors",
      cache: "no-cache",
    })
      .then((response) => response.json())
      .then((data) => {
        // console.log("data:", data);
        if (!data && !data[0]) {
          console.error("create-chat sendFile error");
        } else {
          setNaprAnalyzLoaded(true);
          if (data[0].image) {
            setNaprUrl("https://tmed.su" + data[0].image);
          }
          if (data[0].analyze) {
            setDatesUrl((prev) => [
              ...prev,
              {
                date: getDateTime(),
                analyzes: [{ url: "https://tmed.su" + data[0].analyze, title: data[0].analyze.replace(/^.*[\\/]/, "") }],
              },
            ]);
          }
        }
      });
    // eslint-disable-next-line
  }, []);

  return (
    <div className="drawer drawer-med" style={{ width: `${drawerWidth}px` }}>
      <div className="drawer__header">
        <Offset className="drawer__navbar drawer-med__navbar" style={{ width: `${drawerWidth}px` }}>
          <div className="drawer__navbar-content">
            <IconButton className="drawer__navbar-phone-back" onClick={onClose}>
              <ArrowBackIosNewIcon />
            </IconButton>
            <LocalHospitalOutlinedIcon color="primary" />
            <Typography variant="h6">{t("doctorsNotes")}</Typography>
          </div>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Offset>
        <Offset />
      </div>
      <Paper className="drawer__body">
        <TabPanel className="tab-panel" value={tab} index={0}>
          <div className="session">
            {peersRef.current[0] && (
              <div className="session__header">
                <div className="session__title">
                  <Typography>{t("patient")}</Typography>
                  <Typography variant="h5">{peersRef.current[0].userName}</Typography>
                </div>
              </div>
            )}
            <Box className="session__content" sx={{ borderTop: 1, borderBottom: 1, borderColor: "divider" }}>
              <TextField
                className="session__textarea"
                label={t("diagnosis")}
                fullWidth
                multiline
                minRows={4}
                maxRows={18}
                onChange={(e) => setDiag(e.target.value)}
                value={diag}
                // value="Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna
                // aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
                // dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident,
                // sunt in culpa qui officia deserunt mollit anim id est laborum."
              />
              <TextField
                className="session__textarea"
                label={t("purpose")}
                fullWidth
                multiline
                minRows={4}
                maxRows={18}
                onChange={(e) => setNaz(e.target.value)}
                value={naz}
                // value="Baitileuov Gani"
              />
            </Box>
            <div className="session__actions">
              <Button size="small" variant="contained" onClick={sendDiagNazToChat}>
                {t("sendToChat")}
              </Button>
            </div>
          </div>
        </TabPanel>
        <TabPanel className="tab-panel" value={tab} index={1}>
          {naprAnalyzLoaded ? (
            naprUrl ? (
              <div className="referral-image-box">
                <Link
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setNaprOpen(true);
                  }}
                >
                  <img className="referral-image" src={naprUrl} alt={t("referral")} />
                </Link>
                {naprOpen && (
                  <Lightbox
                    imageTitle={t("referral")}
                    mainSrc={naprUrl}
                    onCloseRequest={() => setNaprOpen(false)}
                    reactModalStyle={{ overlay: { zIndex: 1300 } }}
                    nextLabel={t("nextLabel")}
                    prevLabel={t("prevLabel")}
                    zoomInLabel={t("zoomInLabel")}
                    zoomOutLabel={t("zoomOutLabel")}
                    closeLabel={t("closeLabel")}
                  />
                )}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{t("noData")}</div>
            )
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{t("loading")}</div>
          )}
        </TabPanel>
        <TabPanel className="tab-panel" value={tab} index={2}>
          {naprAnalyzLoaded ? (
            datesUrl.length > 0 ? (
              <div className="analyzes">
                {datesUrl.map((d, dIndex) => (
                  <div className="analyzes-perdate" key={dIndex}>
                    <div className="analyzes-perdate__date">{d.date}</div>
                    <div className="analyzes-perdate__list">
                      {d.analyzes.map((a, aIndex) => (
                        <div className="analyzes-perdate__item" key={aIndex}>
                          <Link
                            href="#"
                            onClick={(e) => {
                              e.preventDefault();
                              setAnalyzOpen({
                                dateIndex: dIndex,
                                photoIndex: aIndex,
                                isOpen: true,
                              });
                            }}
                          >
                            <Avatar size="small">
                              <ImageIcon color="action" />
                            </Avatar>
                          </Link>
                          <div className="analyzes-perdate__list-body">
                            <Link
                              href="#"
                              onClick={(e) => {
                                e.preventDefault();
                                setAnalyzOpen({
                                  dateIndex: dIndex,
                                  photoIndex: aIndex,
                                  isOpen: true,
                                });
                              }}
                              className="analyzes-perdate__list-title"
                            >
                              {a.title}
                            </Link>
                            {a.size && a.ext && <div className="analyzes-perdate__list-desc">{`${a.size} ${a.ext}`}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {analyzOpen.isOpen && (
                  <Lightbox
                    imageTitle={analyzes[photoIndex].title}
                    mainSrc={analyzes[photoIndex].url}
                    nextSrc={analyzes[(photoIndex + 1) % analyzes.length].url}
                    prevSrc={analyzes[(photoIndex + analyzes.length - 1) % analyzes.length].url}
                    onMovePrevRequest={() =>
                      setAnalyzOpen({
                        photoIndex: (photoIndex + analyzes.length - 1) % analyzes.length,
                        isOpen: true,
                        dateIndex,
                      })
                    }
                    onMoveNextRequest={() =>
                      setAnalyzOpen({
                        photoIndex: (photoIndex + 1) % analyzes.length,
                        isOpen: true,
                        dateIndex,
                      })
                    }
                    onCloseRequest={() =>
                      setAnalyzOpen({
                        isOpen: false,
                      })
                    }
                    reactModalStyle={{ overlay: { zIndex: 1300 } }}
                    nextLabel={t("nextLabel")}
                    prevLabel={t("prevLabel")}
                    zoomInLabel={t("zoomInLabel")}
                    zoomOutLabel={t("zoomOutLabel")}
                    closeLabel={t("closeLabel")}
                  />
                )}
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{t("noData")}</div>
            )
          ) : (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>{t("loading")}</div>
          )}
        </TabPanel>
        <Box className="drawer__actions" sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tab} onChange={handleTabChange} variant="fullWidth">
            <Tab icon={<NoteAltOutlinedIcon />} label={t("session")} {...a11yProps(0)} size="small" />
            <Tab icon={<DescriptionOutlinedIcon />} label={t("referral")} {...a11yProps(1)} />
            <Tab icon={<LibraryBooksOutlinedIcon />} label={t("analyzes")} {...a11yProps(2)} />
          </Tabs>
        </Box>
      </Paper>
    </div>
  );
};

export default Med;
