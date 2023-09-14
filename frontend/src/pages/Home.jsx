import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import Tasks from '../components/Tasks';
import MainLayout from '../layouts/MainLayout';

const Home = () => {

  const authState = useSelector(state => state.authReducer);
  const { isLoggedIn } = authState;
  const [Filter,setFilter]=useState("default");

  useEffect(() => {
    document.title = authState.isLoggedIn ? `${authState.user.name}'s tasks` : "Task Manager";
  }, [authState]);
 

  return (
    <>
      <MainLayout>
        {!isLoggedIn ? (
          <div className='bg-primary text-white h-[40vh] py-8 text-center'>
            <h1 className='text-2xl'> Welcome to Task Manager App</h1>
            <Link to="/signup" className='mt-10 text-xl block space-x-2 hover:space-x-4'>
              <span className='transition-[margin]'>Join now to manage your tasks</span>
              <span className='relative ml-4 text-base transition-[margin]'><i className="fa-solid fa-arrow-right"></i></span>
            </Link>
          </div>
        ) : (
          <>
            <h1 className='text-lg text-white mt-8 mx-8 border-b border-b-gray-300'>Welcome {authState.user.name}</h1>
            <select className=' mt-8 mx-8 rounded-md p-2' name="Filter" id="filter" onChange={(e)=>setFilter(e.target.value)}>
              <option className='p-1' value="default">Default</option>
              <option className='p-1' value="High">High</option>
              <option className='p-1' value="Low">Low</option>
              <option className='p-1' value="Medium">Medium</option>
            </select>
            
            <Tasks filter={Filter}/>
          </>
        )}
      </MainLayout>
    </>
  )
}

export default Home