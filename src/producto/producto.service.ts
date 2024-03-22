import { BadRequestException, Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { In, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';

@Injectable()
export class ProductoService {
  private readonly logger = new Logger('ProductoService');
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
  ) { }


  async create(createProductoDto: CreateProductoDto) {
    try {

      const producto = this.productoRepository.create(createProductoDto);
      await this.productoRepository.save(producto);
      return producto;

    } catch (error) {
      this.handleException(error);
    }
  }

  findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const data = this.productoRepository.find({
      take: limit,
      skip: offset
      //TODO:relaciones
    });

    return data;
  }

  findOne(id: string) {
    const data = this.productoRepository.findOneBy({ id: id })
    if (!data) {
      throw new BadRequestException(`Producto con id ${id} no encontrado`);
    }
    return data;
  }

  update(id: number, updateProductoDto: UpdateProductoDto) {
    return `This action updates a #${id} producto`;
  }

  async remove(id: string) {

    const producto = await this.findOne(id)
    await this.productoRepository.remove(producto);
    return;
  }

  private handleException(error: any) {
    if (error.code = 23505) {
      throw new BadRequestException(error.detail);
    }
    this.logger.error(`Error al guardar el producto`, error.stack);
    throw new InternalServerErrorException('Unexpected Error, check server log');

  }
}
