import { v4 as uuid } from 'uuid';

export class SecretGenerator {
  private uuid = uuid;

  public generateID(): string {
    return this.uuid();
  }
}
