import fs from 'fs';

const path = 'src/App.tsx';
let code = fs.readFileSync(path, 'utf8');

const target = `<Route
                  path={ADMIN_ROUTES.content}`;

const replacement = `<Route
                  path={ADMIN_ROUTES.articles}
                  element={
                    <AdminProtectedRoute>
                      <React.Suspense fallback={<AdminFallback />}>
                        <AdminContentPage initialTab="posts" />
                      </React.Suspense>
                    </AdminProtectedRoute>
                  }
                />
                <Route
                  path={ADMIN_ROUTES.content}`;

if (!code.includes('path={ADMIN_ROUTES.articles}')) {
  code = code.replace(target, replacement);
  fs.writeFileSync(path, code, 'utf8');
  console.log('Added ADMIN_ROUTES.articles to App.tsx');
} else {
  console.log('Already present');
}
