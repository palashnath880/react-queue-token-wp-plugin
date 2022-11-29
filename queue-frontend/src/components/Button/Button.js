import React from 'react';

const Button = ({ children, onClick, className }) => {
    return (
        <button onClick={onClick} className={`w-full border border-gray-400 py-2 hover:bg-violet-500 duration-300 hover:text-slate-50 font-semibold ${className}`}>{children}</button>
    );
}

export default Button;
