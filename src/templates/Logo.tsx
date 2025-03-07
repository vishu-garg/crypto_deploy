import { AppConfig } from '@/utils/AppConfig';

export const Logo = (props: {
  isTextHidden?: boolean;
}) => (
  <div className="flex items-center text-xl font-semibold">
    <svg
      className="mr-1 size-8 stroke-current stroke-2"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 200"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="65" y1="90" x2="65" y2="150" stroke="black" stroke-width="2" />
      <rect x="60" y="110" width="10" height="30" fill="green" stroke="black" stroke-width="2" />

      <line x1="85" y1="70" x2="85" y2="150" stroke="black" stroke-width="2" />
      <rect x="80" y="90" width="10" height="50" fill="green" stroke="black" stroke-width="2" />

      <line x1="105" y1="50" x2="105" y2="150" stroke="black" stroke-width="2" />
      <rect x="100" y="70" width="10" height="70" fill="green" stroke="black" stroke-width="2" />

      <line x1="125" y1="30" x2="125" y2="150" stroke="black" stroke-width="2" />
      <rect x="120" y="50" width="10" height="90" fill="green" stroke="black" stroke-width="2" />

      <line x1="145" y1="10" x2="145" y2="150" stroke="black" stroke-width="2" />
      <rect x="140" y="30" width="10" height="110" fill="green" stroke="black" stroke-width="2" />
    </svg>
    {!props.isTextHidden && AppConfig.name}
  </div>
);
