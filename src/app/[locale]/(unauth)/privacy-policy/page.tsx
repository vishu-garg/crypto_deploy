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

const PrivacyPolicy = () => {
  return (
    <>
      <main style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
        <h1 className="text-xl font-bold">Privacy Policy</h1>
        <p>Last Updated: [2025/03/08]</p>
        <br />
        <section>
          <h2>1. Introduction</h2>
          <p>
            Welcome to TradingPeeps. We are committed to protecting your privacy and ensuring that your personal information is handled in a safe and responsible manner. This Privacy Policy outlines how we collect, use, share, and safeguard your information when you use our platform, which provides chart patterns, analysis, and customizations.
          </p>
        </section>

        <section>
          <h2>2. Information We Collect</h2>
          <p>
            We may collect the following types of information:
          </p>
          <ul>
            <li>
              <strong>Personal Information:</strong> Information such as your name, email address, and other contact details when you register or subscribe to our services.
            </li>
            <li>
              <strong>Usage Data:</strong> Details of how you use our platform, including the features you interact with and the time and date of your visits.
            </li>
            <li>
              <strong>Technical Data:</strong> Information such as your IP address, browser type, operating system, and device identifiers.
            </li>
          </ul>
        </section>

        <section>
          <h2>3. How We Use Your Information</h2>
          <p>
            The information we collect is used for:
          </p>
          <ul>
            <li>Providing and maintaining our service</li>
            <li>Improving and personalizing your experience on our platform</li>
            <li>Sending you important updates, newsletters, and marketing communications (with your consent)</li>
            <li>Analyzing usage and trends to enhance our service offerings</li>
          </ul>
        </section>

        <section>
          <h2>4. Sharing and Disclosure</h2>
          <p>
            We do not sell or rent your personal information. However, we may share your data with trusted third-party service providers who help us operate our platform, process payments, or perform analytics. These parties are contractually obligated to maintain the confidentiality and security of your information.
          </p>
          <p>
            We may also disclose your information if required by law or to protect our rights, property, or safety.
          </p>
        </section>

        <section>
          <h2>5. Data Security</h2>
          <p>
            We implement a variety of security measures to maintain the safety of your personal information. Despite these efforts, no method of transmission over the Internet or electronic storage is 100% secure. Therefore, while we strive to protect your data, we cannot guarantee its absolute security.
          </p>
        </section>

        <section>
          <h2>6. Cookies and Tracking Technologies</h2>
          <p>
            Our platform uses cookies and similar tracking technologies to enhance your experience, analyze usage patterns, and deliver personalized content. You can control the use of cookies through your browser settings.
          </p>
        </section>

        <section>
          <h2>7. Your Rights</h2>
          <p>
            Depending on your jurisdiction, you may have rights regarding your personal information, such as the right to access, correct, or delete your data. If you wish to exercise these rights, please contact us using the information provided below.
          </p>
        </section>

        <section>
          <h2>8. Third Party Services</h2>
          <p>
            Our service may contain links to third-party websites or services. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit.
          </p>
        </section>

        <section>
          <h2>9. Changes to This Privacy Policy</h2>
          <p>
            We may update this Privacy Policy from time to time. When we do, we will revise the "Last Updated" date at the top of this page. Your continued use of our service after any changes constitutes your acceptance of the updated policy.
          </p>
        </section>

        <section>
          <h2>10. Contact Information</h2>
          <p>
            If you have any questions or concerns about this Privacy Policy or our data practices, please contact us at tradingpeeps32@gmail.com
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
      <PrivacyPolicy />
    </>
  );
};

export default Home;
