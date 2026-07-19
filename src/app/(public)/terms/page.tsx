import Link from 'next/link';

const SECTIONS = [
  {
    title: 'Acceptance of Terms',
    content: 'By accessing or using ServiceHive, you agree to be bound by these Terms of Service. If you do not agree, please do not use our platform. We reserve the right to update these terms at any time, and continued use constitutes acceptance of changes.',
  },
  {
    title: 'User Accounts',
    content: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account. You must provide accurate information and notify us immediately of any unauthorized use. Accounts may be suspended for violations of these terms.',
  },
  {
    title: 'Service Providers',
    content: 'Service providers are independent contractors, not employees of ServiceHive. Providers are responsible for the quality, safety, and legality of their services. Providers must accurately represent their qualifications, availability, and pricing.',
  },
  {
    title: 'Customer Obligations',
    content: 'Customers agree to use services in good faith, provide accurate information, and pay for services rendered. Customers should communicate respectfully with providers and address disputes directly before escalating to ServiceHive.',
  },
  {
    title: 'Payments & Fees',
    content: 'All payments are processed securely through our platform. ServiceHive charges a service fee on completed transactions, which is clearly disclosed before booking. Refunds are subject to the provider\'s cancellation policy and applicable consumer protection laws.',
  },
  {
    title: 'Intellectual Property',
    content: 'The ServiceHive name, logo, and platform design are proprietary. Users retain ownership of content they post but grant ServiceHive a license to display and distribute it on the platform. You may not copy, modify, or reverse-engineer any part of ServiceHive.',
  },
  {
    title: 'Prohibited Conduct',
    content: 'Users may not engage in fraudulent activity, harassment, spamming, or any illegal conduct through the platform. Circumventing our fee structure, manipulating reviews, or collecting user data without consent is strictly prohibited.',
  },
  {
    title: 'Limitation of Liability',
    content: 'ServiceHive acts as a marketplace connecting customers with providers. We are not liable for the quality, safety, or legality of services provided. Our maximum liability is limited to the fees paid for the specific service giving rise to the claim.',
  },
  {
    title: 'Dispute Resolution',
    content: 'We encourage users to resolve disputes directly. If a resolution cannot be reached, disputes will be handled through binding arbitration in accordance with applicable law. Class action waivers apply. Users agree to a 60-day pre-dispute negotiation period.',
  },
  {
    title: 'Termination',
    content: 'Either party may terminate their account at any time. ServiceHive may suspend or terminate accounts for violations of these terms. Upon termination, you remain liable for any outstanding obligations and completed transactions.',
  },
];

export default function TermsPage() {
  return (
    <main>
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/[0.04] via-white to-secondary/[0.04] py-24">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
          <h1 className="text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl">
            Terms of <span className="text-primary">Service</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Last updated: July 15, 2026. Please read these terms carefully.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="prose prose-gray max-w-none">
          <p className="text-lg leading-relaxed text-gray-600">
            These Terms of Service govern your use of the ServiceHive platform. By creating an account or using our services,
            you agree to these terms. If you are using ServiceHive on behalf of a business, you represent that you have authority to bind that entity.
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
            Questions about these terms?{' '}
            <Link href="/contact" className="font-medium text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </section>
    </main>
  );
}
