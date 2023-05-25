import { MessageEncryptTypeEnum } from '../../shared/constants'

// export class EncryptTypeTransformer {
//   from(value: string) {
//     return value
//   }
//   to(value: string): number {
//     return +value
//   }
// }

export class EncryptTypeTransformer {
  from(value: string | null): MessageEncryptTypeEnum | null {
    if (value === null) {
      return null
    }
    return parseInt(value, 10) as MessageEncryptTypeEnum
  }
  to(value: MessageEncryptTypeEnum | null): string | null {
    if (value === null) {
      return null
    }
    return value.toString()
  }
}
