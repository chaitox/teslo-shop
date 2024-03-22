import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Producto {

    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type:'text',
        unique:true
    })
    title:string

    @Column({
        type:'float',
        default:0
    })
    price:number

    @Column({
        type:'text',
        nullable:true
    })
    description:string

    @Column({
        unique:true
    })
    slug:string

    @Column({
        type:'int',
        default:0
    })
    stock:number

    @Column({
        type:'text',
        array:true
    })
    size:string[]

    @Column({
        type:'text'
    })
    gender:string
}
