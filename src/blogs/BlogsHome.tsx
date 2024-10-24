import * as React from 'jsx-dom';

export default function BlogsHome() {
    return (
        <>
            <div className="container mx-auto p-4">
                <h1 className="text-3xl font-bold">Blogs</h1>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {window.location.href = '/blogs/limits'}}
                    >
                        <h2 className="text-xl font-bold">Limits</h2>
                        <p>
                           This blog talks about the mathematical concept of limits and how it can be visualized using intuituve examples.
                        </p>
                    </div>
                </div>
                <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {window.location.href = '/blogs/refraction'}}
                    >
                        <h2 className="text-xl font-bold">Refraction</h2>
                        <p>
                            This blog talks about the concept of refraction and speed of light.
                        </p>
                    </div>
                </div>            
                <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {window.location.href = '/blogs/python/intro'}}
                    >
                        <h2 className="text-xl font-bold">Python Introduction</h2>
                        <p>
                            An introduction to Python programming language. The first blog in the Python series.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {window.location.href = '/blogs/python/2'}}
                    >
                        <h2 className="text-xl font-bold">Python Aspects</h2>
                        <p>
                            A deep dive into the aspects of Python programming language. The second blog in the Python series.
                        </p>
                    </div>
                </div>

                <div className="flex flex-col gap-4 mt-4">
                    <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg hover:cursor-pointer hover:bg-gray-50"
                    onClick={() => {window.location.href = '/blogs/python/3'}}
                    >
                        <h2 className="text-xl font-bold">Python Basics</h2>
                        <p>
                            The basics of Python programming language. The third blog in the Python series.
                        </p>
                    </div>
                </div>    


            </div>
        </>
    )
}