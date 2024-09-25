import React, { useText } from "jsx-dom"
import Desktop from "./desktop"
import BlogRouter from "./blogs/BlogsRouter"
import "./index.css"
import BlogsHome from "./blogs/BlogsHome"
import bg_image from "./assets/bg-image.jpg"
import back_btn from './assets/back.svg';


const blogs = [
    "/blogs/limits",
    "/blogs/python/intro",
    "/blogs/python/2",
    "/blogs/python/3",
    "/blogs/refraction"
]


const NavBar = () => {
    const [url, setUrl] = useText(window.location.pathname)        
    if (window.location.pathname === "/blogs" || window.location.pathname === "/blogs/") {
        setUrl("/")
    }
    else{
        setUrl("/blogs")
    }

    return(
        <div className="navbar bg-gray-800 text-white p-4">
            <a href={url.textContent || ""} className="text-white">
                <img src={back_btn} alt="back" className="w-6 h-6 invert" />
            </a>
        </div>
    )
}

window.addEventListener('load', () => {
    if (window.location.pathname.startsWith('/blogs')) {
    
        document.body.style.backgroundColor = "white"
        // Get the blog number from the url
        const blogName = window.location.pathname.split('/').slice(2).join('/')
    
        document.body.appendChild(<NavBar />)

        if (blogName === "") {
            document.body.appendChild(<BlogsHome />)
        }


        if (blogs.includes(`/blogs/${blogName}`)) {            
            document.body.appendChild(<BlogRouter blogName={blogName} />)
        }
        
        
    } else {
        document.body.style.backgroundImage = `url(${bg_image})`
        document.body.style.backgroundSize = "cover"
        document.body.style.backgroundAttachment = "fixed"
        document.body.style.backgroundRepeat = "no-repeat"
        document.body.appendChild(<Desktop />)
    }

})

