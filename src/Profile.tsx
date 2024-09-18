import React from 'jsx-dom';
import { startApplication } from './desktop';
import IframeWindow from './IframeWindow';
import resume_icon from "./assets/file_manager.svg"
import user_icon from "./assets/user.svg"


export default function Profile() {
    return (

        <div className="profile bg-white w-full h-screen flex flex-col justify-start items-start">
            <div className="profile-header flex gap-x-4 justify-start items-center">
                <div className="profile-image">
                    <img src={user_icon} alt="user" className="h-12 w-12" />
                </div>
                <div className="profile-name">
                    <h1 className="text-2xl">Ayush Deshpande</h1>
                    <p className="text-gray-500">
                        Everything Developer
                    </p>
                </div>
            </div>
            <div className="profile-bio mt-4">
                <h1 className="text-lg">Bio</h1>
                <p className="text-gray-500">
                    Hello.
                    I make things and I play games.
                </p>
            </div>
            <div className="profile-skills mt-4 w-full">
                <h1 className="text-2xl">Skills</h1>
                <hr className="w-full" />
                <h2 className="text-lg underline">Frontend</h2>
                <p className="text-gray-500">
                    HTML CSS TypeScript React
                </p>
                <h2 className="text-lg underline">Backend</h2>
                <p className="text-gray-500">
                    Node Python FastAPI Flask
                </p>
                <h2 className="text-lg underline">Database</h2>
                <p className="text-gray-500">
                    MySQL PostgreSQL Sqlite MongoDB
                </p>
                <h2 className="text-lg underline">Others</h2>
                <p className="text-gray-500">
                    Android Git Linux Firebase AWS Cybersecurity
                </p>
            </div>

            <div className="profile-contact mt-4 w-full">
                <h1 className="text-2xl">Contact</h1>
                <hr className="w-full" />
                <h2 className="text-lg underline">Email</h2>
                <p className="text-gray-500">
                    <a href="mailto:ayushdeshpande81@gmail.com">
                        ayushdeshpande81@gmail.com
                    </a>
                </p>
            </div>

            <div className="Resume mt-4 w-full">
                <h1 className="text-2xl">Resume</h1>
                <hr className="w-full" />
                <button
                    className="bg-blue-500 px-2 py-2 text-white mt-2 rounded-lg hover:bg-blue-600"
                    onClick={() => {
                        startApplication('Resume', resume_icon, <IframeWindow src="https://drive.google.com/file/d/1vvJDaZbnTc6ewFNhk3-CrgFdqtXa7Oa7/preview" />)
                    }}
                >
                    Open Resume
                </button>
            </div>
        </div>
    )
}