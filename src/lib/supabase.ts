import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mlfakixbqzgttwzqinvl.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1sZmFraXhicXpndHR3enFpbnZsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MzUyNjAsImV4cCI6MjEwMzMxMTI2MH0.NVFZYl5sMuYa-mWMt7In-MqGSCVvLRf-KUOFn9eIJJk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

