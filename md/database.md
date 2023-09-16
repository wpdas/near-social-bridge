## Database

This feature allows tables to be created for each database key. The Social API is used under the hood.

### Table

Tables must be simple class with default values, empty or not. This class will be used as a reference to create the table's fields.

When it's time to persist the table's data on the chain, just call the `persit` database function.

```ts
// Greeting Table
class GreetingTable {
  public greeting = 'Hi'
}
```

```ts
import { connect } from 'near-social-bridge/database'
import { GreetingTable } from './tables'

const main async () {
  // db-name | user | password
  const db = connect('test-db', 'root', '1234')

  // Initialize the "greeting" table using the "GreetingTable"
  // class as a template. If there is already any data saved in
  // the chain, this data will be populated in the table instance.
  const greetingTable = await db.get_table('Greeting', new GreetingTable())
  console.log(greetingTable.table) // { greeting: 'Hi' }

  // Mutating data
  greetingTable.table.greeting = "Hello my dear!"
  await greetingTable.persist() // Data is persisted on the blockchain

  // See the most updated values of the table
  console.log(greetingTable.table) // { greeting: 'Hello my dear!' }

  // Get the last 100 changes
  const greetingHistory = await greetingTable.getHistory(100)
  console.log(greetingHistory)
  // [
  //   { greeting: 'Hello my dear!' },
  //   { greeting: 'Hi' },
  //   { greeting: 'Ei, sou eu :D' },
  //   { greeting: 'Heyo' },
  //   ...
  // ]
}
main()
```
