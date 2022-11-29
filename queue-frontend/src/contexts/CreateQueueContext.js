import React, { createContext } from 'react';

export const QueueContext = createContext();

const CreateQueueContext = ({ children }) => {

    const queueInfo = {}

    return (
        <QueueContext.Provider value={queueInfo}>
            {children}
        </QueueContext.Provider>
    );
}

export default CreateQueueContext;
