import { Access } from './access'
import hash from './hash'
import * as table from './table'

export class DataBase {
  api = ''
  name = ''
  access: Access | null = null
  access_key = ''

  /**
   * Connection information.
   * @param data_base_name Data base name
   * @param user  User to access the data base
   * @param password  Password to access the data base
   */
  connect(data_base_name: string, user: string, password: string) {
    const key_data = `${data_base_name}${user}${password}`

    const key = hash(key_data).toString()

    this.name = data_base_name
    this.access = new Access(user, password)
    this.access_key = key
  }

  /**
   * Initialize a table, fetching its more updated data
   */
  async get_table<Model extends {}>(table_name: string, model: Model) {
    const chainDbCopy = connect(this.name, this.access!.user, this.access!.password)
    const table_data = await table.get<Model>(chainDbCopy, table_name, model)

    // NOTE: Although only the "table" and "persist" properties are displayed by
    // the lint, all Table properties are being exposed.
    // This is due to a javascript limitation on classes.
    //
    // There was an attempt to return a new object with only the required
    // data, but this generates an error in the "this" instance of the Table.
    return table_data as {
      table: Model
      /**
       * Persist table data on chain
       */
      persist: () => Promise<void>
      /**
       * Get the history of changes. A list of transactions from the most recent to the most old
       * in a range of depth
       * @param depth
       */
      getHistory: (depth: number) => Promise<Model[]>
    }
  }
}

export const connect = (data_base_name: string, user: string, password: string) => {
  const chainDb = new DataBase()
  chainDb.connect(data_base_name, user, password)
  return chainDb
}
