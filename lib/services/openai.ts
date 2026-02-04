// Actually standard fetch works with uri in FormData in React Native.

// Ideally use expo-constants and extra, or .env file with babel-plugin-dotenv
const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export interface TranscriptionResult {
  text: string;
  language: string;
}

export const TranscriptionService = {
  /**
   * Transcribes an audio file using OpenAI Whisper API
   * Returns both the transcript and detected language
   */
  async transcribeAudio(uri: string): Promise<TranscriptionResult> {
    if (!OPENAI_API_KEY) {
      console.warn("OpenAI API Key is missing. Skipping transcription.");
      return { text: "Transcription disabled: No API Key", language: "en" };
    }

    try {
      const formData = new FormData();

      // @ts-ignore: React Native FormData expects uri, name, type
      formData.append("file", {
        uri: uri,
        name: "recording.m4a",
        type: "audio/mp4", // OpenAI prefers this for m4a/mp4 containers
      });
      console.log("Uploading file:", uri);
      formData.append("model", "whisper-1");
      formData.append("response_format", "verbose_json");

      const response = await fetch(
        "https://api.openai.com/v1/audio/transcriptions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            // Content-Type header is set automatically by FormData with boundary
          },
          body: formData,
        },
      );

      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `OpenAI API Error: ${error.error?.message || response.statusText}`,
        );
      }

      const data = await response.json();
      return {
        text: data.text,
        language: data.language || "en",
      };
    } catch (error) {
      console.error("Transcription failed:", error);
      throw error;
    }
  },

  /**
   * Generates a short title based on the transcript using GPT-4o-mini (fast & cheap)
   * Uses the detected language to ensure title is in the same language
   */
  async generateTitle(transcript: string, language: string): Promise<string> {
    if (!OPENAI_API_KEY || OPENAI_API_KEY === "YOUR_OPENAI_API_KEY_HERE") {
      return "New Voice Note";
    }

    if (!transcript || transcript.length < 5) return "New Voice Note";

    try {
      const response = await fetch(
        "https://api.openai.com/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `Generate a very short, concise title (max 5 words) for the following voice note transcript. The title MUST be in ${language}. Do not translate to any other language. Do not use quotes.`,
              },
              {
                role: "user",
                content: transcript,
              },
            ],
            max_tokens: 20,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to generate title");
      }

      const data = await response.json();
      const title = data.choices[0]?.message?.content?.trim();
      return title || "New Voice Note";
    } catch (error) {
      console.error("Title generation failed:", error);
      return "New Voice Note";
    }
  },
};
