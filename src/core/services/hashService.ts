import bcrypt from 'bcrypt';

export class HashService {
  private readonly saltRounds: number;

  constructor(saltRounds = 10) {
    this.saltRounds = saltRounds;
  }

  async hash(value: string): Promise<string> {
    if (!value) throw new Error('Valor inválido para hash');
    return await bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    if (!value || !hashedValue) return false;
    return await bcrypt.compare(value, hashedValue);
  }
}

export const hashService = new HashService();
