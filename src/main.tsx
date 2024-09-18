import React from "jsx-dom"
import Desktop from "./desktop"
import BlogsHome from "./blogs/BlogsHome"
import BlogRouter from "./blogs/BlogsRouter"
import "./index.css"

const blogs = [
    "/blogs/limits",
    "/blogs/python/intro",
    "/blogs/python/2",
    "/blogs/python/3"
]


window.addEventListener('load', () => {
    if (window.location.pathname.startsWith('/blogs')) {
        // Get the blog number from the url
        const blogName = window.location.pathname.split('/').slice(2).join('/')
        console.log(blogName);
        
       
            document.body.appendChild(<BlogRouter blogName={blogName} />)
    } else {
        document.body.appendChild(<Desktop />)
    }

})