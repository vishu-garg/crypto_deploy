// app/terms-of-service/page.tsx
import { Navbar } from '@/templates/Navbar';
import {getTranslations} from "next-intl/server";

export async function generateMetadata(props: { params: { locale: string } }) {
  const t = await getTranslations({
    locale: props.params.locale,
    namespace: 'Index',
  });

  return {
    title: t('meta_title'),
    description: t('meta_description'),
  };
}

const TermsOfService = () => {
  return (
    <>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-xl font-bold">Terms of Service</h1>
        <p>Last Updated: [2025/03/08]</p>
        <br />
        <section>
          <h2>1. Acceptance of Terms</h2>
          <p>
            By accessing and using TradingPeeps ("the Service"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree with these Terms, please do not use the Service.
          </p>
        </section>

        <section>
          <h2>2. Description of Service</h2>
          <p>
            TradingPeeps is a cloud-based software-as-a-service platform that provides advanced chart patterns, analysis tools, and customizable insights. Our service is designed to help users make informed decisions by offering real-time data analysis and chart customization features.
          </p>
        </section>

        <section>
          <h2>3. Eligibility</h2>
          <p>
            You must be at least 18 years old to use this Service. By accessing or using the Service, you represent and warrant that you meet this requirement.
          </p>
        </section>

        <section>
          <h2>4. Account Registration</h2>
          <p>
            To access certain features of the Service, you may be required to register for an account. You agree to provide accurate, current, and complete information during the registration process and update such information as necessary. You are responsible for maintaining the confidentiality of your account and password.
          </p>
        </section>

        <section>
          <h2>5. Payment and Subscription</h2>
          <p>
            The Service is offered on a subscription basis. By subscribing, you agree to pay the applicable fees, as outlined during the sign-up process. All fees are non-refundable, except as otherwise provided by law or in our refund policy.
          </p>
        </section>

        <section>
          <h2>6. User Obligations</h2>
          <p>
            You agree to use the Service only for lawful purposes and in accordance with these Terms. You shall not use the Service in any manner that could damage, disable, or impair the Service or interfere with any other party’s use and enjoyment of the Service.
          </p>
        </section>

        <section>
          <h2>7. Intellectual Property</h2>
          <p>
            All content, features, and functionality of the Service—including text, graphics, logos, and proprietary data—are the exclusive property of TradingPeeps or its licensors and are protected by intellectual property laws. You agree not to reproduce, modify, or distribute any of the content without our prior written consent.
          </p>
        </section>

        <section>
          <h2>8. Disclaimer of Warranties</h2>
          <p>
            The Service is provided on an "AS IS" and "AS AVAILABLE" basis. TradingPeeps makes no warranties, either express or implied, regarding the accuracy, reliability, or availability of the Service. Your use of the Service is at your own risk.
          </p>
        </section>

        <section>
          <h2>9. Limitation of Liability</h2>
          <p>
            In no event shall TradingPeeps or its affiliates be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your access to or use of the Service.
          </p>
        </section>

        <section>
          <h2>10. Indemnification</h2>
          <p>
            You agree to indemnify and hold harmless TradingPeeps and its affiliates from any claims, damages, liabilities, or expenses arising out of or related to your use of the Service or your violation of these Terms.
          </p>
        </section>

        <section>
          <h2>11. Termination</h2>
          <p>
            We reserve the right to terminate or suspend your access to the Service at our sole discretion, without notice, for conduct that violates these Terms or for any other reason deemed appropriate by TradingPeeps.
          </p>
        </section>

        <section>
          <h2>12. Governing Law</h2>
          <p>
            These Terms shall be governed by and construed in accordance with the laws of Delhi Jurisdiction, without regard to its conflict of laws principles.
          </p>
        </section>

        <section>
          <h2>13. Changes to These Terms</h2>
          <p>
            We reserve the right to modify these Terms at any time. Any changes will be posted on this page and will become effective immediately upon posting. Your continued use of the Service following any changes constitutes your acceptance of the new Terms.
          </p>
        </section>

        <section>
          <h2>14. Contact Information</h2>
          <p>
            If you have any questions about these Terms, please contact us at tradingpeeps32@gmail.com.
          </p>
        </section>
      </main>
    </>
  );
};

const Home = async () => {
  return (
    <>
      <Navbar />
      <TermsOfService />
    </>
  );
};

export default Home;
