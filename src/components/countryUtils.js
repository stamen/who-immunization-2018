import { lookup } from 'country-data';

const whoCountryNameToCountryDataLookupName = {
  "Bolivia": "Bolivia, Plurinational State Of",
  "Bosnia and Herzegovina": "Bosnia & Herzegovina",
  "Congo": "Republic Of Congo",
  "Congo_Democratic People Republic of": "Democratic Republic Of Congo",
  "Czechia": "Czech Republic",
  "France (metropolitan)": "France, Metropolitan",
  "The Gambia": "Gambia",
  "Palestine": "Palestinian Territory, Occupied",
  //"France_Guadeloupe": "France",
  //"France_Martinique": "France",
  "Iran (Islamic Republic of)": "Iran, Islamic Republic Of",
  "Côte d Ivoire": "Côte d'Ivoire",
  "Korea_Democratic People Republic of": "Korea, Democratic People's Republic Of",
  "Korea_Republic of": "Korea, Republic Of",
  "Lao People Democratic Republic": "Lao People's Democratic Republic",
  "Moldova_Republic of": "Moldova",
  "France_New Caledonia": "France",
  "Guinea-Bissau": "Guinea-bissau",
  "Timor-Leste": "Timor-Leste, Democratic Republic of",
  "France_Reunion": "France",
  "Trinidad and Tobago": "Trinidad And Tobago",
  "Macedonia_Former Yugoslav Republic of": "Macedonia, The Former Yugoslav Republic Of",
  "Tanzania_United Republic of": "Tanzania, United Republic Of",
  "United States of America": "United States",
  "Venezuela": "Venezuela, Bolivarian Republic Of"
};

export function lookupCountryCode (countryName) {
  const countryInfo = lookup.countries({name: whoCountryNameToCountryDataLookupName[countryName] || countryName});
  let countryCode = null;
  if (countryInfo.length) {
    countryCode = countryInfo[0].alpha3;
  } else {
    console.log(`WARNING: Could not look up country code for ${countryName}`);
  }
  return countryCode;
}
