'use client';

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  return (
    <div>
      {props.children}
    </div>
  );
}
