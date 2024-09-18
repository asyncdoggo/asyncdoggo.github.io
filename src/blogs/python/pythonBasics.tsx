import React from "jsx-dom";
import { CodeExecutionBlock, InlineCode } from "./pyUtils";

export default function Python3() {

    return (
        <div
            id="blog-python-2\3"
            className="w-full bg-white flex flex-col px-4 pt-16"
        >
            <div className="flex md:w-2/3 w-full self-center flex-col items-start justify-center">
                <h1 className="w-full text-4xl font-bold font-sans">What is Python and How does it work?</h1>
                <p className="w-full pt-2 px-2 text-lg font-sans">By me</p>
                <div className="w-full border border-gray-500"></div>
            </div>

            {/* Content */}
            <div className="md:w-2/3 w-full self-center flex flex-col items-start justify-center mb-8">
                <p className="w-full pt-8 text-xl font-sans">
                    Python 🐍
                </p>

                <p className="w-full italic pt-4 text-lg font-sans">
                    In this section we will look at the basics of Python programming language.
                </p>

                <p className="w-full pt-4 text-xl font-sans">
                    Lets start with writing some code.
                </p>

                {/* The print statement */}
                <p className="w-full italic pt-4 text-2xl font-sans">
                    The print function
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        In Python, the <InlineCode code="print" /> function is used to display text on the screen.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        Try writing the following code in the editor below:
                    </p>

                    <pre className="w-full">
                        print("Today is a good day!")
                    </pre>

                </div>



                <CodeExecutionBlock expectedOutput={
                    {
                        stdout: "Today is a good day!\n",
                        variables: {}
                    }

                } />


                <p className="w-full pt-4 text-lg font-sans">
                    The <InlineCode code="print" /> function is used to print anything on the screen.
                </p>

                <div className="w-full mt-8 border border-gray-500">
                    <p className="w-full pt-4 px-2 text-lg font-sans font-bold italic">
                        The screen
                    </p>

                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        When we say "print on the screen", we mean that the text is displayed on the console. The console is a window that displays the output of the program.
                    </p>

                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        Generally the text is printed to the stdout (standard output) of the program. The stdout is the default output stream of the program.
                        Read more about <a href="https://en.wikipedia.org/wiki/Standard_streams" className="text-blue-500">standard streams</a>.
                    </p>
                </div>

                <p className="w-full pt-4 text-xl font-sans italic">
                    Variables
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        Variables are used to store data in a program. You would use variables when you need to store a value that you cannot determine while writing the code (such as user input).
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        When creating a variable, following rules must be followed:
                    </p>
                    <ul className="w-full pl-4 text-lg font-sans list-disc">
                        <li>Variable name must always start with a letter or an underscore, you cannot start a variable name with a number.</li>
                        <li>Variable name can only contain letters, numbers and underscores.</li>
                        <li>Variable names are case sensitive.</li>
                    </ul>

                    <p className="w-full pt-4 text-lg font-sans">
                        Try writing the following code in the editor below:
                    </p>

                    <pre className="w-full">
                        {
                            `name = "Python"\nversion = 3\nprint("I am learning", name, "version", version)`
                        }
                    </pre>
                        <CodeExecutionBlock expectedOutput={
                            {
                                stdout: "I am learning Python version 3\n",
                                variables: {
                                    name: "Python",
                                    version: 3
                                }
                            }

                        } />
                    <p className="w-full pt-4 text-lg font-sans">
                        Using variables is as easy as that. You just write the name and assign a value to it.
                    </p>
                </div>

                <div className="w-full mt-8 border border-gray-500">
                    <p className="w-full pt-4 px-2 text-lg font-sans font-bold italic">
                        print function 
                    </p>
                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        You may wonder what the <InlineCode code="print" /> function does in the above code snippet.
                    </p>

                    <p className="w-full pl-4 py-4 text-lg font-sans">
                        <InlineCode code="print" /> is a function. And functions can take multiple arguments. We will learn more about functions later. For now just know that the <InlineCode code="print" /> function will print each argument separated by a space.
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
                        Next, we will look at how to write and run Python code. We will also look at some of the basic concepts of Python.
                    </p>
                    <a href="/blogs/python/3" className="w-full pt-4 text-lg font-sans text-blue-500 underline">
                        Continue to the next blog
                    </a>
                </div>
            </div>
        </div>

    );
}