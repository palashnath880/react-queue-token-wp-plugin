import React, { useContext, useEffect, useRef, useState } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';

const VideoPlayer = ({ }) => {

    const video = useRef();
    const [index, setIndex] = useState(0);
    const [currentVideoSrc, setCurrentVideoSrc] = useState(null);
    const { queueBranch, plugin_url } = useContext(QueueContext);
    const [videos, setVideos] = useState([]);

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

    useEffect(() => {

        const url = `${plugin_url}queue-token-display.php?branch_id=${queueBranch?.branch_id}`;
        fetch(url, { headers: { 'get_video_ads': 'video_ads' } })
            .then(res => res.json())
            .then(data => {
                setVideos(data?.videos);
            })
            .catch(err => console.error(err));

    }, []);

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

export default React.memo(VideoPlayer);
