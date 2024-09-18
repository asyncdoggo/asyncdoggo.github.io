import React from "jsx-dom";

export default function Python2() {

    return (
        <div
            id="blog-python-2"
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
                    While its easy to get started with writing Python code, I think it is important to understand a few things about Python before we dive into writing code.
                </p>

                <p className="w-full pt-4 text-2xl font-sans italic">
                    Open Source
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans font-medium">
                        The most important thing to know about Python is that it is an open-source language.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        It mean that the entire language is free to use and modify. You can download the source code of Python and modify it to suit your needs. This is one of the reasons why Python has a large community of developers.
                    </p>
                </div>

                <p className="w-full pt-4 text-2xl font-sans italic">
                    "Source Code" What is that?
                </p>

                <div className="w-full pl-4">

                    <p className="w-full pt-4 text-lg font-sans">
                        Python is actually made using another programming language. This language is called <a href="https://en.wikipedia.org/wiki/C_(programming_language)" className="text-blue-500">C programming language</a>. The source code of Python is written in C.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The source code is the code that is written by the developers of Python. It is compiled into machine code <i>(an .exe file for windows)</i> that can be executed by the computer.
                        The python code that you write is read and executed by the Python interpreter (.exe file).
                    </p>

                    <p className="w-full pt-4 text-lg font-sans italic">
                        Important thing to note is that there are other types of Python. For example, <a href="https://en.wikipedia.org/wiki/PyPy" className="text-blue-500">PyPy</a> is a version of Python that is written in Python itself (Kinda).
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        But the Python that we will be talking about is the one that is written in C. Which is also knows as <a href="https://en.wikipedia.org/wiki/CPython" className="text-blue-500">CPython</a>.
                    </p>

                </div>

                <p className="w-full pt-4 text-2xl font-sans italic">
                    Some History of Python
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        Python was created by <b>Guido van Rossum</b> and was first released in 1991. It was designed to be a language that is easy to read and write. The language was named after the British comedy show
                        <a href="https://en.wikipedia.org/wiki/Monty_Python" className="text-blue-500"> Monty Python's Flying Circus</a> (It is pretty cool).
                    </p>
                    <p className="w-full pt-4 text-lg font-sans italic">
                        It has nothing to do with the snake. 🐍 ❌
                    </p>
                </div>

                <p className="w-full pt-4 text-2xl font-sans italic">
                    Versions of Python
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        The first version of Python was released in 1991. Python was a successor to the ABC language.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        The first stable version of Python was released in 1994. This was Python 1.0.
                        Guido van Rossum continued to work on Python at the <a href="https://en.wikipedia.org/wiki/Corporation_for_National_Research_Initiatives" className="text-blue-500">Corporation for National Research Initiatives</a> (CNRI) and released Python 1.6 in 2000.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Python was always meant to be easy to use and learn. It was created to make programming accessible to anyone with basic literacy in English and Mathematics and maybe some computers (That's you!).
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Python 2.0 was released in 2000. This was a major release that introduced features like garbage collection and Unicode support. Soon python 2.1 was released in 2001.
                        It was also the first version of Python that was released under the <a href="https://en.wikipedia.org/wiki/Python_Software_Foundation" className="text-blue-500">Python Software Foundation</a>.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Python 3.0 was released in 2008. This was a major release that introduced some breaking changes. The Python community was divided between Python 2 and Python 3 for a long time.
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        For a while, Python 2 and Python 3 were maintained simultaneously. But in 2020, Python 2 was officially discontinued. This means that there will be no more updates or bug fixes for Python 2.
                        It was marked as <a href="https://www.python.org/doc/sunset-python-2/" className="text-blue-500">End of Life</a> (EOL).
                    </p>

                    <p className="w-full pt-4 text-lg font-sans">
                        Today Python 3 is the mostly used version of Python. Most Python 2 code has been ported to Python 3.
                    </p>

                    <p className="w-full pt-4 text-lg font-bold font-sans">
                        And hence forth whenever we refer to Python, we are talking about Python 3.
                    </p>
                </div>

                <p className="w-full pt-4 text-2xl font-sans italic">
                    Python Interpreter
                </p>

                <div className="w-full pl-4">
                    <p className="w-full pt-4 text-lg font-sans">
                        Python is an interpreted language.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        In simple terms, this means that the code that you write is executed line by line.
                    </p>
                    <p className="w-full pt-4 text-lg font-sans">
                        This is different from languages like C++ or Java where the code is compiled first and then executed.
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