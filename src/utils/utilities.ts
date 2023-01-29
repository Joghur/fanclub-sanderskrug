import { differenceInMinutes, isToday as today, format } from 'date-fns';

import { MatchStatus } from './types/Game';

export const thisYear = new Date().getFullYear();
export const thisSeason = String(new Date().getMonth() > 5 ? thisYear : thisYear - 1);

export const getMatchStatus = (MatchDateTime: Date | undefined, MatchIsFinished: boolean | undefined): MatchStatus => {
    if (!MatchDateTime) {
        return { status: '', colour: 'grey' };
    }
    const minuteDiff = differenceInMinutes(new Date(), new Date(MatchDateTime));
    const isToday = today(new Date(MatchDateTime));
    const date = format(new Date(MatchDateTime), 'dd/MMM');
    console.log('minuteDiff', minuteDiff / 60);
    const time =
        Math.abs(minuteDiff) >= 60
            ? `${Math.floor(Math.abs(minuteDiff) / 60)}:${Math.abs(minuteDiff % 60)}`
            : `${Math.abs(minuteDiff)} min`;

    if (minuteDiff < 0) {
        return { status: isToday ? time : date, colour: 'red' };
    }

    if (minuteDiff >= 0 && isToday && !MatchIsFinished) {
        return { status: time, colour: 'green' };
    }
    return { status: 'Endergebnis', colour: 'grey' };
};
