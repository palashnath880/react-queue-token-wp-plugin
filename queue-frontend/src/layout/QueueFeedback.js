import React from 'react';

const QueueFeedback = () => {
    return (
        <div className='h-screen w-full'>
            <div className='py-10 overflow-y-auto w-full flex justify-center items-center'>
                <div className='min-w-[320px] shadow-lg border p-3 rounded-md'>
                    <form className=''>
                        <div className='rounded-md shadow-lg mb-5'>
                            <h2 className='text-center text-xl pb-3 border-b border-slate-300'>Remarks</h2>
                            <div className='py-2 px-2 grid grid-cols-1 gap-2'>
                                <textarea
                                    className='py-2 pl-3 border border-slate-300 rounded-md focus:outline-violet-500 resize-y min-h-[120px]'
                                    name='remarks'
                                    placeholder='Remarks'
                                ></textarea>
                            </div>
                        </div>
                        <div className='rounded-md mb-5'>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='excellent' className='sr-only peer' id='excellent' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:shadow-none duration-300' htmlFor='excellent'>Excellent</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='very_good' className='sr-only peer' id='very_good' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:shadow-none duration-300' htmlFor='very_good'>Very Good</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='good' className='sr-only peer' id='good' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:shadow-none duration-300' htmlFor='good'>Good</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='satisfactory' className='sr-only peer' id='satisfactory' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:shadow-none duration-300' htmlFor='satisfactory'>Satisfactory</label>
                            </div>
                            <div className='mb-3'>
                                <input type='radio' name='feedback' value='unsatisfactory' className='sr-only peer' id='unsatisfactory' />
                                <label className='cursor-pointer border-2 shadow-lg rounded-md block py-2 px-3 text-lg font-semibold peer-checked:border-green-500 peer-checked:shadow-none duration-300' htmlFor='unsatisfactory'>Unsatisfactory</label>
                            </div>
                        </div>
                        <div className='pb-5'>
                            <button type='submit' className='px-5 w-full py-2 bg-violet-500 rounded text-slate-50'>Submit</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default QueueFeedback;
