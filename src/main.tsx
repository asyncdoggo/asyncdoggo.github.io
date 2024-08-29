import React from "jsx-dom"
import Desktop from "./desktop"
import BlogsHome from "./blogs/BlogsHome"
import BlogRouter from "./blogs/BlogsRouter"
import "./index.css"

window.addEventListener('load', () => {
    if(window.location.pathname.startsWith('/blogs')){
        // Get the blog number from the url
        const blogNumber = window.location.pathname.split('/')[2]
        // If the blog number is not a number, redirect to the BlogsHome component
        if(isNaN(Number(blogNumber)) || blogNumber === ''){
            document.body.appendChild(<BlogsHome/>)
        }
        // If the blog number is a number, render the blog
        else{
            document.body.appendChild(<BlogRouter blogNumber={blogNumber}/>)
        }
    }else{      
        document.body.appendChild(<Desktop/>)
    }

})