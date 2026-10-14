# homemealsguide-com

Next.js site for homemealsguide.com.

```bash
npm install
npm run dev
```

## Pages

- `/` quiz page (copy of mealsprogram.netlify.app)
- `/chat` chat page (copy of mealsprogram.netlify.app/chat)

Both pages load the tracking scripts from `app/components/FunnelLayout.tsx`
and read these environment variables:

```bash
NEXT_PUBLIC_GTM_CONTAINER_ID=""
NEXT_PUBLIC_JITSU_URL="https://tracking.adstiacms.com/p.js"
NEXT_PUBLIC_VOLUUM_URL=""
NEXT_PUBLIC_IP_ADDRESS_API_KEY=""

# Call button (defaults in app/lib/meals.ts)
NEXT_PUBLIC_PHONE=""          # e.g. +18885551234, buttons dial directly
NEXT_PUBLIC_PHONE_LABEL=""    # e.g. (888) 555-1234, shown under the button
NEXT_PUBLIC_CALL_URL="https://lander91rtu.senior-advisors.org/landers/6eqi" # used when the phone is empty
NEXT_PUBLIC_META_PIXEL_ID=""  # empty = no pixel
```
