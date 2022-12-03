import React, { useContext, useEffect, useState } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';

const DisplayCounters = () => {

    const [openCounters, setOpenCounters] = useState(null);
    const { queueBranch, plugin_url } = useContext(QueueContext);

    useEffect(() => {
        let interval;
        interval = setInterval(() => {
            const url = `${plugin_url}queue-token-display.php?branch_id=${queueBranch?.branch_id}`;
            fetch(url, { headers: { 'get_all_counters': 'QUEUE_DISPLAY' } })
                .then(res => res.json())
                .then(data => setOpenCounters(data?.counters))
                .catch(err => console.error(err));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    return (
        <table className='w-full table border-collapse mt-4'>
            <thead>
                <tr>
                    <th className='border py-2'>Counter</th>
                    <th className='border py-2'>Token No</th>
                </tr>
            </thead>
            <tbody>
                {
                    openCounters !== null && (
                        openCounters.map((cou, index) =>
                            <tr key={index} className='text-center'>
                                <td className='border py-2 '>{cou?.counter_name}</td>
                                <td className='border py-2'>{cou?.running_token}</td>
                            </tr>)
                    )
                }
            </tbody>
        </table>
    );
}

export default DisplayCounters;
