import fs from "fs";
import fetch from "node-fetch";

const voiceId = "PASTE_REAL_VOICE_ID_HERE";

const response = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`,
  {
    method: "POST",
    headers: {
      "xi-api-key": process.env.ELEVENLABS_API_KEY,
      "Content-Type": "application/json",
      "Accept": "audio/mpeg"
    },
    body: JSON.stringify({
      text: "This is a test.",
      model_id: "eleven_multilingual_v2"
    })
  }
);

if (!response.ok) {
  console.error(await response.text());
  process.exit(1);
}

const audioBuffer = Buffer.from(await response.arrayBuffer());
fs.writeFileSync("test.mp3", audioBuffer);

console.log("✅ test.mp3 created successfully");