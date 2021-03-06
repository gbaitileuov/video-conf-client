import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  ru: {
    translation: {
      linkIsNotValid: "Ссылка не действительна",
      wait: "Подождите...",
      chooseAudioVideoParams: "Выберите параметры звука и видео для",
      forMeeting: "Собрания",
      turnOffCamera: "Отключить камеру",
      turnOnCamera: "Включить камеру",
      turnOffMic: "Отключить микрофон",
      turnOnMic: "Включить микрофон",
      settings: "Настройки",
      enterName: "Введите имя",
      join: "Присоединиться",
      waitingForOtherParticipants: "Ждём других участников...",
      doctorsNotes: "Записи врача",
      chat: "Чат",
      meetingParticipants: "Участники собрания",
      endCall: "Завершить звонок",
      fileDiagNazSend: 'Файл "Консультативное заключение" успешно отправлен в',
      doctor: "Врач",
      patient_: "Пациент",
      patient: "Пациент:",
      diagnosis: "Консультативное заключение",
      purpose: "Назначение",
      sendToChat: "Отправить в чат",
      referral: "Направление",
      noData: "Нет данных",
      loading: "Загрузка...",
      enterMessage: "Введите сообщение",
      chatAlert: "Допускаются только изображения, размер не должен превышать 5 МБ",
      me: "я",
      deviceSettings: "Настройки устройств",
      microphone: "Микрофон",
      camera: "Камера",
      session: "Сеанс",
      analyzes: "Анализы",
      nextLabel: "Туда",
      prevLabel: "Сюда",
      zoomInLabel: "Увеличить",
      zoomOutLabel: "Уменьшить",
      closeLabel: "Закрыть",
      endCallHeader: "Мы будем благодарны за отзыв о нашем сервисе. Ваши отзывы очень сильно помогают стать нам ещё лучше.",
      endCallTextareaPlaceholder: "Как вам этот сервис? Помог ли он вам?",
      endCallTextareaHelperText: "Рекомендуем оставлять отзывы не короче ста слов.",
      endCallRateTextArray: ["Выберите оценку", "Ужасно", "Плохо", "Нормально", "Хорошо", "Отлично"],
      endCallStartOver: "Начать заново",
      endCallSendBtn: "Отправить",
      endCallAlert: "Большое спасибо за оставленный отзыв!",
    },
  },
  kk: {
    translation: {
      linkIsNotValid: "Жарамсыз сілтеме",
      wait: "Күте тұрыңыз...",
      chooseAudioVideoParams: "Аудио және бейне параметрлерін таңдаңыз",
      forMeeting: "Жиналыс",
      turnOffCamera: "Камераны өшіру",
      turnOnCamera: "Камераны қосу",
      turnOffMic: "Микрофонды өшіру",
      turnOnMic: "Микрофонды қосу",
      settings: "Параметрлер",
      enterName: "Есіміңізді енгізіңіз",
      join: "Қосылу",
      waitingForOtherParticipants: "Басқа қатысушылардың қосылуын күтіңіз...",
      doctorsNotes: "Дәрігер жазбалары",
      chat: "Чат",
      meetingParticipants: "Қатысушылар",
      endCall: "Қоңырауды аяқтау",
      fileDiagNazSend: '"Консультативное заключение" файлы сәтті жіберілді',
      doctor: "Дәрігер",
      patient_: "Науқас",
      patient: "Науқас:",
      diagnosis: "Консультативное заключение",
      purpose: "Тағайындау",
      sendToChat: "Чатқа жіберу",
      referral: "Жолдама",
      noData: "Мәліметтер табылған жоқ",
      loading: "Жүктелуде...",
      enterMessage: "Хабарлама енгізіңіз",
      chatAlert: "Тек суреттерге ғана рұқсат етіледі, өлшемі 5 МБ-тан аспауы керек",
      me: "мен",
      deviceSettings: "Құрылғы параметрлері",
      microphone: "Микрофон",
      camera: "Камера",
      session: "Сеанс",
      analyzes: "Сынақтар",
      nextLabel: "Оңға",
      prevLabel: "Солға",
      zoomInLabel: "Үлкейту",
      zoomOutLabel: "Кішірейту",
      closeLabel: "Жабу",
      endCallHeader: "Қызметіміз туралы пікіріңізге риза боламыз. Сіздің пікіріңіз бізге одан да жақсырақ болуға көмектеседі.",
      endCallTextareaPlaceholder: "Сізге бұл қызмет ұнады ма? Cізге көмектесті ме?",
      endCallTextareaHelperText: "Жазған пікіріңіз пайдалы болуы үшін, ондағы сөздердің саны 100-ден кем болмағаны абзал.",
      endCallRateTextArray: ["Бағалаңыз", "Мүлдем ұнамады", "Ұнамады", "Қалыпты", "Ұнады", "Қатты ұнады"],
      endCallStartOver: "Пікір жібермей, басынан бастау",
      endCallSendBtn: "Жіберу",
      endCallAlert: "Пікіріңізге көп рахмет!",
    },
  },
  en: {
    translation: {
      linkIsNotValid: "Link is not valid",
      wait: "Wait...",
      chooseAudioVideoParams: "Select audio and video options for",
      forMeeting: "Meeting",
      turnOffCamera: "Turn off camera",
      turnOnCamera: "Turn on camera",
      turnOffMic: "Turn off microfon",
      turnOnMic: "Turn on microfon",
      settings: "Settings",
      enterName: "Enter your name",
      join: "Join",
      waitingForOtherParticipants: "Waiting for other participants...",
      doctorsNotes: "Doctor's notes",
      chat: "Chat",
      meetingParticipants: "Meeting participants",
      endCall: "End Call",
      fileDiagNazSend: 'The file "Консультативное заключение" has been successfully sent to',
      doctor: "Doctor",
      patient_: "Patient",
      patient: "Patient:",
      diagnosis: "Консультативное заключение",
      purpose: "Purpose",
      sendToChat: "Send to chat",
      referral: "Referral",
      noData: "No Data",
      loading: "Loading...",
      enterMessage: "Enter your message",
      chatAlert: "Only images are allowed, size must not exceed 5MB",
      me: "me",
      deviceSettings: "Device settings",
      microphone: "Microphone",
      camera: "Camera",
      session: "Session",
      analyzes: "Analyzes",
      nextLabel: "Next",
      prevLabel: "Previous",
      zoomInLabel: "Zoom In",
      zoomOutLabel: "Zoom Out",
      closeLabel: "Close",
      endCallHeader: "We would be grateful for your feedback on our service. Your feedback is very helpful in helping us become even better.",
      endCallTextareaPlaceholder: "How do you like this service? Did it help you?",
      endCallTextareaHelperText: "Most helpful reviews have 100 words or more",
      endCallRateTextArray: ["Select a rating", "Hated it", "Didn't like it", "Just OK", "Liked it", "Loved it"],
      endCallStartOver: "Don't send feedback and start over",
      endCallSendBtn: "Submit",
      endCallAlert: "Thank you very much for your feedback!",
    },
  },
};

i18next
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    resources,
    supportedLngs: ["ru", "kk", "en"],
    fallbackLng: "ru",
    interpolation: {
      escapeValue: false,
    },
  });
export default i18next;
