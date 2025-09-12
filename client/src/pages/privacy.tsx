export default function Privacy() {
  return (
    <div className="min-h-screen pt-16 bg-background">
      <div className="container mx-auto px-4 lg:px-8 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <div className="prose prose-gray max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect information you provide directly to us, such as when you create an account, 
                generate apps, or contact us for support.
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>Account information (email, name)</li>
                <li>Generated app descriptions and requirements</li>
                <li>Usage data and analytics</li>
                <li>Support communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. How We Use Your Information</h2>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>To provide and improve our AI generation services</li>
                <li>To communicate with you about your account and updates</li>
                <li>To analyze usage patterns and optimize performance</li>
                <li>To provide customer support</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Information Sharing</h2>
              <p className="text-muted-foreground mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties except:
              </p>
              <ul className="list-disc list-inside text-muted-foreground space-y-2">
                <li>With your explicit consent</li>
                <li>To comply with legal obligations</li>
                <li>To protect our rights and safety</li>
                <li>With service providers who assist in our operations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
              <p className="text-muted-foreground mb-4">
                We implement appropriate security measures to protect your personal information against 
                unauthorized access, alteration, disclosure, or destruction.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. Firebase and Third-Party Services</h2>
              <p className="text-muted-foreground mb-4">
                We use Firebase for authentication and data storage. Please review Google's Privacy Policy 
                for information about how they handle your data.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">6. Cookies and Tracking</h2>
              <p className="text-muted-foreground mb-4">
                We use cookies and similar technologies to enhance your experience, analyze usage, 
                and provide personalized content.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">7. Your Rights</h2>
              <p className="text-muted-foreground mb-4">
                You have the right to access, update, or delete your personal information. 
                Contact us to exercise these rights.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">8. Children's Privacy</h2>
              <p className="text-muted-foreground mb-4">
                Our service is not intended for children under 13. We do not knowingly collect 
                personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">9. Changes to Privacy Policy</h2>
              <p className="text-muted-foreground mb-4">
                We may update this privacy policy from time to time. We will notify you of any 
                significant changes by posting the new policy on this page.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">10. Contact Us</h2>
              <p className="text-muted-foreground">
                If you have questions about this privacy policy, contact us at privacy@appiogenius.com
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
