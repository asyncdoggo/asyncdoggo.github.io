import { MLCEngine } from "@mlc-ai/web-llm";


export let progress = {progress: 0, text: "", timeElapsed: 0}

const initProgressCallback = (initProgress: any) => {
    progress = initProgress;
    console.log(progress);
    
  }

const engine = new MLCEngine(
{ initProgressCallback: initProgressCallback }, // engineConfig
);

engine.getInitProgressCallback

export const availableModels = [
  {
    name: "SmolLM-360M-Instruct-q0f16-MLC",
    notes: "tiny, fast, and good for testing, incoherent responses.",
  },
  {
    name: "Qwen2.5-0.5B-Instruct-q4f16_1-MLC",
    notes: "kinda larger, slower, slightly smart.",
  },
  {
    name: "gemma-2b-it-q4f16_1-MLC",
    notes: "kinda larger. This guy talks using emojis lmao.",
  },
  {
    name: "Llama-3.2-1B-Instruct-q4f16_1-MLC",
    notes: "small but smart.",
  },
  {
    name: "TinyLlama-1.1B-Chat-v0.4-q4f16_1-MLC",
    notes: "larger, slower, smart enough.",
  }
]

export async function init(index: number) {    
    progress = {progress: 0, text: "", timeElapsed: 0}
    engine.resetChat();
    engine.unload();

    try {
      const selectedModel = availableModels[index];      
      if (!selectedModel) {
        return false;
      }
      engine.reload(selectedModel.name);
      return true;   
    }
    catch (e) {
      console.log(e);
      return false;
    }
}

export async function completion(message: any){    
    const reply = await engine.chat.completions.create({
        messages: message,
    });
    return reply.choices[0].message.content;
}

export const messages = [
    { 
        role: "system", 
        content: "You are a helpful AI assistant." 
    },
]

export const interruptEngine = () => {engine.interruptGenerate()}
export const resetChat = () => {
    messages.length = 0;
    messages.push({ role: "system", content: "You are a helpful AI assistant." });
    engine.resetChat();
}
export const unload = async () => {await engine.unload()}

export const streamingResponse = async function (messages: any) {
    const chunks = await engine.chat.completions.create({
        messages,
        temperature: 1,
        stream: true, // <-- Enable streaming
        stream_options: { include_usage: true },
      });
      return chunks;
}

