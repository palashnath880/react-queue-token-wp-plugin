import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const ForgetPassword = ({ closeModal }) => {
    return (
        <div className='h-screen w-full top-0 right-0 fixed' style={{ background: 'linear-gradient(#00000075, #00000085)' }}>
            <div className='h-full w-full flex justify-center items-center'>
                <div className='w-11/12 mx-auto md:w-[350px] rounded px-2 py-4 bg-slate-50 relative'>
                    <button onClick={() => closeModal(null)} className='absolute top-[8px] right-[8px]'>
                        <XMarkIcon className='h-6 w-6' />
                    </button>
                    <div className='pt-3'>
                        <p className='pb-2'>Enter Confirmation Code.</p>
                        <input className='px-3 py-2 border border-gray-400 focus:outline-violet-500 w-full rounded-md' type='text' name='pwd_reset_code' />
                    </div>
                    <div className='flex justify-end gap-2 mt-3'>
                        <button className='bg-violet-500 text-slate-50 px-5 py-2'>Submit</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ForgetPassword;
