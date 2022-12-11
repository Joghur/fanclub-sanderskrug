import {
    collection,
    getDocs,
    addDoc,
    deleteDoc,
    doc,
    getDoc,
    query,
    where,
    updateDoc,
    deleteField,
    WhereFilterOp,
} from 'firebase/firestore/lite';

import { db } from './firebase';

export interface Result<T> {
    success?: T | string;
    error?: unknown;
}

export const saveData = async <T>(dataCollection: string, data: T) => {
    const result: Result<string> = { success: undefined, error: undefined };
    if (!data) {
        result.error = 'No data when saving to DB';
        return result;
    }
    try {
        const docRef = await addDoc(collection(db, dataCollection), data);
        console.log('Document written with ID: ', docRef.id);
        result.success = docRef.id;
    } catch (e) {
        console.error('saveData - Error adding document: ', e);
        result.error = e;
    }
    console.log('result', result);
    return result;
};

/**
 *
 * @param collectionName
 * @param where1st
 * @param where2nd
 * @param where3rd
 * @returns
 */
export const queryDocuments = async <T>(
    collectionName: string,
    where1st: string,
    where2nd: WhereFilterOp,
    where3rd: unknown,
): Promise<Result<T[]>> => {
    const result: Result<T[]> = { success: undefined, error: undefined };
    try {
        const activitiesCollection = query(collection(db, collectionName), where(where1st, where2nd, where3rd));
        const activitiesSnapshot = await getDocs(activitiesCollection);
        result.success = activitiesSnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj as T;
        });
    } catch (e) {
        console.error(
            'queryDocuments - Error fetching documents: ',
            'collectionName',
            collectionName,
            'where1st',
            where1st,
            'where2nd',
            where2nd,
            'where3rd',
            where3rd,
            e,
        );
        result.error = e;
    }
    return result;
};

/**
 *
 * @param collectionName
 * @returns
 */
export const fetchDocuments = async <T>(collectionName: string) => {
    const result: Result<T[]> = { success: undefined, error: undefined };

    try {
        const activitiesCollection = query(collection(db, collectionName));
        const activitiesSnapshot = await getDocs(activitiesCollection);
        result.success = activitiesSnapshot.docs.map(doc => {
            const obj = doc.data();
            obj.id = doc.id;
            return obj as T;
        });
    } catch (e) {
        console.error('fetchDocuments - Error fetching documents: ', e);
        result.error = e;
    }
    return result;
};

export const deleteDocument = async (collectionName: string, docId: string) => {
    const result: Result<string> = { success: undefined, error: undefined };

    try {
        await deleteDoc(doc(db, collectionName, docId));
        result.success = docId;
    } catch (e) {
        console.error('deleteDocuments - Error deleting document: ', e);
        result.error = e;
    }
    return result;
};

export const deleteDocumentField = async (collectionName: string, docId: string, field: string) => {
    const result: Result<string> = { success: undefined, error: undefined };

    try {
        const ref = doc(db, collectionName, docId);

        await updateDoc(ref, { location: deleteField() });
        result.success = docId;
    } catch (e) {
        console.error(
            'deleteDocumentField - Error deleting document field: ',
            e,
            'collectionName',
            collectionName,
            'docId: ',
            docId,
            'field',
            field,
        );
        result.error = e;
    }
    return result;
};

export const editDocument = async <T>(collectionName: string, docId: string, data: T) => {
    const result: Result<string> = { success: undefined, error: undefined };
    if (!data) {
        result.error = 'No data when editing DB';
        return result;
    }
    try {
        await updateDoc(doc(db, collectionName, docId), data);
        result.success = docId;
    } catch (e) {
        console.error('editDocument - Error updating documents: ', e, 'docId: ', docId, 'Data: ', data);
        result.error = e;
    }
    return result;
};

export const fetchDocument = async <T>(collectionName: string, docId: string) => {
    const docRef = doc(db, collectionName, docId);
    const docSnap = await getDoc(docRef);

    const result: Result<T> = { success: undefined, error: undefined };

    if (docSnap.exists()) {
        result.success = docSnap.data() as T;
    } else {
        console.log('No such document!');
    }
    return result;
};

export const chatDB = async () => {
    return collection(db, 'chats');
};
