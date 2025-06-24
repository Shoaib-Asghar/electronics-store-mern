// import { StrictMode } from 'react'
// import { createRoot } from 'react-dom/client'
// import './index.css'
// import App from './App.jsx'

// createRoot(document.getElementById('root')).render(
//   <StrictMode>
//     <App />
//   </StrictMode>,
// )

// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App.jsx';
// import './index.css'; // We'll use this for Tailwind

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );




import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);



// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import { BrowserRouter, Routes, Route } from 'react-router-dom'; 
// import App from './App.jsx';
// import InventoryPage from './pages/InventoryPage.jsx';
// import AddInventoryPage from './pages/AddInventoryPage.jsx';
// import EditInventoryPage from './pages/EditInventoryPage.jsx';
// import BuyerInventoryPage from './pages/BuyerInventoryPage.jsx';
// import { CartProvider } from './context/CartContext';


// import './index.css';

// ReactDOM.createRoot(document.getElementById('root')).render(
//   <React.StrictMode>
//     <BrowserRouter> 
//       <Routes>    {/* */}
//         <Route path="/" element={<App />} />  
//         <Route path="/inventory" element={<InventoryPage />} />
//         <Route path="/inventory/add" element={<AddInventoryPage />} />
//         <Route path="/inventory/edit/:id" element={<EditInventoryPage />} />
//         <Route path='/shop' element={<BuyerInventoryPage />} />

//       </Routes>
//     </BrowserRouter>
//   </React.StrictMode>
// );

