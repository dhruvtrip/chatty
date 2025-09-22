import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import useAuthStore from '../store/useAuthStore'

export default function SignIn() {
    
    const [value, setValue] = useState('');
    const setUsername = useAuthStore(s => s.setUsername);
    const navigate = useNavigate();

    const onChange = useCallback((e) => {
        setValue(e.target.value);
    }, []);
    
    const onSubmit = useCallback((e) => {
        e.preventDefault();
        const trimmed = value.trim();
        if(!trimmed) return;
        setUsername(trimmed);
        navigate('/chat', { replace: true });
    }, [value, setUsername, navigate]);
    
    return (
        <div className='p-4'>
      <h1 className='text-xl mb-2'>Welcome to Chatty</h1>
      <h2 className='text-xl mb-2'>Sign In</h2>
      <form onSubmit={onSubmit} className='flex gap-2'>
        <input
          type='text'
          placeholder='Enter your username'
          value={value}
          onChange={onChange}
          className='border px-2 py-1 rounded'
        />
        <button type='submit' className='bg-blue-600 text-white px-3 py-1 rounded'>
          Sign In
        </button>
      </form>
    </div>
    )
}