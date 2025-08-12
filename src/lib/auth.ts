import Credentials from 'next-auth/providers/credentials';
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import { db } from './db';

export const authOptions = {
  adapter: PrismaAdapter(db),
  session: { strategy: 'jwt' as const },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: { email: {}, password: {} },
      async authorize(creds) {
        console.log('[AUTH] authorize called with', creds?.email);
        if (!creds?.email || !creds?.password) {
          console.log('[AUTH] missing credentials');
          return null;
        }
        const user = await db.user.findUnique({
          where: { email: creds.email },
        });
        console.log('[AUTH] user lookup result', !!user);
        if (!user || !user.hashedPassword) {
          console.log('[AUTH] user not found or no password');
          return null;
        }
        const valid = await bcrypt.compare(creds.password, user.hashedPassword);
        console.log('[AUTH] password valid?', valid);
        if (!valid) return null;
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) (session.user as any).role = (token as any).role;
      return session;
    },
  },
};

const handler = NextAuth(authOptions as any);
export { handler as GET, handler as POST };
