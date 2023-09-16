import { DataBase } from './database'
import { Social } from '../api'

const NEAR_SOCIAL_BRIDGE_DB = 'nsb-db'

class Table<Model extends {}> {
  public table: Model
  private table_id = ''

  constructor(table: Model, table_id: string) {
    this.table = table
    this.table_id = table_id
  }

  /**
   * Persist table data on chain
   */
  async persist() {
    try {
      await Social.set<{ error?: string }>({
        index: {
          [NEAR_SOCIAL_BRIDGE_DB]: JSON.stringify({
            key: this.table_id,
            value: this.table,
          }),
        },
      })
    } catch {
      throw new Error('Something went wrong!')
    }
  }

  /**
   * Get the history of changes. A list of transactions from the most recent to the most old
   * in a range of depth
   * @param depth
   */
  async getHistory(limit: number) {
    try {
      const response = await Social.index<Model>(NEAR_SOCIAL_BRIDGE_DB, this.table_id, { limit, order: 'desc' })

      // Return empty if theres no data
      if (Array.isArray(response) && response[0] && response[0].value) {
        return response.map((res) => res.value)
      }

      return []
    } catch {
      throw new Error('Something went wrong!')
    }
  }
}

export const get = async <Model extends {}>(db: DataBase, table_name: string, model: Model) => {
  const table_id = db.access!.parse(db.name, table_name)

  try {
    const response = await Social.index<Model>(NEAR_SOCIAL_BRIDGE_DB, table_id, { limit: 1, order: 'desc' })

    // Return empty if theres no data
    // If there's already a table (contract) with data, then, fetch its data
    if (Array.isArray(response) && response[0] && response[0].value) {
      const table = new Table<Model>(response[0].value, table_id)
      return table
    }

    // If there's no content for this table (contract), then, create a new table
    const table = new Table<Model>(model, table_id)
    return table
  } catch {
    throw new Error('Something went wrong!')
  }
}
