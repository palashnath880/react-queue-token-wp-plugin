import React, { useContext } from 'react';
import Loader from './components/Loader/Loader';
import { QueueContext } from './contexts/QueueContextProvider';
import BranchManage from './layout/BranchManage';
import Counter from './layout/Counter/Counter';
import CreateQueue from './layout/CreateQueue';
import DisplayQueue from './layout/DisplayQueue';
import QueueFeedback from './layout/QueueFeedback';

const App = () => {

  const { queueBranch, loading } = useContext(QueueContext);
  const searchQuery = window.location.search;
  const search = searchQuery.slice(1).split('=');

  if (loading) {
    return <Loader />
  }

  if (Array.isArray(search) && search[0] == 'feedback') {
    return <QueueFeedback tokenId={search[1]} />
  }

  if (queueBranch?.type === 'queue_branch') {
    return <BranchManage />
  }

  if (queueBranch?.type === 'queue_counter') {
    return <Counter />
  }

  if (queueBranch?.type === 'queue_display') {
    return <DisplayQueue />
  }

  if (queueBranch?.type === 'queue_creator') {
    return <CreateQueue />
  }

  return <div className=''>
    <h1 className='text-4xl text-center'>Welcome to QMS</h1>
  </div>;
}

export default App;

