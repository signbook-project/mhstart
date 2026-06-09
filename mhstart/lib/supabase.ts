// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
// const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

// // Public client (for frontend use)
// export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// // Service role client (for API routes / admin)
// export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
//   auth: { autoRefreshToken: false, persistSession: false }
// })

// console.log("URL:", process.env.NEXT_PUBLIC_SUPABASE_URL)

import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase env vars')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const supabaseAdmin =
  supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
      })
    : supabase

// console.log('✅ Supabase initialized')