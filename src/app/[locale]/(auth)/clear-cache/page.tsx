import { clearRedisKeys } from '@/libs/redis';

const Home = async () => {
  await clearRedisKeys();

  return (
    <div>
      Cache Cleared Successfully!
    </div>
  );
};

export default Home;
