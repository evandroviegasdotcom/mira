export async function uploadCover(cover: File | string) {
  if (typeof cover === "string") return cover;
  const formData = new FormData();
  formData.append("file", cover);
  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const data = await response.json();
  return data.data.url
}
