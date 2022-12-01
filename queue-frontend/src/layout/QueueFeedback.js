import React, { useContext, useEffect, useState } from 'react';
import Loader from '../components/Loader/Loader';
import { QueueContext } from '../contexts/QueueContextProvider';
import logo from '../images/logo.png';
import { toast } from 'react-hot-toast';

const QueueFeedback = ({ tokenId }) => {

    const [queueToken, setQueueToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const { plugin_url } = useContext(QueueContext);
    const [success, setSuccess] = useState(false);

    const handleFeedback = (event) => {
        event.preventDefault();
        const form = event.target;
        const remarks = form.remarks.value;
        const action = form.feedback.value;

        if (!action) {
            toast.error('Please select your action.');
            return;
        }
        fetch(`${plugin_url}queue-feedback.php`, {
            method: 'POST',
            body: JSON.stringify({ remarks, action, tokenId: queueToken?.id })
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status === 'good') {
                    toast.success('Succeed.');
                    setQueueToken(null);
                    setSuccess(true);
                } else {
                    toast.error('Sorry! Something went wrong.');
                }
            });

    }

    useEffect(() => {
        fetch(`${plugin_url}queue-feedback.php?token_id=${tokenId}`)
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data?.status === 'good') {
                    setQueueToken(data?.token);
                } else if (data?.status === 'already_have') {
                    setQueueToken(data);
                }
            });

    }, []);

    if (loading) {
        return <Loader />
    }


    if (success) {
        return <div className='h-screen w-full grid place-items-center'>
            <h1 className='text-center text-2xl'>Thank you for the feedback.</h1>
        </div>
    }

    if (queueToken?.status == 'already_have') {
        return (
            <div className='h-screen w-full bg-contain bg-center bg-no-repeat grid place-items-center' style={{ backgroundImage: `url(${logo})` }}>
                <h1 className='text-center py-3 text-3xl'>Thank You</h1>
            </div>
        );
    }

    return (
        <div className='min-h-screen w-full bg-contain bg-center bg-no-repeat grid place-items-center' style={{ backgroundImage: `url(${logo})` }}>
            <div className='py-10 overflow-y-auto w-full flex justify-center items-center'>
                <div className='min-w-[320px] shadow-lg border p-3 rounded-md backdrop-blur-sm'>
                    {queueToken === null && <p className='text-2xl text-center text-red-500 rounded-md py-2 bg-red-100'>Queue Not Found</p>}
                    {queueToken !== null && <form onSubmit={handleFeedback}>
                        <div className='rounded-md shadow-lg mb-5'>
                            <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Token No: {queueToken?.queue_token}</h2>
                            <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Remarks</h2>
                            <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                                <textarea
                                    className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500 resize-y min-h-[120px]'
                                    name='remarks'
                                    placeholder='Remarks'
                                    required
                                ></textarea>
                            </div>
                        </div>
                        <div className='rounded-md mb-5'>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='Excellent' className='sr-only peer' id='excellent' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:text-slate-50 peer-checked:shadow-none duration-300' htmlFor='excellent'>Excellent</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='Very Good' className='sr-only peer' id='very_good' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:text-slate-50 peer-checked:shadow-none duration-300' htmlFor='very_good'>Very Good</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='Good' className='sr-only peer' id='good' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:text-slate-50 peer-checked:shadow-none duration-300' htmlFor='good'>Good</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='Satisfactory' className='sr-only peer' id='satisfactory' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:text-slate-50 peer-checked:shadow-none duration-300' htmlFor='satisfactory'>Satisfactory</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='Unsatisfactory' className='sr-only peer' id='unsatisfactory' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:bg-green-500 peer-checked:text-slate-50 peer-checked:shadow-none duration-300' htmlFor='unsatisfactory'>Unsatisfactory</label>
                            </div>
                        </div>
                        <div className='pb-5'>
                            <button type='submit' className='px-5 w-full py-2 bg-violet-500 rounded text-slate-50'>Submit</button>
                        </div>
                    </form>
                    }
                </div>
            </div>
        </div >
    );
}

export default QueueFeedback;
