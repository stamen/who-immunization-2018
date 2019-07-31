import * as d3 from "d3";
import { countries } from "country-data";

import healthWorkerDataURL from "/data/health_workforce_data.csv.1";
import wuenicMasterDataURL from "/data/wuenic_master.csv.0";

import HealthWorkersVsVaccinationPlot from "/components/HealthWorkersVsVaccinationPlot";
import HealthWorkerDataProvider from "/components/HealthWorkerDataProvider";
import WuenicMasterDataProvider from "/components/WuenicMasterDataProvider";

import "/index.scss";

document.addEventListener("DOMContentLoaded", function() {
  Promise.all([d3.csv(healthWorkerDataURL), d3.csv(wuenicMasterDataURL)]).then(
    function([healthWorkerData, wuenicMasterData]) {
      healthWorkerData.forEach(row => {
        const countryCode = row["COUNTRY (code)"];

        if (!countries.hasOwnProperty(countryCode)) {
          console.log(
            `Country entry not found for countryCode: ${countryCode}`
          );
          console.log("row");
          console.log(row);
        }
      });

      const healthWorkerDataProvider = new HealthWorkerDataProvider({
        healthWorkerData
      });

      const wuenicDataProvider = new WuenicMasterDataProvider({
        wuenicMasterData
      });

      wuenicDataProvider.getRows().forEach(row => {
        const { countryCode } = row;

        if (!countries.hasOwnProperty(countryCode)) {
          console.log(
            `Country entry not found for countryCode: ${countryCode}`
          );
        }
      });

      const getWuenicDataForCountry = countryCode =>
        wuenicDataProvider.getRowsForCountryAndVaccine(countryCode, "dtp3");

      const containerEl = d3.select("div.plot-container");

      const countriesToPlot = [
        "SSD",
        "NGA",
        "GIN",
        "SYR",
        "ETH",
        "COG",
        "COD",
        "PAK",
        "IDN",
        "IND",
        "CMR",
        "GIN",
        "SYR",
        "IRQ",
        "YEM"
      ];

      countriesToPlot.map(
        countryCode =>
          new HealthWorkersVsVaccinationPlot({
            containerEl,
            countries,
            getWuenicDataForCountry,
            healthWorkerDataProvider,
            countryCode
          })
      );
    }
  );
});
