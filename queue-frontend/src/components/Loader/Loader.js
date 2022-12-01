import React from 'react';
import logo from '../../images/logo.png';
import loaderSvg from './loader.svg';

const Loader = () => {
    return (
        <div className="h-screen bg-white bg-contain bg-center bg-no-repeat" style={{ backgroundImage: `url(${logo})` }}>
            <div className="flex justify-center items-center h-full">
                <img src={loaderSvg} alt='Loader svg' />
                {/* <img className="h-16 w-16" src="https://icons8.com/preloaders/preloaders/1488/Iphone-spinner-2.gif" alt="" /> */}
            </div>
        </div>
    );
}

export default Loader;
