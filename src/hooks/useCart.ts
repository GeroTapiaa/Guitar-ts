import { useState, useEffect, useMemo } from "react";
import { db } from "../data/db";
import type { Guitar , CartItem } from "../types";

export const useCart = () => {
  const initialCart = (): CartItem[] => {
    const localStorageCart = localStorage.getItem("cart");
    return localStorageCart ? JSON.parse(localStorageCart) : []; //si locaStorageCart tiene algo entonces converitmos de string a array con .parse y sino hay nada el valor es un array vacio []
  };
  //useEfect en caso de querer consumir una api conviene mas
  //useEffect(() => {
  //  setGuitar(db) (siempre el modificador del hook)
  //}, [])
  //state
  // const [auth, setAuth] = useState([])
  const MIN_ITEMS = 1;
  const MAX_ITEMS = 10;

  const [data] = useState(db);
  const [cart, setCart] = useState(initialCart);

  //local storage para el carrito con useefect
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]); //cada vez que cart cambie quiero ejecutar lo siguiente(codigo de arriba)

  //agregar al carrito
  function addToCart(item :  Guitar) {
    const itemExist = cart.findIndex((guitar) => guitar.id === item.id);
    if (itemExist >= 0) {
      if (cart[itemExist].quantity >= MAX_ITEMS) return; //existe el item en el carrito
      const updatedCart = [...cart];
      updatedCart[itemExist].quantity ++;
      setCart(updatedCart);
    } else {
      const newItem : CartItem = {...item , quantity : 1}
      
      setCart([...cart, newItem]);
    }
  }
  // borrar prod del carrito
  function removeFromCart(id : Guitar['id']) {
    setCart((prevCart) => prevCart.filter((guitar) => guitar.id !== id)); //filtarme las guitarras cuyo id sea distinto al id que te estoy pasando
  }
  //agregar producto al carrito
  function addProduct(id : Guitar['id']) {
    const updateCart = cart.map((item) => {
      //array metod para iterar
      if (item.id === id && item.quantity < MAX_ITEMS) {
        // condicional para que si el id es igual al id que le envio

        return {
          //me retorne todas las propiedades del item 40/41
          ...item,
          quantity: item.quantity + 1, // y me modifique solamente la cantidad en 1
        };
      }
      return item; // retornamos el item para que en los elementos que no di click para aumentar la cantidad los mantenga
    });
    setCart(updateCart); //devolvemos en el setCart ese carrito modificado
  }
  //aumentar la cantidad de prod del carrito
  function reduceProduct(id : Guitar['id']) {
    const updateCart = cart.map((item) => {
      if (item.id === id && item.quantity > MIN_ITEMS) {
        return {
          ...item,
          quantity: item.quantity - 1,
        };
      }
      return item;
    });
    setCart(updateCart);
  }

  //limpiar el carrito
  function emptyCart() {
    setCart([]);
  }

  //State Derivado y useMemo para no renderizar toda la pag completa y mejorar el rendimiento
  const isEmpty = useMemo(() => cart.length === 0, [cart]);

  // calcular el total a pagar en el carrito
  const cartTotal = useMemo(
    () => cart.reduce((total, item) => total + item.quantity * item.price, 0),
    [cart]
  );

  return {
    data,
    cart,
    addProduct,
    addToCart,
    removeFromCart,
    reduceProduct,
    emptyCart,
    cartTotal,
    isEmpty
  };
};
