import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Information We Collect',
    content: 'We collect information you provide directly, such as your name, email address, phone number, and profile details when you create an account or list a service. We also collect data automatically, including usage information, device information, and cookies to improve your experience.',
  },
  {
    title: 'How We Use Your Information',
    content: 'Your information is used to operate and improve ServiceHive, process transactions, send notifications, personalize recommendations, and detect fraudulent activity. We may use aggregated, anonymized data for analytics and product development.',
  },
  {
    title: 'Information Sharing',
    content: 'We share information with service providers when you book a service (name, contact details, and service requirements). We do not sell your personal information to third parties. We may disclose information if required by law or to protect our rights.',
  },
  {
    title: 'Data Security',
    content: 'We implement industry-standard security measures including encryption at rest and in transit, secure socket layer technology, and regular security audits. However, no method of transmission over the internet is 100% secure.',
  },
  {
    title: 'Your Rights',
    content: 'You have the right to access, correct, or delete your personal data. You can update your information through your account settings or contact us to request data deletion. You may also opt out of marketing communications at any time.',
  },
  {
    title: 'Cookies',
    content: 'We use cookies and similar tracking technologies to enhance your browsing experience, analyze site traffic, and understand where our users come from. You can control cookie preferences through your browser settings.',
  },
  {
    title: 'Third-Party Services',
    content: 'ServiceHive may integrate with third-party services for payments, authentication, and analytics. These services have their own privacy policies, and we encourage you to review them. We are not responsible for the practices of third parties.',
  },
  {
    title: 'Changes to This Policy',
    content: 'We may update this privacy policy from time to time. We will notify you of material changes by email or through a prominent notice on our platform. Continued use of ServiceHive after changes constitutes acceptance of the updated policy.',
  },
  {
    title: 'Contact Us',
    content: 'If you have questions about this privacy policy or how we handle your data, please contact us at privacy@servicehive.com or through our contact page.',
  },
];

export default function PrivacyPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Privacy <span className="text-primary">Policy</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Last updated: July 15, 2026. We take your privacy seriously.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">
          <p className="text-lg leading-relaxed text-gray-600">
            ServiceHive (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) is committed to protecting your privacy.
            This policy describes how we collect, use, and safeguard your information when you use our platform.
          </p>
        </div>
        <div className="mt-12 space-y-10">
          {SECTIONS.map((section, i) => (
            <div key={i}>
              <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
              <p className="mt-3 leading-relaxed text-gray-600">{section.content}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 rounded-2xl border border-gray-100 bg-gray-50 p-6 text-center">
          <p className="text-sm text-gray-500">
            Have questions?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">Contact our privacy team</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
