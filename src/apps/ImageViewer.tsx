import React, { useRef } from 'jsx-dom'
import photo1 from "../assets/gallery/1.png"
import photo2 from "../assets/gallery/2.png"
import photo3 from "../assets/gallery/3.png"
import photo4 from "../assets/gallery/4.png"
import photo5 from "../assets/gallery/5.png"
import photo6 from "../assets/gallery/6.png"
import photo7 from "../assets/gallery/7.png"
import photo8 from "../assets/gallery/8.png"
import photo9 from "../assets/gallery/9.png"
import photo10 from "../assets/gallery/10.png"
import photo11 from "../assets/gallery/11.png"
import folder_icon from "../assets/folder.svg"
import Notes from './Notes'


export const images = [
    {
        name: "Readme.txt",
        type: 'window_open',
        icon: folder_icon,
        component: () => <Notes content="These are some random AI generated images you use them as you wish."/>
    },
    {
        name: "1.png",
        type: 'photo',
        icon: folder_icon,
        image: photo1,
    },
    {
        name: "2.png",
        type: 'photo',
        icon: folder_icon,
        image: photo2,
    },
    {
        name: "3.png",
        type: 'photo',
        icon: folder_icon,
        image: photo3,
    },
    {
        name: "4.png",
        type: 'photo',
        icon: folder_icon,
        image: photo4,
    },
    {
        name: "5.png",
        type: 'photo',
        icon: folder_icon,
        image: photo5,
    },
    {
        name: "6.png",
        type: 'photo',
        icon: folder_icon,
        image: photo6,
    },
    {
        name: "7.png",
        type: 'photo',
        icon: folder_icon,
        image: photo7,
    },
    {
        name: "8.png",
        type: 'photo',
        icon: folder_icon,
        image: photo8,
    },
    {
        name: "9.png",
        type: 'photo',
        icon: folder_icon,
        image: photo9,
    },
    {
        name: "10.png",
        type: 'photo',
        icon: folder_icon,
        image: photo10,
    },
    {
        name: "11.png",
        type: 'photo',
        icon: folder_icon,
        image: photo11,
    },
]


export default function ImageViewer({id}:any) {
    let current = id
    const imageRef = useRef<HTMLImageElement>(null)

    return (
        <div className="flex flex-col items-center justify-center h-full mt-10 select-none">
            <img src={images[current].image} alt="image" className="w-full" ref={imageRef}/>
            <div className="flex gap-x-4 mt-4">
                <button className="bg-gray-800 text-white p-2 rounded-lg" onClick={() => {
                    if (current > 1) {
                        current -= 1
                        imageRef.current?.setAttribute('src', images[current].image||"")
                    }
                }}>Previous</button>
                <button className="bg-gray-800 text-white p-2 rounded-lg" onClick={() => {
                    if (current < images.length - 1) {
                        current += 1
                        imageRef.current?.setAttribute('src', images[current].image||"")                        
                    }
                }}>Next</button>
            </div>
        </div>
    )
}