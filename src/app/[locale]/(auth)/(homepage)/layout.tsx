import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';

import NewsMarquee from '@/components/common/NewsMarquee';
import { DashboardHeader } from '@/features/dashboard/DashboardHeader';

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Dashboard',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

export default function AuthLayout(props: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const t = useTranslations('DashboardLayout');

  return (
    <div>
      <div className="shadow-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-3 py-4">
          <DashboardHeader
            menu={[
              {
                href: '/dashboard',
                label: t('home'),
              },
              {
                href: '/customization',
                label: t('customcharts'),
              },
              // PRO: Link to the /dashboard/todos page
              // {
              //   href: '/dashboard/organization-profile/organization-members',
              //   label: t('members'),
              // },
              // {
              //   href: '/dashboard/organization-profile',
              //   label: t('settings'),
              // },
              // PRO: Link to the /dashboard/billing page
            ]}
          />
        </div>
      </div>
      <div className="min-h-[calc(100vh-72px)] bg-muted">
        <div className="mx-auto max-w-screen-xl px-3 pb-16 pt-1">
          <NewsMarquee />
          {props.children}
        </div>
      </div>
    </div>
  );
}
