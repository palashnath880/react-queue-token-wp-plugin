import React, { useContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import CounterBody from '../../components/CounterBody/CounterBody';
import CounterHeader from '../../components/CounterHeader/CounterHeader';
import Loader from '../../components/Loader/Loader';
import { QueueContext } from '../../contexts/QueueContextProvider';

const Counter = () => {
    const [counterStatus, setCounterStatus] = useState(false);
    const [loading, setLoading] = useState(true);
    const { plugin_url, queueBranch } = useContext(QueueContext);
    const [queueToken, setQueueToken] = useState(null);

    const counterHandler = (counterID, status) => {
        const url = `${plugin_url}queue-counter-manage.php?counter_id=${counterID}&counter_status=${status}`;
        setLoading(true);
        fetch(url, { method: 'PATCH' })
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                if (data?.status === 'good') {
                    data?.counter_status == 'on' && setCounterStatus(true);
                    data?.counter_status == 'off' && setCounterStatus(false);
                } else {
                    toast.error(data?.message);
                }
            })
            .catch(err => console.error(err));
    }

    useEffect(() => {

        const url = `${plugin_url}queue-counter-manage.php?counter_id=${queueBranch?.id}`;

        fetch(url)
            .then(res => res.json())
            .then(data => {
                setLoading(false);
                data?.counter_status == 'on' && setCounterStatus(true);
                data?.counter_status == 'off' && setCounterStatus(false);
            })
            .catch(err => console.error(err));

    }, [queueBranch]);

    return (
        <div className='h-screen w-full'>
            <div className='h-full w-full flex flex-col'>
                {/* Counter Header Start */}
                <CounterHeader
                    loading={loading}
                    counterStatus={counterStatus}
                    counterHandler={counterHandler}
                    queueToken={queueToken}
                />
                {/* Counter Header End */}
                {loading ? <Loader /> :
                    <CounterBody
                        counterStatus={counterStatus}
                        counterLoading={loading}
                        counterHandler={counterHandler}
                        queueToken={queueToken}
                        setQueueToken={setQueueToken}
                    />}
            </div>
        </div>
    );
}

export default Counter;
