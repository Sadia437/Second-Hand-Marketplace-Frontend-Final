import React, { useContext } from 'react'; 
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { FaShoppingCart, FaUsers, FaHome, FaSignOutAlt, FaBars } from 'react-icons/fa';
import { AuthContext } from '../context/AuthContext'; 

const Dashboard = () => {
    const { dbUser, logout, loading } = useContext(AuthContext); 
    const navigate = useNavigate();
    
    if (loading) return <div className="text-center p-20">Loading...</div>;

    const isAdmin = dbUser?.role === 'admin';
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
                <div className="bg-white min-h-[80vh] rounded-xl shadow-sm border p-5">
                    <Outlet /> 
                    {window.location.pathname === '/dashboard' && (
                        <div className="text-center py-20">
                            <h2 className="text-3xl font-bold">Welcome, {dbUser?.name || 'User'}!</h2>
                            <p className="text-gray-500 mt-2 uppercase tracking-widest text-xs font-bold">{dbUser?.role}</p>
                        </div>
                    )}
                </div>
            </div>

            <div className="drawer-side">
                <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-80 min-h-full bg-white text-base-content border-r">
                    <div className="text-xl font-bold p-4 text-primary italic border-b mb-4">Greenmart</div>
                    {isBuyer && (
                        <li><NavLink to="/dashboard/my-bookings"><FaShoppingCart /> My Bookings</NavLink></li>
                    )}
                    {isAdmin && (
                        <li><NavLink to="/dashboard/admin-sellers"><FaUsers /> Seller Management</NavLink></li>
                    )}
                    <div className="divider"></div>
                    <li><NavLink to="/"><FaHome /> Home</NavLink></li>
                    <li><button onClick={handleLogOut} className="text-red-500 font-bold"><FaSignOutAlt /> Logout</button></li>
                </ul>
            </div>
        </div>
    );
};


export default Dashboard;