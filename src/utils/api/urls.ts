import { ligaData } from 'src/config/settings';

export const getLeagueStandingUrl = (league: string, year: string) => {
    switch (league) {
        case 'dfb':
        case 'wm':
            return `${ligaData.endpoint}/getbltable/${league}${year}/${year}`;

        case 'uefacl':
            return `${ligaData.endpoint}/getbltable/${league}${year.substring(2)}/${year}`;

        default:
            return `${ligaData.endpoint}/getbltable/${league}/${year}`;
    }
};

export const getCurrentGroupUrl = (league: string) => {
    return `${ligaData.endpoint}/getcurrentgroup/${league}`;
};

export const getMatchDataUrl = (league: string, year: string, blMatchDay: string) => {
    return `${ligaData.endpoint}/getmatchdata/${league}/${year}/${blMatchDay}`;
};
