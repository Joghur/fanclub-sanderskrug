import { getAuth } from 'firebase/auth';

const Admin = () => {
    const auth = getAuth();

    return <div>{auth.currentUser && `Admin`}</div>;
};

export default Admin;
