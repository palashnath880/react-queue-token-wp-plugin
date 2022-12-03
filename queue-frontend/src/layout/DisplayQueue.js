import React, { useContext, useRef, useState } from 'react';
import VideoPlayer from '../components/VideoPlayer/VideoPlayer';
import { QueueContext } from '../contexts/QueueContextProvider';
import DisplayCounters from '../components/DisplayCounters/DisplayCounters';
import DisplayNextQueue from '../components/DisplayNextQueue/DisplayNextQueue';
import RealTime from '../utilities/RealTime';

const DisplayQueue = () => {

    const { queueBranch } = useContext(QueueContext);
    const [isFullScreen, setIsFullScreen] = useState(false);
    const ref = useRef();

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
        <div className='h-screen w-full bg-blue-200' ref={ref}>
            <div className='flex h-full flex-col w-11/12 mx-auto overflow-hidden'>
                <div className='py-2 px-3 bg-violet-500 rounded-md text-slate-50'>
                    <h1 className='text-4xl text-center relative'>
                        <button onClick={isFullScreen ? closeFullScreen : fullScreenHandler} className='absolute left-0 top-1/2 -translate-y-1/2'>
                            {isFullScreen ? <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                            </svg> : <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                            </svg>
                            }
                        </button>
                        Welcome to {queueBranch?.branch_name}
                        <a href={queueBranch?.logout_url} className='absolute right-0 top-1/2 -translate-y-1/2 ' title='Log Out'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9" />
                            </svg>
                        </a>
                        <span className='absolute right-8 font-semibold text-2xl top-1/2 -translate-y-1/2'><RealTime /></span>
                    </h1>
                </div>
                <div className='flex-1 flex py-3'>
                    <div className='w-9/12 h-full'>
                        <div className='px-3 h-full'>
                            <div className='border-2 p-2 h-full rounded-lg bg-slate-300 overflow-hidden'>
                                <VideoPlayer />
                            </div>
                        </div>
                    </div>
                    <div className='w-3/12'>
                        <div className='px-3 border rounded-md h-full bg-violet-500 text-slate-50'>
                            <div className=''>
                                <h1 className='text-center text-3xl border-b-2 border-violet-500 py-3'>Running Token No</h1>
                                <DisplayCounters />
                            </div>
                        </div>
                    </div>
                </div>
                <div className='pb-3'>
                    <div className=' border flex items-center rounded-md border-violet-500'>
                        <div className='bg-violet-500 text-slate-50 rounded-md py-2 px-3'>
                            <span className='text-2xl'>Next Queues</span>
                        </div>
                        <div className='ml-2'>
                            <DisplayNextQueue />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DisplayQueue;
