export default class Message {
  constructor(data) {
    this.id = data.id;
    this.sender = data.sender || undefined;
    this.message = data.message || undefined;
    this.medFileName = data.medFileName || undefined;
    this.medFileSize = data.medFileSize || undefined;
    this.medDiag = data.medDiag || undefined;
    this.muted = data.muted || undefined;
    this.fileName = data.fileName || undefined;
    this.fileExt = data.fileExt || undefined;
    this.fileMime = data.fileMime || undefined;
    this.fileData = data.fileData || undefined;
    this.fileURL = data.fileURL || undefined;
    this.bytelength = data.bytelength || undefined;
  }
}
