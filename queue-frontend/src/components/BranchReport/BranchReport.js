import React, { useContext, useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { QueueContext } from '../../contexts/QueueContextProvider';
import toast from 'react-hot-toast';

const BranchReport = () => {

    const { queueBranch, plugin_url, counters } = useContext(QueueContext);
    const [loading, setLoading] = useState(false);

    const branchReportHandler = (event) => {
        event.preventDefault();
        const form = event.target;
        const counter_id = form.counter.value;
        const from_date = form.from_date.value;
        const to_date = form.to_date.value;
        if (counter_id == 0) {
            toast.error('Please Select Counter.');
            return;
        }
        setLoading(true);

        const url = `${plugin_url}queue-manage.php?queue_id=${queueBranch?.id}&from_date=${from_date}&to_date=${to_date}`;
        fetch(url)
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.error(err));
    }

    return (
        <div>
            <div className='border-b-2 border-gray-300 pb-4'>
                <h2 className='pb-3 text-2xl text-center border-b'>Queue Branch Report</h2>
                <form onSubmit={branchReportHandler} className='mt-3'>
                    <div className='grid gap-2 grid-cols-3'>
                        <div className=''>
                            <label htmlFor='counter' className='block mb-2'>Counter</label>
                            <select name='counter' id='counter' className='px-2 py-2 w-full rounded border border-gray-300 focus:outline-0 cursor-pointer focus:border-violet-500'>
                                {counters !== null && (
                                    counters.length > 0 ? <>
                                        <option value='0'>Select Counter </option>
                                        {counters.map((counter, index) => counter?.counter_type == 'queue_counter' && <option option key={index} value={counter?.counter_id}>{counter?.counter_name}</option>)}
                                    </> :
                                        <option value='0'>No Counter Found</option>
                                )}
                            </select>
                        </div>
                        <div className=''>
                            <label htmlFor='from_date' className='block mb-2'>From Date</label>
                            <input name='from_date' id='from_date' type='date' className='px-2 py-2 w-full rounded border border-gray-300 focus:outline-0 cursor-pointer focus:border-violet-500' required />
                        </div>
                        <div className=''>
                            <label htmlFor='to_date' className='block mb-2'>To Date</label>
                            <input name='to_date' id='to_date' type='date' className='px-2 py-2 w-full rounded border border-gray-300 focus:outline-0 cursor-pointer focus:border-violet-500' required />
                        </div>
                    </div>
                    <div className='mt-2'>
                        <button disabled={loading ? true : false} type='submit' className='flex py-2 justify-center rounded mx-auto text-slate-50 items-center gap-2 bg-violet-500 w-[300px]'>
                            <MagnifyingGlassIcon className='w-5 h-5' />
                            Search
                        </button>
                    </div>
                </form>
            </div >
            {loading && <div className='h-[200px] flex justify-center items-center'>
                <span className='block w-10 h-10 rounded-full border-4 border-gray-700 border-t-slate-100 animate-spin'></span>
            </div>}
            <div className='mt-5 border border-gray-300'>
                <table className='table w-full border-collapse'>
                    <thead>
                        <tr>
                            <th className='border border-gray-300 py-2'>Branch</th>
                            <th className='border border-gray-300 py-2'>Counter</th>
                            <th className='border border-gray-300 py-2'>Service Type</th>
                            <th className='border border-gray-300 py-2'>Customer Type</th>
                            <th className='border border-gray-300 py-2'>Customer Name</th>
                            <th className='border border-gray-300 py-2'>Phone</th>
                            <th className='border border-gray-300 py-2'>Product</th>
                            <th className='border border-gray-300 py-2'>Issue D & T </th>
                            <th className='border border-gray-300 py-2'>Start D & T </th>
                            <th className='border border-gray-300 py-2'>Closed D & T </th>
                            <th className='border border-gray-300 py-2'>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className='text-center'>
                            <td className='border border-gray-300 py-2'>Branch</td>
                            <td className='border border-gray-300 py-2'>Counter</td>
                            <td className='border border-gray-300 py-2'>Service Type</td>
                            <td className='border border-gray-300 py-2'>Customer Type</td>
                            <td className='border border-gray-300 py-2'>Customer Name</td>
                            <td className='border border-gray-300 py-2'>Phone</td>
                            <td className='border border-gray-300 py-2'>Product</td>
                            <td className='border border-gray-300 py-2'>Issue D & T </td>
                            <td className='border border-gray-300 py-2'>Start D & T </td>
                            <td className='border border-gray-300 py-2'>Closed D & T </td>
                            <td className='border border-gray-300 py-2'>Status</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div >
    );
}

export default BranchReport;
