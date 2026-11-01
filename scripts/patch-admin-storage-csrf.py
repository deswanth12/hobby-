with open('C:/kavatha ca/src/services/adminStorage.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# 1. Add getAuthHeaders
target_method = '''  isCloudConnected(): boolean {
    return isSupabaseConfigured() || true; // Server API is active on port 5173
  },'''

replacement_method = '''  isCloudConnected(): boolean {
    return isSupabaseConfigured() || true; // Server API is active on port 5173
  },

  getAuthHeaders(includeContentType = true): Record<string, string> {
    const session = this.getSession();
    const headers: Record<string, string> = {};
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    if (session?.token) {
      headers['Authorization'] = `Bearer ${session.token}`;
    }
    if (session?.csrfToken) {
      headers['X-KA-CSRF-Token'] = session.csrfToken;
    }
    return headers;
  },'''

text = text.replace(target_method.replace('\r\n', '\n'), replacement_method.replace('\r\n', '\n'))
text = text.replace(target_method.replace('\n', '\r\n'), replacement_method.replace('\n', '\r\n'))

# 2. Update enquiry status update fetch
old_enquiry_patch = '''    fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify({
        status: normalizedStatus,
        followUpNotes
      })
    }).catch(() => {});'''

new_enquiry_patch = '''    fetch(`/api/admin/enquiries/${id}`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify({
        status: normalizedStatus,
        followUpNotes
      })
    }).catch(() => {});'''

text = text.replace(old_enquiry_patch.replace('\r\n', '\n'), new_enquiry_patch.replace('\r\n', '\n'))
text = text.replace(old_enquiry_patch.replace('\n', '\r\n'), new_enquiry_patch.replace('\n', '\r\n'))

# 3. Update enquiry delete fetch
old_enquiry_del = '''    fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});'''

new_enquiry_del = '''    fetch(`/api/admin/enquiries/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false)
    }).catch(() => {});'''

text = text.replace(old_enquiry_del.replace('\r\n', '\n'), new_enquiry_del.replace('\r\n', '\n'))
text = text.replace(old_enquiry_del.replace('\n', '\r\n'), new_enquiry_del.replace('\n', '\r\n'))

# 4. Update service update fetch
old_svc_put = '''    fetch(`/api/admin/content/services/${serviceId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(updates)
    }).catch(() => {});'''

new_svc_put = '''    fetch(`/api/admin/content/services/${serviceId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(updates)
    }).catch(() => {});'''

text = text.replace(old_svc_put.replace('\r\n', '\n'), new_svc_put.replace('\r\n', '\n'))
text = text.replace(old_svc_put.replace('\n', '\r\n'), new_svc_put.replace('\n', '\r\n'))

# 5. Update FAQ update fetch
old_faq_put = '''    fetch(`/api/admin/content/faqs/${faqId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(updates)
    }).catch(() => {});'''

new_faq_put = '''    fetch(`/api/admin/content/faqs/${faqId}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(updates)
    }).catch(() => {});'''

text = text.replace(old_faq_put.replace('\r\n', '\n'), new_faq_put.replace('\r\n', '\n'))
text = text.replace(old_faq_put.replace('\n', '\r\n'), new_faq_put.replace('\n', '\r\n'))

# 6. Update post update fetch
old_post_put = '''    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(post)
    }).catch(() => {});'''

new_post_put = '''    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(post)
    }).catch(() => {});'''

text = text.replace(old_post_put.replace('\r\n', '\n'), new_post_put.replace('\r\n', '\n'))
text = text.replace(old_post_put.replace('\n', '\r\n'), new_post_put.replace('\n', '\r\n'))

# 7. Update post delete fetch
old_post_del = '''    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'DELETE',
      headers: {
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      }
    }).catch(() => {});'''

new_post_del = '''    fetch(`/api/admin/content/posts/${cleanSlug}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(false)
    }).catch(() => {});'''

text = text.replace(old_post_del.replace('\r\n', '\n'), new_post_del.replace('\r\n', '\n'))
text = text.replace(old_post_del.replace('\n', '\r\n'), new_post_del.replace('\n', '\r\n'))

# 8. Update content reset fetch
old_content_reset = '''    fetch('/api/admin/content/reset', {
      method: 'POST',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});'''

new_content_reset = '''    fetch('/api/admin/content/reset', {
      method: 'POST',
      headers: this.getAuthHeaders(false)
    }).catch(() => {});'''

text = text.replace(old_content_reset.replace('\r\n', '\n'), new_content_reset.replace('\r\n', '\n'))
text = text.replace(old_content_reset.replace('\n', '\r\n'), new_content_reset.replace('\n', '\r\n'))

# 9. Update settings update fetch
old_settings_put = '''    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(session ? { 'Authorization': `Bearer ${session.token}` } : {})
      },
      body: JSON.stringify(updates)
    }).catch(() => {});'''

new_settings_put = '''    fetch('/api/admin/settings', {
      method: 'PUT',
      headers: this.getAuthHeaders(true),
      body: JSON.stringify(updates)
    }).catch(() => {});'''

text = text.replace(old_settings_put.replace('\r\n', '\n'), new_settings_put.replace('\r\n', '\n'))
text = text.replace(old_settings_put.replace('\n', '\r\n'), new_settings_put.replace('\n', '\r\n'))

# 10. Update settings reset fetch
old_settings_reset = '''    fetch('/api/admin/settings/reset', {
      method: 'POST',
      headers: session ? { 'Authorization': `Bearer ${session.token}` } : {}
    }).catch(() => {});'''

new_settings_reset = '''    fetch('/api/admin/settings/reset', {
      method: 'POST',
      headers: this.getAuthHeaders(false)
    }).catch(() => {});'''

text = text.replace(old_settings_reset.replace('\r\n', '\n'), new_settings_reset.replace('\r\n', '\n'))
text = text.replace(old_settings_reset.replace('\n', '\r\n'), new_settings_reset.replace('\n', '\r\n'))

# 11. Ensure login stores csrfToken
login_target = '''        const session: AdminSession = {
          token: body.session.token,
          user: body.session.user,
          expiresAt: body.session.expiresAt
        };'''

login_replacement = '''        const session: AdminSession = {
          token: body.session.token,
          csrfToken: body.session.csrfToken,
          user: body.session.user,
          expiresAt: body.session.expiresAt
        };'''

text = text.replace(login_target.replace('\r\n', '\n'), login_replacement.replace('\r\n', '\n'))
text = text.replace(login_target.replace('\n', '\r\n'), login_replacement.replace('\n', '\r\n'))

with open('C:/kavatha ca/src/services/adminStorage.ts', 'w', encoding='utf-8') as f:
    f.write(text)

print('Updated src/services/adminStorage.ts successfully')
