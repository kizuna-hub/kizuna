import { ReactNode } from 'react';

export default function AdminLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="m-0 p-0" style={{ backgroundColor: 'var(--admin-bg)' }}>
                {children}
            </body>
        </html>
    );
}
