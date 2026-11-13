const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { 
  readDb, 
  writeDb, 
  BASELINE_DATA, 
  hashPassword, 
  verifyPassword, 
  generateSalt, 
  PBKDF2_ITERATIONS,
  SESSION_SECRET 
} = require('./db.cjs');

let createClient = null;
try {
  const sbModule = require('@supabase/supabase-js');
  createClient = sbModule.createClient;
} catch {
  // @supabase/supabase-js unavailable in test harness or offline
}

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_KEY;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
const EFFECTIVE_KEY = SUPABASE_SERVICE_KEY || SUPABASE_ANON_KEY;

function isDurableConfigured() {
  return Boolean(
    createClient &&
    SUPABASE_URL &&
    EFFECTIVE_KEY &&
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_URL !== 'https://your-project-id.supabase.co' &&
    EFFECTIVE_KEY !== 'your-anon-key-here'
  );
}

let supabaseInstance = null;
if (isDurableConfigured()) {
  try {
    supabaseInstance = createClient(SUPABASE_URL, EFFECTIVE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false }
    });
  } catch (err) {
    console.warn('[DurableStorage] Failed to initialize Supabase client:', err);
  }
}

function getDurableStatus() {
  const isConfigured = isDurableConfigured();
  const hasServiceRole = Boolean(SUPABASE_SERVICE_KEY && SUPABASE_SERVICE_KEY !== 'your-service-role-key-here');
  return {
    isDurable: isConfigured,
    provider: isConfigured ? 'supabase' : 'local_json',
    storageTarget: isConfigured 
      ? `Supabase (${new URL(SUPABASE_URL).hostname}) [${hasServiceRole ? 'service_role' : 'anon'}]`
      : (process.env.VERCEL ? 'Vercel /tmp (Ephemeral Warning)' : 'Local File (data/practice_db.json)'),
    hasServiceRole,
    strictMode: Boolean(process.env.STRICT_DURABLE_STORAGE === 'true' || (process.env.VERCEL && process.env.NODE_ENV === 'production'))
  };
}

// =============================================================================
// 1. CLIENT ENQUIRIES (DURABLE CRUD)
// =============================================================================

async function readAllEnquiries() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('enquiries')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(d => ({
          id: d.id,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
          fullName: d.full_name,
          entityType: d.entity_type || '',
          organization: d.organization || '',
          phone: d.phone,
          email: d.email || '',
          serviceCategory: d.service_category,
          city: d.city,
          urgency: d.urgency,
          message: d.message,
          status: d.status,
          followUpNotes: d.follow_up_notes || ''
        }));
      }
      console.warn('[DurableStorage] Supabase enquiries fetch failed, falling back to local DB:', error);
    } catch (err) {
      console.warn('[DurableStorage] Supabase enquiries query exception:', err);
    }
  }

  const db = readDb();
  return db.enquiries || [];
}

async function saveEnquiry(enquiry) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('enquiries')
        .upsert({
          id: enquiry.id,
          full_name: enquiry.fullName,
          entity_type: enquiry.entityType || null,
          organization: enquiry.organization || null,
          phone: enquiry.phone,
          email: enquiry.email || null,
          service_category: enquiry.serviceCategory,
          city: enquiry.city,
          urgency: enquiry.urgency === 'Urgent / Approaching Deadline' ? 'statutory-deadline' : (enquiry.urgency || 'routine'),
          message: enquiry.message,
          status: enquiry.status || 'new',
          follow_up_notes: enquiry.followUpNotes || '',
          created_at: enquiry.createdAt,
          updated_at: enquiry.updatedAt || new Date().toISOString()
        });

      if (error) {
        console.error('[DurableStorage] CRITICAL: Supabase enquiry insert failed:', error);
        return { 
          success: false, 
          error: `Durable database write failed: ${error.message} (${error.code || 'UNKNOWN'})` 
        };
      }

      // Update local cache on successful durable write
      const db = readDb();
      db.enquiries = db.enquiries || [];
      db.enquiries.unshift(enquiry);
      writeDb(db);
      return { success: true, enquiry };
    } catch (err) {
      console.error('[DurableStorage] Supabase exception during enquiry insert:', err);
      return { 
        success: false, 
        error: `Durable storage exception: ${err instanceof Error ? err.message : String(err)}` 
      };
    }
  }

  if (isStrict) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production. Ephemeral write aborted.'
    };
  }

  const db = readDb();
  db.enquiries = db.enquiries || [];
  db.enquiries.unshift(enquiry);
  writeDb(db);

  return { success: true, enquiry, warning: !isDurableConfigured() ? 'Stored in local/ephemeral store' : undefined };
}

async function updateEnquiryStatus(id, status, followUpNotes) {
  const ALLOWED_STATUSES = ['new', 'contacted', 'in-progress', 'closed'];
  if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
    return {
      success: false,
      error: `Invalid status '${status}'. Status must be one of: ${ALLOWED_STATUSES.join(', ')}.`
    };
  }

  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const updatePayload = {
        status,
        updated_at: new Date().toISOString()
      };
      if (followUpNotes !== undefined) updatePayload.follow_up_notes = followUpNotes;

      const { error } = await supabaseInstance
        .from('enquiries')
        .update(updatePayload)
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable update failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.enquiries = db.enquiries || [];
  const idx = db.enquiries.findIndex(e => e.id === id);
  if (idx !== -1) {
    db.enquiries[idx].status = status;
    if (followUpNotes !== undefined) db.enquiries[idx].followUpNotes = followUpNotes;
    db.enquiries[idx].updatedAt = new Date().toISOString();
    writeDb(db);
  }

  return { success: true };
}

async function deleteEnquiry(id) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('enquiries')
        .delete()
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable delete failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.enquiries = (db.enquiries || []).filter(e => e.id !== id);
  writeDb(db);

  return { success: true };
}

// =============================================================================
// 2. SERVICES CATALOG (DURABLE CRUD & ORDERING)
// =============================================================================

async function readAllServices() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('content_services')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const active = [];
        const deleted = [];
        data.forEach(row => {
          const s = {
            id: row.id,
            title: row.title,
            shortDescription: row.short_description,
            fullDescription: row.full_description,
            statutoryFramework: row.statutory_framework || '',
            targetClients: row.target_clients || '',
            typicalScenarios: Array.isArray(row.typical_scenarios) ? row.typical_scenarios : [],
            services: Array.isArray(row.sub_services) ? row.sub_services : [],
            iconName: row.icon_name || 'Briefcase',
            seo: row.seo || {
              metaTitle: `${row.title} | Kavitha & Associates`,
              metaDescription: row.short_description || '',
              canonicalUrl: `https://kavithaassociates.com/services/${row.id}`
            },
            status: row.status,
            order: row.display_order,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            deletedAt: row.deleted_at
          };
          if (row.deleted_at) {
            deleted.push(s);
          } else {
            active.push(s);
          }
        });
        return { active, deleted };
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase services fetch exception:', err);
    }
  }

  const db = readDb();
  return {
    active: (db.services || []).filter(s => !s.deletedAt),
    deleted: db.deletedServices || []
  };
}

async function saveService(service) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_services')
        .upsert({
          id: service.id,
          title: service.title,
          short_description: service.shortDescription || '',
          full_description: service.fullDescription || '',
          statutory_framework: service.statutoryFramework || '',
          target_clients: service.targetClients || '',
          typical_scenarios: service.typicalScenarios || [],
          sub_services: service.services || [],
          icon_name: service.iconName || 'Briefcase',
          seo: service.seo || {},
          status: service.status || 'published',
          display_order: service.order || 1,
          deleted_at: service.deletedAt || null,
          created_at: service.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: `Durable database write failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.services = db.services || [];
  const idx = db.services.findIndex(s => s.id === service.id);
  if (idx !== -1) {
    db.services[idx] = { ...db.services[idx], ...service, updatedAt: new Date().toISOString() };
  } else {
    db.services.push({ ...service, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  db.deletedServices = (db.deletedServices || []).filter(s => s.id !== service.id);
  writeDb(db);

  return { success: true, service };
}

async function deleteService(id) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_services')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable delete failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.services = db.services || [];
  const match = db.services.find(s => s.id === id);
  if (match) {
    match.deletedAt = new Date().toISOString();
    db.deletedServices = db.deletedServices || [];
    db.deletedServices = db.deletedServices.filter(s => s.id !== id);
    db.deletedServices.push(match);
    db.services = db.services.filter(s => s.id !== id);
    writeDb(db);
  }

  return { success: true };
}

async function recoverService(id) {
  const db = readDb();
  db.deletedServices = db.deletedServices || [];
  const match = db.deletedServices.find(s => s.id === id);
  if (match) {
    delete match.deletedAt;
    match.updatedAt = new Date().toISOString();
    db.services = db.services || [];
    db.services.push(match);
    db.deletedServices = db.deletedServices.filter(s => s.id !== id);
    writeDb(db);
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_services')
        .update({ deleted_at: null, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable recover failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, service: match };
}

async function reorderServices(orderedIds) {
  const db = readDb();
  db.services = db.services || [];
  orderedIds.forEach((id, idx) => {
    const s = db.services.find(item => item.id === id);
    if (s) s.order = idx + 1;
  });
  db.services.sort((a, b) => (a.order || 0) - (b.order || 0));
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const updates = orderedIds.map((id, idx) => 
        supabaseInstance
          .from('content_services')
          .update({ display_order: idx + 1, updated_at: new Date().toISOString() })
          .eq('id', id)
      );
      await Promise.all(updates);
    } catch (err) {
      return { success: false, error: `Durable reorder failed: ${err.message}` };
    }
  }

  return { success: true, services: db.services };
}

// =============================================================================
// 3. FAQS CATALOG (DURABLE CRUD & ORDERING)
// =============================================================================

async function readAllFaqs() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('content_faqs')
        .select('*')
        .order('display_order', { ascending: true });

      if (!error && Array.isArray(data) && data.length > 0) {
        const active = [];
        const deleted = [];
        data.forEach(row => {
          const f = {
            id: row.id,
            question: row.question,
            answer: row.answer,
            statuteReference: row.statute_reference || '',
            category: row.category || 'General Practice',
            serviceIds: Array.isArray(row.service_ids) ? row.service_ids : [],
            status: row.status,
            order: row.display_order,
            createdAt: row.created_at,
            updatedAt: row.updated_at,
            deletedAt: row.deleted_at
          };
          if (row.deleted_at) {
            deleted.push(f);
          } else {
            active.push(f);
          }
        });
        return { active, deleted };
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase FAQs fetch exception:', err);
    }
  }

  const db = readDb();
  return {
    active: (db.faqs || []).filter(f => !f.deletedAt),
    deleted: db.deletedFaqs || []
  };
}

async function saveFaq(faq) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_faqs')
        .upsert({
          id: faq.id,
          question: faq.question,
          answer: faq.answer,
          statute_reference: faq.statuteReference || '',
          category: faq.category || 'General Practice',
          service_ids: faq.serviceIds || [],
          status: faq.status || 'published',
          display_order: faq.order || 1,
          deleted_at: faq.deletedAt || null,
          created_at: faq.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: `Durable database write failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.faqs = db.faqs || [];
  const idx = db.faqs.findIndex(f => f.id === faq.id);
  if (idx !== -1) {
    db.faqs[idx] = { ...db.faqs[idx], ...faq, updatedAt: new Date().toISOString() };
  } else {
    db.faqs.push({ ...faq, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  db.deletedFaqs = (db.deletedFaqs || []).filter(f => f.id !== faq.id);
  writeDb(db);

  return { success: true, faq };
}

async function deleteFaq(id) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_faqs')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable delete failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.faqs = db.faqs || [];
  const match = db.faqs.find(f => f.id === id);
  if (match) {
    match.deletedAt = new Date().toISOString();
    db.deletedFaqs = db.deletedFaqs || [];
    db.deletedFaqs = db.deletedFaqs.filter(f => f.id !== id);
    db.deletedFaqs.push(match);
    db.faqs = db.faqs.filter(f => f.id !== id);
    writeDb(db);
  }

  return { success: true };
}

async function recoverFaq(id) {
  const db = readDb();
  db.deletedFaqs = db.deletedFaqs || [];
  const match = db.deletedFaqs.find(f => f.id === id);
  if (match) {
    delete match.deletedAt;
    match.updatedAt = new Date().toISOString();
    db.faqs = db.faqs || [];
    db.faqs.push(match);
    db.deletedFaqs = db.deletedFaqs.filter(f => f.id !== id);
    writeDb(db);
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_faqs')
        .update({ deleted_at: null, updated_at: new Date().toISOString() })
        .eq('id', id);

      if (error) {
        return { success: false, error: `Durable recover failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  return { success: true, faq: match };
}

async function reorderFaqs(orderedIds) {
  const db = readDb();
  db.faqs = db.faqs || [];
  orderedIds.forEach((id, idx) => {
    const f = db.faqs.find(item => item.id === id);
    if (f) f.order = idx + 1;
  });
  db.faqs.sort((a, b) => (a.order || 0) - (b.order || 0));
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const updates = orderedIds.map((id, idx) => 
        supabaseInstance
          .from('content_faqs')
          .update({ display_order: idx + 1, updated_at: new Date().toISOString() })
          .eq('id', id)
      );
      await Promise.all(updates);
    } catch (err) {
      return { success: false, error: `Durable reorder failed: ${err.message}` };
    }
  }

  return { success: true, faqs: db.faqs };
}

// =============================================================================
// 4. PRACTICE SETTINGS (DURABLE)
// =============================================================================

async function readSettings() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('practice_settings')
        .select('*')
        .eq('id', 'primary')
        .maybeSingle();

      if (!error && data) {
        return {
          primaryPhone: data.primary_phone,
          secondaryPhone: data.secondary_phone || '',
          email: data.email,
          primaryLocation: data.primary_location,
          googleMapsUrl: data.google_maps_url,
          whatsappLink: data.whatsapp_link,
          openingHours: data.opening_hours,
          updatedAt: data.updated_at
        };
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase settings fetch exception:', err);
    }
  }

  const db = readDb();
  return db.settings || BASELINE_DATA.settings;
}

async function saveSettings(settings) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('practice_settings')
        .upsert({
          id: 'primary',
          primary_phone: settings.primaryPhone,
          secondary_phone: settings.secondaryPhone || null,
          email: settings.email,
          primary_location: settings.primaryLocation,
          google_maps_url: settings.googleMapsUrl,
          whatsapp_link: settings.whatsappLink,
          opening_hours: settings.openingHours,
          updated_at: new Date().toISOString()
        });

      if (error) {
        return { success: false, error: `Durable settings write failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.settings = { ...db.settings, ...settings, updatedAt: new Date().toISOString() };
  writeDb(db);

  return { success: true, settings: db.settings };
}

// =============================================================================
// 5. DISTRIBUTED ADMIN CREDENTIALS & SESSIONS (DURABLE ACROSS CONTAINERS)
// =============================================================================

async function readAuthorizedUsers() {
  const db = readDb();
  const dbUsers = db.userCredentials || {};

  // If Supabase is configured, pull persistent credentials
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('admin_credentials')
        .select('*');

      if (!error && Array.isArray(data)) {
        data.forEach(cred => {
          dbUsers[cred.username] = {
            passwordHash: cred.password_hash,
            salt: cred.salt,
            iterations: cred.iterations || PBKDF2_ITERATIONS,
            algorithm: cred.algorithm || 'pbkdf2-sha512',
            role: cred.role || 'admin',
            updatedAt: cred.updated_at
          };
        });
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase credentials fetch exception:', err);
    }
  }

  const kavithaEnvPass = process.env.ADMIN_KAVITHA_PASSWORD;
  const adminEnvPass = process.env.ADMIN_PASSWORD;

  let kavithaHash = dbUsers?.kavitha?.passwordHash || null;
  let kavithaSalt = dbUsers?.kavitha?.salt || null;
  let kavithaIterations = dbUsers?.kavitha?.iterations || PBKDF2_ITERATIONS;

  if (!kavithaHash && kavithaEnvPass) {
    kavithaSalt = 'kavitha_env_salt_' + (process.env.SESSION_SECRET || 'static').slice(0, 16);
    kavithaHash = hashPassword(kavithaEnvPass, kavithaSalt, kavithaIterations);
  }

  let adminHash = dbUsers?.admin?.passwordHash || null;
  let adminSalt = dbUsers?.admin?.salt || null;
  let adminIterations = dbUsers?.admin?.iterations || PBKDF2_ITERATIONS;

  if (!adminHash && adminEnvPass) {
    adminSalt = 'admin_env_salt_' + (process.env.SESSION_SECRET || 'static').slice(0, 16);
    adminHash = hashPassword(adminEnvPass, adminSalt, adminIterations);
  }

  return [
    {
      username: 'kavitha',
      passwordHash: kavithaHash,
      salt: kavithaSalt,
      iterations: kavithaIterations,
      isConfigured: Boolean(kavithaHash),
      displayName: 'CA Kavitha Vijay',
      role: 'Managing Partner'
    },
    {
      username: 'admin',
      passwordHash: adminHash,
      salt: adminSalt,
      iterations: adminIterations,
      isConfigured: Boolean(adminHash),
      displayName: 'Practice Administrator',
      role: 'Practice Administrator'
    }
  ];
}

async function updateUserPassword(username, newPassword) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  const salt = generateSalt();
  const iterations = PBKDF2_ITERATIONS;
  const hash = hashPassword(newPassword, salt, iterations);
  const nowSec = Math.floor(Date.now() / 1000);
  const db = readDb();
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  let currentEpoch = db.userRevocationEpochs[username] || 0;

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data } = await supabaseInstance
        .from('user_revocation_epochs')
        .select('epoch_sec')
        .eq('username', username)
        .maybeSingle();
      if (data && Number(data.epoch_sec) > currentEpoch) {
        currentEpoch = Number(data.epoch_sec);
      }
    } catch {}
  }
  const epochSec = Math.max(nowSec, currentEpoch + 1);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const [credRes, epochRes] = await Promise.all([
        supabaseInstance
          .from('admin_credentials')
          .upsert({
            username,
            password_hash: hash,
            salt,
            iterations,
            algorithm: 'pbkdf2-sha512',
            role: username === 'kavitha' ? 'managing_partner' : 'admin',
            updated_at: new Date().toISOString()
          }),
        supabaseInstance
          .from('user_revocation_epochs')
          .upsert({
            username,
            epoch_sec: epochSec,
            updated_at: new Date().toISOString()
          })
      ]);

      if (credRes.error || epochRes.error) {
        const err = credRes.error || epochRes.error;
        return { success: false, error: `Durable password update failed: ${err.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  db.userCredentials = db.userCredentials || {};
  db.userCredentials[username] = {
    salt,
    passwordHash: hash,
    iterations,
    algorithm: 'pbkdf2-sha512',
    updatedAt: new Date().toISOString()
  };
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  db.userRevocationEpochs[username] = epochSec;
  writeDb(db);

  return { success: true };
}

// =============================================================================
// 6. DISTRIBUTED LOGIN RATE LIMITING (SHARED ACROSS SERVERLESS INSTANCES)
// =============================================================================

async function checkLoginRateLimit(rateKey) {
  const now = Date.now();

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('login_rate_limits')
        .select('*')
        .eq('rate_key', rateKey)
        .maybeSingle();

      if (!error && data) {
        const lockoutUntil = Number(data.lockout_until) || 0;
        if (lockoutUntil && now < lockoutUntil) {
          const remainingMinutes = Math.ceil((lockoutUntil - now) / 60000);
          return { locked: true, remainingMinutes, attempts: data.attempts || 5 };
        }
        return { locked: false, remainingMinutes: 0, attempts: data.attempts || 0 };
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase rate limit fetch exception:', err);
    }
  }

  const db = readDb();
  db.rateLimits = db.rateLimits || {};
  const rateInfo = db.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };
  if (rateInfo.lockoutUntil && now < rateInfo.lockoutUntil) {
    const remainingMinutes = Math.ceil((rateInfo.lockoutUntil - now) / 60000);
    return { locked: true, remainingMinutes, attempts: rateInfo.attempts };
  }
  return { locked: false, remainingMinutes: 0, attempts: rateInfo.attempts };
}

async function recordFailedLoginAttempt(rateKey) {
  const now = Date.now();
  const db = readDb();
  db.rateLimits = db.rateLimits || {};
  const rateInfo = db.rateLimits[rateKey] || { attempts: 0, lockoutUntil: 0 };
  rateInfo.attempts += 1;
  if (rateInfo.attempts >= 5) {
    rateInfo.lockoutUntil = now + 15 * 60 * 1000; // 15 mins
  }
  db.rateLimits[rateKey] = rateInfo;
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      await supabaseInstance
        .from('login_rate_limits')
        .upsert({
          rate_key: rateKey,
          attempts: rateInfo.attempts,
          lockout_until: rateInfo.lockoutUntil || 0,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to record login attempt:', err);
    }
  }

  return rateInfo;
}

async function clearLoginRateLimit(rateKey) {
  const db = readDb();
  if (db.rateLimits && db.rateLimits[rateKey]) {
    delete db.rateLimits[rateKey];
    writeDb(db);
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      await supabaseInstance
        .from('login_rate_limits')
        .delete()
        .eq('rate_key', rateKey);
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to clear rate limit:', err);
    }
  }
}

// =============================================================================
// 7. DISTRIBUTED TOKEN REVOCATION & USER EPOCHS
// =============================================================================

async function isTokenRevokedDurable(jti, username, iatSec) {
  const db = readDb();

  // 1. Check local DB cache
  if (db.revokedTokens && db.revokedTokens[jti]) return true;
  if (db.userRevocationEpochs && username && db.userRevocationEpochs[username]) {
    if (iatSec <= db.userRevocationEpochs[username]) return true;
  }

  // 2. Check Supabase shared tables across all serverless instances
  if (isDurableConfigured() && supabaseInstance) {
    try {
      if (jti) {
        const { data: revData } = await supabaseInstance
          .from('revoked_tokens')
          .select('jti')
          .eq('jti', jti)
          .maybeSingle();

        if (revData && revData.jti) return true;
      }

      if (username) {
        const { data: epochData } = await supabaseInstance
          .from('user_revocation_epochs')
          .select('epoch_sec')
          .eq('username', username)
          .maybeSingle();

        if (epochData && iatSec <= Number(epochData.epoch_sec)) return true;
      }
    } catch (err) {
      console.warn('[DurableStorage] Token revocation check exception:', err);
    }
  }

  return false;
}

async function revokeTokenDurable(jti, expSec) {
  const db = readDb();
  db.revokedTokens = db.revokedTokens || {};
  db.revokedTokens[jti] = expSec;
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      await supabaseInstance
        .from('revoked_tokens')
        .upsert({
          jti,
          expires_at: new Date(expSec * 1000).toISOString(),
          revoked_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to revoke token:', err);
    }
  }
}

async function revokeAllUserSessionsDurable(username) {
  const nowSec = Math.floor(Date.now() / 1000);
  const db = readDb();
  db.userRevocationEpochs = db.userRevocationEpochs || {};
  let currentEpoch = db.userRevocationEpochs[username] || 0;

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data } = await supabaseInstance
        .from('user_revocation_epochs')
        .select('epoch_sec')
        .eq('username', username)
        .maybeSingle();
      if (data && Number(data.epoch_sec) > currentEpoch) {
        currentEpoch = Number(data.epoch_sec);
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to query current revocation epoch:', err);
    }
  }
  const epochSec = Math.max(nowSec, currentEpoch + 1);
  db.userRevocationEpochs[username] = epochSec;
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      await supabaseInstance
        .from('user_revocation_epochs')
        .upsert({
          username,
          epoch_sec: epochSec,
          updated_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to update revocation epoch:', err);
    }
  }
}

// =============================================================================
// 8. SLUG REDIRECTS (DURABLE)
// =============================================================================

async function readSlugRedirects() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('slug_redirects')
        .select('*');

      if (!error && Array.isArray(data)) {
        const map = {};
        data.forEach(r => map[r.old_slug] = r.new_slug);
        return map;
      }
    } catch (err) {
      console.warn('[DurableStorage] Supabase slug redirects fetch exception:', err);
    }
  }

  const db = readDb();
  return db.slugRedirects || {};
}

async function recordSlugRedirect(oldSlug, newSlug) {
  const db = readDb();
  db.slugRedirects = db.slugRedirects || {};
  db.slugRedirects[oldSlug] = newSlug;
  writeDb(db);

  if (isDurableConfigured() && supabaseInstance) {
    try {
      await supabaseInstance
        .from('slug_redirects')
        .upsert({
          old_slug: oldSlug,
          new_slug: newSlug,
          created_at: new Date().toISOString()
        });
    } catch (err) {
      console.warn('[DurableStorage] Supabase failed to record slug redirect:', err);
    }
  }
}

// =============================================================================
// 9. BLOG POSTS & ARTICLES (DURABLE CLOUD PERSISTENCE)
// =============================================================================

async function readAllPosts() {
  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { data, error } = await supabaseInstance
        .from('content_posts')
        .select('*')
        .is('deleted_at', null)
        .order('date', { ascending: false });

      if (!error && Array.isArray(data)) {
        return data.map(d => ({
          slug: d.slug,
          title: d.title,
          excerpt: d.excerpt || '',
          content: d.content || '',
          tags: d.tags || [],
          author: d.author || 'CA Kavitha Vijay',
          authorRole: d.author_role || 'Managing Partner',
          coverImage: d.cover_image || '',
          coverImageAlt: d.cover_image_alt || '',
          draft: Boolean(d.draft),
          readingTime: d.reading_time || '5 min read',
          seo: d.seo || {},
          date: d.date,
          createdAt: d.created_at,
          updatedAt: d.updated_at
        }));
      }
      console.warn('[DurableStorage] Supabase posts fetch failed, falling back to local DB:', error);
    } catch (err) {
      console.warn('[DurableStorage] Supabase posts fetch exception:', err);
    }
  }

  const db = readDb();
  return db.posts || [];
}

async function savePost(post) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_posts')
        .upsert({
          slug: post.slug,
          title: post.title,
          excerpt: post.excerpt || '',
          content: post.content || '',
          tags: Array.isArray(post.tags) ? post.tags : (post.tags ? String(post.tags).split(',').map(t => t.trim()).filter(Boolean) : []),
          author: post.author || 'CA Kavitha Vijay',
          author_role: post.authorRole || 'Managing Partner',
          cover_image: post.coverImage || '',
          cover_image_alt: post.coverImageAlt || '',
          draft: Boolean(post.draft),
          reading_time: post.readingTime || '5 min read',
          seo: post.seo || {},
          date: post.date || new Date().toISOString(),
          created_at: post.createdAt || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          deleted_at: null
        });

      if (error) {
        return { success: false, error: `Durable database write failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.posts = db.posts || [];
  const idx = db.posts.findIndex(p => p.slug && p.slug.toLowerCase().trim() === post.slug.toLowerCase().trim());
  if (idx !== -1) {
    db.posts[idx] = { ...db.posts[idx], ...post, updatedAt: new Date().toISOString() };
  } else {
    db.posts.push({ ...post, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
  }
  writeDb(db);

  return { success: true, post };
}

async function deletePost(slug) {
  const isStrict = process.env.STRICT_DURABLE_STORAGE === 'true';

  if (isStrict && (!isDurableConfigured() || !supabaseInstance)) {
    return {
      success: false,
      error: 'CRITICAL: Durable cloud storage is mandatory in production (STRICT_DURABLE_STORAGE=true). Database is unconfigured or unavailable.'
    };
  }

  if (isDurableConfigured() && supabaseInstance) {
    try {
      const { error } = await supabaseInstance
        .from('content_posts')
        .update({ deleted_at: new Date().toISOString() })
        .eq('slug', slug);

      if (error) {
        return { success: false, error: `Durable delete failed: ${error.message}` };
      }
    } catch (err) {
      return { success: false, error: err.message };
    }
  }

  if (isStrict && !isDurableConfigured()) {
    return { success: false, error: 'CRITICAL: Durable cloud storage unavailable in strict mode.' };
  }

  const db = readDb();
  db.posts = (db.posts || []).filter(p => !p.slug || p.slug.toLowerCase().trim() !== slug.toLowerCase().trim());
  writeDb(db);

  return { success: true };
}

module.exports = {
  isDurableConfigured,
  getDurableStatus,
  readAllEnquiries,
  saveEnquiry,
  updateEnquiryStatus,
  deleteEnquiry,
  readAllServices,
  saveService,
  deleteService,
  recoverService,
  reorderServices,
  readAllFaqs,
  saveFaq,
  deleteFaq,
  recoverFaq,
  reorderFaqs,
  readSettings,
  saveSettings,
  readAuthorizedUsers,
  updateUserPassword,
  checkLoginRateLimit,
  recordFailedLoginAttempt,
  clearLoginRateLimit,
  isTokenRevokedDurable,
  revokeTokenDurable,
  revokeAllUserSessionsDurable,
  readSlugRedirects,
  recordSlugRedirect,
  readAllPosts,
  savePost,
  deletePost
};
