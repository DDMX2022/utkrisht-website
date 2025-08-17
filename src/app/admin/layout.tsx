export const metadata = {
  title: 'Admin Dashboard - Utkrisht Interior Design',
  description: 'Admin panel for managing the interior design website',
};

export const dynamic = 'force-dynamic';

// Added required default layout component
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>; // Could add specific admin wrappers later
}
