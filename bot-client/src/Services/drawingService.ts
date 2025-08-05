import { Command } from "../types";

const BASE_URL = "https://localhost:7214/api/Drawing";

export async function fetchUserDrawings(userId: string) {
  try {
    const res = await fetch(`${BASE_URL}/user/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch drawings");
    const data = await res.json();
    return data;
  } catch (err) {
    throw new Error("שגיאה בטעינת הציורים: " + err);
  }
}

export const interpretPrompt = async (prompt: string, existingCommands: Command[][]) => {
  const response = await fetch(`https://localhost:7214/api/DrawingPrompt/interpret-prompt`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, existingCommands }),
  });

  if (!response.ok) {
    throw new Error("שגיאה בקריאת הפרומפט");
  }

  return await response.json();
};

export const saveImage = async (imageDto: {
  name: string;
  userId: number;
  commands: Command[];
}) => {
  const response = await fetch(`${BASE_URL}/image`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(imageDto),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || response.statusText);
  }

  return await response.json();
};

export const getImageById = async (id: number) => {
  const res = await fetch(`${BASE_URL}/image/${id}`);
  if (!res.ok) {
    throw new Error("שגיאה בטעינת הציור");
  }

  return await res.json();
};
