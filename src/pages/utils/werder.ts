import {
  bundesligaData,
  storageKeyPrefix,
  werderData,
} from "../../config/settings";
import { apiFetch } from "../api/axios";
import { League, Standing } from "../types/Standing";
import { StorageWerderLeague } from "../types/response";

import { getLocalStorage, setLocalStorage } from "./storage";
import { thisSeason } from "./utilities";

const storageKeyWerderStatus = `${storageKeyPrefix}werder_league`;

const fetching = async (standingsUrl) => {
  return apiFetch(standingsUrl);
};

export const getLeague = async (
  league: League,
  currentSeason: string
): Promise<Standing[] | null> => {
  const standingsUrl = `${bundesligaData.endpoint}/getbltable/${league}/${currentSeason}`;
  let res;
  try {
    res = await apiFetch(standingsUrl);
  } catch (error) {
    console.log("findWerder error: ", error);
  }
  if (res?.data) {
    return res.data;
  }
  return null;
};

export const werderLeagueStatus = async () => {
  const currentSeason = thisSeason;
  const leagues: League[] = ["bl1", "bl2", "bl3"];
  const shortName = werderData.shortName;

  if (currentSeason) {
    for (let index = 0; index < leagues.length; index++) {
      const lg = await getLeague(leagues[index], currentSeason);
      if (lg && lg?.length > 0) {
        const ret = lg[lg.findIndex((item) => item.ShortName == shortName)];
        if (ret) {
          console.log(
            `Werder League stored for season ${currentSeason} - ${leagues[index]}`
          );
          setLocalStorage(storageKeyWerderStatus, {
            currentSeason: currentSeason,
            currentLeague: leagues[index],
          });
          return leagues[index];
        }
      }
    }
  }
};

export const getLeagueStatus = async () => {
  const localStorage: StorageWerderLeague = getLocalStorage(storageKeyWerderStatus);

  if (!localStorage || localStorage.currentSeason !== thisSeason) {
    const league = await werderLeagueStatus();
    if (league) {
      return league;
    }
  }

  console.log(
    `Storage Werder League found for season ${thisSeason} - ${localStorage.currentLeague}`
  );
  return localStorage.currentLeague || "bl1";
};
