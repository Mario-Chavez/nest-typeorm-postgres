import { Type } from 'class-transformer';
import { IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationDto {
  @IsOptional()
  @IsPositive()
  @Type(() => Number) //cambia el valor a numero ya que llega en string
  limit?: number;

  @IsOptional()
  @Min(0)
  @Type(() => Number) //cambia el valor a numero ya que llega en string
  offset?: number;
}
