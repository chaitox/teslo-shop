import { Module } from '@nestjs/common';
import { ProductoService } from './producto.service';
import { ProductoController } from './producto.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Producto } from './entities/producto.entity';
import { ProductoImage } from './entities/producto-image.entity';

@Module({
  controllers: [ProductoController],
  providers: [ProductoService],
  imports: [
    TypeOrmModule.forFeature(
      [
        Producto,
        ProductoImage
      ]
    )
  ]
})
export class ProductoModule { }
