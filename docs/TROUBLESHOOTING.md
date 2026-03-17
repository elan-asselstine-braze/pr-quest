# Troubleshooting

## Localhost not connecting

If http://localhost:3000 doesn’t load after you run `npm run dev`, try the following.

### 1. Use the right directory

Run everything from the project root (the folder that contains `package.json`):

```bash
cd "/Users/elan.asselstine/Desktop/PR Quest"
npm run dev
```

If you’re elsewhere, you’ll see npm errors or the wrong app.

### 2. Confirm the dev server started

After `npm run dev` you should see something like:

- `▲ Next.js 15.x.x`
- `- Local: http://localhost:3000`
- `✓ Ready in ...`

If you don’t see “Ready,” the server may have crashed. Check the terminal for red error messages.

### 3. Try 127.0.0.1 instead of localhost

Sometimes `localhost` doesn’t resolve. Open:

**http://127.0.0.1:3000**

in your browser instead.

### 4. Try a different port

If port 3000 is in use, run:

```bash
npm run dev:port
```

Then open **http://localhost:3001** (or http://127.0.0.1:3001).

### 5. Install dependencies

If the server won’t start at all:

```bash
cd "/Users/elan.asselstine/Desktop/PR Quest"
npm install
npm run dev
```

### 6. Clear Next.js cache

If the app used to work and now doesn’t:

```bash
rm -rf .next
npm run dev
```

---

**Quick checklist**

- [ ] I’m in the folder that has `package.json` (PR Quest project root)
- [ ] I ran `npm install` at least once
- [ ] I ran `npm run dev` and see “Ready” in the terminal
- [ ] I tried http://127.0.0.1:3000 as well as http://localhost:3000
- [ ] I’m not blocking the port with a firewall or another app
