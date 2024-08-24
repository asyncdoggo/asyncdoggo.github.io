import React from 'jsx-dom';

export default function BlogsHome() {
    return (
        <div>
            <h1 className="text-4xl font-bold">Blogs</h1>
            <div className="flex flex-col">
                <a href="/blogs/1" className="hover:underline">Blog 1</a>
                <a href="/blogs/2" className="hover:underline">Blog 2</a>
                <a href="/blogs/3" className="hover:underline">Blog 3</a>
                <a href="/blogs/4" className="hover:underline">Blog 4</a>
                <a href="/blogs/5" className="hover:underline">Blog 5</a>
            </div>
        </div>
    )
}