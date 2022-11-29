import React, { useContext } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';

const CounterHeader = ({ loading, counterStatus, counterHandler, queueToken }) => {
    const { queueBranch } = useContext(QueueContext);
    return (
        <div className='py-3 flex bg-gray-700'>
            <h1 className='text-slate-50 text-xl font-semibold text-center flex-1'>{queueBranch?.name} - {queueBranch?.branch_name}</h1>
            <label htmlFor="purple-toggle" className={`inline-flex relative items-center mr-5 cursor-pointer ${loading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
                <input disabled={queueToken !== null ? true : false} onChange={() => counterHandler(queueBranch?.id, counterStatus ? 'off' : 'on')} type="checkbox" checked={counterStatus ? true : false} id="purple-toggle" className="sr-only peer" />
                <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-purple-300 dark:peer-focus:ring-purple-800 peer-checked:after:translate-x-full  after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-purple-600"></div>
            </label>
        </div >
    );
}

export default CounterHeader;
