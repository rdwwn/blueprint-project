import openpyxl
import json
import re
from urllib.parse import urlparse

wb = openpyxl.load_workbook('C:/MyProjects/05-documents/The Blueprint Project - Free Opportunities.xlsx', read_only=False)
ws = wb['All Opportunities']

all_opps = []
seen_names = set()

EXCLUDE = {
    'Stanford Pre-Collegiate University-Level Studies',
    'Stanford Summer Session for High School Students',
    'Stanford Pre-Collegiate Summer Institute',
    'Duke Summer Session Credit Courses',
    'Duke Pre-College High School Program',
    'Columbia University Summer High School Program',
    'MIT Summer Session',
    'CalArts Summer Program',
    'Juilliard Pre-College Division',
    'RISD Pre-College',
    'SAIC Summer Institute',
    'Skidmore Pre-College',
    'Penn State Dual Enrollment',
    'Michigan State University Dual Enrollment',
    'University of Michigan Dual Enrollment',
    'LeTourneau University Dual Credit',
    'North Greenville University Dual Enrollment',
    'Southern Adventist University Online Dual Enrollment',
    'SNU Concurrent Enrollment',
    'Oregon State Ecampus High School Credit',
    'Teacher Academy Summer Program',
}

# Normalize spreadsheet difficulty to the app's vocabulary.
DIFFICULTY_MAP = {
    'Competitive': 'Competitive',
    'Hard': 'Competitive',
    'Advanced': 'Competitive',
    'Selective': 'Selective',
    'Moderate': 'Moderate',
    'Medium': 'Moderate',
    'Intermediate': 'Moderate',
    'Accessible': 'Accessible',
    'Easy': 'Accessible',
    'Beginner': 'Accessible',
    'Open': 'Open',
}


def derive_tags(eligibility, location, name, category, tags_col, college_credit_col):
    """Derive 'Open to' tags from every available text field."""
    tags = []
    hay = " ".join([
        eligibility or "",
        location or "",
        name or "",
        tags_col or "",
    ]).lower()

    if re.search(r'\bgirls\b|women|female|nonbinary|young women|all-girls', hay):
        tags.append('Girls')
    if re.search(r'\bboys\b|young men|all-boys|\bmales?\b', hay):
        tags.append('Boys')
    if re.search(r'low[\s-]?income|free/reduced|free and reduced|pell|financial (need|aid|assistance)|economically (disadvantaged|underrepresented)|need-blind|based on need|fafsa|expected family contribution|efc', hay):
        tags.append('Low-Income')
    if re.search(r'first[\s-]?gen|first generation|1st[\s-]?gen|parents (who )?(did not|haven.t|never) (attend|go)|no (family|parent).*college', hay):
        tags.append('1st-Generation')
    if re.search(r'underrep|under-rep|\burm\b|minorit|under[-\s]?served|black|african[\s-]?american|hispanic|latino|latina|\bnative american\b|indigenous|disadvantaged|first[\s-]?generation', hay):
        tags.append('Under-represented Minorities')
    if re.search(r'college credit|dual (enrollment|credit)|concurrent', hay) or category == 'Dual Enrollment' or (college_credit_col and str(college_credit_col).strip().lower() in ('yes', 'possible')):
        tags.append('College Credit')
    if re.search(r'one[- ]on[- ]one|1[- ]on[- ]1|mentor(ed|ship)?|paired with|research mentor', hay):
        tags.append('1-on-1')
    if re.search(r'rural|appalachia|rust belt|inner[- ]city|frontier|remote (communities|areas)|tribal|geographically (isolated|underserved)|small[- ]town', hay):
        tags.append('Rural')
    if re.search(r'\bintl\b|international|worldwide|global|from (over|around) the world', hay):
        tags.append('International')
    if re.search(r'\blgbtq\b|\bgay\b|lesbian|queer|trans(gender)?|nonbinary|gender[\s-]?expansive|gender[\s-]?nonconforming|sexual minorities|pride', hay):
        tags.append('LGBTQ+')
    if re.search(r'disab(led|ility|ilities)|neurodiverg|autism|autistic|deaf|hard of hearing|blind|low vision|wheelchair|learning (disab|different)|adhd', hay):
        tags.append('Disabilities')
    if re.search(r'military|veteran|armed forces|active duty|service member|dependent(s)? of|jrotc|rotc', hay):
        tags.append('Military Family')
    if re.search(r'immigrant|new american|refugee|asylee|undocumented|\bdaca\b|newcomers?', hay):
        tags.append('Immigrants & DACA')
    if re.search(r'home[\s-]?school', hay):
        tags.append('Homeschool')

    # Fold spreadsheet tags column into the same vocabulary.
    if tags_col:
        tc = tags_col.lower()
        if 'urm' in tc or 'minority' in tc:
            if 'Under-represented Minorities' not in tags:
                tags.append('Under-represented Minorities')
        if 'girls' in tc or 'women' in tc:
            if 'Girls' not in tags:
                tags.append('Girls')
        if 'low income' in tc or 'low-income' in tc:
            if 'Low-Income' not in tags:
                tags.append('Low-Income')
        if 'first gen' in tc or 'first-gen' in tc:
            if '1st-Generation' not in tags:
                tags.append('1st-Generation')

    return tags


for i in range(2, ws.max_row + 1):
    def cell(col):
        v = ws.cell(row=i, column=col).value
        return str(v or '').strip() or None

    name = cell(1)
    if not name or name in seen_names or name in EXCLUDE:
        continue
    seen_names.add(name)

    org = cell(2)
    field = cell(3)
    category = cell(4)
    grades_raw = cell(5)
    eligibility = cell(6)
    region = cell(7)
    location = cell(8)
    cost_detail = cell(9)
    cost_raw = cell(10)
    difficulty_raw = cell(11)
    essay_raw = cell(12)
    acceptance_raw = cell(20)
    remote_raw = cell(22)
    stipend_raw = cell(24)
    effort_raw = cell(28)
    duration_weeks_raw = cell(21)
    prestige_raw = cell(25)
    deadline_type_raw = cell(27)
    resume_raw = cell(29)
    rec_raw = cell(13)
    award_amount_raw = cell(33)
    deadline = cell(14)
    duration = cell(15)
    what_learn = cell(16)
    description = cell(17)
    url = cell(18)
    verified_raw = str(cell(19) or '').strip().lower() if cell(19) else ''
    tags_col = cell(26)
    college_credit_col = cell(23)

    if not url or url == 'None':
        continue

    # Normalize field
    if field in ('Certificates', 'Quick Start', 'Research', 'Volunteer & Community Service'):
        field = None
    if field in ('Study Abroad', 'Law, Politics & Public', 'Space, Earth & Environment'):
        field = {'Study Abroad': 'International', 'Law, Politics & Public': 'Law', 'Space, Earth & Environment': 'Space'}[field]
    if field in ('Arts, Design & Music', 'Theater, Film & Writing', 'Math, Physics & Materials'):
        field = {'Arts, Design & Music': 'Arts', 'Theater, Film & Writing': 'Theater', 'Math, Physics & Materials': 'Math'}[field]
    if field in ('Low-Income',):
        field = None

    # Normalize category
    cat_norm = category
    if category == 'Other':
        cat_norm = None

    # Determine cost
    cost = None
    if cost_raw:
        cl = cost_raw.lower()
        if 'free' in cl and 'stipend' in cl:
            cost = 'Free | stipend: Yes'
        elif 'free' in cl and 'paid' not in cl:
            cost = 'Free'
        elif 'paid' in cl or 'stipend' in cl:
            cost = cost_raw
        elif cl in ('0', 'none', 'no cost'):
            cost = 'Free'
        else:
            cost = cost_raw

    # Determine cost_detail
    if cost_detail and cost_detail != 'None':
        cd = cost_detail
    elif cost:
        cd = cost
    else:
        cd = None

    # Determine season from category
    season = None
    if category == 'Summer Program':
        season = 'Summer'
    elif category == 'School Year Program':
        season = 'School year'

    # Extract host from url
    host = None
    try:
        parsed = urlparse(url)
        host = parsed.hostname.replace('www.', '') if parsed.hostname else None
    except Exception:
        pass

    difficulty = DIFFICULTY_MAP.get(difficulty_raw) if difficulty_raw else None

    # --- Essay ---
    essay = None
    if essay_raw:
        es = essay_raw.strip().lower()
        if es in ('yes', 'true'):
            essay = 'Required'
        elif es == 'no':
            essay = 'Not required'

    # --- Effort ---
    effort = None
    if effort_raw:
        ef = effort_raw.strip().capitalize()
        if ef in ('Low', 'Medium', 'High'):
            effort = ef

    # --- Remote option ---
    remote = None
    if remote_raw:
        rv = remote_raw.strip().lower()
        if 'virtual' in rv or rv == 'online' or rv == 'yes':
            remote = 'Virtual'
        elif 'both' in rv or 'hybrid' in rv:
            remote = 'Both'
        elif 'in-person' in rv or rv == 'no':
            remote = 'In-Person'

    # --- Stipend ---
    stipend = None
    stipend_min = None
    # For scholarships, prefer the dedicated Award Amount column (real,
    # researched dollar figures) over the generic stipend column.
    if category == 'Scholarship' and award_amount_raw:
        aa = award_amount_raw.strip()
        aal = aa.lower()
        if 'full' in aal and any(w in aal for w in ('tuition', 'ride', 'cost', 'scholarship')):
            # Full-ride / full-tuition awards: no fake dollar figure, but a
            # real "Full tuition" tier so the filter can match them.
            stipend = 'Full tuition'
            stipend_min = None
        else:
            nums = re.findall(r'\$\s*([\d,]+)', aa)
            if nums:
                # Award tiers use the headline (max) figure, e.g. "up to $55,000".
                vals = [int(n.replace(',', '')) for n in nums]
                stipend_min = max(vals)
                if stipend_min >= 10000:
                    stipend = 'Stipend $10,000+'
                elif stipend_min >= 2500:
                    stipend = 'Stipend $2,500–$10,000'
                elif stipend_min >= 500:
                    stipend = 'Stipend $500–$2,500'
                else:
                    stipend = 'Stipend under $500'
            elif aa and aal not in ('unknown', 'n/a', 'varies', 'varies by chapter'):
                stipend = 'Stipend'
    if stipend is None and stipend_raw:
        sv = stipend_raw.strip()
        if sv.lower().startswith('free'):
            stipend = None
        elif not sv.lower().startswith('unknown'):
            # Stash a display-friendly form and the lowest dollar figure.
            nums = re.findall(r'\$\s*([\d,]+)', sv)
            if nums:
                mins = [int(n.replace(',', '')) for n in nums]
                stipend_min = min(mins)
                if stipend_min >= 5000:
                    stipend = 'Stipend $5,000+'
                elif stipend_min >= 1000:
                    stipend = 'Stipend $1,000–$5,000'
                else:
                    stipend = 'Stipend under $1,000'
            else:
                stipend = 'Stipend'

    # --- Acceptance ---
    acceptance = None
    if acceptance_raw:
        first = acceptance_raw.strip().split()[0] if acceptance_raw.strip() else ''
        if first in ('Moderate', 'Selective', 'Open', 'Unknown', 'Competitive'):
            acceptance = first

    # --- Grades (kept as the raw "9-12" style string for grade filters) ---
    grades = grades_raw
    if grades and re.match(r'^[\d\s\-–,]+$', grades) is None:
        grades = None

    # --- Duration in weeks ("6-8" -> 8, "52" -> 52, "1" -> 1) ---
    duration_weeks = None
    if duration_weeks_raw:
        nums = [int(n) for n in re.findall(r'\d+', str(duration_weeks_raw))]
        if nums:
            duration_weeks = max(nums)

    # --- Prestige tier (Niche / Regional / National) ---
    prestige = None
    if prestige_raw and prestige_raw.strip().capitalize() in ('Niche', 'Regional', 'National'):
        prestige = prestige_raw.strip().capitalize()

    # --- Deadline type (Rolling / Fixed) ---
    deadline_type = None
    if deadline_type_raw:
        dt = deadline_type_raw.strip().lower()
        if dt.startswith('rolling'):
            deadline_type = 'Rolling'
        elif dt.startswith('fixed'):
            deadline_type = 'Fixed'

    # --- Resume value (Low / Medium / High) ---
    resume = None
    if resume_raw and resume_raw.strip().capitalize() in ('Low', 'Medium', 'High'):
        resume = resume_raw.strip().capitalize()

    # --- Recommendation letter (Yes / No) ---
    rec = None
    if rec_raw:
        rr = rec_raw.strip().lower()
        if rr in ('yes', 'true'):
            rec = 'Yes'
        elif rr == 'no':
            rec = 'No'

    tags = derive_tags(eligibility, location, name, category, tags_col, college_credit_col)

    # Build description - combine what_learn and description
    desc = description or what_learn or None
    if desc and what_learn and desc != what_learn:
        desc = f"{what_learn}. {desc}"

    opp = {
        'name': name,
        'org': org,
        'category': category,
        'field': field,
        'eligibility': eligibility,
        'location': location,
        'cost': cost,
        'cost_detail': cd,
        'deadline': deadline,
        'duration': duration,
        'url': url,
        'description': desc,
        'verified': verified_raw in ('yes', 'true', '1'),
        'cat_norm': cat_norm,
        'tags': tags,
        'season': season,
        'host': host,
        'difficulty': difficulty,
        'essay': essay,
        'stipend': stipend,
        'stipend_min': stipend_min,
        'effort': effort,
        'remote': remote,
        'acceptance': acceptance,
        'grades': grades,
        'duration_weeks': duration_weeks,
        'prestige': prestige,
        'deadline_type': deadline_type,
        'resume': resume,
        'rec': rec,
    }
    all_opps.append(opp)

print(f"Total unique programs: {len(all_opps)}")

# Print field counts
fields = {}
for o in all_opps:
    f = o['field'] or '(none)'
    fields[f] = fields.get(f, 0) + 1
print("Fields:", json.dumps(fields, indent=2))

# Print category counts
cats = {}
for o in all_opps:
    c = o['category'] or '(none)'
    cats[c] = cats.get(c, 0) + 1
print("Categories:", json.dumps(cats, indent=2))

# Print tag counts
tag_counts = {}
for o in all_opps:
    for t in o['tags']:
        tag_counts[t] = tag_counts.get(t, 0) + 1
print("Tags:", json.dumps(tag_counts, indent=2))

# Print difficulty counts
diff_counts = {}
for o in all_opps:
    d = o['difficulty'] or '(none)'
    diff_counts[d] = diff_counts.get(d, 0) + 1
print("Difficulty:", json.dumps(diff_counts, indent=2))

# Write TypeScript
def ts_string(s):
    if s is None:
        return 'null'
    escaped = s.replace('\\', '\\\\').replace('"', '\\"').replace('\n', ' ').replace('\r', '')
    return f'"{escaped}"'


def ts_array(arr):
    if not arr:
        return '[]'
    items = ', '.join(f'"{t}"' for t in arr)
    return f'[{items}]'


lines = []
lines.append('export type Opportunity = {')
lines.append('  name: string;')
lines.append('  org: string | null;')
lines.append('  category: string | null;')
lines.append('  field: string | null;')
lines.append('  eligibility: string | null;')
lines.append('  location: string | null;')
lines.append('  cost: string | null;')
lines.append('  cost_detail: string | null;')
lines.append('  deadline: string | null;')
lines.append('  duration: string | null;')
lines.append('  url: string;')
lines.append('  description: string | null;')
lines.append('  verified: boolean;')
lines.append('  cat_norm: string | null;')
lines.append('  tags: string[];')
lines.append('  season: string | null;')
lines.append('  host: string | null;')
lines.append('  difficulty?: string | null;')
lines.append('  essay?: "Required" | "Not required" | null;')
lines.append('  stipend?: string | null;')
lines.append('  stipend_min?: number | null;')
lines.append('  effort?: "Low" | "Medium" | "High" | null;')
lines.append('  remote?: "In-Person" | "Virtual" | "Both" | null;')
lines.append('  acceptance?: string | null;')
lines.append('  grades?: string | null;')
lines.append('  duration_weeks?: number | null;')
lines.append('  prestige?: "Niche" | "Regional" | "National" | null;')
lines.append('  deadline_type?: "Rolling" | "Fixed" | null;')
lines.append('  resume?: "Low" | "Medium" | "High" | null;')
lines.append('  rec?: "Yes" | "No" | null;')
lines.append('};')
lines.append('')
lines.append('export const OPPORTUNITIES: Opportunity[] = [')
for opp in all_opps:
    lines.append('  {')
    lines.append(f'    name: {ts_string(opp["name"])},')
    lines.append(f'    org: {ts_string(opp["org"])},')
    lines.append(f'    category: {ts_string(opp["category"])},')
    lines.append(f'    field: {ts_string(opp["field"])},')
    lines.append(f'    eligibility: {ts_string(opp["eligibility"])},')
    lines.append(f'    location: {ts_string(opp["location"])},')
    lines.append(f'    cost: {ts_string(opp["cost"])},')
    lines.append(f'    cost_detail: {ts_string(opp["cost_detail"])},')
    lines.append(f'    deadline: {ts_string(opp["deadline"])},')
    lines.append(f'    duration: {ts_string(opp["duration"])},')
    lines.append(f'    url: {ts_string(opp["url"])},')
    lines.append(f'    description: {ts_string(opp["description"])},')
    lines.append(f'    verified: {"true" if opp["verified"] else "false"},')
    lines.append(f'    cat_norm: {ts_string(opp["cat_norm"])},')
    lines.append(f'    tags: {ts_array(opp["tags"])},')
    lines.append(f'    season: {ts_string(opp["season"])},')
    lines.append(f'    host: {ts_string(opp["host"])},')
    lines.append(f'    difficulty: {ts_string(opp["difficulty"])},')
    lines.append(f'    essay: {ts_string(opp["essay"])},')
    lines.append(f'    stipend: {ts_string(opp["stipend"])},')
    lines.append(f'    stipend_min: {opp["stipend_min"] if opp["stipend_min"] is not None else "null"},')
    lines.append(f'    effort: {ts_string(opp["effort"])},')
    lines.append(f'    remote: {ts_string(opp["remote"])},')
    lines.append(f'    acceptance: {ts_string(opp["acceptance"])},')
    lines.append(f'    grades: {ts_string(opp["grades"])},')
    lines.append(f'    duration_weeks: {opp["duration_weeks"] if opp["duration_weeks"] is not None else "null"},')
    lines.append(f'    prestige: {ts_string(opp["prestige"])},')
    lines.append(f'    deadline_type: {ts_string(opp["deadline_type"])},')
    lines.append(f'    resume: {ts_string(opp["resume"])},')
    lines.append(f'    rec: {ts_string(opp["rec"])},')
    lines.append('  } as Opportunity,')
lines.append('];')
lines.append('')

output = '\n'.join(lines)
with open('C:/MyProjects/01-projects/blueprint-project/Mark 20/src/data/opportunities.ts', 'w', encoding='utf-8') as f:
    f.write(output)

print(f"Written {len(all_opps)} opportunities to opportunities.ts")
print(f"File size: {len(output)} bytes, {len(lines)} lines")
