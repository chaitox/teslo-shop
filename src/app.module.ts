import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioModule } from './usuario/usuario.module';
import { ConfigModule } from '@nestjs/config';
import { ProductoModule } from './producto/producto.module';

@Module({
  imports: [
    //TODO: Configurar la conexión a la base de datos para oracle
    // TypeOrmModule.forRoot({

    //   type: 'oracle',
    //   host: ' 10.200.1.204',
    //   port:  1521,
    //   username: 'adcs',
    //   password: 'tabebuia',
    //   serviceName:'hades',
    //   entities: ['dist/**/*.entity{.ts,.js}'],
    //   thickMode: {
    //     configDir: 'C:\\app\\product\\12.1.0\\client_1',
        
    //   },
    //   autoLoadEntities:true,
    //   synchronize:false
    // }),
   // UsuarioModule
   ConfigModule.forRoot(),
   TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: +process.env.DB_PORT,
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    autoLoadEntities: true,
    //sincronize true: cada vez que se inicia la aplicación, se sincroniza la base de datos con las entidades
    //si borramos alguna entidad, se borra la tabla
    //en produccion no usar en true
    synchronize: true,

   }),
   ProductoModule
  ]
})
export class AppModule {}
