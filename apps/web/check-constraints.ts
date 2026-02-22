import postgres from 'postgres';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const sql = postgres(process.env.DATABASE_URL!);

async function main() {
  const constraints = await sql`
    SELECT 
      tc.constraint_name,
      tc.constraint_type,
      pg_get_constraintdef(con.oid) AS constraint_definition,
      tc.table_name,
      tc.constraint_schema
    FROM
      information_schema.table_constraints AS tc
    JOIN pg_constraint AS con
      ON tc.constraint_name = con.conname
      AND con.conrelid = (
        SELECT oid
        FROM pg_class
        WHERE relname = tc.table_name
        AND relnamespace = (
          SELECT oid
          FROM pg_namespace
          WHERE nspname = tc.constraint_schema
        )
      )
    WHERE
      tc.constraint_type = 'CHECK'
      AND con.contype = 'c'
      AND pg_get_constraintdef(con.oid) IS NULL;
  `;
  console.log(constraints);
  await sql.end();
}

main();