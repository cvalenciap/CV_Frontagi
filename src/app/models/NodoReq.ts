import { RequisitoRelacionado } from "./requisitoRelacionado";

export class NodoReq{
    id:number;
    nombre:string;
    requisitoRelacionado:RequisitoRelacionado[];
    children: NodoReq[];
}