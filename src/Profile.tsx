import React from 'jsx-dom';

export default function Profile() {
    return (
        
        <div className="profile bg-gray-100 w-full h-full flex justify-center items-center">
            <div className="profile-card bg-white p-4 rounded-lg shadow-lg">
                <div className="profile-header flex justify-between items-center">
                    <div className="profile-image">
                        <img src="https://freesvg.org/img/abstract-user-flat-4.png" alt="user" className="h-12 w-12"/>
                    </div>
                    <div className="profile-name">
                        <h1 className="text-2xl">Ayush Deshpande</h1>
                        <p className="text-gray-500">

                        </p>
                    </div>
                </div>
                <div className="profile-bio mt-4">
                    <h1 className="text-lg">Bio</h1>
                    <p className="text-gray-500">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
                        Nulla nec purus feugiat, molestie ipsum et, consequat nibh. 
                        Etiam non elit dui. Nullam vel erat et est laoreet sollicitudin ac ac nulla. 
                        Nulla id mauris nec elit cursus rutrum. 
                        Cras tincidunt nec nisl et mattis. 
                        Donec justo turpis, ultricies nec ultricies nec, pellentesque nec metus.
                    </p>
                </div>
                <div className="profile-skills mt-4">
                    <h1 className="text-lg">Skills</h1>
                    <div className="flex flex-wrap gap-x-2 gap-y-2">
                        <span className="bg-gray-300 p-1 rounded-lg">HTML</span>
                        <span className="bg-gray-300 p-1 rounded-lg">CSS</span>
                        <span className="bg-gray-300 p-1 rounded-lg">JavaScript</span>
                        <span className="bg-gray-300 p-1 rounded-lg">React</span>
                        <span className="bg-gray-300 p-1 rounded-lg">Node</span>
                        <span className="bg-gray-300 p-1 rounded-lg">Express</span>
                    </div>
                </div>
                <div className="profile-buttons mt-4">
                    <button className="bg-blue-500 text-white p-2 rounded-lg">Download Resume</button>
                    <button className="bg-blue-500 text-white p-2 rounded-lg">View Projects</button>
                    <button className="bg-blue-500 text-white p-2 rounded-lg">Contact Me</button>
                    <button className="bg-blue-500 text-white p-2 rounded-lg">Social Media</button>
                    <button className="bg-blue-500 text-white p-2 rounded-lg">Blog</button>
                </div>
            </div>        

        </div>
    )   
}