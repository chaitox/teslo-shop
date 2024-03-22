import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({
    name: 'HI_RESERVAPP_USUARIO'
    
})
export class Usuario {
    @PrimaryGeneratedColumn({
        type: 'number',
        name: 'USUARIO_CODIGO'
    })
    usuario_codigo: number;
    @Column({
        name:'USUARIO_EMAIL'
    })
    usuario_email: string;
}
