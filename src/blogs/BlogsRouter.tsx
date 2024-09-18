import React from 'jsx-dom';
import Limits from './limits';
import PythonIntro from './python/pythonIntro';
import Python2 from './python/pythonAspects';
import BlogsHome from './BlogsHome';
import Python3 from './python/pythonBasics';
import Refraction from './refraction';


export default function BlogRouter({blogName}: any) {
    
    if(blogName == "limits"){
        return (
            <Limits />
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
    if (blogName == "refraction"){
        return (
            <Refraction/>
        )
    }

    return (
        <BlogsHome/>
    )


}


