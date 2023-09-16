import hash from './hash'

export class Access {
  user = ''
  password = ''

  constructor(user: string, password: string) {
    this.user = user
    this.password = password
  }

  parse = (data_base: string, table_name: string) => {
    const access_info = `${data_base}${table_name}${this.user}${this.password}`
    return hash(access_info).toString()
  }
}
