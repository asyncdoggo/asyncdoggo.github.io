import React from 'jsx-dom';
import Blog1 from './Blog1';
import PythonIntro from './python/pythonIntro';
import Python2 from './python/pythonAspects';
import BlogsHome from './BlogsHome';
import Python3 from './python/pythonBasics';


export default function BlogRouter({blogName}: any) {
    console.log(blogName);
    
    if(blogName == "limits"){
        return (
            <Blog1/>
        )
    }
    if (blogName == "python/intro"){
        return (
            <PythonIntro/>
        )
    }
    if (blogName == "python/2"){
        return (
            <Python2/>
        )
    }
    if (blogName == "python/3"){
        return (
            <Python3/>
        )
    }
    return (
        <BlogsHome/>
    )


}


