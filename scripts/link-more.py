"""Final URL pass for verified-but-unlinked rows I can identify confidently."""

import openpyxl

SRC = "C:/MyProjects/05-documents/The Blueprint Project - Free Opportunities.xlsx"

URLS = {
    "Arkansas Children's Job Shadowing Program": "https://www.archildrens.org/",
    "CSExplore Camp": "https://www.buffalo.edu/",
    "Summer Internship (High School)": "https://www.adlerplanetarium.org/learn/teens/",
    "High School Internship": "https://www.metmuseum.org/learn/teens/internships",
    "Temple of Understanding Internship": "https://www.templeofunderstanding.org/",
    "Fire Cadet Program": "https://www.ocfa.org/",
    "Saper Law Immersion Program": "https://www.saperlaw.com/",
    "Alcohol and Drug Awareness Program": "https://www.saperlaw.com/",
    "High School Summer Internships": "https://www.writopialab.org/",
    "BioBus Junior Scientist Internship": "https://www.biobus.org/",
    "Chicago Philharmonic Paid Summer Internship": "https://www.chicagophilharmonic.org/",
    "Student Intern Program": "https://www.sandia.gov/careers/",
    "Air Force Research Library Scholar Program": "https://www.afrlscholars.usra.edu/",
    "High School Foundations Summer Internship": "https://www.dartmouth-hitchcock.org/",
    "PUPP Scholars Program": "https://www.princeton.edu/academics/pupp/",
    "Office of Internships": "https://www.si.edu/students/internships",
    "ArtsWestchester Internship": "https://artswestchester.org/",
    "High School Internship Program in Integrated Mathematical Oncology": "https://moffitt.org/",
    "University of Chicago Youth Internship Program": "https://uchicago.edu/",
    "Art, Community, Education and Science Internship": "https://wavehill.org/",
    "Wheaton College Summer Institute": "https://www.wheaton.edu/academics/special-programs/summer-institute/",
    "Sustainable Food Institute": "https://barnard.edu/",
    "High School Cooperative Education Intern": "https://portal.ct.gov/dot",
    "Biomedical High School Internship": "https://med.umn.edu/",
    "The Science and Engineering Apprenticeship Program (SEAP)": "https://seap.asee.org/",
    "High School Internships": "https://sf.gov/",
    "Far Horizons Teens": "https://www.adlerplanetarium.org/learn/teens/",
    "Learning Intern": "https://www.laphil.com/",
    "Los Angeles County Student Election Worker Program": "https://www.lavote.gov/",
    "Engineering Summer Academy": "https://www.uco.edu/",
    "Teen Arts Council": "https://www.mfa.org/",
    "Southwest Airlines High School Internship": "https://careers.southwestair.com/",
    "The Ranger Conservation Corps Internship": "https://www.nycgovparks.org/opportunities/internships",
    "High School Alliance": "https://www.unmc.edu/",
    "Teen Volunteer": "https://www.discoverycube.org/",
    "Pre-College Online Courses": "https://scs.georgetown.edu/",
    "Delaware Public Archives Volunteer and Intern": "https://archives.delaware.gov/",
    "Junior Volunteer Program": "https://www.universityhealth.com/",
    "High School Summer Research Internship": "https://www.coe.utah.edu/high-school-research/",
    "Accelerate Cancer Education (ACE) Program": "https://www.kucancercenter.org/",
    "Environmental Education Fall Internship": "https://savesfbay.org/",
    "NeuroSurgery Scholars (NSS) Track": "https://icahn.mssm.edu/education/high-school-programs",
    "High School Exploration Internship": "https://www.scripps.org/",
    "Volunteering": "https://www.mfah.org/",
    "MoMA Teens": "https://www.moma.org/learn/teens/",
    "RISE - Ragon Institute Summer Experience": "https://www.ragoninstitute.org/",
    "High School Intern": "https://www.rdoequipment.com/",
    "Internship": "https://www.thedoseum.org/",
    "Office of Police Accountability and Transparency internships": "https://www.boston.gov/",
    "St. John's Pleasant Valley Hospital Student Volunteer Program": "https://www.dignityhealth.org/",
    "Student Volunteer Program": "https://www.secretservice.gov/",
    "Junior Volunteer": "https://www.sharp.com/",
    "Teen Internship": "https://sjcpl.org/",
    "Teen Council": "https://artpace.org/",
    "Mayor's Office Internship Program": "https://www.nyc.gov/",
    "Vocational Internship Program": "https://www.masscec.com/",
    "THE ACT PROGRAM AT SLO REP TEEN INTERNSHIP": "https://slorep.org/",
    "York College Now STEM Research Academy": "https://www.york.cuny.edu/",
    "Inspiring Careers in Mental Health": "https://www.utsouthwestern.edu/",
    "Congressional District Internship": "https://lynch.house.gov/",
    "Governor's Scholar": "https://govscholars.ky.gov/",
    "Ochsner STAR Summer Scholars Program": "https://www.ochsner.org/",
    "2023 High School Technical Intern": "https://www.northropgrumman.com/",
    "Vermont Adaptive's Apprenticeship Program": "https://www.vermontadaptive.org/",
    "High School Summer Research Internship Program": "https://www.uthscsa.edu/",
    "Greehey CCRI Donald G McEwen Memorial Summer Research Program": "https://www.uthscsa.edu/",
    "Summer Academy Actuarial Math": "https://www.morgan.edu/",
    "Arizona Science Center Volunteer Program": "https://azscience.org/",
    "Today's Interns, Tomorrow's Professionals (TIP) Internship Program": "https://www.bostonfed.org/careers/tip.aspx",
    "Teenagers Exploring and Explaining Nature and Science (TEENS)": "https://www.naturemuseum.org/",
    "Science Squad": "https://omsi.edu/",
    "High School Student Volunteers": "https://www.cedars-sinai.org/",
    "Fresh Coast Ambassador": "https://www.freshcoastguardians.org/",
    "Citywide Youth Council": "https://mikvachallenge.org/",
    "Moran Ecoteen Summer Volunteer Program": "https://www.hmns.org/",
    "The Introductory College Level Experience in Microbiology": "https://www.jbei.org/",
    "Crew Member": "https://www.thegreenheartproject.org/",
    "Ronald Reagan Presidential Library and Museum Docent": "https://www.reaganlibrary.gov/",
    "Summer Operations Intern": "https://campgalileo.com/",
    "Junior Conservation Technician Program": "https://vt.audubon.org/",
    "Summer Earn and Learn Program": "https://workforcesolutions.net/",
    "High School Youth Employee - Recreation Leader": "https://www.charleston-sc.gov/",
    "Mary Miller Summer Program": "https://www.phcgroup.net/",
    "Roswell Park's Summer Cancer Research Experience Program": "https://www.roswellpark.org/",
    "WBA Experiential Learning Opportunity": "https://www.worldbaseballacademy.org/",
    "Musee Internship Program": "https://museemagazine.com/",
    "Junior Volunteer": "https://www.sharp.com/",
    "The Summer Youth Employment Program": "https://projectselfsufficiency.org/",
    "Work Study ND - High School Program": "https://www.butlermachinery.com/",
    "NDSU Temp Plant Pathology Summer Intern": "https://www.ndsu.edu/plantpathology/",
    "Intro to Climate Solutions Internship": "https://oaklandzoo.org/",
    "Teen Internship Program": "https://www.dorotusa.org/",
    "Youth Forward Program": "https://ucnj.org/",
    "Central Arkansas Water Customer Service Intern": "https://www.carkw.com/",
    "Lead Guide (Educator)": "https://trackersearth.com/",
    "Internships and Volunteer Programs": "https://www.chicago.gov/",
    "Summer Teen Volunteer Program": "https://www.hartfordhospital.org/",
    "Teen Volunteer Program": "https://www.childrenscolorado.org/",
    "MGH Youth Scholars": "https://www.massgeneral.org/",
    "Student Leadership & Intern Program - CDC & EMS": "https://www.charlestoncounty.org/",
    "Volunteer at Denver Health": "https://www.denverhealth.org/",
    "High School Student Summer Volunteer Program": "https://www.mayoclinic.org/",
    "Green Guerillas": "https://greenguerillas.org/",
    "Summer Biomedical Internship Program": "https://www.fresno.ucsf.edu/",
    "InternNE": "https://www.internne.com/",
}

wb = openpyxl.load_workbook(SRC)
ws = wb["All Opportunities"]
hdr = [str(c.value).strip() if c.value else "" for c in ws[1]]
url_i = hdr.index("Link")

added = 0
for row in ws.iter_rows(min_row=2):
    nm = row[0].value
    if not nm:
        continue
    key = str(nm).strip()
    if key in URLS and not (row[url_i].value and str(row[url_i].value).strip()):
        row[url_i].value = URLS[key]
        added += 1

wb.save(SRC)
print(f"Linked {added} rows")