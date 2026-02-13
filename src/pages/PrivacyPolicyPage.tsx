import { Header, MobileNav } from '@/components/Navigation';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from '@/components/VintageCard';
import { Shield, Lock, Eye, Trash2, Download, Mail } from 'lucide-react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen pb-20">
      <Header />
      <main className="container py-6 space-y-6 max-w-3xl">
        <h1 className="font-display text-2xl font-bold">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground">Last updated: February 2026</p>

        <VintageCard variant="parchment">
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              <VintageCardTitle>Your Privacy Matters</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent className="prose prose-sm dark:prose-invert">
            <p className="text-muted-foreground">
              StoryTrail is committed to protecting your personal data and respecting your privacy 
              in accordance with the EU General Data Protection Regulation (GDPR) and other applicable laws.
            </p>
          </VintageCardContent>
        </VintageCard>

        <OrnamentalDivider />

        {/* Data We Collect */}
        <VintageCard>
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Eye className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">Data We Collect</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent className="space-y-3">
            <div>
              <h4 className="font-semibold text-sm">Account Information</h4>
              <p className="text-sm text-muted-foreground">Email address, display name, and authentication credentials.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Game Progress</h4>
              <p className="text-sm text-muted-foreground">Your completed locations, purchases, and gameplay statistics.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm">Device Information</h4>
              <p className="text-sm text-muted-foreground">Browser type, IP address (anonymized), and general location for gameplay features.</p>
            </div>
          </VintageCardContent>
        </VintageCard>

        {/* How We Use Your Data */}
        <VintageCard>
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">How We Use Your Data</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Provide and improve the StoryTrail game experience</li>
              <li>• Save your progress across devices</li>
              <li>• Process purchases and transactions</li>
              <li>• Send important service updates (opt-in for marketing)</li>
              <li>• Ensure security and prevent fraud</li>
            </ul>
          </VintageCardContent>
        </VintageCard>

        {/* Your Rights */}
        <VintageCard variant="parchment">
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Download className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">Your GDPR Rights</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent className="space-y-3">
            <div className="flex items-start gap-3">
              <Eye className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-sm">Right to Access</h4>
                <p className="text-sm text-muted-foreground">Request a copy of your personal data.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Download className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-sm">Right to Portability</h4>
                <p className="text-sm text-muted-foreground">Export your data in a machine-readable format.</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Trash2 className="h-4 w-4 mt-1 text-muted-foreground" />
              <div>
                <h4 className="font-semibold text-sm">Right to Erasure</h4>
                <p className="text-sm text-muted-foreground">Delete your account and all associated data.</p>
              </div>
            </div>
          </VintageCardContent>
        </VintageCard>

        {/* Data Security */}
        <VintageCard>
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Lock className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">Data Security</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• All data encrypted in transit (TLS 1.3) and at rest (AES-256)</li>
              <li>• Data stored in secure EU data centers</li>
              <li>• Row-Level Security ensures you only access your own data</li>
              <li>• Regular security audits and monitoring</li>
            </ul>
          </VintageCardContent>
        </VintageCard>

        {/* Contact */}
        <VintageCard>
          <VintageCardHeader>
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-primary" />
              <VintageCardTitle className="text-lg">Contact Us</VintageCardTitle>
            </div>
          </VintageCardHeader>
          <VintageCardContent>
            <p className="text-sm text-muted-foreground">
              For privacy inquiries or to exercise your rights, contact us at:{' '}
              <a href="mailto:privacy@storytrail.app" className="text-primary hover:underline">
                privacy@storytrail.app
              </a>
            </p>
          </VintageCardContent>
        </VintageCard>
      </main>
      <MobileNav />
    </div>
  );
}
