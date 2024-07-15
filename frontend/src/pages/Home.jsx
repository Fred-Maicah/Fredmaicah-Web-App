import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('http://localhost:3000/api/products');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  return (
    <div className='container mx-auto'>
      <h1 className='text-2xl font-bold mb-4'>Products</h1>
      <div className='grid grid-cols-4 gap-4'>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default Home;
