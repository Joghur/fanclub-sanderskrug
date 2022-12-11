import { storageKeyPrefix, werderData } from '../config/settings';

import { useAxios } from './api/axios';
import { getLeagueStandingUrl } from './api/urls';
import { getLocalStorage, setLocalStorage } from './localStorage';
import { League, Standing } from './types/Standing';
import { StorageWerderLeague } from './types/response';
import { thisSeason } from './utilities';

const storageKeyWerderStatus = `${storageKeyPrefix}werder_league`;

export const getLeagueStanding = async (league: League, currentSeason: string): Promise<Standing[] | undefined> => {
    const standingsUrl = getLeagueStandingUrl(league, currentSeason);
    const [value, loading] = useAxios<Standing[]>(standingsUrl);
    if (loading) {
        return undefined;
    }
    return value;
};

export const werderLeagueStatus = async () => {
    const currentSeason = thisSeason;
    const leagues: League[] = ['bl1', 'bl2', 'bl3'];
    const shortName = werderData.shortName;

    if (currentSeason) {
        for (let index = 0; index < leagues.length; index++) {
            const lg = await getLeagueStanding(leagues[index], currentSeason);
            if (lg && lg?.length > 0) {
                const ret = lg[lg.findIndex(item => item.ShortName == shortName)];
                if (ret) {
                    console.log(`Werder League stored for season ${currentSeason} - ${leagues[index]}`);
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

export const getWerderLeagueStatus = async () => {
    const localStorage: StorageWerderLeague = getLocalStorage(storageKeyWerderStatus);

    if (!localStorage || localStorage.currentSeason !== thisSeason) {
        const league = await werderLeagueStatus();
        if (league) {
            return league;
        }
    }

    console.log(`Storage Werder League found for season ${thisSeason} - ${localStorage.currentLeague}`);
    return localStorage.currentLeague || 'bl1';
};
