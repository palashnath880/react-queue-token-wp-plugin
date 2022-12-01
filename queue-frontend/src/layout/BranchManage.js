import React, { useContext, useState } from 'react';
import BranchCounter from '../components/BranchCounter/BranchCounter';
import BranchReport from '../components/BranchReport/BranchReport';
import CounterDefine from '../components/CounterDefine/CounterDefine';
import { QueueContext } from '../contexts/QueueContextProvider';

const BranchManage = () => {

    const [menuItem, setMenuItem] = useState(<BranchCounter />);
    const { queueBranch } = useContext(QueueContext);

    return (
        <>
            <div className='flex flex-row gap-4'>
                <div className='w-72 bg-gray-600 h-screen overflow-y-auto sticky top-0 left-0'>
                    <div className='px-2 py-3 h-full text-slate-50 flex flex-col'>
                        <h2 className='text-center text-2xl pb-3 border-b'>{queueBranch?.name}</h2>
                        <ul className='mt-4 flex-1'>
                            <li onClick={() => setMenuItem(<BranchCounter />)} className='rounded-lg bg-slate-500 px-3 py-2 mb-2 cursor-pointer'>Counter</li>
                            <li onClick={() => setMenuItem(<BranchReport />)} className='rounded-lg bg-slate-500 px-3 py-2 mb-2 cursor-pointer'>Report</li>
                            <li onClick={() => setMenuItem(<CounterDefine />)} className='rounded-lg bg-slate-500 px-3 py-2 mb-2 cursor-pointer'>Counter Define</li>
                        </ul>
                        <div className='py-2'>
                            <a href={queueBranch?.logout_url} className='rounded-lg block bg-slate-500 px-3 py-3 flex gap-2'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                                </svg>
                                Log Out
                            </a>
                        </div>
                    </div>
                </div>
                <div className='flex-1 py-3'>
                    <div className='p-3 rounded-md bg-slate-50'>
                        {menuItem !== null && menuItem}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BranchManage;
