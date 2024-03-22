import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { In, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductoService {
  
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
      
      console.log(error);
      throw new InternalServerErrorException('Error al guardar el producto');
    
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
}
