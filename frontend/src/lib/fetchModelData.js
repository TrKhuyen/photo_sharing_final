async function fetchModel(url, options = {}) {
  try {
    const response = await fetch(`http://localhost:8081/api${url}`, {
      credentials: 'include', // Include cookies for session-based auth
      ...options, // merge các tuỳ chọn như method, headers, body...
    });

    if (response.status === 401) {
      window.dispatchEvent(new CustomEvent('unauthorized'));
      return null;
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("fetchModel error:", error);
    return null;
  }
}

// export async function deletePhoto(photoId, token) {
//   const res = await fetch(`/api/photosOfUser/${photoId}`, {
//     method: "DELETE",
//     headers: {
//       "Content-Type": "application/json",
//       Authorization: `Bearer ${token}`
//     },
//   });
//   if (!res.ok) throw new Error("Failed to delete photo");
//   return res.json();
// }


export default fetchModel;
