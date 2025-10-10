"use client";
import { fetchRedeems } from '@/redux/slices/paymentSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const RedeemsPage = () => {
  const dispatch = useDispatch();
  const [isClient, setIsClient] = useState(false);
  
  // Initialize client-side only
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Safe selector with fallback
  const { 
    redeems, 
    redeemsLoading, 
    redeemsError 
  } = useSelector((state) => state.payments || {});

  // Fetch redeems on component mount
  useEffect(() => {
    if (isClient) {
      dispatch(fetchRedeems());
    }
  }, [dispatch, isClient]);

  // Handle error state
  useEffect(() => {
    if (redeemsError) {
      console.error('Error fetching redeems:', redeemsError);
    }
  }, [redeemsError]);

  // Log redeems data when it changes
  useEffect(() => {
    if (redeems && redeems.results && !redeemsLoading) {
      console.log('Redeems data:', redeems);
      console.log('Total redeems count:', redeems.count);
      console.log('Redeems results:', redeems.results);
    }
  }, [redeems, redeemsLoading]);

  // Manual fetch function
  const handleFetchRedeems = () => {
    console.log('Manually fetching redeems...');
    dispatch(fetchRedeems());
  };

  // Show loading state during SSR
  if (!isClient) {
    return (
      <div>
        <h1>Redeems Management</h1>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <h1>Redeems Management</h1>
      
      <button onClick={handleFetchRedeems} disabled={redeemsLoading}>
        {redeemsLoading ? 'Loading...' : 'Fetch Redeems'}
      </button>

      {redeemsLoading && <p>Loading redeems...</p>}
      
      {redeemsError && (
        <p style={{ color: 'red' }}>
          Error: {typeof redeemsError === 'string' ? redeemsError : JSON.stringify(redeemsError)}
        </p>
      )}

      {!redeemsLoading && !redeemsError && redeems && (
        <p>Redeems loaded successfully! Check console for data.</p>
      )}
    </div>
  );
};

export default RedeemsPage;