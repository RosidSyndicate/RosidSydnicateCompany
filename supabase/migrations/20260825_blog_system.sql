-- ============================================================================
-- ROSID SYNDICATES GROUP — BLOG SYSTEM SUPABASE MIGRATION
-- ============================================================================

-- 1. Create Blog Categories Table
CREATE TABLE IF NOT EXISTS public.blog_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(100) DEFAULT 'FolderIcon',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Blog Posts Table
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title VARCHAR(500) NOT NULL,
    slug VARCHAR(500) UNIQUE NOT NULL,
    excerpt TEXT NOT NULL,
    content TEXT NOT NULL,
    featured_image TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    category_slug VARCHAR(255) NOT NULL,
    author VARCHAR(255) DEFAULT 'Rosid Editorial Team' NOT NULL,
    author_role VARCHAR(255) DEFAULT 'Executive Advisory',
    is_published BOOLEAN DEFAULT true NOT NULL,
    published_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    views INTEGER DEFAULT 0 NOT NULL,
    reading_time VARCHAR(50) DEFAULT '5 min read',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Enable Row Level Security (RLS)
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for Blog Categories
DROP POLICY IF EXISTS "Public can view blog categories" ON public.blog_categories;
CREATE POLICY "Public can view blog categories"
ON public.blog_categories FOR SELECT
TO public
USING (true);

DROP POLICY IF EXISTS "Authenticated users have full access to blog categories" ON public.blog_categories;
CREATE POLICY "Authenticated users have full access to blog categories"
ON public.blog_categories FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. RLS Policies for Blog Posts
DROP POLICY IF EXISTS "Public can view published blog posts" ON public.blog_posts;
CREATE POLICY "Public can view published blog posts"
ON public.blog_posts FOR SELECT
TO public
USING (is_published = true);

DROP POLICY IF EXISTS "Authenticated users have full access to blog posts" ON public.blog_posts;
CREATE POLICY "Authenticated users have full access to blog posts"
ON public.blog_posts FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. Trigger for updated_at column
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE PROCEDURE public.handle_updated_at();

-- 7. Seed Initial Categories
INSERT INTO public.blog_categories (name, slug, description, icon)
VALUES 
('Company News', 'company-news', 'Corporate updates, executive announcements, and strategic group milestones.', 'NewspaperIcon'),
('Infrastructure & Construction', 'infrastructure-construction', 'Engineering feats, civil works, equipment logistics, and nationwide project analysis in Nepal.', 'BuildingOffice2Icon'),
('Financial Advisory', 'financial-advisory', 'Bank syndication, debt structuring, counter-guarantees, and capital closure for mega energy projects.', 'BanknotesIcon'),
('International Trade', 'international-trade', 'Cross-border import/export operations, custom clearances, supply chain synergies, and heavy sourcing.', 'GlobeAltIcon'),
('Foreign Contractors', 'foreign-contractors', 'Comprehensive guides for international EPC firms, joint ventures, and PPA regulatory navigation in Nepal.', 'BriefcaseIcon')
ON CONFLICT (slug) DO UPDATE 
SET name = EXCLUDED.name, description = EXCLUDED.description;

-- 8. Seed Initial Blog Posts
INSERT INTO public.blog_posts (
    title, 
    slug, 
    excerpt, 
    content, 
    featured_image, 
    category, 
    category_slug, 
    author, 
    author_role,
    is_published, 
    published_at, 
    reading_time,
    tags
)
VALUES 
(
    'Welcome to Rosid Syndicates Group - Building Nepal''s Future',
    'welcome-to-rosid-syndicates-group-building-nepals-future',
    'An introduction to Rosid Syndicates Group, our six specialized subsidiaries, unified execution engine, and vision for nation-building infrastructure.',
    '## Engineering Nationwide Economic & Industrial Progress

**Rosid Syndicates Group** represents a premier multi-disciplinary conglomerate operating across the key pillars of Nepal''s economic growth: heavy infrastructure development, strategic procurement, sovereign financial advisory, and cross-border commercial trade.

Headquartered in New Baneshwor, Kathmandu, our group operates as an integrated execution engine connecting global EPC contractors, international investors, and government bodies with reliable on-the-ground execution in Nepal.

---

### Our Operating Ecosystem: Six Specialized Subsidiaries

Our strength lies in the synergistic alignment of six dedicated corporate subsidiaries:

1. **Roshan Enterprises Pvt. Ltd.** — Bulk supply of certified construction materials, public-private procurement, and national material distribution.
2. **Appi Saipal Financial Solutions Pvt. Ltd.** — Financial closure, Class "A" bank consortium syndication, counter-guarantees, and risk mitigation for energy mega-projects.
3. **Kasthamandap Commerce and Company Pvt. Ltd.** — Nationwide trading networks, domestic raw material sourcing, and supply-only civil tenders.
4. **B & C Exim Company Pvt. Ltd.** — International import/export execution, customs navigation, warehousing, and last-mile logistics.
5. **Deiyougo Enterprises Pvt. Ltd.** — Government procurement bidding, specialized industrial machinery sourcing, and tender fulfillment.
6. **Vharmal Singh Multipurpose and Construction Company Pvt. Ltd.** — Earthworks, highway building, structural engineering, and integrated civil construction contracts.

---

### Bridging Global Capability with Local Execution

Entering Nepal''s infrastructure market presents remarkable opportunities, from the 10,000 MW hydropower master plan to trans-Himalayan transmission corridors. However, foreign contractors frequently face regulatory friction under the Public Procurement Act (PPA), local bank guarantee compliance, and complex regional logistics.

Rosid Syndicates Group acts as the definitive in-country operational anchor. By uniting financial guarantees, bulk material supply lines, and civil engineering machinery under one unified group structure, we eliminate project bottlenecks and guarantee timeline integrity.',
    'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=100&w=3840&auto=format&fit=crop',
    'Company News',
    'company-news',
    'Roshan Pandey',
    'Chairman & Managing Director',
    true,
    '2026-08-20T10:00:00Z',
    '4 min read',
    ARRAY['Corporate', 'Infrastructure', 'Subsidiaries', 'Nepal Trade']
),
(
    'A Guide to Bank Guarantees for Foreign Contractors in Nepal',
    'guide-to-bank-guarantees-for-foreign-contractors-nepal',
    'Comprehensive guide on structuring Bid Bonds, Performance Bonds, Advance Payment Guarantees, and counter-guarantees under Nepal Rastra Bank guidelines.',
    '## Demystifying Financial Instruments in Nepal''s Public Procurement

For international engineering and construction firms bidding on sovereign infrastructure contracts in Nepal, navigating the banking and guarantee framework is one of the most critical pre-bid requirements. 

Under the **Public Procurement Act (PPA)** and directives issued by **Nepal Rastra Bank (NRB)**, international bidders must issue tenders and contract guarantees through licensed Class "A" commercial banks in Nepal.

---

### Core Guarantee Instruments Required

```
Bid Security (Bid Bond)
  └── 2% to 5% of estimated project value
Performance Guarantee
  └── 5% (standard) to 10% (specialized) of contract value
Advance Payment Guarantee (APG)
  └── 100% of mobilization disbursement (typically 10%–20% of contract)
Retention Money Guarantee / Defect Liability Bond
  └── 5% retained during the Defect Notification Period
```

---

### The Counter-Guarantee Challenge

Foreign banks without direct SWIFT credit arrangements with Nepalese Class "A" banks often encounter substantial delays or steep collateral demands when issuing counter-guarantees. 

### How Appi Saipal Financial Solutions Accelerates Closure

Through **Appi Saipal Financial Solutions Pvt. Ltd.**, Rosid Syndicates Group resolves these frictions through:

- **Pre-Arranged Credit Lines:** Institutional standing with premier Class "A" Nepalese banks.
- **Rapid SWIFT Confirmation:** Expedited MT760/MT799 verification for overseas banks.
- **Tripartite Guarantee Structuring:** Direct coordination between the foreign EPC sponsor, the Nepalese issuing bank, and the procuring government agency.
- **Cost Minimization:** Negotiating competitive issuance fees and minimal margin collateral holding requirements.',
    'https://images.unsplash.com/photo-1554469384-e58fac16e23a?q=100&w=3840&auto=format&fit=crop',
    'Foreign Contractors',
    'foreign-contractors',
    'Appi Saipal Advisory Team',
    'Financial Engineering Division',
    true,
    '2026-08-22T08:30:00Z',
    '6 min read',
    ARRAY['Bank Guarantees', 'Foreign Contractors', 'NRB Compliance', 'Bid Bonds']
),
(
    'Hydropower Project Reaches Financial Closure',
    'hydropower-project-reaches-financial-closure',
    'A landmark case study showcasing how Appi Saipal structured a multi-bank consortium syndication for an 86 MW run-of-river hydropower project in eastern Nepal.',
    '## Case Study: Structured Debt Syndication & Risk Mitigation

Rosid Syndicates Group is pleased to announce the successful financial closure of an **86 MW Run-of-River (RoR) Hydropower Project** in Koshi Province, Nepal. The project represents a total capital investment exceeding USD $140 Million.

The financial structuring and consortium debt arrangement were led by **Appi Saipal Financial Solutions Pvt. Ltd.** in partnership with a syndicate of tier-one Nepalese commercial banks and private infrastructure funds.

---

### Project Key Facts & Metrics

- **Installed Capacity:** 86 MW Run-of-River Hydroelectric Station
- **Total Project Outlay:** NPR 18.2 Billion (~USD $138M)
- **Debt-to-Equity Ratio:** 75:25 Structured Project Finance
- **Lead Syndicate Bank:** Class "A" Commercial Consortium (4 Banks)
- **Power Purchase Agreement (PPA):** Long-term take-or-pay with Nepal Electricity Authority (NEA)

---

### Strategic Financial Engineering Interventions

Appi Saipal provided end-to-end capital advisory throughout the 14-month development cycle:

1. **Multi-Tier Debt Syndication:** Structured Senior Debt tranches with staggered maturity profiles matching the river basin hydrological yield forecasts.
2. **Construction Risk Ring-Fencing:** Formulated escrow waterfall mechanisms protecting debt servicing while ensuring uninterrupted liquidity for civil works executed by group partners.
3. **Forex Risk Hedging:** Formulated NRB-compliant counter-hedging structures for turbine and electro-mechanical imports sourced from European manufacturers.

This milestone reinforces Rosid Syndicates Group''s reputation as an indispensable catalyst for Nepal''s sovereign clean energy independence.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?q=100&w=3840&auto=format&fit=crop',
    'Financial Advisory',
    'financial-advisory',
    'Energy Capital Desk',
    'Infrastructure Finance',
    true,
    '2026-08-24T12:00:00Z',
    '5 min read',
    ARRAY['Hydropower', 'Financial Closure', 'Debt Syndication', 'Clean Energy']
),
(
    'How Foreign Contractors Can Enter Nepal''s Infrastructure Market',
    'how-foreign-contractors-can-enter-nepals-infrastructure-market',
    'A strategic blueprint detailing PPA compliance, local agency alignment, Joint Venture (JV) agreements, and site execution logistics in Nepal.',
    '## Strategic Blueprint for International Bidders

Nepal''s infrastructure landscape is experiencing unprecedented growth. Multilateral funding from the Asian Development Bank (ADB), World Bank, and bilateral development assistance has opened billions in road networks, airport expansions, tunneling, and high-voltage transmission projects.

However, international contractors often struggle with local joint-venture mandates, regulatory clearances, and procurement dispute mechanisms.

---

### 1. Understanding the Legal Framework (PPA / PPMO)

International tenders in Nepal are regulated under the **Public Procurement Act, 2063 (2007)** and Public Procurement Regulations, 2064. Key stipulations include:

- **Mandatory Domestic Preference:** Bids offering domestic participation or local joint ventures are often granted statutory evaluation preferences.
- **e-GP Portal Submissions:** All public bids must be submitted through the electronic government procurement portal managed by the PPMO.
- **Taxation & Repatriation:** Navigating Foreign Investment and Technology Transfer Act (FITTA) rules for profit repatriation.

---

### 2. The Power of Local Joint Venture (JV) Structuring

Partnering with a proven local conglomerate like **Rosid Syndicates Group** transforms overseas engineering power into successful in-country completion:

- **Equipment & Heavy Machinery:** Access to crushing plants, dump trucks, and excavators through *Vharmal Singh Construction*.
- **Certified Bulk Materials:** Immediate bulk procurement of OPC 53 Grade cement, TMT rebar, and aggregate through *Roshan Enterprises*.
- **Local Workforce & Community Liaisons:** Smooth social license to operate, land acquisition mediation, and site security.',
    'https://images.unsplash.com/photo-1541888056262-563b7852f826?q=100&w=3840&auto=format&fit=crop',
    'Foreign Contractors',
    'foreign-contractors',
    'Roshan Pandey & Advisory Board',
    'Executive Leadership',
    true,
    '2026-08-25T09:00:00Z',
    '7 min read',
    ARRAY['Foreign Contractors', 'Public Procurement', 'Joint Ventures', 'Nepal Bidding']
)
ON CONFLICT (slug) DO UPDATE 
SET 
    title = EXCLUDED.title,
    excerpt = EXCLUDED.excerpt,
    content = EXCLUDED.content,
    featured_image = EXCLUDED.featured_image,
    category = EXCLUDED.category,
    category_slug = EXCLUDED.category_slug,
    author = EXCLUDED.author,
    author_role = EXCLUDED.author_role,
    is_published = EXCLUDED.is_published,
    reading_time = EXCLUDED.reading_time,
    tags = EXCLUDED.tags;
