import { clearRedisKeys } from '@/app/api/redis/route';

const Home = async () => {
  await clearRedisKeys();

  return (
    <div>
      Cache Cleared Successfully!
    </div>
  );
};

export default Home;
