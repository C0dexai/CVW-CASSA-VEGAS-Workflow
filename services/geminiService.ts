import { GoogleGenAI, Content } from "@google/genai";
import { type ChatMessage } from "../types";

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const streamChatResponse = async (
    history: ChatMessage[],
    newMessage: string,
    systemInstruction: string,
    onStream: (chunk: string) => void
): Promise<void> => {
    if (!newMessage.trim()){
        throw new Error("Message cannot be empty.");
    }
    
    const apiHistory: Content[] = history
        .filter(msg => msg.role === 'user' || msg.role === 'model')
        .map(msg => ({ role: msg.role as 'user' | 'model', parts: [{ text: msg.content }]}));
    
    const contents: Content[] = [...apiHistory, { role: 'user', parts: [{ text: newMessage }] }];

    try {
        const responseStream = await ai.models.generateContentStream({
            model: 'gemini-2.5-flash',
            contents: contents,
            config: {
                systemInstruction: systemInstruction,
            },
        });

        for await (const chunk of responseStream) {
            onStream(chunk.text);
        }
    } catch (error) {
        console.error("Error streaming chat response:", error);
        throw new Error("The AI is currently unavailable. Please try again later.");
    }
};