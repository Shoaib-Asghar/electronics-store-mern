import React, { useEffect, useState } from 'react';
import { getAllInventory } from '../services/inventoryService';

const InventoryPage = () => {   // InventoryPage component to display all items.
  const [items, setItems] = useState([]); // State to hold inventory items for rendering. Initially set to an empty array.
  const [loading, setLoading] = useState(true); // State to manage loading state while fetching data. Initially set to true to show loading state.


  // Fetch items from backend when component loads
  useEffect(() => { //
    const fetchData = async () => {
      try {
        const inventory = await getAllInventory(); // Fetch all inventory items from the backend
        setItems(inventory);  //
      } catch (error) {
        console.error('Failed to load inventory.');
      } finally {
        setLoading(false); 
      } 
    };

    fetchData();
  }, []);  //no dependencies means this runs once when the component mounts. 
            // UseEffect is used to perform side effects which are operations that can affect other components 
            // and cannot be done during rendering. In this case, it is used to fetch data from the backend when
            //  the component mounts. UseEffect is a hook that allows you to perform side effects in function 
            // components. Side effects are operations that can affect other components and cannot be done during rendering,
            // such as data fetching, subscriptions, or manually changing the DOM. Fetching the inventory items
            // is suitable for useEffect because it is an asynchronous operation that needs to be performed after the component mounts.
            // The useEffect hook takes two arguments: a function that contains the side effect code and an array of dependencies.
            // It takes a function as its first argument, which is executed after the component renders. 
            // The second argument is an array of dependencies that determines when the effect should run. If the array 
            // is empty, the effect runs only once when the component mounts. Here we don't use componentDidMount or componentDidUpdate because
            // we are using functional components and hooks. UseEffect is the equivalent of componentDidMount and componentDidUpdate in class components. 

  if (loading) return <p className="text-center">Loading...</p>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item._id}
            className="bg-white shadow-md p-4 rounded-md border"
          >
            <h2 className="text-xl font-semibold">{item.name}</h2>
            <p className="text-gray-500">{item.brand}</p>
            <p className="text-sm">{item.description}</p>
            <p className="font-bold text-blue-600">${item.price}</p>
            <p className="text-sm text-green-600">Stock: {item.stock}</p>
          </div>
        ))}
      </div>
    </div>
  );

};

export default InventoryPage;
