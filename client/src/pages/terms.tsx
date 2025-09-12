export default function Terms() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Terms of Service</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground mb-4">
                By accessing and using Appio Genius, you accept and agree to be bound by the terms and provision of this agreement.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Service Description</h2>
              <p className="text-muted-foreground mb-4">
                Appio Genius is an AI-powered platform that generates Android Studio projects based on user input. 
                The service includes code generation, Firebase integration, and project management features.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. User Responsibilities</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>You are responsible for maintaining the confidentiality of your account</li>
                <li>You agree to provide accurate and complete information</li>
                <li>You will not use the service for any unlawful purposes</li>
                <li>You are responsible for all content generated using our service</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                Generated code and projects belong to you. However, Appio Genius retains ownership of the platform, 
                AI models, and underlying technology.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                Appio Genius is provided "as is" without warranties. We are not liable for any damages arising 
                from the use of generated code or projects.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Termination</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to terminate or suspend accounts that violate these terms or engage in 
                abusive behavior.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Changes to Terms</h2>
              <p className="text-muted-foreground mb-4">
                We reserve the right to modify these terms at any time. Users will be notified of significant changes.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Contact Information</h2>
              <p className="text-muted-foreground">
                For questions about these terms, contact us at legal@appiogenius.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
