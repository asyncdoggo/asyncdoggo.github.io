import React from 'jsx-dom';
import Blog1 from './Blog1';


export default function BlogRouter({blogNumber}: any) {
    if(blogNumber == 1){
        return (
            <Blog1/>
        )
    }

}


