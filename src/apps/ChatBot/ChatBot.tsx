import * as React from "jsx-dom"
import { progress, interruptEngine, streamingResponse, init, messages, availableModels, resetChat, unload } from "./llmUtils"
import { waitForElement } from "../../globals";

export default function ChatBot() {
 
    const asyncCaller = async (callback: any) => {
        callback();
    }

    // cleanup if previous model was loaded
    unload();

    let generating = false;
    let initialized = false;
    let selectedIndex = 0;

    let resize_observer: ResizeObserver;

    let prompt = "USER: ";

    waitForElement('#terminal_chatbot', () => {
        jQuery(function ($: any) {
            const terminal = $('#terminal_chatbot').terminal(async function (command: string, term: any) {
                if(!initialized){
                    const index = parseInt(command);
                    selectedIndex = index;
                    const success = await init(index - 1);
                    if (!success) {
                        term.error("You did not enter a valid model number. I hope you know what a number is.");
                        term.resume();
                        return;
                    }
                }

                if (progress.progress < 1) {
                    initialized = true;
                    asyncCaller(async () => {
                        while (progress.progress < 1 || !progress.text.startsWith("Finish")) {
                            await new Promise((resolve) => setTimeout(resolve, 500));
                            term.pause()
                            term.update(term.last_index(), `Loading model: ${progress.text}`);
                            if (progress.progress === -1) {
                                term.clear();
                                term.error(progress.text);
                                term.error("Model did not load because you might be in incognito mode. Or there isn't enough memory to load the model.");
                                return;
                            }
                        }
                        term.clear();
                        term.echo(`Model loaded successfully!\nSelected Model: ${availableModels[selectedIndex - 1].name}\nUse "q" to interrupt generation, and "clear" to reset the chat.`);
                        term.resume()
                    });
                }

                if (command === "unload") {
                    term.clear();
                    progress.progress = 0;
                    progress.text = "";
                    progress.timeElapsed = 0;
                    interruptEngine();
                    await unload();
                    resetChat();
                    term.echo(`Welcome to the Chat BOT!\nHere are the list of available models to load:\n` + availableModels.map((model, index) => {return `${index + 1}. ${model.name} - ${model.notes}`}).join("\n") + `\nType the number of the model you want to load and press enter.`);
                    term.resume();
                    initialized = false
                }

                else if (command === "clear") {
                    term.clear();
                    resetChat();
                    term.echo(`Chat cleared.\nSelected model ${availableModels[selectedIndex - 1].name}\nUse "unload" to load a new model.\n"q" to interrupt generation.\n"clear" to reset the chat.`);
                    term.resume();
                }
                else if(progress.progress === 1 && progress.text.startsWith("Finish")){
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
                greetings: `Welcome to the Chat BOT!\nHere are the list of available models to load:\n` + availableModels.map((model, index) => {return `${index + 1}. ${model.name} - ${model.notes}`}).join("\n") + `\nNOTE: WILL NOT LOAD IN INCOGNITO MODE\nType the number of the model you want to load and press enter.`,
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

            console.log(terminal);
            

            resize_observer = new ResizeObserver((entries) => {
                for (let entry of entries) {
                    terminal.resize(entry.contentRect.width, entry.contentRect.height-50);
                }
            });

            resize_observer.observe(document.getElementById('ChatBot')!);
            document.getElementById('ChatBot')!.style.overflow = "hidden";            
        })
    })

    waitForElement('#ChatBot_inner', () => {
        (document.getElementById('ChatBot_inner')! as any).onCleanUp = async () => {
            await interruptEngine();
            await unload();
            resize_observer.disconnect();
            
        }
    })


    return (
        <div className="w-full h-full" id="ChatBot_inner">
            <div id="terminal_chatbot"></div>
        </div>
    )





}