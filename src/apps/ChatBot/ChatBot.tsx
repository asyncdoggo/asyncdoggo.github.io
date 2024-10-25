import * as React from "jsx-dom"
import { progress, interruptEngine, streamingResponse, init, messages } from "./llmUtils"
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
                    init();
                }

                if (progress.progress < 1) {
                    // term.pause();
                    initialized = true;
                    asyncCaller(() => {
                        term.update(term.last_index(), `Loading model: ${progress.text}`)
                    });
                    
                }
                else {
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
                greetings: `Using model Llama-3.2-1B-Instruct-q4f16_1-MLC, if you are using this for the first time, it may take a while to load. \nTHIS MODEL WILL NOT LOAD IN INCOGNITO MODE.\nPress ENTER to load the model. Type 'q' to stop the model from generating.`,
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
                }
            });

        })
    })


    return (
        <div className="w-full h-full">
            <div id="terminal"></div>
        </div>
    )





}