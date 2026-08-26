-- ============================================================================
-- ROSID SYNDICATES GROUP — COMPLETE ADMIN & CORE TABLES MIGRATION
-- ============================================================================

-- 1. Create Inquiries Table (For Contact & Tender Submissions)
CREATE TABLE IF NOT EXISTS public.inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inquiry_type VARCHAR(100) DEFAULT 'General Inquiry' NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(100),
    subject VARCHAR(500),
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'New' NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Companies / Subsidiaries Table
CREATE TABLE IF NOT EXISTS public.companies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    is_archived BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Site Content Table (Mission, Vision, Core Values)
CREATE TABLE IF NOT EXISTS public.site_content (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_key VARCHAR(100) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Credentials & Compliance Documents Table
CREATE TABLE IF NOT EXISTS public.credentials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,
    is_public BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================

ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.credentials ENABLE ROW LEVEL SECURITY;

-- Inquiries RLS: Public can INSERT inquiries (from contact/tender form), Admins have full access
DROP POLICY IF EXISTS "Public can insert inquiries" ON public.inquiries;
CREATE POLICY "Public can insert inquiries"
ON public.inquiries FOR INSERT
TO public
WITH CHECK (true);

DROP POLICY IF EXISTS "Authenticated users have full access to inquiries" ON public.inquiries;
CREATE POLICY "Authenticated users have full access to inquiries"
ON public.inquiries FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Companies RLS: Public can view active companies, Admins have full access
DROP POLICY IF EXISTS "Public can view active companies" ON public.companies;
CREATE POLICY "Public can view active companies"
ON public.companies FOR SELECT
TO public
USING (is_archived = false);

DROP POLICY IF EXISTS "Authenticated users have full access to companies" ON public.companies;
CREATE POLICY "Authenticated users have full access to companies"
ON public.companies FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Site Content RLS: Public can view content, Admins have full access
DROP POLICY IF EXISTS "Public can view site content" ON public.site_content;
CREATE POLICY "Public can view site content"
ON public.site_content FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users have full access to site content" ON public.site_content;
CREATE POLICY "Authenticated users have full access to site content"
ON public.site_content FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Credentials RLS: Public can view public credentials, Admins have full access
DROP POLICY IF EXISTS "Public can view public credentials" ON public.credentials;
CREATE POLICY "Public can view public credentials"
ON public.credentials FOR SELECT
TO public
USING (is_public = true);

DROP POLICY IF EXISTS "Authenticated users have full access to credentials" ON public.credentials;
CREATE POLICY "Authenticated users have full access to credentials"
ON public.credentials FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- ============================================================================
-- STORAGE BUCKET CREATION (FOR CREDENTIALS UPLOADS)
-- ============================================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('credentials_files', 'credentials_files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for credentials_files bucket
DROP POLICY IF EXISTS "Public can read credentials files" ON storage.objects;
CREATE POLICY "Public can read credentials files"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'credentials_files');

DROP POLICY IF EXISTS "Authenticated users can upload credentials files" ON storage.objects;
CREATE POLICY "Authenticated users can upload credentials files"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'credentials_files')
WITH CHECK (bucket_id = 'credentials_files');

-- ============================================================================
-- SEED INITIAL DATA
-- ============================================================================

-- Seed 6 Core Subsidiaries
INSERT INTO public.companies (name, slug, description, is_archived)
VALUES
('Roshan Enterprises Pvt. Ltd.', 'roshan-enterprises', 'Bulk supply of certified construction materials, public-private procurement, and national material distribution.', false),
('Appi Saipal Financial Solutions Pvt. Ltd.', 'appi-saipal-financial-solutions', 'Financial closure, Class A bank consortium syndication, counter-guarantees, and risk mitigation for energy mega-projects.', false),
('Kasthamandap Commerce and Company Pvt. Ltd.', 'kasthamandap-commerce', 'Nationwide trading networks, domestic raw material sourcing, and supply-only civil tenders.', false),
('B & C Exim Company Pvt. Ltd.', 'b-c-exim', 'International import/export execution, customs navigation, warehousing, and last-mile logistics.', false),
('Deiyougo Enterprises Pvt. Ltd.', 'deiyougo-enterprises', 'Government procurement bidding, specialized industrial machinery sourcing, and tender fulfillment.', false),
('Vharmal Singh Multipurpose and Construction Company Pvt. Ltd.', 'vharmal-singh-construction', 'Earthworks, highway building, structural engineering, and integrated civil construction contracts.', false)
ON CONFLICT (slug) DO UPDATE
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- Seed Corporate Site Content (Mission, Vision, Core Values)
INSERT INTO public.site_content (section_key, content)
VALUES
('mission', 'To accelerate Nepal''s industrial transformation by integrating sovereign financial engineering, tier-one infrastructure construction, and resilient international supply chains under one trusted group structure.'),
('vision', 'To be the preeminent corporate conglomerate and partner of choice for foreign EPC contractors, sovereign institutions, and multilateral investors driving South Asia''s sustainable development.'),
('core_values', 'Institutional Integrity, Engineering Precision, Financial Reliability, and Sovereign Stewardship.')
ON CONFLICT (section_key) DO UPDATE
SET content = EXCLUDED.content;
