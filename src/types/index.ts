export type Guitar = {
  id: number;
  name: string;
  image: string;
  description: string;
  price: number;
};


//utility type, sirve para elegir atributos de otro type con Pick en este caso y elegir las propiedades de la misma.
//tambien se le puede agregar propiedades 
export type CartItem = Guitar & {
  quantity : number;
}