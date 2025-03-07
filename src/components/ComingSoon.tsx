// components/ComingSoon.tsx
import Image from 'next/image';

const ComingSoon = () => {
  return (
    <div style={{ textAlign: 'center', padding: '100px 20px' }}>
      <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Coming Soon</h1>
      <p style={{ fontSize: '1.5rem' }}>
        Something exciting is happening behind the scenes!
      </p>
      <Image
        src="/assets/images/illuminati.jpg"
        alt=""
        width="128"
        height="50"
        className="justify-self-center mt-12"
      />
    </div>
  );
};

export default ComingSoon;
