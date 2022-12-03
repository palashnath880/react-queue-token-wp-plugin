import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Button from '../Button/Button';
import { useDetectClickOutside } from 'react-detect-click-outside';

const CounterBodySideBar = (props) => {

    const {
        remarks,
        queueToken,
        setQueueToken,
        breakTime,
        setBreakTime,
        setLoading,
        loading,
        counterHandler,
        quantity,
        soField,
        productRec
    } = props;

    const [counters, setCounters] = useState([]);
    const [transferQueue, setTransferQueue] = useState(null);
    const [breakMenuOpen, setBreakMenuOpen] = useState(false);
    const { queueBranch, plugin_url } = useContext(QueueContext);

    const ref = useDetectClickOutside({ onTriggered: () => setBreakMenuOpen(false) });

    //handle recall function
    const reCallQueue = async () => {
        const res = await fetch(`${plugin_url}queue-counter-manage.php`, {
            method: 'POST',
            headers: {
                'QUEUE_RECALL_TOKEN': `${queueBranch?.queue_name} Token Number ${queueToken?.queue_token}`,
                'QUEUE_BRANCH_ID': queueBranch?.branch_id,
            }
        });
        const data = await res.json();
        console.log(data);
    }

    // handle break time
    const handleBreak = (reason) => {
        setLoading(true);
        fetch(`${plugin_url}queue-counter-manage.php`, {
            method: 'POST',
            headers: { 'Queue-Break': true },
            body: JSON.stringify({ reason, status: 'break' })
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                setBreakMenuOpen(false);
                setBreakTime(data);
            })
            .catch(err => console.error(err));
    }

    //handle pause 
    const handlePause = () => {
        setLoading(true);
        fetch(`${plugin_url}queue-counter-manage.php?id=${breakTime?.id}`, {
            method: 'PATCH',
            headers: { 'Queue-Pause': true }
        })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data?.status === 'good') {
                    setBreakTime(null);
                } else {
                    toast.error(data?.message);
                }
            })
            .catch(err => console.error(err));
    }

    // update queue status
    const handleQueueStatus = (queueID, status) => {
        const url = `${plugin_url}queue-counter-manage.php?queue_id=${queueID}`;
        fetch(url, { method: 'PATCH', body: JSON.stringify({ remarks, quantity, soField, productRec, status }) })
            .then(res => res.json())
            .then(data => {
                if (data?.status === 'good') {
                    setQueueToken(null);
                } else {
                    toast.error('Something Went Wrong. Please Try Again');
                }
            })
            .catch(err => console.error(err));
    }

    // counter transfer
    const handleCounterTransfer = (e) => {
        e.preventDefault();
        const form = e.target;
        const selectCounter = form.counter.value;
        const url = `${plugin_url}queue-counter-manage.php?queue_id=${queueToken?.id}&transfer_counter=${selectCounter}`;
        fetch(url, { method: 'PATCH' })
            .then(res => res.json())
            .then(data => {
                if (data?.status == 'good') {
                    toast.success(data?.message);
                    setTransferQueue(null);
                    setQueueToken(null);
                } else {
                    toast.error(data?.message);
                }
            })
            .catch(err => console.error(err));
    }

    // counter logout
    const logOutHandler = () => {
        window.location.href = queueBranch?.logout_url;
    }

    useEffect(async () => {

        const url = `${plugin_url}queue-counter-manage.php?branch_id=${queueBranch?.branch_id}`;
        fetch(url, { headers: { get_all_counter: 'queue_counter' } })
            .then(res => res.json())
            .then(data => {
                const deleteThisCounter = data?.counters.filter(counter => counter.counter_id != queueBranch?.queue_id);
                setCounters(deleteThisCounter);
            })

    }, []);

    return (
        <>
            <div className={`flex flex-col gap-2 ${queueToken !== null ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'} `}>
                <div className='flex-1'>
                    <Button onClick={() => handleQueueStatus(queueToken?.id, 'close')}>Next</Button>
                </div>
                <div className='flex-1'>
                    <Button onClick={() => reCallQueue()}>Re Call</Button>
                </div>
                <div className='flex-1'>
                    <Button onClick={() => handleQueueStatus(queueToken?.id, 'customer_missing')}>Customer Missing</Button>
                </div>
                <div className='flex-1'>
                    <Button onClick={() => setTransferQueue(queueToken)}>Counter Transfer</Button>
                </div>
            </div>

            <div className={`flex flex-col gap-2 mt-2`}>
                <div className={`flex-1 relative ${breakTime === null ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'} `} ref={ref}>
                    <Button onClick={() => setBreakMenuOpen(!breakMenuOpen)}>Break</Button>
                    <div className={`absolute bottom-full right-0 mb-2 shadow-lg w-52 z-50 ${breakMenuOpen ? 'visible opacity-100' : 'invisible opacity-0'}`}>
                        <div className='bg-zinc-50 rounded-md border border-gray-400 p-3 flex flex-wrap gap-2 justify-center'>
                            <Button disabled={loading ? true : false} onClick={() => handleBreak('Prayer')} className='w-auto px-2 rounded-md'>Prayer</Button>
                            <Button disabled={loading ? true : false} onClick={() => handleBreak('Lunch')} className='w-auto px-2 rounded-md'>Lunch</Button>
                            <Button disabled={loading ? true : false} onClick={() => handleBreak('Washroom')} className='w-auto px-2 rounded-md'>Washroom</Button>
                            <Button disabled={loading ? true : false} onClick={() => handleBreak('Snacks')} className='w-auto px-2 rounded-md'>Snacks</Button>
                        </div>
                    </div>
                </div>
                <div className={`flex-1 ${breakTime !== null ? 'opacity-100 pointer-events-auto' : 'opacity-40 pointer-events-none'}`}>
                    <Button disabled={loading ? true : false} onClick={handlePause}>Pause</Button>
                </div>
                <div className='flex-1'>
                    <Button onClick={logOutHandler}>Log Out</Button>
                </div>
            </div>

            {/* Counter Transfer Modal */}
            {transferQueue !== null && <div className='fixed top-0 left-0 h-screen w-full' style={{ background: 'linear-gradient(#00000075, #00000075)' }}>
                <div className='h-full w-full flex justify-center items-center'>
                    <div className='w-96 p-3 rounded-md bg-slate-50'>
                        <form onSubmit={handleCounterTransfer}>
                            <h2 className='text-center border-b pb-3 text-xl'>Transfer Queue Token: <span className='font-semibold'>{transferQueue?.queue_token}</span></h2>
                            <div className='mb-3'>
                                <label htmlFor='counter' className='block'>Counter</label>
                                <select id='counter' name='counter' className='w-full cursor-pointer border border-gray-300 focus:outline-none py-2' >
                                    {counters && counters.map(counter => <option key={counter?.counter_id} value={counter?.counter_id}>{counter?.counter_name}</option>)}
                                </select>
                            </div>
                            <button type='submit' className='px-4 mr-2 py-2 bg-violet-500 border-2 border-violet-500 text-slate-50'>Transfer</button>
                            <button onClick={() => setTransferQueue(null)} type='button' className='px-4 py-2 border-2 border-gray-300'>Cancel</button>
                        </form>
                    </div>
                </div>
            </div>
            }
        </>
    );
}

export default React.memo(CounterBodySideBar);
