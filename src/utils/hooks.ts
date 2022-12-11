import axios from 'axios';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { credentials } from 'src/config/firebase';

import { logOut, logIn } from './api/auth';
import { useAxios } from './api/axios';
import { editDocument, fetchDocument, queryDocuments } from './api/database';
import { getCurrentGroupUrl, getLeagueStandingUrl } from './api/urls';
import { CardOrder } from './types/Cards';
import { MatchDay, NextMatch } from './types/Game';
import { Standing } from './types/Standing';
import { getWerderLeagueStatus } from './werder';

export const initNextMatch: NextMatch = {
    gameId: '',
    matchDate: new Date(),
    location: 'Weser Stadion',
    matchDay: 0,
    matchType: 'other',
    opponent: '',
    nextMatch: false,
    active: false,
    busTour: true,
};

export const useNextMatch = () => {
    const [value, setValue] = useState<NextMatch>(initNextMatch);

    const fetchingStartInfo = async () => {
        const nextMatch = await fetchDocument('info', 'nextMatch');

        if (nextMatch.success) {
            const _nextMatch = nextMatch.success;
            _nextMatch.matchDate = new Date(_nextMatch.matchDate.seconds * 1000);
            setValue(_nextMatch);
            return;
        }
        console.log('Error in NextMatch: ', nextMatch.error);
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    return [value, setValue] as const;
};

export const useExtraCardsOrder = (gameId: string) => {
    const [cards, setCards] = useState<CardOrder[]>([]);

    const fetchingCards = async () => {
        const dbCards = await queryDocuments('cards', 'gameId', '==', gameId);

        if (dbCards.success) {
            const _cards = dbCards.success;
            setCards(_cards);
            return;
        }
        console.log('Error in Cards: ', dbCards.error);
    };

    useEffect(() => {
        fetchingCards();
    }, []);

    return [cards, setCards] as const;
};

export const useStartInfo = () => {
    const snackbar = useSnackbar();

    const [info, setInfo] = useState('');

    const fetchingStartInfo = async () => {
        const info = await queryDocuments('info', 'infoText', '!=', '');

        if (info?.success.length === 1) {
            setInfo(info.success[0].infoText);
        }
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    const submitInformation = async () => {
        const res = await editDocument('info', 'info', {
            infoText: info,
        });

        if (res.error) {
            snackbar.enqueueSnackbar('Änderungen werden nicht gespeichert', {
                variant: 'error',
            });
        } else {
            snackbar.enqueueSnackbar('Änderungen gespeichert', {
                variant: 'success',
            });
        }
    };

    const changeInformationText = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setInfo(event.target.value);
    };

    return [info, submitInformation, changeInformationText] as const;
};

export const useFirebaseAuth = () => {
    const [authUser, setAuthUser] = useState<User | null>(null);
    const [initializing, setInitializing] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const subscriber = onAuthStateChanged(auth, userObj => {
            if (userObj) {
                setAuthUser(() => userObj);
            } else {
                setAuthUser(null);
            }
            setInitializing(false);
        });
        return subscriber; // unsubscribe on unmount
    }, []);

    const handleLogin = async () => {
        if (authUser) {
            await logOut();
        } else {
            await logIn(credentials);
        }
    };

    return [authUser, handleLogin, initializing] as const;
};

export const useleague = () => {
    const [league, setLeague] = useState<string>('');

    useEffect(() => {
        (async function () {
            const _league = await getWerderLeagueStatus();

            if (_league) {
                setLeague(_league);
            }
        })();
    }, []);

    return [league, setLeague] as const;
};

export const useBlMatchday = (league: string) => {
    const [blMatchDayData, setBlMatchDayData] = useState<MatchDay>();
    const [blMatchDay, setBlMatchDay] = useState(blMatchDayData?.GroupOrderID || '0');

    const getMatchDayData = async (league: string) => {
        if (league.substring(0, 2) === 'bl') {
            const url = getCurrentGroupUrl(league);
            const res = await axios.get(url);
            setBlMatchDayData(res.data);
        }
    };

    useEffect(() => {
        if (blMatchDayData?.GroupOrderID) {
            setBlMatchDay(() => blMatchDayData.GroupOrderID);
        }
    }, [blMatchDayData?.GroupOrderID]);

    useEffect(() => {
        if (league) {
            getMatchDayData(league);
        }
    }, [league]);

    return [blMatchDay] as const;
};

export const useStandings = (league: string, year: string) => {
    const [standings, setStandings] = useState<Standing[]>([]);
    const standingsUrl = getLeagueStandingUrl(league, year);
    const [data, loading, error] = useAxios<Standing[]>(standingsUrl || '');

    useEffect(() => {
        if (data) {
            setStandings(data);
        }
    }, [data]);

    return [standings, loading, error] as const;
};
