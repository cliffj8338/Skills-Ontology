// api/galileo-stats.js
// Serves Galileo counter stats to the galileo.html page.
// Uses Firestore REST API — no firebase-admin needed.

import { fsGet } from './lib/firestore-rest.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', 'https://myblueprint.work');
  res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');

  try {
    const data = await fsGet('galileo_counter', 'stats');

    if (!data) {
      return res.status(404).json({
        error: 'No data yet. Run /api/galileo-refresh?mode=harvest then ?mode=process then ?mode=stats',
      });
    }

    return res.status(200).json({
      yearData:                  data.yearData                  || [],
      logData:                   data.logData                   || [],
      lastUpdated:               data.lastUpdated               || 'Unknown',
      daysSinceMention:          data.daysSinceMention          ?? 0,
      totalMentions:             data.totalMentions             ?? 0,
      totalPublications:         data.totalPublications         ?? 0,
      totalArticlesWithGalileo:  data.totalArticlesWithGalileo  ?? 0,
      mentionRate:               data.mentionRate               ?? 0,
      crawlErrors:               data.crawlErrors               ?? 0,
      totalCrawled:              data.totalCrawled              ?? 0,
      refreshedAt:               data.refreshedAt               || null,
    });
  } catch (err) {
    console.error('[galileo-stats] Error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
