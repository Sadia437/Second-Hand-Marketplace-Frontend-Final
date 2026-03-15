import React, { useContext } from 'react'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUsers, FaHome, FaSignOutAlt, FaBars, FaBoxOpen, FaExclamationTriangle } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; 

const Dashboard = () => {
    const { dbUser, logout, loading } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    if (loading) return <div className="text-center p-20 font-bold">Synchronizing Session...</div>;

    
    const isAdmin = dbUser?.role === 'admin';
    const isSeller = dbUser?.role === 'seller';
    const isBuyer = dbUser?.role === 'buyer';

    const handleLogOut = () => {
        logout().then(() => navigate('/'));
    };

    return (
        <div className="drawer lg:drawer-open bg-gray-50">
            <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex flex-col p-6">
                <div className="lg:hidden mb-4">
                    <label htmlFor="dashboard-drawer" className="btn btn-ghost drawer-button">
                        <FaBars className="text-xl" />
                    </label>
                </div>
                
                
                <div className="bg-white min-h-[85vh] rounded-2xl shadow-sm border border-gray-100 p-8">
                    <Outlet /> 
                    
                    
                    {(window.location.pathname === '/dashboard' || window.location.pathname === '/dashboard/') && (
                        <div className="text-center py-24">
                            <h2 className="text-4xl font-extrabold text-gray-800 tracking-tight">
                                Welcome, <span className="text-primary">{dbUser?.name || 'User'}</span>!
                            </h2>
                            <div className="mt-6">
                                <span className="bg-blue-600 text-white px-6 py-2 rounded-full text-xs font-black uppercase tracking-[0.2em] shadow-lg shadow-blue-200">
                                    Current Role: {dbUser?.role || 'Guest'}
                                </span>
                            </div>
                            {isAdmin && (
                                <p className="mt-6 text-green-500 font-semibold flex items-center justify-center gap-2">
                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-ping"></span>
                                    Verified Administrator Access
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div> 

         
            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <ul className="menu p-5 w-80 min-h-full bg-white text-base-content border-r border-gray-100">
                    <div className="text-2xl font-black p-4 text-primary italic border-b mb-8 flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg"></div>
                        Seconhand Marketplace
                    </div>
                    
                    
                    {isAdmin && (
                        <>
                            <div className="text-[10px] font-bold text-gray-400 uppercase mb-2 px-4">Management</div>
                            <li><NavLink to="/dashboard/admin" className={({isActive}) => isActive ? "bg-primary text-white shadow-md" : "hover:bg-gray-100"}>
                                <FaUsers className="text-lg" /> Admin Dashboard
                            </NavLink></li>
                        </>
                    )}

                  
                    {isSeller && (
                        <li><NavLink to="/dashboard/my-products" className={({isActive}) => isActive ? "bg-primary text-white shadow-md" : ""}>
                            <FaBoxOpen /> My Products
                        </NavLink></li>
                    )}

                    
                    {isBuyer && (
                        <li><NavLink to="/dashboard/my-bookings" className={({isActive}) => isActive ? "bg-primary text-white shadow-md" : ""}>
                            <FaShoppingCart /> My Bookings
                        </NavLink></li>
                    )}

                    <div className="divider my-10"></div>
                    
                    <li><NavLink to="/"><FaHome /> Return Home</NavLink></li>
                    <li><button onClick={handleLogOut} className="text-red-500 font-bold hover:bg-red-50 mt-2">
                        <FaSignOutAlt /> Sign Out
                    </button></li>

                   
                    <div className="mt-auto p-4 bg-gray-50 rounded-2xl flex items-center gap-3 border border-gray-100">
                        <div className="avatar placeholder">
                            <div className="bg-primary text-white rounded-full w-10">
                                <span>{dbUser?.name?.charAt(0) || 'U'}</span>
                            </div>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-bold truncate">{dbUser?.name}</p>
                            <p className="text-[10px] text-gray-400 truncate">{dbUser?.email}</p>
                        </div>
                    </div>
                </ul>
            </div>
        </div>
    );
};

export default Dashboard;