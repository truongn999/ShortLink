export default async function handler(req, res) {
  const { link_id } = req.query;

  const referer = req.headers.referer || "Direct";
  const userAgent = req.headers["user-agent"] || "";
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  // Detect country bằng Vercel geolocation headers
  const country = req.headers["x-vercel-ip-country"] || "Unknown";

  // Detect nguồn
  let source = "Direct";
  if (referer.includes("facebook.com")) source = "Facebook";
  else if (referer.includes("instagram.com")) source = "Instagram";
  else if (referer.includes("google.com")) source = "Google";
  else source = referer;

  // Lưu vào Supabase
  const { createClient } = require("@supabase/supabase-js");
  const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY);

  await supabase.from("click").insert({
    link_id,
    source,
    referer,
    country,
    ip,
    user_agent: userAgent
  });

  return res.redirect(302, process.env.REDIRECT_TARGET);
}
