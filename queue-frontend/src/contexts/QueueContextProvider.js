import React, { createContext, useEffect, useState } from 'react';

export const QueueContext = createContext();

const QueueContextProvider = ({ children }) => {

    const [loading, setLoading] = useState(true);
    const [queueBranch, setQueueBranch] = useState(null);
    const [counters, setCounters] = useState(null);

    const plugin_url = window.location.origin + '/wp-content/plugins/queue/api/';

    useEffect(() => {

        const url = `${plugin_url}queue-manage.php`;
        fetch(url)
            .then(res => res.json())
            .then(data => {
                setQueueBranch(data);
                setLoading(false);
                setCounters(data?.counters);
            })
            .catch(err => console.error(err));

    }, []);

    const queueInfo = { queueBranch, loading, plugin_url, counters, setCounters };

    return (
        <QueueContext.Provider value={queueInfo}>
            {children}
        </QueueContext.Provider>
    );
}

export default QueueContextProvider;
