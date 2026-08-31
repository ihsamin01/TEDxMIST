/**
 * Universities offered in the registration form.
 *
 * Everything in and around Dhaka, plus the larger campuses outside it that
 * students travel in from. One flat alphabetical list, no public/private
 * split — people look for their own name, not a category.
 *
 * Well-known abbreviations sit in brackets so the filter box finds a
 * university whether someone types "BUET" or "Bangladesh University of...".
 *
 * Add or remove names freely; the dropdown rebuilds itself from this file.
 * Nobody is ever blocked by a gap in the list: picking "Other" reveals a
 * text box where they type their own institution.
 */

/** The option that turns the dropdown into a free text field. */
export const OTHER_UNIVERSITY = "Other (not listed)";

/** Alphabetical. `OTHER_UNIVERSITY` is appended last, deliberately. */
export const universities: readonly string[] = [
  "Ahsanullah University of Science and Technology (AUST)",
  "American International University-Bangladesh (AIUB)",
  "Asian University of Bangladesh",
  "Atish Dipankar University of Science and Technology",
  "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
  "Bangabandhu Sheikh Mujibur Rahman Agricultural University",
  "Bangladesh Islami University",
  "Bangladesh Open University",
  "Bangladesh University",
  "Bangladesh University of Business and Technology (BUBT)",
  "Bangladesh University of Engineering and Technology (BUET)",
  "Bangladesh University of Health Sciences",
  "Bangladesh University of Professionals (BUP)",
  "Bangladesh University of Textiles (BUTEX)",
  "BRAC University",
  "Canadian University of Bangladesh",
  "Central Women's University",
  "Chittagong University of Engineering and Technology (CUET)",
  "City University",
  "Daffodil International University (DIU)",
  "Dhaka International University",
  "Dhaka Medical College",
  "Dhaka University of Engineering and Technology (DUET)",
  "East West University (EWU)",
  "Eastern University",
  "European University of Bangladesh",
  "German University Bangladesh",
  "Gono Bishwabidyalay",
  "Green University of Bangladesh",
  "Hamdard University Bangladesh",
  "IBAIS University",
  "Independent University, Bangladesh (IUB)",
  "International University of Business Agriculture and Technology (IUBAT)",
  "Islamic University of Technology (IUT)",
  "Jagannath University",
  "Jahangirnagar University",
  "Khulna University (KU)",
  "Khulna University of Engineering and Technology (KUET)",
  "Manarat International University",
  "Military Institute of Science and Technology (MIST)",
  "National University",
  "North South University (NSU)",
  "Northern University Bangladesh",
  "Notre Dame University Bangladesh",
  "Presidency University",
  "Prime University",
  "Primeasia University",
  "Queens University",
  "Rajshahi University of Engineering and Technology (RUET)",
  "Shanto-Mariam University of Creative Technology",
  "Sher-e-Bangla Agricultural University",
  "Sonargaon University",
  "Southeast University",
  "Stamford University Bangladesh",
  "State University of Bangladesh (SUB)",
  "The Millennium University",
  "United International University (UIU)",
  "University of Asia Pacific (UAP)",
  "University of Chittagong (CU)",
  "University of Development Alternative (UODA)",
  "University of Dhaka (DU)",
  "University of Information Technology and Sciences (UITS)",
  "University of Liberal Arts Bangladesh (ULAB)",
  "University of Rajshahi (RU)",
  "University of Scholars",
  "University of South Asia",
  "Uttara University",
  "Victoria University of Bangladesh",
  "World University of Bangladesh",
  "ZNRF University of Management Sciences",
  OTHER_UNIVERSITY,
];
