import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import Select from 'react-select';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Loader from '../Loader/Loader';

const CounterDefine = () => {

    const [printerCounter, setPrinterCounter] = useState(null);
    const [corporateCounter, setCorporateCounter] = useState(null);
    const [loading, setLoading] = useState(true);
    const [options, setOptions] = useState([]);
    const { plugin_url } = useContext(QueueContext);

    const handleDefineCounter = () => {
        const toastId = toast.loading('Updating');
        fetch(`${plugin_url}queue-manage.php`, {
            method: 'PATCH',
            headers: {
                'update_define_counter': 'true'
            },
            body: JSON.stringify({ printerCounter, corporateCounter })
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
                    setCorporateCounter(data?.corporate_counter);
                    setPrinterCounter(data?.printer_counter);
                    let counters = [];
                    data?.counters.map((counter) => {
                        if (counter?.counter_type == 'queue_counter') {
                            counters.push({ value: counter?.counter_id, label: counter?.counter_name });
                        }
                    });
                    setOptions(counters);
                    setLoading(false);
                }
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
                <div className='mx-auto lg:w-1/2 p-2 shadow-lg'>
                    <div className='mb-2'>
                        <label htmlFor='printerCounter' className='block'>Printer Counter </label>
                        <Select
                            options={options}
                            placeholder='Select Printer Counter'
                            name='printerCounter'
                            isClearable={true}
                            onChange={(e) => setPrinterCounter(e ? e.value : 0)}
                            defaultValue={() => options.filter(cou => cou.value == printerCounter)}
                        />
                    </div>
                    <div className='mb-2'>
                        <label htmlFor='corporateCounter' className='block'>Corporate Counter </label>
                        <Select
                            options={options}
                            placeholder='Select Corporate Counter '
                            name='corporateCounter'
                            isClearable={true}
                            onChange={(e) => setCorporateCounter(e ? e.value : 0)}
                            defaultValue={() => options.filter(cou => cou.value == corporateCounter)}
                        />
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
