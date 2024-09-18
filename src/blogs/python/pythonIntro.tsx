import React from "jsx-dom";
import { CodeBlock, InlineCode } from "./pyUtils";

export default function PythonIntro() {
    return (
        <div
            id="blog-python-main"
            className="w-full bg-white flex flex-col px-4 pt-16"
        >
            <div className="flex md:w-2/3 w-full self-center flex-col items-start justify-center">
                <h1 className="w-full text-4xl font-bold font-sans">Python Introduction</h1>
                <p className="w-full pt-2 px-2 text-lg font-sans">By me</p>
                <p className="w-full pt-2 px-2 text-sm font-sans">Published on 16th september 2024</p>
                <div className="w-full border border-gray-500"></div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 w-full self-center flex flex-col items-start justify-center mb-8">
                <p className="w-full pt-8 text-xl font-sans">
                    Python 🐍
                </p>

                <p className="w-full italic pt-4 text-2xl font-sans">
                    What is Python?
                </p>

                <div className="w-full pl-4">
                    <p className="w-full  text-lg font-sans">
                        In simple words, Python is a programming language. It can be used to write programs that can be executed by a computer.
                    </p>

                    <p className="w-full pt-4  text-lg font-sans">
                        But that is not what makes Python special.
                        Python is special because of its simplicity and at the same time, its power.
                    </p>

                    <p className="w-full pt-4  text-lg font-sans">
                        You will hear people say that Python is a <b>high-level</b>, <b>interpreted</b>, and <b>general-purpose</b> programming language.
                    </p>

                    <p className="w-full pt-4  text-lg italic font-sans">
                        What does that mean?
                    </p>

                    <div className="w-full pl-4">
                        <p className="w-full pt-4  text-lg font-sans">
                            <b>High-level</b> means that Python is designed using human-readable syntax. When you write Python code, its structure is similar to how you would write English sentences. This makes Python more intuitive and easier to learn.
                        </p>

                        <p className="w-full pt-4  text-lg font-sans italic">
                            The high-level in technical terms means that Python is abstracted from the machine code. This is achieved by using an interpreter.
                            You will learn more about interpreters and how python works in further sections.
                        </p>

                        <p className="w-full pt-4  text-lg font-sans">
                            <b>Interpreted</b> means that Python code is executed line by line. This is different from languages like C++ or Java where the code is compiled first and then executed.
                        </p>

                        <p className="w-full pt-4  text-lg font-sans">
                            <b>General-purpose</b> means that Python can be used for a wide variety of tasks. You can use Python to make web applications, games, scientific applications, and much more.
                        </p>
                    </div>
                </div>

                <p className="w-full pt-4  text-2xl font-sans italic">
                    Structure of a Python program:
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4  text-lg font-sans">
                        Python programs are written in files with a <b>.py</b> extension. The .py extension tells the computer that the file contains Python code.
                    </p>

                    <p className="w-full pt-4  text-lg font-sans">
                        A Python program is a sequence of statements. These statements are executed one by one.
                    </p>
                </div>

                <p className="w-full pt-4  text-lg font-sans">
                    Lets look at an important part of a Python program, you may have noticed that this blog is written with indentation.
                    An indentation is nothing but a <b>space</b> or a <b>tab</b> before a statement.
                </p>
                <CodeBlock code={`if 5 > 2:
    print("5 is greater than 2")`} />

                <p className="w-full pt-4  text-lg font-sans">
                    In the above code snippet, the print statement is indented.
                    This is because the <InlineCode code={"print"}/> statement is inside the <InlineCode code="if" /> block.
                    The indentation is used to define the scope of the if block.
                </p>

                <p className="w-full pt-4  text-lg font-sans">
                    A scope is a simple way to define the area where something is valid or accessible.
                </p>


                <div className="w-full mt-8 border border-gray-500">
                    <p className="w-full pt-4 px-2 text-lg font-sans font-bold italic">
                        Why Python?
                    </p>

                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        Python is a very dynamic and versatile language. Python today is used almost everywhere.
                        Its simplicity allows it to be used for simple tasks like writing scripts to automate tasks to large scale applications like web applications or games.
                    </p>

                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        Python's popularity in today's world is on part due to its use in Machine Learning.
                        You may have used tools such as ChatGPT or AI, these tools are built using Python.
                    </p>
                </div>
            </div>

            {/* Next Steps */}
            <div className="md:w-2/3 w-full self-center flex flex-col items-start justify-center mb-8">
                <p className="w-full pt-8  text-lg font-sans">
                    <b>Next Steps:</b>
                </p>
                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        Next, we will look at some important things to know about Python.
                    </p>
                    <a href="/blogs/python/2" className="w-full pt-4 text-lg font-sans text-blue-500 underline">
                        Continue to the next blog
                    </a>
                </div>
            </div>
        </div>

    );
}