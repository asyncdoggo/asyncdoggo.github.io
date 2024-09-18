import React from "jsx-dom"
import Desktop from "./desktop"
import BlogRouter from "./blogs/BlogsRouter"
import "./index.css"
import BlogsHome from "./blogs/BlogsHome"

const blogs = [
    "/blogs/limits",
    "/blogs/python/intro",
    "/blogs/python/2",
    "/blogs/python/3",
    "/blogs/refraction"
]


window.addEventListener('load', () => {
    if (window.location.pathname.startsWith('/blogs')) {
        // Get the blog number from the url
        const blogName = window.location.pathname.split('/').slice(2).join('/')
        
        if (blogName === "") {
            document.body.appendChild(<BlogsHome />)
        }


        if (blogs.includes(`/blogs/${blogName}`)) {
            console.log("Blog found");
            
            document.body.appendChild(<BlogRouter blogName={blogName} />)
        }
        
        
    } else {
        document.body.appendChild(<Desktop />)
    }

})