import React from 'react';
import App from '../src/App';

export async function generateMetadata() {
  return {
    title: 'WithHuyen — Authentic Vietnam tours',
    description: 'Licensed guide Huyen — Explore authentic Vietnam tours',
  };
}

export default function Page() {
  return <App />;
}
