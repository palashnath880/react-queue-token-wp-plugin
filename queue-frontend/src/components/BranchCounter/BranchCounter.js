import React, { useContext, useState } from 'react';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/solid'
import ForgetPassword from '../ForgetPassword/ForgetPassword';
import { QueueContext } from '../../contexts/QueueContextProvider';
import toast from 'react-hot-toast';

const BranchCounter = () => {

    const { plugin_url, queueBranch, counters, setCounters } = useContext(QueueContext);

    const [isPwdShow, setIsPwdShow] = useState(false);
    const [pwd, setPwd] = useState('');
    const [resetPwd, setResetPwd] = useState(null);
    const [loading, setLoading] = useState(false);

    const generatePwd = () => {
        const str = "0123456789abcdefghijklmnopqrstuvwxyz!@#$%^&*()+";
        const min = 0;
        const max = str.length - 1;
        let randomPwd = '';
        for (let i = 0; i <= 12; i++) {
            const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
            randomPwd += str[randomNumber];
        }
        setPwd(randomPwd);
    }

    const createCounterHandler = (event) => {
        event.preventDefault();
        const form = event.target;
        const counter_name = form.counter_name.value;
        const counter_email = form.counter_email.value;
        const counter_pwd = form.counter_pwd.value;
        const counter_type = form.counter_type.value;

        const url = `${plugin_url}queue-manage.php`;

        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Create-Queue': queueBranch?.id,
            },
            body: JSON.stringify({ counter_name, counter_email, counter_pwd, counter_type }),
        }
        setLoading(true);
        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoading(false);
                if (data?.status === 'bad') {
                    toast.error(data?.message);
                } else if (data?.status === 'good') {
                    toast.success(data?.message);
                    form.reset();
                    setCounters(data?.counters);
                }
            })
            .catch(err => console.error(err));
    }

    return (
        <div className='flex gap-2'>
            <div className='w-1/2'>
                <form onSubmit={createCounterHandler} className='shadow-lg py-4 px-2 rounded-lg border border-slate-300'>
                    <div className='shadow-lg p-2 mb-3'>
                        <label className='block mb-2 pl-1' htmlFor='counter_type'>Type</label>
                        <select name='counter_type' id='counter_type' className='px-2 py-2 w-full border rounded focus:outline-violet-500'>
                            <option value='queue_counter'>Counter</option>
                            <option value='queue_creator'>Token Creator</option>
                            <option value='queue_display'>Token Display</option>
                        </select>
                    </div>
                    <div className='shadow-lg p-2 mb-3'>
                        <label className='block mb-2 pl-1' htmlFor='counter_name'>Counter Name</label>
                        <input
                            type='text'
                            name='counter_name'
                            placeholder='Enter Counter Name'
                            id='counter_name'
                            className='px-2 py-2 w-full border rounded focus:outline-violet-500'
                            required
                        />
                    </div>
                    <div className='shadow-lg p-2 mb-3'>
                        <label className='block mb-2 pl-1' htmlFor='counter_email'>Counter Email</label>
                        <input
                            type='email'
                            name='counter_email'
                            placeholder='Enter Counter Email'
                            id='counter_email'
                            className='px-2 py-2 w-full border rounded focus:outline-violet-500'
                            required
                        />
                    </div>
                    <div className='shadow-lg p-2 mb-3'>
                        <label className='block mb-2 pl-1' htmlFor='counter_pwd'>Password</label>
                        <div className='flex gap-2 items-center'>
                            <input
                                type={isPwdShow ? 'text' : 'password'}
                                name='counter_pwd'
                                placeholder='Password'
                                id='counter_pwd'
                                onChange={(e) => setPwd(e.target.value)}
                                value={pwd}
                                className='px-2 py-2 flex-1 border rounded focus:outline-violet-500'
                                required
                            />
                            {
                                isPwdShow ?
                                    <EyeSlashIcon className='h-5 w-5 cursor-pointer' onClick={() => setIsPwdShow(!isPwdShow)} /> :
                                    <EyeIcon className='h-5 w-5 cursor-pointer' onClick={() => setIsPwdShow(!isPwdShow)} />
                            }

                            <button type='button' onClick={generatePwd} className='py-2 px-4 bg-violet-500 text-slate-50'>Generate Password</button>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button disabled={loading ? true : false} className='w-full border border-violet-500 rounded-md bg-violet-500 py-2 font-semibold text-slate-50 hover:bg-transparent hover:text-gray-700 duration-300'>Create Counter</button>
                    </div>
                </form>
            </div >
            <div className='w-1/2'>
                <div className='px-2 py-4 shadow-lg rounded-lg border border-slate-300 '>
                    {counters !== null && (
                        counters.length > 0 ? counters.map((counter, index) =>
                            <div key={index} className='rounded-md p-2 border mb-2 '>
                                <h2 className='text-xl flex justify-between items-center'>
                                    {counter?.counter_name}
                                    <span className='text-lg'>Create: <small>{counter?.registered_date}</small></span>
                                </h2>
                                <p className='mt-1'>Counter User Name: <small>{counter?.counter_login}</small></p>
                                <p>Counter Email: <small><a href='mailto:palashnath880@gmail.com'>{counter?.counter_email}</a></small></p>
                                <p className='mt-2'>
                                    <button onClick={() => setResetPwd(counter)} className='px-4 py-1 rounded duration-300 border border-violet-500 hover:bg-transparent bg-violet-500 text-slate-50 hover:text-gray-700'>Forget Password</button>
                                </p>
                            </div>)
                            :
                            <div class="bg-red-100 rounded-lg py-3 text-xl text-red-700 text-center" role="alert">
                                No Counter Found
                            </div>
                    )}

                </div>
            </div>
            {resetPwd !== null && <ForgetPassword closeModal={setResetPwd} />}
        </div >
    );
}

export default BranchCounter;
