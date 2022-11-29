import React, { useContext } from 'react';
import { QueueContext } from '../../contexts/QueueContextProvider';
import Button from '../Button/Button';

const CounterFooter = ({ counterHandler, loading }) => {
    const { queueBranch } = useContext(QueueContext);

    const logOutHandler = () => {
        counterHandler(queueBranch?.id, 'off');
        window.location.href = queueBranch?.logout_url;
    }

    return (
        <div className='w-full py-3 px-3 bg-zinc-50'>
            <div className='flex gap-2'>
                <div className='w-32'>
                    <Button onClick={logOutHandler}>Log Out</Button>
                </div>
            </div>
        </div>
    );
}

export default CounterFooter;
