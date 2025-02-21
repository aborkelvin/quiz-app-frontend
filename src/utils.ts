
export const baseUrl = `https://quiz-app-pg8t.onrender.com`
//export const baseUrl = `http://localhost:6060`




// Function to Convert Base64 to File
export const base64ToFile = (base64: string, filename: string) => {
    const arr = base64.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "application/octet-stream";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
};



// Helper function to convert File to Base64
export const fileToBase64 = (file: File): Promise<string> => {
    //console.log("running")
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };