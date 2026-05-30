import {Client, Databases, ID, Query} from "appwrite";

const PROJECT_ID = import.meta.env.VITE_APPWRITE_PROJECT_ID;
const DB_ID = import.meta.env.VITE_APPWRITE_DB_ID;
const TABLE_ID = import.meta.env.VITE_APPWRITE_METRICS_ID;

const client = new Client().setEndpoint('https://fra.cloud.appwrite.io/v1').setProject(PROJECT_ID);

const db = new Databases(client);

export const updateSearchCount = async (searchTerm, movie) => {
    searchTerm = searchTerm.toLowerCase();
    // 1. Use Appwrite SDK to check if the search term exists in the database
    try {
        const results = await db.listDocuments(DB_ID, TABLE_ID, [Query.equal('searchTerm', searchTerm),]);

    // 2. If it does, update the count (+1)
        if(results.documents.length > 0) {
            const doc = results.documents[0];

            await db.updateDocument(DB_ID, TABLE_ID, doc.$id, {
                count: doc.count+1,
            });
            console.log(doc.count);
        }
        // 3. If it doesn't, create a new document with the search term and set the count as 1
        else{
            await db.createDocument(DB_ID, TABLE_ID, ID.unique(), {
                searchTerm: searchTerm,
                movieTitle: movie.title,
                count: 1,
                poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
                movie_id: movie.id,
            })
        }
    }
    catch(err){
        console.error(err)
    }
}

export const fetchTrendingMovies = async () => {
    try {
        const results = await db.listDocuments(DB_ID, TABLE_ID, [Query.limit(5), Query.orderDesc("count")]);
        return results.documents;
    }
    catch(err){
        console.error(err)
    }
}