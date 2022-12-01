import React, { useContext, useRef, useState } from 'react';
import QueryQueue from '../components/QueryQueue/QueryQueue';
import QueueForm from '../components/QueueForm/QueueForm';
import { QueueContext } from '../contexts/QueueContextProvider';
import logo from '../images/logo.png';

const CreateQueue = () => {

    const { queueBranch } = useContext(QueueContext);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const ref = useRef();
    const [queueCreator, setQueueCreator] = useState(null);

    const fullScreenHandler = () => {
        if (ref.current.requestFullscreen) {
            ref.current.requestFullscreen();
        } else if (ref.current.webkitRequestFullscreen) { /* Safari */
            ref.current.webkitRequestFullscreen();
        } else if (ref.current.msRequestFullscreen) { /* IE11 */
            ref.current.msRequestFullscreen();
        }
        setIsFullScreen(true);
    }

    const closeFullScreen = () => {
        if (document.exitFullscreen) {
            document.exitFullscreen();
        } else if (ref.current.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
        }
        setIsFullScreen(false);
    }

    return (
        <div
            className='bg-slate-50 min-h-screen py-10 overflow-y-auto grid place-items-center bg-contain bg-center bg-no-repeat'
            ref={ref}
            style={{ backgroundImage: `url(${logo})` }}
        >
            <div className='h-full w-full flex justify-center items-center'>
                <div className='min-w-[440px] px-3 py-4 rounded-md border border-slate-300 shadow-lg'>
                    {queueCreator === null ? <>
                        <div>
                            <button
                                onClick={() => setQueueCreator(<QueueForm products={queueBranch?.queue_products} setQueueCreator={setQueueCreator} />)}
                                className='w-full rounded-md bg-violet-500 text-slate-50 py-2 text-lg mb-2 font-semibold'
                            >Get Service</button>
                            <button
                                onClick={() => setQueueCreator(<QueryQueue setQueueCreator={setQueueCreator} />)}
                                className='w-full rounded-md bg-violet-500 text-slate-50 py-2 text-lg mb-2 font-semibold'
                            >Query</button>
                        </div>
                    </> :
                        queueCreator
                    }
                    {/* <QueueForm products={queueBranch?.queue_products} /> */}
                </div>
                {/* Log out button */}
                <a href={queueBranch?.logout_url} className='fixed top-[20px] left-[20px]' title='Log Out'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                    </svg>
                </a>
                {/* full screen control button */}
                <button onClick={isFullScreen ? closeFullScreen : fullScreenHandler} className='fixed top-[20px] right-[20px]'>
                    {isFullScreen ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                    </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                    </svg>
                    }

                </button>
            </div>
        </div>
    );
}

export default CreateQueue;
