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
import { waitForElementFromRef } from '../globals'


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
    const loading = useRef(false)
    const imageRef = useRef<HTMLImageElement>(null)

    const previous = () => {
        if (current > 1) {
            current -= 1
            imageRef.current?.setAttribute('src', images[current].image||"")
            loading.current = true  
            imageRef.current!.style.opacity = "0"
            document.getElementById('loading')!.style.display = "block"                      
        }
    }

    const next = () => {
        if (current < images.length - 1) {
            current += 1
            imageRef.current?.setAttribute('src', images[current].image||"")     
            loading.current = true               
            imageRef.current!.style.opacity = "0"   
            document.getElementById('loading')!.style.display = "block" 
        }
    }


    waitForElementFromRef(imageRef, () => {
        
        imageRef.current?.addEventListener('load', () => {
            loading.current = false
            imageRef.current!.style.opacity = "1"
            document.getElementById('loading')!.style.display = "none"
        })
    })

    return (
        <div className="flex flex-col items-center justify-center h-full mt-10 select-none">
            <img src={images[current].image} alt="image" ref={imageRef} />
            <div className="flex gap-x-4 mt-4">
                <button className="bg-gray-800 text-white p-2 rounded-lg" onClick={previous}>Previous</button>
                <button className="bg-gray-800 text-white p-2 rounded-lg" onClick={next}>Next</button>
                
                    <div role="status" id='loading'>
                        <svg aria-hidden="true" class="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                            <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                        </svg>
                        <span class="sr-only">Loading...</span>
                    </div>

            </div>
        </div>
    )
}