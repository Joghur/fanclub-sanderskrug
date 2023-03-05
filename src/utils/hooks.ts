import axios, { AxiosError, AxiosResponse } from 'axios';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import { credentials } from 'src/config/firebase';

import { logOut, logIn } from './api/auth';
import { useAxios } from './api/axios';
import { editDocument, fetchDocument, queryDocuments } from './api/database';
import { getCurrentGroupUrl, getLeagueStandingUrl } from './api/urls';
import { CardOrder } from './types/Cards';
import { Game, MatchDay, NextMatch, NextMatchDB } from './types/Game';
import { Standing } from './types/Standing';
import { getWerderLeagueStatus } from './werder';

export const initNextMatch: NextMatch = {
    gameId: '',
    matchDate: new Date(),
    location: 'Weser Stadion',
    matchDay: 0,
    matchType: 'league',
    opponent: '',
    nextMatch: false,
    active: false,
    busTour: false,
};

export const useNextMatch = () => {
    const [value, setValue] = useState<NextMatch>(initNextMatch);
    const [loading, setLoading] = useState(true);

    const fetchingStartInfo = async () => {
        const res = await fetchDocument<NextMatchDB>('info', 'nextMatch');

        if (res.success) {
            const _nextMatch = res.success;
            if (typeof _nextMatch === 'string') {
                return;
            }
            setValue(() => ({ ..._nextMatch, matchDate: new Date(_nextMatch.matchDate?.seconds * 1000) }));
            setLoading(() => false);
            return;
        }
        console.log('Error in NextMatch');
        // console.log('Error in NextMatch: ', res.error);
    };

    useEffect(() => {
        fetchingStartInfo();
    }, []);

    return [value, setValue, loading] as const;
};

export const useExtraCardsOrder = (gameId: string) => {
    const [cards, setCards] = useState<CardOrder[]>([]);

    const fetchingCards = async () => {
        const dbCards = await queryDocuments<CardOrder>('cards', 'gameId', '==', gameId);
        if (typeof dbCards.success === 'string') {
            return;
        }
        if (dbCards.success) {
            const _cards = dbCards.success;
            setCards(_cards);
            return;
        }
        // console.log('Error in Cards: ', dbCards.error);
        console.log('Error in Cards');
    };

    useEffect(() => {
        fetchingCards();
    }, []);

    return [cards, setCards] as const;
};

export const useStartInfo = () => {
    const snackbar = useSnackbar();

    interface Startinfo {
        id: string;
        infoText: string;
    }

    const [info, setInfo] = useState('');

    const fetchingStartInfo = async () => {
        const info = await queryDocuments<Startinfo>('info', 'infoText', '!=', '');
        if (typeof info.success === 'string') {
            return;
        }
        if (info && info.success?.length === 1) {
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

    const changeInformationText = (event?: React.ChangeEvent<HTMLTextAreaElement>) => {
        if (!event) {
            setInfo('');
        }
        if (event?.target) {
            setInfo(event.target.value);
        }
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

export const useleague = (currentSeason: string) => {
    const [league, setLeague] = useState<string>('');
    useEffect(() => {
        (async () => {
            const _league = await getWerderLeagueStatus(currentSeason);

            if (_league) {
                setLeague(_league);
            }
        })();
    }, []);

    return [league, setLeague] as const;
};

export const useBlMatchday = (league: string) => {
    const [blMatchDayData, setBlMatchDayData] = useState<MatchDay>();
    const [blMatchDay, setBlMatchDay] = useState(blMatchDayData?.groupOrderID || 0);

    const getMatchDayData = async (league: string) => {
        if (league.substring(0, 2) === 'bl') {
            const url = getCurrentGroupUrl(league);
            const res = await axios.get(url);
            setBlMatchDayData(res.data);
        }
    };

    useEffect(() => {
        if (blMatchDayData?.groupOrderID) {
            setBlMatchDay(() => blMatchDayData.groupOrderID);
        }
    }, [blMatchDayData?.groupOrderID]);

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
    const [loading, setLoading] = useState<boolean | undefined>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (standingsUrl) {
            fetchAxios(standingsUrl);
        }
    }, [standingsUrl]);

    const fetchAxios = async (url: string) => {
        let res: Standing[];
        try {
            res = await (await fetch(url)).json();
            if (res) {
                setStandings(() => res);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<Error>;
                if (serverError && serverError.response) {
                    setError(serverError.response.data.message);
                }
            }
        }
        setLoading(() => false);
    };

    return [standings, loading, error] as const;
};

export const useGames = (url: string) => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState<boolean | undefined>(true);
    const [error, setError] = useState<string | undefined>(undefined);

    useEffect(() => {
        if (url) {
            fetchAxios(url);
        }
    }, [url]);

    const fetchAxios = async (url: string) => {
        let res: Game[];
        try {
            res = await (await fetch(url)).json();
            if (res) {
                setGames(() => res);
            }
        } catch (err) {
            if (axios.isAxiosError(err)) {
                const serverError = err as AxiosError<Error>;
                if (serverError && serverError.response) {
                    setError(serverError.response.data.message);
                }
            }
        }
        setLoading(() => false);
    };

    return [games, loading, error] as const;
};
