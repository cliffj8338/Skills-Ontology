#!/usr/bin/env python3
"""
Blueprint Values System Patch
Run from repo root: python3 patch_values.py
Patches public/app-core.js (and syncs to legacy.js)

Changes:
  1. Values cap: 7 → 10
  2. saveValues() persistence fix: syncs userData.values + triggers Firestore
  3. VALUES_CATALOG expanded: 25 → 50 values
  4. UI strings updated (PICK 3-7 → PICK 3-10, Done x/7 → x/10, library of 30 → 50)
"""

import re, shutil, sys
from pathlib import Path

SRC = Path('public/app-core.js')

if not SRC.exists():
    print('ERROR: public/app-core.js not found. Run from repo root.')
    sys.exit(1)

# Backup
shutil.copy(SRC, SRC.with_suffix('.js.bak'))
print('Backup: public/app-core.js.bak')

text = SRC.read_text(encoding='utf-8')
original = text

# ─────────────────────────────────────────────────────────────
# 1. VALUES_CATALOG — replace entire block with expanded version
# ─────────────────────────────────────────────────────────────
OLD_CATALOG_START = "        // ===== VALUES SYSTEM =====\n        var VALUES_CATALOG = ["
OLD_CATALOG_END   = "        ];\n\n        // ===== COMPANY VALUES DATA ====="

NEW_CATALOG = """        // ===== VALUES SYSTEM =====
        var VALUES_CATALOG = [
            { group: 'How I Think', values: [
                { name: 'Intellectual Honesty', keywords: ['integrity', 'honest', 'evidence', 'data', 'analy', 'research', 'rigor'], description: 'Following evidence wherever it leads, even when it challenges your own position.' },
                { name: 'Strategic Thinking', keywords: ['strateg', 'vision', 'foresight', 'roadmap', 'long-term', 'planning', 'framework'], description: 'Connecting present decisions to long-term outcomes others have not yet considered.' },
                { name: 'Curiosity', keywords: ['learn', 'curiosit', 'explor', 'research', 'discover', 'question', 'experiment'], description: 'Pursuing understanding for its own sake, not just when the job requires it.' },
                { name: 'Evidence-Based Decision Making', keywords: ['evidence', 'data', 'measur', 'metric', 'analy', 'research', 'validated'], description: 'Letting data settle debates that opinions cannot.' },
                { name: 'Systems Thinking', keywords: ['system', 'architect', 'integrat', 'complex', 'interdepend', 'holistic', 'scale'], description: 'Seeing how components interact across an entire system, not just the part in front of you.' },
                { name: 'First Principles Thinking', keywords: ['first principle', 'fundamenta', 'decompos', 'root cause', 'foundati', 'reason from'], description: 'Decomposing problems to their foundational truths rather than reasoning by analogy.' },
                { name: 'Comfort with Ambiguity', keywords: ['ambig', 'uncertain', 'unclear', 'complex', 'navigate', 'incomplete', 'fluid'], description: 'Moving forward decisively when the full picture will never arrive.' },
                { name: 'Critical Thinking', keywords: ['critical', 'question', 'challeng', 'assumption', 'skeptic', 'evaluat', 'assess'], description: 'Questioning assumptions before accepting conclusions that feel convenient.' },
                { name: 'Pattern Recognition', keywords: ['pattern', 'trend', 'signal', 'connect', 'synthesiz', 'insight', 'cross-domain'], description: 'Connecting signals across domains others treat as unrelated.' },
                { name: 'Long-term Orientation', keywords: ['long-term', 'sustainab', 'decade', 'future', 'legacy', 'patient', 'invest'], description: 'Resisting the pressure to optimize for the quarter at the expense of the decade.' }
            ]},
            { group: 'How I Lead', values: [
                { name: 'Accountability', keywords: ['account', 'responsib', 'own', 'deliver', 'commit', 'reliable', 'dependab'], description: 'Owning outcomes, not just tasks. Especially the ones that went wrong.' },
                { name: 'Servant Leadership', keywords: ['servant', 'mentor', 'coach', 'develop', 'empower', 'support', 'grow'], description: 'Measuring your success by the growth and readiness of the people around you.' },
                { name: 'Empowerment', keywords: ['empower', 'delegat', 'trust', 'autonom', 'enable', 'develop', 'grow'], description: 'Giving people the authority and resources to act, then getting out of their way.' },
                { name: 'Transparency', keywords: ['transparen', 'open', 'honest', 'candid', 'communicat', 'visible', 'share'], description: 'Sharing context freely so others can make informed decisions without you.' },
                { name: 'Courage', keywords: ['courag', 'bold', 'risk', 'challeng', 'spoke', 'stand', 'confront', 'difficult'], description: 'Saying the hard thing in the room when staying silent would be easier.' },
                { name: 'Decisiveness', keywords: ['decis', 'judgment', 'call', 'resolv', 'commit', 'direction', 'choice'], description: 'Making the call with 70% of the information rather than waiting for certainty that never comes.' },
                { name: 'Talent Development', keywords: ['develop', 'grow', 'coach', 'mentor', 'promot', 'career', 'potential', 'talent'], description: 'Treating the people around you as the actual work, not a means to it.' },
                { name: 'Vision Casting', keywords: ['vision', 'inspir', 'future', 'direct', 'narrat', 'mission', 'purpose', 'north star'], description: "Describing a future clearly enough that people can navigate toward it without you." },
                { name: 'Psychological Safety', keywords: ['psych', 'safe', 'speak up', 'candid', 'vulnerab', 'trust', 'openness'], description: 'Creating conditions where people say the true thing, not the safe thing.' },
                { name: 'Ownership Mentality', keywords: ['owner', 'initiative', 'proactiv', 'drive', 'lead', 'champion', 'responsible'], description: "Acting on problems you didn't create because the outcome still matters to you." }
            ]},
            { group: 'How I Work', values: [
                { name: 'Excellence', keywords: ['excel', 'quality', 'precision', 'standard', 'best', 'outperform', 'world-class'], description: 'Setting a standard that makes good enough feel insufficient.' },
                { name: 'Resourcefulness', keywords: ['resourceful', 'creative', 'scrappy', 'bootstrap', 'efficien', 'lean', 'solve'], description: 'Finding a path forward when the obvious one is blocked.' },
                { name: 'Bias Toward Action', keywords: ['action', 'launch', 'ship', 'built', 'execut', 'deliver', 'implement', 'deploy'], description: 'Shipping something real rather than perfecting something theoretical.' },
                { name: 'Continuous Improvement', keywords: ['improv', 'optimi', 'iterat', 'refine', 'evolv', 'better', 'enhance'], description: 'Treating every process as a draft that can be rewritten.' },
                { name: 'Craftsmanship', keywords: ['craft', 'precision', 'detail', 'quality', 'artis', 'master', 'skill', 'technique'], description: 'Caring about the quality of work even when nobody is watching.' },
                { name: 'Focus', keywords: ['focus', 'deep work', 'priorit', 'concentrat', 'distract', 'single-minded', 'attenti'], description: 'Protecting the conditions for deep work in an environment designed to fragment attention.' },
                { name: 'Adaptability', keywords: ['adapt', 'flex', 'pivot', 'change', 'agile', 'adjust', 'resilient', 'dynamic'], description: 'Treating changed circumstances as new information, not personal failure.' },
                { name: 'Discipline', keywords: ['disciplin', 'consist', 'habit', 'routine', 'commit', 'follow through', 'rigor'], description: 'Doing the necessary work on the days when motivation has left the building.' },
                { name: 'Speed', keywords: ['speed', 'fast', 'rapid', 'quick', 'agile', 'responsive', 'timely', 'urgent'], description: 'Understanding that a good decision now beats a perfect decision after the moment has passed.' },
                { name: 'Innovation', keywords: ['innovat', 'creat', 'novel', 'invent', 'disrupt', 'pioneer', 'original', 'new approach'], description: 'Finding solutions that did not exist in the category before you showed up.' }
            ]},
            { group: 'How I Connect', values: [
                { name: 'Empathy', keywords: ['empathy', 'empathetic', 'understand', 'compassion', 'listen', 'perspective', 'human'], description: 'Understanding what someone needs before they have to explain it twice.' },
                { name: 'Collaboration', keywords: ['collaborat', 'partner', 'cross-functional', 'stakeholder', 'team', 'together', 'align'], description: 'Building shared ownership across boundaries that usually divide teams.' },
                { name: 'Trust', keywords: ['trust', 'reliab', 'credib', 'consistent', 'depend', 'faith', 'relationship'], description: 'Being the person others confide in because your word has always held.' },
                { name: 'Candor', keywords: ['candor', 'candid', 'direct', 'honest', 'feedback', 'frank', 'straightforward'], description: 'Delivering honest feedback as a form of respect, not confrontation.' },
                { name: 'Inclusion', keywords: ['inclusi', 'divers', 'equit', 'belong', 'access', 'representation', 'voice'], description: 'Making sure the quietest voice in the room is heard, not just the loudest.' },
                { name: 'Mentorship', keywords: ['mentor', 'guide', 'teach', 'sponsor', 'invest', 'develop', 'nurture', 'advise'], description: "Investing in someone's development without expecting anything in return." },
                { name: 'Influence Without Authority', keywords: ['influenc', 'persuade', 'align', 'coalition', 'buy-in', 'consensus', 'stakeholder'], description: 'Moving people toward outcomes using logic and relationship, not rank.' },
                { name: 'Active Listening', keywords: ['listen', 'heard', 'understand', 'absorb', 'attentive', 'engage', 'present'], description: 'Processing what someone is saying rather than preparing your response.' },
                { name: 'Conflict Resolution', keywords: ['conflict', 'resolv', 'mediat', 'tension', 'disagree', 'diffuse', 'align'], description: 'Addressing tension directly rather than letting it calcify into dysfunction.' },
                { name: 'Generosity', keywords: ['generos', 'share', 'credit', 'give', 'contribute', 'help', 'support', 'volunteer'], description: 'Sharing credit, resources, and attention as a default, not a transaction.' }
            ]},
            { group: 'What I Protect', values: [
                { name: 'Integrity', keywords: ['integrity', 'ethical', 'principle', 'moral', 'honest', 'right', 'trust'], description: 'Doing the right thing when there is a personal cost to doing so.' },
                { name: 'Resilience', keywords: ['resilien', 'crisis', 'recover', 'adapt', 'persever', 'overcome', 'surviv', 'endur'], description: 'Converting setbacks into capabilities that did not exist before.' },
                { name: 'Authenticity', keywords: ['authentic', 'genuine', 'vulnerab', 'self-aware', 'real', 'true', 'honest'], description: 'Presenting yourself as you are, not as the audience expects.' },
                { name: 'Work-Life Boundaries', keywords: ['balance', 'boundar', 'sustain', 'wellbeing', 'health', 'burnout', 'life'], description: 'Protecting the conditions that let you sustain high performance over years, not weeks.' },
                { name: 'Purpose Over Profit', keywords: ['purpose', 'mission', 'impact', 'meaning', 'community', 'service', 'cause', 'foundation'], description: 'Choosing work that matters to people, not just to a balance sheet.' },
                { name: 'Privacy', keywords: ['privacy', 'confidential', 'data', 'protect', 'secure', 'personal', 'discretion'], description: "Treating people's personal information as theirs, not data." },
                { name: 'Independence', keywords: ['independ', 'autonom', 'disagree', 'dissent', 'principled', 'walk away', 'self-direct'], description: 'Protecting your ability to disagree, dissent, or walk away.' },
                { name: 'Simplicity', keywords: ['simple', 'clear', 'concis', 'elegant', 'minimal', 'strip', 'essenti'], description: 'Stripping complexity down to what actually matters.' },
                { name: 'Legacy', keywords: ['legacy', 'lasting', 'build', 'impact', 'future', 'endur', 'found', 'create'], description: 'Building things that outlast the role you held when you built them.' },
                { name: 'Diversity of Thought', keywords: ['divers', 'perspect', 'challeng', 'debate', 'disagree', 'varied', 'multip'], description: 'Actively seeking perspectives that challenge your own before deciding.' }
            ]}
        ];

        // ===== COMPANY VALUES DATA ====="""

# Locate and replace the catalog block
idx_start = text.find(OLD_CATALOG_START)
idx_end   = text.find(OLD_CATALOG_END)

if idx_start == -1:
    print('ERROR: Could not find VALUES_CATALOG start. Aborting.')
    sys.exit(1)
if idx_end == -1:
    print('ERROR: Could not find VALUES_CATALOG end marker. Aborting.')
    sys.exit(1)

# The end marker text itself should be replaced by the new catalog's closing + the marker
text = text[:idx_start] + NEW_CATALOG + '\n' + text[idx_end + len(OLD_CATALOG_END):]
print('✓ VALUES_CATALOG expanded (25 → 50 values)')

# ─────────────────────────────────────────────────────────────
# 2. saveValues() — add userData sync + Firestore trigger
# ─────────────────────────────────────────────────────────────
OLD_SAVE = """        function saveValues() {
            if (readOnlyGuard()) return;
            try {
                safeSet('wbValues', JSON.stringify(blueprintData.values));
                safeSet('wbPurpose', blueprintData.purpose || '');
            } catch (e) { /* quota exceeded or private mode */ }
        }"""

NEW_SAVE = """        function saveValues() {
            if (readOnlyGuard()) return;
            // Sync to userData so Firestore write includes current values
            userData.values = blueprintData.values;
            try {
                safeSet('wbValues', JSON.stringify(blueprintData.values));
                safeSet('wbPurpose', blueprintData.purpose || '');
            } catch (e) { /* quota exceeded or private mode */ }
            // Persist to Firestore for signed-in users
            if (typeof fbUser !== 'undefined' && fbUser && typeof debouncedSave === 'function') {
                debouncedSave();
            }
        }"""

if OLD_SAVE in text:
    text = text.replace(OLD_SAVE, NEW_SAVE, 1)
    print('✓ saveValues() patched — now syncs userData.values + triggers Firestore')
else:
    print('WARNING: saveValues() exact match not found — check manually')

# ─────────────────────────────────────────────────────────────
# 3. Cap: inferValues() enforce max 7 → 10
# ─────────────────────────────────────────────────────────────
text = text.replace(
    '            // Enforce max 7 values\n            if (blueprintData.values.length > 7) {\n                blueprintData.values = blueprintData.values.slice(0, 7);',
    '            // Enforce max 10 values\n            if (blueprintData.values.length > 10) {\n                blueprintData.values = blueprintData.values.slice(0, 10);',
    1
)
print('✓ inferValues() cap: 7 → 10')

# ─────────────────────────────────────────────────────────────
# 4. UI picker — PICK 3-7 → PICK 3-10
# ─────────────────────────────────────────────────────────────
text = text.replace("'PICK 3-7 VALUES'", "'PICK 3-10 VALUES'", 1)
text = text.replace('"PICK 3-7 VALUES"', '"PICK 3-10 VALUES"', 1)
# coaching-tip div string
text = text.replace('PICK 3-7 VALUES', 'PICK 3-10 VALUES')
print('✓ UI string PICK 3-7 → PICK 3-10')

# ─────────────────────────────────────────────────────────────
# 5. Count color guard: count > 7 → count > 10
# ─────────────────────────────────────────────────────────────
text = text.replace(
    'var countColor = count > 7 ? \'#ef4444\' : count >= 3 ? \'#10b981\' : \'#f59e0b\';',
    'var countColor = count > 10 ? \'#ef4444\' : count >= 3 ? \'#10b981\' : \'#f59e0b\';',
    1
)
print('✓ countColor guard: > 7 → > 10')

# ─────────────────────────────────────────────────────────────
# 6. Done button: x/7 → x/10
# ─────────────────────────────────────────────────────────────
text = text.replace(
    "'Done (' + count + '/7)</button>'",
    "'Done (' + count + '/10)</button>'",
    1
)
print('✓ Done button label: /7 → /10')

# ─────────────────────────────────────────────────────────────
# 7. Maximum reached guard: count >= 7 → count >= 10
# ─────────────────────────────────────────────────────────────
text = text.replace(
    "+ (count >= 7 ? ' &nbsp;\\u2022&nbsp; <span style=\"color:#f59e0b;\">Maximum reached</span>' : '')",
    "+ (count >= 10 ? ' &nbsp;\\u2022&nbsp; <span style=\"color:#f59e0b;\">Maximum reached</span>' : '')",
    1
)
print('✓ Maximum reached: >= 7 → >= 10')

# ─────────────────────────────────────────────────────────────
# 8. addValueFromPicker guards: >= 7 → >= 10 (two occurrences)
# ─────────────────────────────────────────────────────────────
count_replaced = 0
# First occurrence (toggleValueFromPicker)
old = '                if (blueprintData.values.length >= 7) {'
new = '                if (blueprintData.values.length >= 10) {'
idx = text.find(old)
while idx != -1 and count_replaced < 2:
    text = text[:idx] + new + text[idx+len(old):]
    count_replaced += 1
    idx = text.find(old, idx + len(new))
print(f'✓ addValueFromPicker guards: >= 7 → >= 10 ({count_replaced} occurrences)')

# ─────────────────────────────────────────────────────────────
# 9. Admin description string: library of 30 → 50
# ─────────────────────────────────────────────────────────────
text = text.replace('Pick 3-7 core values from library of 30', 'Pick 3-10 core values from library of 50', 1)
print('✓ Admin description: library of 30 → 50')

# ─────────────────────────────────────────────────────────────
# Write output
# ─────────────────────────────────────────────────────────────
if text == original:
    print('\nWARNING: No changes were made — check the patterns above.')
    sys.exit(1)

SRC.write_text(text, encoding='utf-8')
print(f'\n✓ Written: {SRC}')

# Sync to legacy.js
import shutil as sh
sh.copy(SRC, 'legacy.js')
print('✓ Synced to legacy.js')

print('\nAll done. Verify with:')
print('  head -3 public/app-core.js')
print('  diff legacy.js public/app-core.js')
print('\nThen bump version to v4.46.30 and deploy.')
