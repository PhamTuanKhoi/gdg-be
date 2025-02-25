import { Repository, FindOptionsWhere, DeepPartial } from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';

export abstract class BaseRepository<T> {
  constructor(protected readonly repository: Repository<T>) {}

  async findOneByField(field: keyof T, value: any): Promise<T | null> {
    return this.repository.findOne({ where: { [field]: value } as FindOptionsWhere<T> });
  }

  async findById(id: number): Promise<T | null> {
    return this.findOneByField('id' as keyof T, id);
  }

  async save(entity: DeepPartial<T>): Promise<T> {
    return this.repository.save(entity) as Promise<T>;
  }

  async update(id: number, updateData: QueryDeepPartialEntity<T>): Promise<T> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected > 0;
  }
}
