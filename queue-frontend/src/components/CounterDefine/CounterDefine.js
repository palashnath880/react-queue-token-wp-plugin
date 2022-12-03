import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Loader from '../Loader/Loader';

const CounterDefine = () => {

    const [defineCustomer, setDefineCustomer] = useState(null);
    const [defineCustomerCounter, setDefineCustomerCounter] = useState(null);
    const [defineProduct, setDefineProduct] = useState(null);
    const [defineProductCounter, setDefineProductCounter] = useState(null);
    const [loading, setLoading] = useState(true);
    const { plugin_url, queueBranch } = useContext(QueueContext);

    const counters = queueBranch?.counters &&
        queueBranch.counters.filter(counter => counter.counter_type == 'queue_counter')
            .map(counter => {
                return { value: counter.counter_id, label: counter.counter_name };
            });

    const customerType = [
        { value: 'corporate', label: 'Corporate' },
        { value: 'end_user', label: 'End User' },
        { value: 'dealer', label: 'Dealer' },
    ];

    const products = queueBranch?.queue_products && queueBranch.queue_products.map(item => {
        return { value: item, label: item };
    });

    const handleDefineCounter = () => {

        const updateData = {
            defineCustomer: defineCustomer?.value || null,
            defineCustomerCounter: defineCustomerCounter?.value || null,
            defineProduct: defineProduct?.value || null,
            defineProductCounter: defineProductCounter?.value || null
        };

        const toastId = toast.loading('Updating');
        fetch(`${plugin_url}queue-manage.php`, {
            method: 'PATCH',
            headers: {
                'update_define_counter': 'true'
            },
            body: JSON.stringify(updateData)
        })
            .then(res => res.json())
            .then(() => {
                toast.dismiss(toastId);
                toast.success('Update Successfully');
            })
            .catch(err => {
                toast.dismiss(toastId);
                console.error(err);
            });
    }

    useEffect(() => {
        fetch(`${plugin_url}queue-manage.php`, {
            headers: {
                'get-counter-define': 'true'
            }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status === 'good') {
                    setDefineCustomer(customerType.find(item => item.value == data?.define_customer));
                    setDefineCustomerCounter(counters.find(counter => counter.value == data?.define_customer_counter));
                    setDefineProduct(products.find(item => item.value == data?.define_product));
                    setDefineProductCounter(counters.find(counter => counter.value == data?.define_product_counter));
                }
                setLoading(false);
            })
            .catch(err => console.error(err));
    }, []);

    if (loading) {
        return <div className=''><Loader /></div>;
    }

    return (
        <div className=''>
            <h1 className='text-center pb-3 border-b text-2xl'>Counter Define</h1>
            <div className='py-5'>
                <div className='p-2 shadow-lg'>
                    <div className='mb-2 flex gap-4'>
                        <div className='flex-1'>
                            <label htmlFor='defineCustomer' className='block'>Select Customer Type</label>
                            <Select
                                options={customerType}
                                placeholder='Select Customer Type'
                                name='defineCustomer'
                                isClearable={true}
                                onChange={(e) => setDefineCustomer(e)}
                                defaultValue={defineCustomer}
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor='defineCustomerCounter' className='block'>Customer Type Counter </label>
                            <Select
                                options={counters.filter(counter => counter.value !== defineProductCounter?.value)}
                                placeholder='Select Customer Type Counter'
                                name='defineCustomerCounter'
                                isClearable={true}
                                onChange={(e) => setDefineCustomerCounter(e)}
                                defaultValue={defineCustomerCounter}
                            />
                        </div>
                    </div>
                    <div className='mb-2 flex gap-4'>
                        <div className='flex-1'>
                            <label htmlFor='defineProduct' className='block'>Select Product Type</label>
                            <Select
                                options={products}
                                placeholder='Select Product Type'
                                name='defineProduct'
                                isClearable={true}
                                onChange={(e) => setDefineProduct(e)}
                                defaultValue={defineProduct}
                            />
                        </div>
                        <div className='flex-1'>
                            <label htmlFor='defineProductCounter' className='block'>Product Type Counter </label>
                            <Select
                                options={counters.filter(counter => counter.value !== defineCustomerCounter?.value)}
                                placeholder='Select Product Type Counter'
                                name='defineProductCounter'
                                isClearable={true}
                                onChange={(e) => setDefineProductCounter(e)}
                                defaultValue={defineProductCounter}
                            />
                        </div>
                    </div>
                    <div className='mt-4'>
                        <button onClick={handleDefineCounter} className='w-full bg-violet-500 py-2 text-slate-50'>Update Define Counter</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CounterDefine;
