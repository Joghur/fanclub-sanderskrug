import { differenceInMinutes, isToday as today, format } from 'date-fns';

import { MatchStatus } from './types/Game';

export const thisYear = new Date().getFullYear();
export const thisSeason = String(new Date().getMonth() > 5 ? thisYear : thisYear - 1);

export const getMatchStatus = (
    MatchDateTime: Date | undefined,
    MatchHasStarted: boolean | undefined,
    MatchIsFinished: boolean | undefined,
): MatchStatus => {
    let colour = 'grey';
    let status = '';
    const res = { status, colour };

    if (!MatchDateTime) {
        return res;
    }
    const minuteDiff = differenceInMinutes(new Date(), new Date(MatchDateTime));
    const isToday = today(new Date(MatchDateTime));
    const date = format(new Date(MatchDateTime), 'd/MMM');
    const absMinuteDiff = Math.abs(minuteDiff);
    const time =
        absMinuteDiff >= 60
            ? `${Math.floor(absMinuteDiff / 60)}:${absMinuteDiff % 60 < 10 ? '0' : ''}${absMinuteDiff % 60}`
            : `${absMinuteDiff} min`;

    status = 'Endergebnis';
    if (!MatchHasStarted) {
        colour = 'red';
        status = isToday ? `-${time}` : date;
    }
    if (MatchHasStarted && !MatchIsFinished) {
        colour = 'green';
        status = 'Gestartet';
    }
    if (MatchIsFinished && !isToday) {
        status = date;
    }

    return { ...res, status, colour };
};
