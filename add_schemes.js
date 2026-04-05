import sqlite3 from 'sqlite3';

const db = new sqlite3.Database('scheme_portal.db');

const newSchemes = [
  // Farmers
  {
    scheme_name: 'PM-KISAN',
    provider: 'Central Government',
    target_role: 'Farmer',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 9999999,
    education_required: 'All',
    state: 'All India',
    description: 'Income support of ₹6,000 per year given to all landholding farmer families.',
    official_link: 'https://pmkisan.gov.in/'
  },
  {
    scheme_name: 'Chief Minister Farmers Security Scheme',
    provider: 'Tamil Nadu Government',
    target_role: 'Farmer',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 250000,
    education_required: 'All',
    state: 'Tamil Nadu',
    description: 'Provides educational, marriage assistance and old age pension for registered farmers.',
    official_link: 'https://www.tn.gov.in/scheme/data_view/43977'
  },
  // Seniors
  {
    scheme_name: 'IGNOAPS (National Old Age Pension)',
    provider: 'Central Government',
    target_role: 'Senior Citizen',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 100000,
    education_required: 'All',
    state: 'All India',
    description: 'Monthly pension for persons aged 60 years or above belonging to a BPL family.',
    official_link: 'https://nsap.nic.in/'
  },
  {
    scheme_name: 'TN Old Age Pension Scheme',
    provider: 'Tamil Nadu Government',
    target_role: 'Senior Citizen',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 100000,
    education_required: 'All',
    state: 'Tamil Nadu',
    description: 'Destitute citizens aged 60+ receive ₹1,000 per month as pension from state govt.',
    official_link: 'https://cms.tn.gov.in/sites/default/files/go/sw_e_39_2016.pdf'
  },
  // Unemployed
  {
    scheme_name: 'MGNREGA',
    provider: 'Central Government',
    target_role: 'Unemployed',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 9999999,
    education_required: 'All',
    state: 'All India',
    description: 'Guarantees 100 days of wage employment in a financial year to rural households.',
    official_link: 'https://nrega.nic.in/'
  },
  {
    scheme_name: 'Unemployment Assistance Scheme',
    provider: 'Tamil Nadu Government',
    target_role: 'Unemployed',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 72000,
    education_required: 'School',
    state: 'Tamil Nadu',
    description: 'Monthly allowance for educated youth registered on the employment exchange for over 5 years.',
    official_link: 'https://tnvelaivaaippu.gov.in/'
  },
  // Women
  {
    scheme_name: 'Pradhan Mantri Matru Vandana Yojana',
    provider: 'Central Government',
    target_role: 'Women',
    category_required: 'All',
    gender_required: 'Female',
    income_limit: 800000,
    education_required: 'All',
    state: 'All India',
    description: 'Maternity benefit providing ₹5,000 to pregnant women for their first child.',
    official_link: 'https://pmmvy.wcd.gov.in/'
  },
  {
    scheme_name: 'Dr. Muthulakshmi Reddy Maternity Scheme',
    provider: 'Tamil Nadu Government',
    target_role: 'Women',
    category_required: 'All',
    gender_required: 'Female',
    income_limit: 120000,
    education_required: 'All',
    state: 'Tamil Nadu',
    description: 'Financial assistance of ₹18,000 for poor pregnant women in TN given in installments.',
    official_link: 'https://picme.tn.gov.in/'
  },
  // Disabled
  {
    scheme_name: 'Differently Abled Pension Scheme',
    provider: 'Tamil Nadu Government',
    target_role: 'Disabled',
    category_required: 'All',
    gender_required: 'All',
    income_limit: 100000,
    education_required: 'All',
    state: 'Tamil Nadu',
    description: 'Minimum ₹1,000 monthly pension for specially-abled citizens with disability percentage of 40% and above.',
    official_link: 'https://www.scd.tn.gov.in/'
  }
];

db.serialize(() => {
  const stmt = db.prepare(`INSERT INTO schemes 
    (scheme_name, provider, target_role, category_required, gender_required, income_limit, education_required, state, description, official_link) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  let count = 0;
  newSchemes.forEach(s => {
    db.get('SELECT id FROM schemes WHERE scheme_name = ?', [s.scheme_name], (err, row) => {
      if (!row) {
        stmt.run([s.scheme_name, s.provider, s.target_role, s.category_required, s.gender_required, s.income_limit, s.education_required, s.state, s.description, s.official_link]);
        count++;
      }
    });
  });

  setTimeout(() => {
    stmt.finalize();
    console.log(`Successfully added ${newSchemes.length} diverse schemes to the live DB!`);
  }, 1000);
});
