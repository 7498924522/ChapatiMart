import React from 'react'
import {BrowserRouter as Router,Route,Routes} from "react-router-dom";

import Home from './Components/Home'
import Chapati from './Components/Chapati'
import Bhakaries from './Components/Bhakaries';
import Flour from './Components/Flour'
 import Puranpolies from './Components/Puranpolies';
 import Rice from './Components/Rice';


import Wheat from './Components/Wheat';
import UnifiedCartFlow from './Components/UnifiedCartFlow';
import MainPage from './Components/MainPage';
import SignUp from './Components/SignUp';
import Login from './Components/Login';
import AdminDashboard from './Components/Admin/AdminDashboard';
// import ProtectedRoute from './Components/ProtectedRoute';

// import Practice from './Components/Practice'

function App() {
return (
    <>
    {/* <Practice/> */}
    <Router>
    <Routes>
      
        <Route path='/' element={  <MainPage/>}/>
          <Route path='/admin' element={  <AdminDashboard/>}/>
        <Route path='/signup' element={  <SignUp/>}/>
         <Route path='/login' element={  <Login/>}/>
        <Route path='/home' element={<Home/>}/>

        <Route path='/chapati' element={<Chapati/>}/>
        <Route path='/bhakari' element={<Bhakaries/>}/>
          <Route path='/puranpoli' element={<Puranpolies/>}/>
          <Route path='/rice' element={<Rice/>}/>
        <Route path='/flour' element={<Flour/>}/>
        <Route path='/gahu' element={<Wheat/>}/>
        <Route path='/cart' element={<UnifiedCartFlow/>}/>
        
        
        
    </Routes>
    </Router>
    </>
  
   
  )
}

export default App
