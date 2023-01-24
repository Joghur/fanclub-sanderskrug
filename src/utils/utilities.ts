import { differenceInMinutes, isToday, format } from 'date-fns';

export const thisYear = new Date().getFullYear();
export const thisSeason = String(new Date().getMonth() > 5 ? thisYear : thisYear - 1);

export const getMatchStatus = (
    MatchDateTime: Date | undefined,
    MatchIsFinished: boolean | undefined,
): string | undefined => {
    if (!MatchDateTime) {
        return undefined;
    }
    if (!isToday(new Date(MatchDateTime))) {
        return `${format(new Date(MatchDateTime), 'dd/MMM')}`;
    }
    if (MatchDateTime && !MatchIsFinished) {
        let minuteDiff = differenceInMinutes(new Date(), new Date(MatchDateTime));

        // faking changing half.
        if (minuteDiff > 59) {
            minuteDiff -= 15;
        }
        return `${minuteDiff}'`;
    }
    return 'Endergebnis';
};
