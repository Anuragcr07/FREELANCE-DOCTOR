import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { FiMenu } from 'react-icons/fi';

const Layout = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-slate-50 font-sans">
            <Sidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />

            <div className="flex-1 flex flex-col">
                <Header>
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="p-2 rounded-md text-slate-600 hover:bg-slate-100 focus:outline-none lg:hidden"
                    >
                        <FiMenu className="h-6 w-6" />
                    </button>
                </Header>
                
                
                <div className="flex-1 p-4 lg:p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default Layout;