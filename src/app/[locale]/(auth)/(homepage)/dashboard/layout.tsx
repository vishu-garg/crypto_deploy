export default function DashboardLayout(props: { children: React.ReactNode }) {
  return (
    <div>
      {props.children}
    </div>
  );
}

export const dynamic = 'force-dynamic';
