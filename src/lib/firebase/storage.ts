import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { storage } from "./config";

export async function uploadImagesToFirebase(images: any) {
  const uploadPromises = images.map(async (image: any, ind: number) => {
    const filePath = `${image.file.name}`;
    const blob = await fetch(image.file.url).then((response) => response.blob());
    const newImageRef = ref(storage, filePath);
    await uploadBytesResumable(newImageRef, blob);
    const url = await getDownloadURL(newImageRef);
    return { url, field: images[ind].field };
  });

  const response = await Promise.all(uploadPromises);

  return response;
}

export const uploadAvatarImages = async (image: ArrayBuffer, name: string) => {
  const filePath = `avatars/${name}`;
  const newImageRef = ref(storage, filePath);
  await uploadBytesResumable(newImageRef, image);
  const url = await getDownloadURL(newImageRef);
  return url;
};
