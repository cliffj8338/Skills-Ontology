# Blueprint™ Scouting Reports — File Structure

## Directory Layout

```
reports/
├── templates/
│   └── base.html              # Scouting report template (Tyrion demo data)
│                                # Used by generateScoutingReport() as the base
│                                # file — REPORT_DATA gets injected at generation time
│
├── demos/                       # Pre-built demo profiles for sample viewing
│   ├── tyrion-lannister.html    # Game of Thrones — Chief of Staff, United Nations
│   ├── walter-white.html        # Breaking Bad — CSO, Gray Matter Technologies
│   ├── jim-hopper.html          # Stranger Things — Dir. Crisis Response, DHS
│   └── kendall-roy.html         # Succession — CEO, Waystar Royco
│
└── u/                           # User-generated reports (sharded)
    └── {shard}/                 # First 2 hex chars of user_id
        └── {user_id}/           # Full user identifier
            └── {report_id}.html # Individual report file
```

## Sharding Strategy (u/ directory)

At scale (millions of users), flat directories become unmanageable. The `u/`
directory uses a 2-character hex prefix shard derived from the user ID:

```
User ID: usr_a3f8b2c1d4e5
Shard:   a3
Path:    reports/u/a3/usr_a3f8b2c1d4e5/

User ID: usr_0072ff91ab88
Shard:   00
Path:    reports/u/00/usr_0072ff91ab88/
```

This gives 256 top-level shards, each holding ~3,900 user directories at 1M users.
At 10M users: ~39,000 per shard. Still performant for filesystem lookups.

For CDN/object storage (S3, Vercel Blob, etc.), the path becomes the object key
and sharding is less critical but still useful for tooling and debugging.

## Report ID Convention

Report IDs encode creation context:
```
{YYYY-MM-DD}_{job-slug}_{hash}
Example: 2026-02-22_cso-gray-matter_a7b3
```

## File Self-Containment

Every .html file under reports/ is fully self-contained:
- Embedded CSS + JS + D3.js CDN reference
- All data in the REPORT_DATA config object
- No external dependencies beyond fonts and D3
- Works offline, via email attachment, or direct URL

## Access Control (Future)

When auth is added:
- `/reports/demos/*` — Public, no auth required
- `/reports/u/{shard}/{user_id}/*` — Requires share token or owner auth
- Share links use signed tokens: `?token={jwt}` or `?share={hash}`
- Expired/revoked tokens return a "Report no longer available" page
