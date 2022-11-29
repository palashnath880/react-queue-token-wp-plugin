import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ videos }) => {

    const video = useRef();
    const videoRef = useRef();
    const [index, setIndex] = useState(0);
    const [videoHeight, setVideoHeight] = useState('');
    const [currentVideoSrc, setCurrentVideoSrc] = useState(null);

    const videoHandler = () => {
        if (videos.length - 1 === index) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    }

    useEffect(() => {

        let interval;
        interval = setInterval(() => {
            // const height = videoRef.current.clientHeight;
            // setVideoHeight(height);
        }, 1000);

        if (videos !== null) {
            setCurrentVideoSrc(videos[index]);
        }

        return () => clearInterval(interval);

    }, [index, videos])

    return (
        <div className='rounded-md overflow-hidden flex items-center justify-center h-full'>
            <video
                className='rounded-md h-full'
                style={{ maxHeight: '100%', minHeight: '100%', maxWidth: '100%' }}
                ref={video}
                src={currentVideoSrc}
                autoPlay
                onEnded={videoHandler}
                muted
            >
            </video>
        </div>
    );
}

export default VideoPlayer;
