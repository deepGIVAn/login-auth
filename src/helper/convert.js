// image into base64 format .. to store the image in mongodb Database
export default function convertToBase64(file) {
  return new Promise((resolve, reject) => {
    console.log("work");
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
}
