import React, { useContext, useEffect, useState } from 'react';
import { useSpeechSynthesis } from 'react-speech-kit';
import { QueueContext } from '../../contexts/QueueContextProvider';

const CallToken = () => {

    const { queueBranch, plugin_url } = useContext(QueueContext);
    const [reCallToken, setReCallToken] = useState(null);
    const { speak } = useSpeechSynthesis({
        onEnd: () => {
            setReCallToken(null);
        }
    });

    // get recall token
    const fetchReCallToken = () => {
        fetch(`${plugin_url}queue-token-display.php?branch_id=${queueBranch?.branch_id}`, {
            headers: { 'get_recall_token': 'TRUE' }
        })
            .then(res => res.json())
            .then(data => {
                if (data?.status == 'good') {
                    setReCallToken(data?.token);
                }
            })
    }

    useEffect(() => {
        if (reCallToken !== null) {
            speak({
                text: `${reCallToken}`
            });
        }
    }, [reCallToken]);

    useEffect(() => {
        let interval;

        interval = setInterval(() => {
            if (reCallToken === null) {
                fetchReCallToken();
            }
        }, 500);

        return () => clearInterval(interval);
    }, [reCallToken]);
    return <></>;
}

export default CallToken;
