import React, { useContext } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';
import toast from 'react-hot-toast';

const QueryQueue = ({ setQueueCreator }) => {

    const { plugin_url, queueBranch } = useContext(QueueContext);

    const sendQueueToken = async (data, customer_mobile, customer_name) => {
        const message = `[1000FIX Service Ltd.] Hey ${customer_name}, Your token no is ${data?.queue_token}, Please wait for your turn. Thank you - ${queueBranch?.branch_name} - www.1000fix.com`;
        const res = await fetch(`http://188.138.41.146:7788/sendtext?apikey=${data?.api_key}&secretkey=${data?.secret_key}&callerID=${data?.caller_id}&toUser=${customer_mobile}&messageContent=${message}`);
        const resData = await res.json();
        return resData;
    }

    const handleQueryToken = (event) => {

        event.preventDefault();
        const form = event.target;
        const customer_name = form.name.value;
        const customer_mobile = form.mobile.value;
        const toastId = toast.loading('Creating');

        fetch(`${plugin_url}queue-manage.php`, {
            method: 'POST',
            headers: {
                query_queue_create: true,
            },
            body: JSON.stringify({ customer_name, customer_mobile })
        })
            .then(res => res.json())
            .then(data => {
                toast.dismiss(toastId);
                if (data?.status == 'good') {
                    sendQueueToken(data, customer_mobile, customer_name);
                    form.reset();
                    setQueueCreator(null);
                    toast.success('Queue Token Create Successfully');
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <div>
            <form className='relative' onSubmit={handleQueryToken}>
                <button
                    type='button'
                    className='absolute top-0 left-[10px]'
                    onClick={() => setQueueCreator(null)}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                    </svg>
                </button>
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
