import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { VintageCard, VintageCardContent, VintageCardHeader, VintageCardTitle, OrnamentalDivider } from './VintageCard';
import { Loader2, ArrowLeft } from 'lucide-react';

const loginSchema = z.object({
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const signupSchema = loginSchema.extend({
  displayName: z.string().min(2, 'Name must be at least 2 characters'),
  playerName: z.string().min(2, 'Player/Team name must be at least 2 characters').max(30, 'Player/Team name must be under 30 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

type LoginFormData = z.infer<typeof loginSchema>;
type SignupFormData = z.infer<typeof signupSchema>;

export function AuthForms() {
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<'login' | 'signup'>(() => 
    searchParams.get('mode') === 'signup' ? 'signup' : 'login'
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const signupForm = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', displayName: '', playerName: '' },
  });

  const handleLogin = async (data: LoginFormData) => {
    setLoading(true);
    setError(null);
    const { error } = await signIn(data.email, data.password);
    if (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleSignup = async (data: SignupFormData) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);
    const { error } = await signUp(data.email, data.password, data.displayName, data.playerName);
    if (error) {
      setError(error.message);
    } else {
      setSuccessMessage('Check your email to confirm your account before signing in.');
      setMode('login');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background relative">
      <Link 
        to="/" 
        className="absolute top-6 left-6 inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors font-display text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back
      </Link>
      <div className="w-full max-w-md">
        <VintageCard variant="parchment" className="w-full">
        <VintageCardHeader className="text-center">
          <VintageCardTitle className="text-2xl">
            {mode === 'login' ? 'Welcome Back' : 'Join the Mystery'}
          </VintageCardTitle>
          <p className="text-muted-foreground mt-2">
            {mode === 'login' 
              ? 'Sign in to continue your StoryTrail' 
              : 'Create an account to begin your adventure'}
          </p>
        </VintageCardHeader>
        
        <VintageCardContent>
          {error && (
            <div className="mb-4 p-3 bg-destructive/10 border border-destructive/30 rounded-md text-destructive text-sm">
              {error}
            </div>
          )}
          
          {successMessage && (
            <div className="mb-4 p-3 bg-accent/10 border border-accent/30 rounded-md text-accent text-sm">
              {successMessage}
            </div>
          )}

          {mode === 'login' ? (
            <Form {...loginForm} key="login-form">
              <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4" autoComplete="on">
                <FormField
                  control={loginForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          type="email"
                          autoComplete="email"
                          id="login-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={loginForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          autoComplete="current-password"
                          id="login-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Sign In
                </Button>
              </form>
            </Form>
          ) : (
            <Form {...signupForm} key="signup-form">
              <form onSubmit={signupForm.handleSubmit(handleSignup)} className="space-y-4" autoComplete="off">
                <FormField
                  control={signupForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Your Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Bond, James Bond" 
                          type="text"
                          autoComplete="name"
                          id="signup-displayname"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="playerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Player / Team Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="The Baker Street Irregulars" 
                          type="text"
                          autoComplete="off"
                          id="signup-playername"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-xs text-muted-foreground">This name will be shown publicly on leaderboards.</p>
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="your@email.com" 
                          type="email"
                          autoComplete="email"
                          id="signup-email"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          autoComplete="new-password"
                          id="signup-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={signupForm.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm Password</FormLabel>
                      <FormControl>
                        <Input 
                          type="password" 
                          placeholder="••••••••" 
                          autoComplete="new-password"
                          id="signup-confirm-password"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Account
                </Button>
              </form>
            </Form>
          )}

          <OrnamentalDivider />

          <p className="text-center text-sm text-muted-foreground">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign up
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button 
                  type="button"
                  onClick={() => { setMode('login'); setError(null); }}
                  className="text-primary hover:underline font-medium"
                >
                  Sign in
                </button>
              </>
            )}
          </p>
        </VintageCardContent>
        </VintageCard>
      </div>
    </div>
  );
}
