import React, { useEffect, useState } from 'react';
import { getAllProducts } from '../services/inventoryService';
import axios from 'axios'; // Axios is a promise-based HTTP client for the browser and Node.js. It is used to make HTTP requests to the backend API to fetch, create, update, or delete data.

import { useNavigate } from 'react-router-dom'; //useNavigate is a hook that allows you to programmatically navigate to different routes in your application. for example, you can use it to navigate to the inventory page after adding an item or to redirect users based on certain conditions. It replaces the older useHistory hook from React Router v5.

import { useRole } from '../context/RoleContext';


const API = import.meta.env.VITE_API_BASE_URL; // backend API base URL, this is used to make requests to the backend API to fetch, create, update, or delete data.

const InventoryPage = () => {   // InventoryPage component to display all items.

    const { role } = useRole();

    if (role !== 'admin') return <Navigate to="/" />;

    const [items, setItems] = useState([]); // State variable to hold inventory items for rendering. Initially set to an empty array.
    const [loading, setLoading] = useState(true); // State to manage loading state while fetching data. Initially set to true to show loading state.

    const navigate = useNavigate(); //store the navigate function from useNavigate hook 





    // Fetch items from backend when component loads
    useEffect(() => { 
        const fetchData = async () => {
        try {
            const inventory = await getAllProducts(); // Fetch all inventory items from the backend
            setItems(inventory);  //
        } catch (error) {
            console.error('Failed to load inventory.');
        } finally {
            setLoading(false); // Set loading to false after fetching data to stop showing loading on the UI 
        } };
        
        fetchData(); 
    }, []);  //no dependencies means this runs once when the component mounts. 
    // UseEffect is used to perform side effects which are operations that can affect other components 
            // and cannot be done during rendering. In this case, it is used to fetch data from the backend when
            // the component mounts. UseEffect is a hook that allows you to perform side effects in function 
            // components. Side effects are operations that can affect other components and cannot be done during rendering,
            // such as data fetching, subscriptions, or manually changing the DOM. Fetching the inventory items
            // is suitable for useEffect because it is an asynchronous operation that needs to be performed after the component mounts.
            // The useEffect hook takes two arguments: a function that contains the side effect code and an array of dependencies.
            // It takes a function as its first argument, which is executed after the component renders. 
            // The second argument is an array of dependencies that determines when the effect should run. If the array 
            // is empty, the effect runs only once when the component mounts. Here we don't use componentDidMount or componentDidUpdate because
            // we are using functional components and hooks. UseEffect is the equivalent of componentDidMount and componentDidUpdate in class components. 


    // const handleDelete = async (id) => {
    //     if (!confirm("Are you sure you want to delete this item?")) return;

    //     try {
    //     await axios.delete(`${API}/inventory/${id}`); // Send DELETE request to backend to remove item by ID
    //     // Remove item from UI
    //     setItems(items.filter(item => item._id !== id));
    //     } catch (error) {
    //     alert("Failed to delete item.");
    //     }
    // };


    const handleDelete = async (id) => {
        if (!confirm("Are you sure you want to delete this item?")) return;

        try {
            const res = await axios.delete(`${API}/products/${id}`);
            
            // Optional: check for 200 OK and success message
            if (res.status === 200) {
            console.log("Deleted:", res.data);
            setItems(items.filter(item => item._id !== id));
            } else {
            throw new Error("Unexpected response");
            }

        } catch (error) {
            console.error("Delete error:", error);
            alert("Failed to delete item.");
        }
    };




    if (loading) return <p className="text-center">Loading...</p>; //this takes a loading state variable that is set to true initially, and once the data is fetched, it is set to false.


    return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div key={item._id} className="bg-white shadow p-4 rounded border">
            <h2 className="text-lg font-bold">{item.name}</h2>
            <p>{item.brand}</p>
            <p className="text-sm">{item.description}</p>
            <p className="text-blue-600 font-bold">${item.price}</p>
            <p className="text-green-600">Stock: {item.stock}</p>

            {/* Action buttons */}
            <div className="mt-4 space-x-2">

              <button
                onClick={() => navigate(`/products/edit/${item._id}`)}
                className="bg-yellow-500 px-3 py-1 text-white rounded"
              >
                Edit
              </button>

              <button
                onClick={() => handleDelete(item._id)}
                className="bg-red-500 px-3 py-1 text-white rounded"
              >
                Delete
              </button>

            </div>
          </div>
        ))}
      </div>
    </div>
    );




    // return (
    // <div className="p-4">
    //     <h1 className="text-2xl font-bold mb-4">Inventory</h1>
    //     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
    //     {items.map((item) => (
    //         <div
    //         key={item._id}
    //         className="bg-white shadow-md p-4 rounded-md border"
    //         >
    //         <h2 className="text-xl font-semibold">{item.name}</h2>
    //         <p className="text-gray-500">{item.brand}</p>
    //         <p className="text-sm">{item.description}</p>
    //         <p className="font-bold text-blue-600">${item.price}</p>
    //         <p className="text-sm text-green-600">Stock: {item.stock}</p>
    //         </div>
    //     ))}
    //     </div>
    // </div>
    // );

};

export default InventoryPage;
