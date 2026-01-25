//The connection between supabase and the project

import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm";

const supabaseUrl = "https://dxqfezwqdfwgiltuplvd.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4cWZlendxZGZ3Z2lsdHVwbHZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg4MzA4NDMsImV4cCI6MjA4NDQwNjg0M30.OFNcK17h4RWNZN0lFnJAwjumoSepf37d7tQP1MFY-Og";

export const supabase = createClient(supabaseUrl, supabaseKey);
