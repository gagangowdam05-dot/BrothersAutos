// Re-export the hardened, rate-limited authentication handler
// to ensure zero logic divergence and eliminate legacy backdoors.
export { POST } from '@/app/api/auth/login/route';
export const dynamic = 'force-dynamic';
