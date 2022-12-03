import React, { useContext } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';

const CounterHeader = ({ loading, queueToken }) => {
    const { queueBranch } = useContext(QueueContext);

    const logOut = () => {
        window.location.href = queueBranch?.logout_url;
    }

    return (
        <div className='py-3 flex bg-gray-700'>
            <h1 className='text-slate-50 text-xl font-semibold text-center flex-1'>{queueBranch?.queue_name} - {queueBranch?.branch_name}</h1>
            <label disabled={queueToken !== null ? true : false} onClick={logOut} htmlFor="purple-toggle" className={`inline-flex text-slate-50 relative items-center mr-5 cursor-pointer ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                Logout
            </label>
        </div >
    );
}

export default CounterHeader;
