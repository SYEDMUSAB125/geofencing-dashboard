import postgres from 'postgres'


const sql = postgres(process.env.NEXT_PUBLIC_POSTGRESS_URL, {ssl:"require"}) // will use psql environment variables

export default sql