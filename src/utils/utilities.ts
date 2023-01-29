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
    const absMinuteDiff = Math.abs(minuteDiff);
    const time =
        absMinuteDiff >= 60
            ? `${Math.floor(absMinuteDiff / 60)}:${absMinuteDiff % 60 < 10 ? '0' : ''}${absMinuteDiff % 60}`
            : `${absMinuteDiff} min`;

    if (minuteDiff < 0) {
        return { status: isToday ? time : date, colour: 'red' };
    }

    if (minuteDiff >= 0 && isToday && !MatchIsFinished) {
        return { status: time, colour: 'green' };
    }
    return { status: isToday ? 'Endergebnis' : date, colour: 'grey' };
};
