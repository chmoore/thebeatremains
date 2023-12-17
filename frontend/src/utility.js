export function generateKey() {
  const timestamp = Date.now();
  const randomPart = Math.floor(Math.random() * 1000);
  return `${timestamp}_${randomPart}`;
}

export function downloadFile(blob, filename) {
  const url = window.URL.createObjectURL(blob);
  const anchorElement = document.createElement('a');
  anchorElement.href = url;
  anchorElement.download = filename;
  anchorElement.click();
}

export function readFileFromHeaders(response) {
  const contentDisposition = response.headers.get('content-disposition');
  const [, filenameIndex] = contentDisposition.split(' ');
  const [, filename] = filenameIndex.split('=');

  return filename;
}
