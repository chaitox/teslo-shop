import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { In, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductoService {
  private readonly logger = new Logger('ProductoService');
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
  ) {}
  
  
  async create(createProductoDto: CreateProductoDto) {
    try {
      
      const producto = this.productoRepository.create(createProductoDto);
      await this.productoRepository.save(producto);
      return producto;

    } catch (error) {
     this.handleException(error);
    }
  }

  findAll() {
    return `This action returns all producto`;
  }

  findOne(id: number) {
    return `This action returns a #${id} producto`;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  remove(id: number) {
    return `This action removes a #${id} producto`;
  }

  private handleException(error: any) {
    if (error.code = 23505) {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(`Error al guardar el producto`, error.stack);
    throw new InternalServerErrorException('Unexpected Error, check server log');
  
  }
}
