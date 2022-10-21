### `Sander's Krug fanclub - cards ordering`


### `Prerequisites`
 - src/config folder 

##### `firebase.js`

    export const config = {
        apiKey: "xxxx",
        authDomain: "xxxx.firebaseapp.com",
        projectId: "xxxx",
        storageBucket: "xxxx.appspot.com",
        messagingSenderId: "xxxx",
        appId: "xxxx",
    };

    export const auth = {
        email: "xxxx@xxxx.xx",
        password: "12345678",
    };

##### `imageKit.js`

    export const imageEndpoint = "https://ik.imagekit.io/xxxx";

    export const imageKey = "xxxx";


##### `settings.js`

    export const werderData = {
        shortName: "Bremen",
        teamGroupName: null,
        teamIconUrl:
            "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/SV-Werder-Bremen-Logo.svg/681px-SV-Werder-Bremen-Logo.svg.png",
        teamId: 134,
        teamName: "Werder Bremen",
        currentLeagueString: "bl1",
    };

    export const carlData = {
        name: "xxxx",
    };

    export const bundesligaData = {
        endpoint: "https://www.openligadb.de/api",
    };

    export const storageKeyPrefix = "sanders_krug_";


 - root folder 

##### `.firebaserc`
    {
        "projects": {
            "default": "firebase project name"
        }
    }
