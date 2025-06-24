import { useRole } from '../context/RoleContext';
import { Link } from 'react-router-dom';

const Header = () => {
  const { role, setRole } = useRole();

  return (
    <header className="bg-blue-700 text-white px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">Mughal Electronics</h1>

      <nav className="space-x-4">
        <Link to="/">Home</Link>
        {role === 'admin' && <Link to="/inventory">Inventory</Link>}
        {role === 'customer' && <Link to="/shop">Shop</Link>}
        <Link to="/cart">Cart</Link>
      </nav>

      <div>
        <label className="mr-2">Role:</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="text-black p-1 rounded"
        >
          <option value="customer">Customer</option>
          <option value="admin">Admin</option>
        </select>
      </div>
    </header>
  );
};

export default Header;
