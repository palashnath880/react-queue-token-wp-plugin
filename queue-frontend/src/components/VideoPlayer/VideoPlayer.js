import React, { useEffect, useRef, useState } from 'react';

const VideoPlayer = ({ videos }) => {

    const video = useRef();
    const [index, setIndex] = useState(0);
    const [currentVideoSrc, setCurrentVideoSrc] = useState(null);

    const videoHandler = () => {
        if (videos.length - 1 === index) {
            setIndex(0);
        } else {
            setIndex(index + 1);
        }
    }

    useEffect(() => {

        if (videos !== null) {
            setCurrentVideoSrc(videos[index]);
        }

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
