import { useTranslations } from 'next-intl';

import { PricingCard } from '@/features/billing/PricingCard';
import { PricingFeature } from '@/features/billing/PricingFeature';
import { PricingPlanList } from '@/utils/AppConfig';

export const PricingInformation = (props: {
  buttonList: Record<string, React.ReactNode>;
}) => {
  const t = useTranslations('PricingPlan');

  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
      {Object.values(PricingPlanList).map(plan => (
        <PricingCard
          key={plan.id}
          planId={plan.id}
          price={plan.price}
          interval={plan.interval}
          button={props.buttonList[plan.id]}
        >
          <PricingFeature>
            {t('chart_access', {
              content: plan.features.chartAccess,
            })}
          </PricingFeature>

          {plan.features.support && (
            <PricingFeature>
              {t('support', {
                number: plan.features.support,
              })}
            </PricingFeature>
          )}

          {/* <PricingFeature> */}
          {/*  {t('feature_storage', { */}
          {/*    number: plan.features.storage, */}
          {/*  })} */}
          {/* </PricingFeature> */}

          {/* <PricingFeature> */}
          {/*  {t('feature_transfer', { */}
          {/*    number: plan.features.transfer, */}
          {/*  })} */}
          {/* </PricingFeature> */}

          {/* <PricingFeature>{t('feature_email_support')}</PricingFeature> */}
        </PricingCard>
      ))}
    </div>
  );
};
