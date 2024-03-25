import { BadRequestException, Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { CreateProductoDto } from './dto/create-producto.dto';
import { UpdateProductoDto } from './dto/update-producto.dto';
import { DataSource, In, Repository } from 'typeorm';
import { Producto } from './entities/producto.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { ProductoImage } from './entities/producto-image.entity';

import { validate as isUUID } from 'uuid'

@Injectable()
export class ProductoService {
  private readonly logger = new Logger('ProductoService');
  constructor(
    @InjectRepository(Producto)
    private readonly productoRepository: Repository<Producto>
    ,
    @InjectRepository(ProductoImage)
    private readonly productoImageRepository: Repository<ProductoImage>,

    private readonly dataSource: DataSource

  ) { }


  async create(createProductoDto: CreateProductoDto) {
    try {

      const { images = [], ...productoDetalle } = createProductoDto;

      const producto = this.productoRepository.create({
        ...productoDetalle,
        images: images
          .map(image => this.productoImageRepository
            .create({ url: image }))
      });
      await this.productoRepository.save(producto);
      return { ...producto, images };

    } catch (error) {
      this.handleException(error);
    }
  }

  async findAll(paginatioDto: PaginationDto) {
    const { limit = 10, offset = 0 } = paginatioDto;
    const data = await this.productoRepository.find({
      take: limit,
      skip: offset,
      relations: {
        images: true
      }
    });

    return data
  }

  async findOne(term: string) {
    let product: Producto;
    if (isUUID(term)) {
      product = await this.productoRepository.findOneBy({ id: term });

    } else {
      const queryBuilder = this.productoRepository.createQueryBuilder('prod');
      product = await queryBuilder
        .where('upper(title) = :title or upper(slug)= :slug',
          {
            title: term.toUpperCase(),
            slug: term.toUpperCase()
          })
        .leftJoinAndSelect('prod.images', 'prodImages')
        .getOne();
    }

    // const data = this.productoRepository.findOneBy({ id: id })
    if (!product) {
      throw new BadRequestException(`Producto con  ${term} no encontrado`);
    }
    return product;
  }
  async findOnePlain(term: string) {
    const { images = [], ...producto } = await this.findOne(term);
    return {
      ...producto,
      images: images.map((image) => image.url)
    }
  }
  async update(id: string, updateProductoDto: UpdateProductoDto) {
    const { images = [], ...toUpdateProducto } = updateProductoDto;


    const producto = await this.productoRepository.preload({
      id,
      ...toUpdateProducto
    });

    if (!producto) {
      throw new NotFoundException(`Producto con id ${id} no encontrado`);
    }

    //create query runner
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      if (images) {
        await queryRunner.manager.delete(ProductoImage, { producto: { id } })
        producto.images = images.map(image => this.productoImageRepository.create({ url: image }));
      }

      await queryRunner.manager.save(producto);

      await queryRunner.commitTransaction();
      await queryRunner.release();

      return this.findOnePlain(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      await queryRunner.release();
      this.handleException(error);
    }

  }

  async remove(id: string) {
    const producto = await this.findOne(id);
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
