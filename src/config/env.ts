import { get } from 'lodash'

class EnvConfig {
  public get allowList(): Array<string> {
    const allowList = get(process.env, 'ALLOW_LIST', '[]')
    return JSON.parse(allowList)
  }
}

const envConfig = new EnvConfig()
export default envConfig
