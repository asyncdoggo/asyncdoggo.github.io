import * as React from "jsx-dom"
import { progress, interruptEngine, streamingResponse, init, messages, availableModels } from "./llmUtils"
import { waitForElement } from "../../globals";

export default function ChatBot() {
 
    const asyncCaller = async (callback: any) => {
        while (progress.progress < 1) {
            await new Promise((resolve) => setTimeout(resolve, 500));
            callback();
        }
    }


    let generating = false;
    let initialized = false;

    let prompt = "USER: ";
    waitForElement('#terminal', () => {
        jQuery(function ($: any) {
            $('#terminal').terminal(async function (command: string, term: any) {
                if(!initialized){
                    const index = parseInt(command);
                    const success = await init(index - 1);
                    if (!success) {
                        term.error("You did not enter a valid model number. I hope you know what a number is.");
                        term.resume();
                        return;
                    }
                }

                if (progress.progress < 1) {
                    // term.pause();
                    initialized = true;
                    asyncCaller(() => {
                        term.update(term.last_index(), `Loading model: ${progress.text}`)
                        if (progress.progress === 1) {
                            term.clear();
                            term.echo(`Model loaded successfully!\nUse "q" to interrupt generation, and "clear" to reset the chat.`);
                        }
                    });
                    
                }

                else if (command === "clear") {
                    term.clear();
                    messages.length = 0;
                    messages.push({ role: "system", content: "You are a helpful AI assistant." });
                    term.echo("Chat cleared.");
                    term.resume();
                }
                else if(progress.progress === 1){
                    try {
                        if (command.trim() === "") {
                            term.resume();
                            return;
                        }
                        messages.push({ role: "user", content: command });
                        const chunks = await streamingResponse(messages);
                        term.echo(`USER: ${command}`);
                        term.update(term.last_index(), "");
                        term.resume();
                                                
                        let reply = "";
                        generating = true;
                        for await (const chunk of chunks) {
                            reply += chunk.choices[0]?.delta.content || "";
                            if (chunk.usage) {
                            console.log(chunk.usage); // only last chunk has usage
                            }
                            term.update(term.last_index(), reply);
                        }
                        generating = false;
                        
                        messages.push({ role: "assistant", content: reply || "" });

                    } catch (e) {
                        term.error(e);
                    } finally {
                        term.resume();
                    }
                }
            }, {
                greetings: `Welcome to the Chat BOT!
Here are the list of available models to load:
`
+
availableModels.map((model, index) => {
    return `${index + 1}. ${model.name} - ${model.notes}`
}).join("\n")
+
`
Type the number of the model you want to load and press enter.
`,
                name: 'Chat BOT',
                prompt: prompt,
                height: 400,
                width: '100%',
                keypress: function (e: any, term: any) {
                    if (generating) {
                        if (e.key === "q") {
                            interruptEngine();
                            term.resume();
                            generating = false;
                        }
                        return false;
                    }
                },
                clear: false
            });

        })
    })


    return (
        <div className="w-full h-full">
            <div id="terminal"></div>
        </div>
    )





}