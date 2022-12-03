import React, { useEffect, useState } from 'react';

const RealTime = () => {
    const [time, setTime] = useState('');
    useEffect(() => {
        let interval;
        interval = setInterval(() => {
            setTime(`${new Date().toDateString()} ${new Date().toLocaleTimeString()}`);
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return <>{time}</>;
}

export default RealTime;
