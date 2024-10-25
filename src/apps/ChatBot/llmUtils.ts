import { MLCEngine } from "@mlc-ai/web-llm";


export let progress = {progress: 0, text: "", timeElapsed: 0}

const initProgressCallback = (initProgress: any) => {
    progress = initProgress;
  }

const engine = new MLCEngine(
{ initProgressCallback: initProgressCallback }, // engineConfig
);
 


export async function init(){
    // Callback function to update model loading progress
    console.log("Creating engine");
    
    const selectedModel = "SmolLM-135M-Instruct-q4f32_1-MLC";
    // const selectedModel = "Llama-3.2-1B-Instruct-q4f16_1-MLC";
    engine.reload(selectedModel);   
    console.log("Engine created", engine);
}

export async function completion(message: any){
    console.log("Sending message to engine", message);
    
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


export const streamingResponse = async function (messages: any) {
    const chunks = await engine.chat.completions.create({
        messages,
        temperature: 1,
        stream: true, // <-- Enable streaming
        stream_options: { include_usage: true },
      });
      return chunks;
}