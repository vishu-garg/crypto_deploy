export default function CustomChartLayout(props: { children: React.ReactNode }) {
  return (
    <div>
      {props.children}
    </div>
  );
}

export const dynamic = 'force-dynamic';
