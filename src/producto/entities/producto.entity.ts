import { AfterInsert, BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ProductoImage } from "./producto-image.entity";

@Entity()
export class Producto {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: 'text',
        unique: true
    })
    title: string

    @Column({
        type: 'float',
        default: 0
    })
    price: number

    @Column({
        type: 'text',
        nullable: true
    })
    description: string

    @Column({
        unique: true
    })
    slug: string

    @Column({
        type: 'int',
        default: 0
    })
    stock: number

    @Column({
        type: 'text',
        array: true
    })
    size: string[]

    @Column({
        type: 'text'
    })
    gender: string


    @OneToMany(
        () => ProductoImage,
        (productoImage) => productoImage.producto,
        {
            cascade: true,
            //eager: cada ves que utilizamos un evento find* para buscar un producto, tambien traera las imagenes
            //esta funcion solo funciona con los eventos find,
            //si se utiliza queryBuilder no funciona
            //https://orkhan.gitbook.io/typeorm/docs/eager-and-lazy-relations
            eager: true
        }
    )
    images?: ProductoImage[]

    @BeforeInsert()
    checkSlug() {
        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '');
    }
    @AfterInsert()
    updateSlug() {

        if (!this.slug) {
            this.slug = this.title;
        }
        this.slug = this.slug
            .toLocaleLowerCase()
            .replaceAll(' ', '-')
            .replaceAll("'", '');
    }

}
