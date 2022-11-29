import React, { useContext } from 'react';
import BranchReport from './components/BranchReport/BranchReport';
import Loader from './components/Loader/Loader';
import { QueueContext } from './contexts/QueueContextProvider';
import BranchManage from './layout/BranchManage';
import Counter from './layout/Counter/Counter';
import CreateQueue from './layout/CreateQueue';
import DisplayQueue from './layout/DisplayQueue';
import QueueFeedback from './layout/QueueFeedback';

const App = () => {

  const { queueBranch, loading } = useContext(QueueContext);

  if (loading) {
    return <Loader />
  }

  if (queueBranch?.type === 'queue_branch') {
    return <BranchManage />
  }

  if (queueBranch?.type === 'queue_counter') {
    return <Counter />
  }

  if (queueBranch?.type === 'queue_creator') {
    return <CreateQueue />
  }

  if (queueBranch?.type === 'queue_display') {
    return <DisplayQueue />
  }

  return <DisplayQueue />;
}

export default App;

