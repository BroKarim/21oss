# Toolbox Activity Progress

## Done

- [x] Buat route awal `app/(web)/toolbox/activity/page.tsx`
- [x] Buat schema input `lib/toolbox/activity/schema.ts`
- [x] Buat parser URL `lib/toolbox/activity/parse-github-url.ts`
- [x] Validasi `GitHub profile URL` dan `GitHub repo URL`
- [x] Validasi `theme`, `palette`, `variant`
- [x] Normalisasi URL ke shape `{ type, username, owner, repo, normalizedUrl }`
- [x] Buat UI basic: title, input URL, button `Generate`
- [x] Buat section `Preview` dan `Editor` berdampingan
- [x] Buat editor control untuk `theme`, `palette`, `template`
- [x] Buat preview activity graph reusable di `components/web/toolbox/activity/graph.tsx`
- [x] Buat mock activity generator untuk preview sementara
- [x] Buat layout khusus `toolbox/` tanpa sidebar
- [x] Ganti sidebar jadi header biasa untuk route `toolbox/*`
- [x] Tambah nav header: `Templates` dan `Students`

## Next

- [ ] Buat `server/web/toolbox/activity/actions.ts`
- [ ] Fetch live data GitHub profile activity
- [ ] Fetch live data GitHub repo activity
- [ ] Ganti mock preview ke data hasil server action
- [ ] Implement `Copy Code` beneran dari generator code
- [ ] Implement `Export Image`
- [ ] Rapikan responsive header toolbox untuk mobile
