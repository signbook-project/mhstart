# MHStart — Maharashtra Startup Ecosystem Platform

A full-stack website for Maharashtra's startup ecosystem with a public website and admin panel.

---

## 🗂️ What's Included

| Feature | Details |
|---|---|
| 🏠 Homepage | Hero, ticker, spotlight, news, map preview, CTA |
| 📰 News | Public listing, pinned articles, rich content, public submission |
| 🗺️ Ecosystem Map | Interactive map with startups & enablers, filter by type |
| 👥 People | Team, advisors, founding members, partners |
| 📍 Submit Listing | Startups/enablers can self-register (requires admin approval) |
| 📬 Contact | Contact form with admin inbox |
| ℹ️ About | About page with mission and city coverage |
| 🔐 Admin Panel | Full CMS for all content, news moderation, map listings, settings |

---

## 🚀 Deployment Guide (Step by Step — No Coding Needed)

### Step 1 — Create a Supabase Project (Free)

1. Go to [supabase.com](https://supabase.com) and sign up for free
2. Click **"New Project"** → choose a name like `mhstart` → set a strong DB password → click Create
3. Wait ~2 minutes for the project to be ready
4. Go to **Settings → API** and copy:
   - **Project URL** (looks like `https://xxxx.supabase.co`)
   - **anon public** key (long string starting with `eyJ...`)
   - **service_role secret** key (another long string — keep this private!)

### Step 2 — Set Up the Database

1. In Supabase, go to **SQL Editor** (left sidebar)
2. Click **"New query"**
3. Open the file `supabase-schema.sql` from this project and paste its entire contents
4. Click **"Run"** — you should see "Success"
5. Go to **Storage** → click **"New bucket"** → name it `media` → check **"Public bucket"** → Save

### Step 3 — Deploy to Vercel (Free)

1. Push this project to GitHub:
   - Go to [github.com](https://github.com) → create a new repository called `mhstart`
   - Upload all files, or use GitHub Desktop app
2. Go to [vercel.com](https://vercel.com) → sign in with GitHub
3. Click **"Add New Project"** → select your `mhstart` repository → click **Import**
4. Before clicking Deploy, click **"Environment Variables"** and add these one by one:

```
NEXT_PUBLIC_SUPABASE_URL        = (your Supabase Project URL from Step 1)
NEXT_PUBLIC_SUPABASE_ANON_KEY   = (your anon key from Step 1)
SUPABASE_SERVICE_ROLE_KEY       = (your service_role key from Step 1)
JWT_SECRET                      = (type any random 32+ character string, e.g. mhstart-super-secret-key-2024-xyz)
NEXT_PUBLIC_SITE_URL            = (your Vercel URL, e.g. https://mhstart.vercel.app)
```

5. Click **Deploy** — wait ~2 minutes

### Step 4 — Create Your Admin Account

1. Visit: `https://your-site.vercel.app/api/admin/setup`
2. You should see: `{"message":"Admin created: admin@mhstart.com / Billionapps@100!"}`
3. ✅ This only works once — if admin already exists, it shows a message and does nothing

### Step 5 — First Login

1. Go to: `https://your-site.vercel.app/admin/login`
2. Email: `admin@mhstart.com`
3. Password: `Billionapps@100!`
4. **Change your password immediately** in Admin → Settings → Change Password

### Step 6 — Configure Email (Optional but Recommended)

1. In Admin Panel → Settings → Email / SMTP
2. For Gmail:
   - Host: `smtp.gmail.com`
   - Port: `587`
   - User: your Gmail address
   - Password: Create an [App Password](https://myaccount.google.com/apppasswords) (requires 2FA enabled)
3. Click **Save**, then **Send Test Email** to verify

---

## 🔗 Important URLs

| URL | Purpose |
|---|---|
| `/` | Public homepage |
| `/news` | News listing |
| `/map` | Ecosystem map |
| `/people` | People directory |
| `/about` | About page |
| `/contact` | Contact form |
| `/submit` | Add a startup/enabler listing |
| `/news/submit` | Submit a news article |
| `/admin` | Admin dashboard (requires login) |
| `/admin/login` | Admin login |
| `/api/admin/setup` | One-time admin user creation |

---

## 📦 Tech Stack

| Layer | Technology | Cost |
|---|---|---|
| Frontend + Backend | Next.js 14 (App Router) | Free on Vercel |
| Database | Supabase (PostgreSQL) | Free tier (500MB, 2 projects) |
| File Storage | Supabase Storage | Free tier (1GB) |
| Hosting | Vercel | Free tier |
| Maps | Leaflet + OpenStreetMap | Free forever |
| Email | Nodemailer (your SMTP) | Free with Gmail |

**Total cost: ₹0/month** on free tiers.

---

## 🖼️ Adding Images

Since there's no built-in image uploader, use one of these free options:
- **Supabase Storage**: Go to Supabase → Storage → `media` bucket → Upload → copy the public URL
- **Cloudinary** (free): [cloudinary.com](https://cloudinary.com) — drag & drop, copy link
- **ImgBB** (free): [imgbb.com](https://imgbb.com) — paste URL into image fields in admin

---

## 🗺️ Adding Map Pins

When adding a listing, you need Latitude & Longitude coordinates:
1. Go to [Google Maps](https://maps.google.com)
2. Search for the location
3. Right-click on the map → click the coordinates shown at the top of the menu
4. Paste Latitude and Longitude into the form

---

## 🆘 Troubleshooting

**Site shows error after deploy:**
- Check Vercel → your project → Deployments → click on the deployment → View logs

**Admin login not working:**
- Make sure you ran `/api/admin/setup` first
- Check that `JWT_SECRET` is set in Vercel environment variables

**Map not showing:**
- Make sure listings have latitude & longitude filled in
- Map uses OpenStreetMap (free, no API key needed)

**Email not sending:**
- For Gmail, use an App Password (not your regular password)
- Make sure 2FA is enabled on your Google account first

---

## 📞 Admin Credentials (Default)

```
Email:    admin@mhstart.com
Password: Billionapps@100!
```

> ⚠️ Change this password immediately after first login via Admin → Settings → Change Password
