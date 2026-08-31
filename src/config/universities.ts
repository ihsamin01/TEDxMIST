/**
 * Universities in and around Dhaka, offered in the registration form.
 *
 * Add or remove names freely — the dropdown rebuilds itself from this file.
 * Keep each list alphabetical so people can find their own quickly.
 *
 * Nobody is ever blocked by an incomplete list: picking "Other" reveals a
 * text box where they type their own institution.
 */

/** The option that turns the dropdown into a free text field. */
export const OTHER_UNIVERSITY = "Other (not listed)";

export const universityGroups: readonly {
  label: string;
  options: readonly string[];
}[] = [
  {
    label: "Public",
    options: [
      "Bangabandhu Sheikh Mujib Medical University (BSMMU)",
      "Bangladesh Open University",
      "Bangladesh University of Engineering and Technology (BUET)",
      "Bangladesh University of Professionals (BUP)",
      "Bangladesh University of Textiles (BUTEX)",
      "Dhaka Medical College",
      "Dhaka University of Engineering and Technology (DUET)",
      "Islamic University of Technology (IUT)",
      "Jagannath University",
      "Jahangirnagar University",
      "Military Institute of Science and Technology (MIST)",
      "National University",
      "Sher-e-Bangla Agricultural University",
      "University of Dhaka",
    ],
  },
  {
    label: "Private",
    options: [
      "Ahsanullah University of Science and Technology (AUST)",
      "American International University-Bangladesh (AIUB)",
      "Asian University of Bangladesh",
      "BRAC University",
      "Bangladesh University",
      "Bangladesh University of Business and Technology (BUBT)",
      "Bangladesh University of Health Sciences",
      "Canadian University of Bangladesh",
      "Central Women's University",
      "City University",
      "Daffodil International University (DIU)",
      "Dhaka International University",
      "East West University (EWU)",
      "Eastern University",
      "European University of Bangladesh",
      "Green University of Bangladesh",
      "Independent University, Bangladesh (IUB)",
      "Manarat International University",
      "North South University (NSU)",
      "Northern University Bangladesh",
      "Presidency University",
      "Primeasia University",
      "Prime University",
      "Shanto-Mariam University of Creative Technology",
      "Sonargaon University",
      "Southeast University",
      "Stamford University Bangladesh",
      "State University of Bangladesh (SUB)",
      "United International University (UIU)",
      "University of Asia Pacific (UAP)",
      "University of Liberal Arts Bangladesh (ULAB)",
      "Uttara University",
      "World University of Bangladesh",
    ],
  },
  {
    label: "Not on the list",
    options: [OTHER_UNIVERSITY],
  },
];

/** Every name in one array, for validating what the form sends back. */
export const allUniversities: readonly string[] = universityGroups.flatMap(
  (group) => group.options,
);
