import React from 'react';

const QueryQueue = () => {
    return (
        <div>
            <form>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Enter Your Mobile Number</h2>
                    <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                        <input className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500' type='tel' placeholder='Mobile Number' name='mobile' required />
                    </div>
                </div>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Enter Your Name</h2>
                    <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                        <input className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500' type='text' placeholder='Your Name' name='name' required />
                    </div>
                </div>
                <div className='flex gap-4 justify-end'>
                    <button type='reset' className='px-5 py-2 bg-red-500 rounded-md text-slate-50'>Cancel</button>
                    <button type='submit' className='px-5 py-2 bg-violet-500 rounded-md text-slate-50'>Submit</button>
                </div>
            </form>
        </div>
    );
}

export default QueryQueue;
