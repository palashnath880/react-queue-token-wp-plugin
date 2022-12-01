import React, { useContext, useState } from 'react';
import toast from 'react-hot-toast';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Select from 'react-select';

const QueueForm = ({ products, setQueueCreator }) => {

    const [loading, setLoading] = useState(false);
    const [selectedProducts, setSelectedProducts] = useState([]);
    const { plugin_url, queueBranch } = useContext(QueueContext);


    const sendQueueToken = async (data, customer_mobile, customer_name) => {
        const message = `[1000FIX Service Ltd.] Hey ${customer_name}, Your token no is ${data?.queue_token}, Please wait for your turn. Thank you - ${queueBranch?.branch_name} - www.1000fix.com`;
        const res = await fetch(`http://188.138.41.146:7788/sendtext?apikey=${data?.api_key}&secretkey=${data?.secret_key}&callerID=${data?.caller_id}&toUser=${customer_mobile}&messageContent=${message}`);
        const resData = await res.json();
        return resData;
    }

    const queueCreateFormHandler = (event) => {

        event.preventDefault();
        const form = event.target;
        const service_type = form.service_type.value;
        const customer_type = form.customer_type.value;
        const customer_mobile = form.customer_mobile.value;
        const customer_name = form.customer_name.value;

        !service_type && toast.error('Please Select Service.');
        !customer_type && toast.error('Please Select Customer Category.');
        !customer_name && toast.error('Please Enter Customer Name.');

        if (customer_mobile.length !== 11) {
            toast.error('Please Select Valid Mobile Number');
            return;
        }

        if (selectedProducts.length <= 0) {
            toast.error('Please Select Product Type.');
            return;
        }

        if (!service_type || !customer_type || !customer_name) {
            return;
        }
        const selectProducts = selectedProducts.map(pro => pro.value);
        setLoading(true);
        const url = `${plugin_url}queue-manage.php`;
        const requestOptions = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'queue-creator': queueBranch?.id,
            },
            body: JSON.stringify({ service_type, productType: selectProducts, customer_type, customer_name, customer_mobile }),
        }

        fetch(url, requestOptions)
            .then(res => res.json())
            .then(data => {
                console.log(data);
                setLoading(false);
                if (data?.status === 'good') {
                    sendQueueToken(data, customer_mobile, customer_name);
                    setSelectedProducts([]);
                    toast.success(data?.message);
                    form.reset();
                    setQueueCreator(null);
                } else {
                    toast.error(data?.message);
                }
            })
            .catch(err => console.error(err));

    }

    const options = products.map(product => {
        return { value: product, label: product }
    });

    return (
        <>
            <form onSubmit={queueCreateFormHandler} className={`${loading ? 'pointer-events-none' : 'pointer-events-auto'} relative`}>
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
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Select Service Type</h2>
                    <div className='py-2 px-2 grid grid-cols-2 gap-2'>
                        <span className='flex-1'>
                            <input id='service_request' type='radio' className='sr-only peer' name='service_type' value='service_request' />
                            <label className='duration-300 text-center peer-checked:font-semibold block py-3 pl-3 border border-slate-300 rounded cursor-pointer peer-checked:bg-green-500 peer-checked:text-slate-50' htmlFor='service_request'>Service Request</label>
                        </span>
                        <span className='flex-1'>
                            <input id='service_delivery' type='radio' className='sr-only peer' name='service_type' value='service_delivery' />
                            <label className='duration-300 text-center peer-checked:font-semibold block py-3 pl-3 border border-slate-300 rounded cursor-pointer peer-checked:bg-green-500 peer-checked:text-slate-50' htmlFor='service_delivery'>Service Delivery</label>
                        </span>
                    </div>
                </div>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Select Customer Category</h2>
                    <div className='py-2 px-2 grid grid-cols-2 gap-2'>
                        <span className=''>
                            <input id='corporate' type='radio' className='sr-only peer' name='customer_type' value='corporate' />
                            <label className='duration-300 text-center peer-checked:font-semibold block py-3 pl-3 border border-slate-300 rounded cursor-pointer peer-checked:bg-green-500 peer-checked:text-slate-50' htmlFor='corporate'>Corporate</label>
                        </span>
                        <span className=''>
                            <input id='dealer' type='radio' className='sr-only peer' name='customer_type' value='dealer' />
                            <label className='duration-300 text-center peer-checked:font-semibold block py-3 pl-3 border border-slate-300 rounded cursor-pointer peer-checked:bg-green-500 peer-checked:text-slate-50' htmlFor='dealer'>Dealer</label>
                        </span>
                        <span className=''>
                            <input id='end_user' type='radio' className='sr-only peer' name='customer_type' value='end_user' />
                            <label className='duration-300 text-center peer-checked:font-semibold block py-3 pl-3 border border-slate-300 rounded cursor-pointer peer-checked:bg-green-500 peer-checked:text-slate-50' htmlFor='end_user'>End User</label>
                        </span>
                    </div>
                </div>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Select Product Type</h2>
                    <div className='py-2 px-2'>
                        <Select
                            options={options}
                            isMulti
                            value={selectedProducts}
                            onChange={(res) => setSelectedProducts(res)}
                            name='product_type'
                            placeholder='Select Product'
                            className="basic-multi-select"
                            classNamePrefix="select"
                        />
                    </div>
                </div>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Enter Your Mobile Number</h2>
                    <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                        <input className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500' type='tel' placeholder='Mobile Number' name='customer_mobile' required />
                    </div>
                </div>
                <div className='rounded-md shadow-lg mb-5'>
                    <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Enter Your Name</h2>
                    <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                        <input className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500' type='text' placeholder='Your Name' name='customer_name' required />
                    </div>
                </div>
                {loading && <div className='h-20 flex justify-center items-center'>
                    <span className='block w-8 h-8 rounded-full border-2 border-gray-600 border-t-slate-300 animate-spin'></span>
                </div>}
                <div className='flex gap-4 justify-end'>
                    <button disabled={loading ? true : false} type='reset' className='px-5 py-2 bg-red-500 rounded-md text-slate-50'>Cancel</button>
                    <button disabled={loading ? true : false} type='submit' className='px-5 py-2 bg-violet-500 rounded-md text-slate-50'>Submit</button>
                </div>
            </form>
        </>
    );
}

export default QueueForm;
