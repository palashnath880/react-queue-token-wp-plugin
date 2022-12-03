import React, { useContext, useEffect, useState } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';

const DisplayNextQueue = () => {

    const [nextTokens, setNextTokens] = useState(null);
    const { queueBranch, plugin_url } = useContext(QueueContext);

    // pending queue token
    const pendingQueueToken = () => {
        const url = `${plugin_url}queue-token-display.php?branch_id=${queueBranch?.branch_id}`;
        fetch(url, { headers: { 'get_next_queue': 'NEXT_QUEUE' } })
            .then(res => res.json())
            .then(data => {
                setNextTokens(data?.tokens);
            })
            .catch(err => console.error(err));
    }

    //
    useEffect(() => {

        let interval;
        interval = setInterval(() => {
            pendingQueueToken();
        }, 1000);

        return () => clearInterval(interval);

    }, [queueBranch]);

    return (
        <marquee className='flex items-center'>
            {
                nextTokens !== null && nextTokens.map((token, index) => <span key={index} className='bg-gray-700 text-slate-50 px-3 py-2 mr-3 rounded inline-block'>{token}</span>)
            }
        </marquee>
    );
}

export default DisplayNextQueue;
