import React, { useContext, useEffect, useState } from 'react';
import CounterBodySideBar from '../CounterBodySideBar/CounterBodySideBar';
import logo from '../../images/logo.png';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Countdown from 'react-countdown';

const CounterBody = ({ counterStatus, counterLoading, counterHandler, queueToken, setQueueToken }) => {

    const [transferredToken, setTransferredToken] = useState(null);
    const [loading, setLoading] = useState(false);
    const [waitingTime, setWaitingTime] = useState(null);
    const [remarks, setRemarks] = useState('');
    const [quantity, setQuantity] = useState(null);
    const [soField, setSoField] = useState('');
    const [productRec, setProductRec] = useState(false);
    const { plugin_url, queueBranch } = useContext(QueueContext);
    const [breakTime, setBreakTime] = useState(null);

    const formatDate = (date) => {
        const dt = new Date(date);
        return dt.toLocaleTimeString();
    }

    const getQueueToken = () => {
        const url = `${plugin_url}queue-counter-manage.php?counter_id=${queueBranch?.id}&branch_id=${queueBranch?.branch_id}`;
        fetch(url, {
            headers: { 'GET_QUEUE_TOKEN': queueBranch?.id }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status === 'good') {
                    setQueueToken(data?.queue_token);
                }
            })
            .catch(err => console.error(err));
    }

    const getTransferredQueueToken = () => {
        const url = `${plugin_url}queue-counter-manage.php?cou_id=${queueBranch?.id}&bra_id=${queueBranch?.branch_id}`;
        fetch(url, {
            headers: { 'GET_TRANSFERRED_QUEUE_TOKEN': queueBranch?.id }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status === 'good') {
                    setTransferredToken(data?.queue_token);
                }
            })
            .catch(err => console.error(err));
    }

    const waitingTimeFunc = (date) => {

        const startDate = new Date(date);
        const cuDate = new Date();
        const duration = cuDate.getTime() - startDate.getTime();

        let seconds = Math.floor((duration / 1000) % 60),
            minutes = Math.floor((duration / (1000 * 60)) % 60),
            hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

        hours = (hours < 10) ? "0" + hours : hours;
        minutes = (minutes < 10) ? "0" + minutes : minutes;
        seconds = (seconds < 10) ? "0" + seconds : seconds;

        setWaitingTime(`${hours}:${minutes}:${seconds}`);

    }

    // break time count down
    const countdownRender = ({ hours, minutes, seconds }) => {
        return <div className='text-center'>
            <h2 className='font-semibold text-3xl'>Breaking Time</h2>
            <h1 className='text-4xl font-bold'>{hours}:{minutes}:{seconds}</h1>
        </div>
    }

    // TODO : Onbeforeunload add eventlistener
    // "2022-11-18 16:59:00"
    // "2022-11-18 16:59:00"

    useEffect(() => {
        // set interval function
        let interval;
        interval = setInterval(() => {

            if (breakTime === null || counterStatus) {
                transferredToken === null && counterStatus && getTransferredQueueToken();
                transferredToken !== null && queueToken === null && counterStatus && setQueueToken(transferredToken);
                queueToken === null && transferredToken == null && counterStatus && getQueueToken();
                transferredToken !== null && queueToken === null && counterStatus && setQueueToken(transferredToken);
                queueToken !== null && counterStatus && waitingTimeFunc(queueToken?.start_date);
            }

        }, 1000);

        return () => clearInterval(interval);
    }, [queueToken, counterStatus]);

    return (
        <div className={`flex-1 h-full w-full p-2 relative ${counterLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
            {/* overly */}
            {counterStatus === false && <div className='h-full w-full absolute top-0 right-0'>
                <div className='flex justify-center items-center h-full w-full bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url(${logo})` }}>
                    <h1 className='text-3xl font-semibold'>Counter Off</h1>
                </div>
            </div>}
            {counterStatus && <div className='flex h-full gap-2'>
                <div className='w-10/12 bg-zinc-50 border-2 border-gray-200 p-2 rounded-lg bg-contain bg-center bg-no-repeat' style={{ backgroundImage: `url(${logo})` }}>
                    {/* Break time */}
                    {breakTime !== null &&
                        <div className='h-full w-full flex justify-center items-center'>
                            <Countdown
                                date={Date.now() + (parseInt(breakTime?.time) * 1000)}
                                daysInHours={true}
                                renderer={countdownRender}
                            />
                        </div>
                    }
                    {/* Waiting Token */}
                    {queueToken === null &&
                        (breakTime === null &&
                            <div className='h-full w-full flex justify-center items-center'>
                                <h1 className='text-3xl text-center py-4'>Waiting Token </h1>
                            </div>
                        )
                    }

                    {queueToken !== null &&
                        <table className='w-full table border-collapse'>
                            <tbody>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Token No <span className='font-bold'>:</span></td>
                                    <td className='py-2'>{queueToken?.queue_token}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Service Type<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{queueToken?.service_type}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Products Type<span className='font-bold'>:</span></td>
                                    <td className='py-2'>
                                        {queueToken?.product_type.map((pro, index) => <span key={index} className='mr-2 border border-gray-600 px-2'>{pro}</span>)}
                                    </td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Waiting Token<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{queueToken?.waiting_token}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Issue Time<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{formatDate(queueToken?.issue_date)}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Start Time<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{formatDate(queueToken?.start_date)}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Waiting Time<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{waitingTime}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Customer Name<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{queueToken?.cus_name}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Customer Mobile<span className='font-bold'>:</span></td>
                                    <td className='py-2'>{queueToken?.cus_mobile}</td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>SO<span className='font-bold'>:</span></td>
                                    <td className='py-2'>
                                        <input onChange={(e) => setSoField(e.target.value)} defaultValue={soField} className={`w-full rounded-md py-2 px-2 border-2 border-gray-300 ${productRec ? 'pointer-events-auto' : 'pointer-events-none'} `} type={'text'} name='so_field' />
                                    </td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Product Received<span className='font-bold'>:</span></td>
                                    <td className='py-2'>
                                        <input
                                            onChange={(e) => {
                                                if (e.target.checked == false) {
                                                    setSoField('');
                                                }
                                                setProductRec(e.target.checked);
                                            }}
                                            className='rounded-md py-2 px-2 peer'
                                            type='checkbox'
                                            name='product_rec'
                                        />
                                    </td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Quantity<span className='font-bold'>:</span></td>
                                    <td className='py-2'>
                                        <input onChange={(e) => setQuantity(e.target.value)} className='w-full rounded-md py-2 px-2 border-2 border-gray-300' type={'number'} name='quantity' />
                                    </td>
                                </tr>
                                <tr className='border-b border-slate-300'>
                                    <td className='py-2 pr-2 flex justify-between'>Remarks<span className='font-bold'>:</span></td>
                                    <td className='py-2'>
                                        <textarea onChange={(e) => setRemarks(e.target.value)} className='w-full px-2 py-2 rounded-md focus:outline-violet-500 resize-y border-2 border-gray-300' placeholder='Write Remarks .....'></textarea>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    }
                </div>
                {/* Sidebar */}
                <div className='w-2/12 bg-zinc-50 border-2 border-gray-200 p-2 rounded-lg'>
                    <CounterBodySideBar
                        remarks={remarks}
                        quantity={quantity}
                        productRec={productRec}
                        soField={soField}
                        queueToken={queueToken}
                        setQueueToken={setQueueToken}
                        loading={loading}
                        setLoading={setLoading}
                        breakTime={breakTime}
                        setBreakTime={setBreakTime}
                        counterHandler={counterHandler}
                    />
                </div>
            </div>}
        </div>
    );
}

export default CounterBody;
